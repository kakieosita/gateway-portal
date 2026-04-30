import { useState, useEffect } from "react";
import { onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import {
  usersCollection,
  programsCollection,
  transactionsCollection,
  enrollmentsCollection,
  activitiesCollection,
} from "@/lib/db/collections";
import { User, Program, Transaction, Enrollment, Activity } from "@/lib/db/schema";
import { format, subMonths, isAfter, startOfMonth, startOfYear } from "date-fns";

export interface AdminStats {
  kpis: {
    totalStudents: number;
    activePrograms: number;
    revenueMonthly: number;
    revenueAnnual: number;
    newEnrollments: number;
  };
  charts: {
    enrollmentTrends: { name: string; enrollments: number }[];
    programPerformance: { name: string; enrollments: number }[];
    revenueByProgram: { name: string; value: number }[];
    demographicsAge: { name: string; value: number }[];
    demographicsGender: { name: string; value: number }[];
  };
  activities: Activity[];
  loading: boolean;
}

// Helper to safely get JS Date from Firebase Timestamp or ISO string
const getDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000);
  return new Date(timestamp);
};

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    kpis: {
      totalStudents: 0,
      activePrograms: 0,
      revenueMonthly: 0,
      revenueAnnual: 0,
      newEnrollments: 0,
    },
    charts: {
      enrollmentTrends: [],
      programPerformance: [],
      revenueByProgram: [],
      demographicsAge: [],
      demographicsGender: [],
    },
    activities: [],
    loading: true,
  });

  useEffect(() => {
    // We will collect states here and dispatch one big update,
    // though realistically onSnapshot will trigger individually.
    let currentUsers: User[] = [];
    let currentPrograms: Program[] = [];
    let currentTransactions: Transaction[] = [];
    let currentEnrollments: Enrollment[] = [];
    let currentActivities: Activity[] = [];

    const updateStats = () => {
      const now = new Date();
      const thirtyDaysAgo = subMonths(now, 1);
      const thisMonthStart = startOfMonth(now);
      const thisYearStart = startOfYear(now);

      // KPIs
      const totalStudents = currentUsers.length;
      const activePrograms = currentPrograms.length;

      let revenueMonthly = 0;
      let revenueAnnual = 0;
      currentTransactions.forEach((t) => {
        if (t.status === "completed") {
          const tDate = getDate(t.createdAt);
          if (isAfter(tDate, thisMonthStart)) revenueMonthly += t.amount;
          if (isAfter(tDate, thisYearStart)) revenueAnnual += t.amount;
        }
      });

      let newEnrollments = 0;
      const enrollmentsByDate: Record<string, number> = {};
      const enrollmentsByProgram: Record<string, number> = {};

      currentEnrollments.forEach((e) => {
        const eDate = getDate(e.createdAt);
        if (isAfter(eDate, thirtyDaysAgo)) {
          newEnrollments++;
        }

        // Trends (group by day for last 7 days or format as Mon, Tue)
        // For simplicity, let's group by month or just the formatted date
        const dateKey = format(eDate, "MMM dd");
        enrollmentsByDate[dateKey] = (enrollmentsByDate[dateKey] || 0) + 1;

        // Program Performance
        enrollmentsByProgram[e.programId] = (enrollmentsByProgram[e.programId] || 0) + 1;
      });

      // Format Trends array (last 7 days ideally, but let's just sort available)
      const enrollmentTrends = Object.keys(enrollmentsByDate)
        .map((k) => ({ name: k, enrollments: enrollmentsByDate[k] }))
        .slice(-7); // take last 7

      // Format Program Performance
      const programPerformance = Object.keys(enrollmentsByProgram).map((pid) => {
        const p = currentPrograms.find((prog) => prog.id === pid);
        return {
          name: p ? p.title.substring(0, 15) + (p.title.length > 15 ? "..." : "") : "Unknown",
          enrollments: enrollmentsByProgram[pid],
        };
      }).sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);

      // Revenue by Program
      const revByProgramMap: Record<string, number> = {};
      currentTransactions.forEach((t) => {
        if (t.status === "completed" && t.programId) {
          revByProgramMap[t.programId] = (revByProgramMap[t.programId] || 0) + t.amount;
        }
      });
      const revenueByProgram = Object.keys(revByProgramMap).map((pid) => {
        const p = currentPrograms.find((prog) => prog.id === pid);
        return {
          name: p ? p.title.substring(0, 15) + (p.title.length > 15 ? "..." : "") : "Unknown",
          value: revByProgramMap[pid],
        };
      });

      // Demographics
      const ageGroups = { "<20": 0, "20-25": 0, "26-30": 0, "31-40": 0, ">40": 0, "Unknown": 0 };
      const genderCounts: Record<string, number> = {};

      currentUsers.forEach((u) => {
        // Age
        const age = u.demographics?.age;
        if (!age) ageGroups["Unknown"]++;
        else if (age < 20) ageGroups["<20"]++;
        else if (age <= 25) ageGroups["20-25"]++;
        else if (age <= 30) ageGroups["26-30"]++;
        else if (age <= 40) ageGroups["31-40"]++;
        else ageGroups[">40"]++;

        // Gender
        const gender = u.demographics?.gender || "Unknown";
        genderCounts[gender] = (genderCounts[gender] || 0) + 1;
      });

      const demographicsAge = Object.keys(ageGroups).map((k) => ({ name: k, value: ageGroups[k as keyof typeof ageGroups] }));
      const demographicsGender = Object.keys(genderCounts).map((k) => ({ name: k, value: genderCounts[k] }));

      setStats({
        kpis: {
          totalStudents,
          activePrograms,
          revenueMonthly,
          revenueAnnual,
          newEnrollments,
        },
        charts: {
          enrollmentTrends,
          programPerformance,
          revenueByProgram,
          demographicsAge,
          demographicsGender,
        },
        activities: currentActivities,
        loading: false,
      });
    };

    // Subscriptions
    const unsubUsers = onSnapshot(query(usersCollection, where("role", "==", "student")), (snap) => {
      currentUsers = snap.docs.map((d) => ({ ...d.data(), id: d.id } as User));
      updateStats();
    });

    const unsubPrograms = onSnapshot(programsCollection, (snap) => {
      currentPrograms = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Program));
      updateStats();
    });

    const unsubTransactions = onSnapshot(transactionsCollection, (snap) => {
      currentTransactions = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Transaction));
      updateStats();
    });

    const unsubEnrollments = onSnapshot(enrollmentsCollection, (snap) => {
      currentEnrollments = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Enrollment));
      updateStats();
    });

    const unsubActivities = onSnapshot(query(activitiesCollection, orderBy("createdAt", "desc"), limit(10)), (snap) => {
      currentActivities = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Activity));
      updateStats();
    });

    return () => {
      unsubUsers();
      unsubPrograms();
      unsubTransactions();
      unsubEnrollments();
      unsubActivities();
    };
  }, []);

  return stats;
}
