import { create } from "zustand";
import {
  instructorCourses,
  enrolledStudents,
  instructorAssignments,
  submissions,
  recentActivity,
  instructorProfile,
  type InstructorCourse,
  type EnrolledStudent,
  type InstructorAssignment,
  type Submission,
  type ActivityItem,
} from "@/lib/instructor-data";

type Profile = typeof instructorProfile;

type InstructorState = {
  courses: InstructorCourse[];
  students: EnrolledStudent[];
  assignments: InstructorAssignment[];
  submissions: Submission[];
  activity: ActivityItem[];
  profile: Profile;
  addCourse: (course: Omit<InstructorCourse, "id" | "students" | "rating" | "revenue" | "completionRate" | "updatedAt">) => void;
  deleteCourse: (id: string) => void;
  updateCourse: (id: string, patch: Partial<InstructorCourse>) => void;
  gradeSubmission: (id: string, grade: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
};

export const useInstructorStore = create<InstructorState>((set) => ({
  courses: instructorCourses,
  students: enrolledStudents,
  assignments: instructorAssignments,
  submissions,
  activity: recentActivity,
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
  gradeSubmission: (id, grade) =>
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, status: "graded" as const, grade } : s,
      ),
    })),
  updateProfile: (patch) => set((state) => ({ profile: { ...state.profile, ...patch } })),
}));
