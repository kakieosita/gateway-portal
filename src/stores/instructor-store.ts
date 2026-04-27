import { create } from "zustand";
import {
  instructorCourses,
  enrolledStudents,
  instructorAssignments,
  submissions,
  recentActivity,
  instructorProfile,
  instructorSchedules,
  instructorAnnouncements,
  earningsHistory,
  instructorCredentials,
  type InstructorCourse,
  type EnrolledStudent,
  type InstructorAssignment,
  type Submission,
  type ActivityItem,
  type ScheduleSession,
  type Announcement,
  type EarningRecord,
  type Credential,
} from "@/lib/instructor-data";

type Profile = typeof instructorProfile;

type InstructorState = {
  courses: InstructorCourse[];
  students: EnrolledStudent[];
  assignments: InstructorAssignment[];
  submissions: Submission[];
  activity: ActivityItem[];
  schedules: ScheduleSession[];
  announcements: Announcement[];
  earnings: EarningRecord[];
  credentials: Credential[];
  profile: Profile;
  addCourse: (course: Omit<InstructorCourse, "id" | "students" | "rating" | "revenue" | "completionRate" | "updatedAt">) => void;
  deleteCourse: (id: string) => void;
  updateCourse: (id: string, patch: Partial<InstructorCourse>) => void;
  gradeSubmission: (id: string, grade: string, feedback?: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addSchedule: (session: Omit<ScheduleSession, "id">) => void;
  postAnnouncement: (announcement: Omit<Announcement, "id" | "date">) => void;
  markAttendance: (sessionId: string, studentId: string, status: "present" | "absent") => void;
};

export const useInstructorStore = create<InstructorState>((set) => ({
  courses: instructorCourses,
  students: enrolledStudents,
  assignments: instructorAssignments,
  submissions,
  activity: recentActivity,
  schedules: instructorSchedules,
  announcements: instructorAnnouncements,
  earnings: earningsHistory,
  credentials: instructorCredentials,
  profile: instructorProfile,
  addCourse: (course) =>
    set((state) => ({
      courses: [
        {
          ...course,
          id: `ic${Date.now()}`,
          students: 0,
          rating: 0,
          revenue: 0,
          completionRate: 0,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
        ...state.courses,
      ],
    })),
  deleteCourse: (id) =>
    set((state) => ({ courses: state.courses.filter((c) => c.id !== id) })),
  updateCourse: (id, patch) =>
    set((state) => ({
      courses: state.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    })),
  gradeSubmission: (id, grade, feedback) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status: "graded" as const, grade, feedback } : s,
      ),
    })),
  updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
  addSchedule: (session) =>
    set((state) => ({
      schedules: [
        { ...session, id: `sess${Date.now()}` },
        ...state.schedules,
      ],
    })),
  postAnnouncement: (announcement) =>
    set((state) => ({
      announcements: [
        { ...announcement, id: `an${Date.now()}`, date: new Date().toISOString().slice(0, 10) },
        ...state.announcements,
      ],
    })),
  markAttendance: (sessionId, studentId, status) => {
    // In a real app we'd update an attendance collection
    // Here we'll just log it for the mock
    console.log(`Marked student ${studentId} as ${status} for session ${sessionId}`);
  },
}));

