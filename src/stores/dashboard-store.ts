import { create } from "zustand";
import {
  mockCourses,
  mockAssignments,
  mockCertificates,
  mockActivity,
  mockUser,
  type Course,
  type Assignment,
  type Certificate,
  type Activity,
} from "@/lib/dashboard-data";

type User = typeof mockUser;

type DashboardState = {
  courses: Course[];
  assignments: Assignment[];
  certificates: Certificate[];
  activity: Activity[];
  user: User;
  loading: boolean;
  toggleLesson: (courseId: string, lessonId: string) => void;
  submitAssignment: (id: string) => void;
  updateUser: (patch: Partial<User>) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  courses: mockCourses,
  assignments: mockAssignments,
  certificates: mockCertificates,
  activity: mockActivity,
  user: mockUser,
  loading: false,
  toggleLesson: (courseId, lessonId) =>
    set((state) => ({
      courses: state.courses.map((c) => {
        if (c.id !== courseId) return c;
        const lessons = c.lessons.map((l) =>
          l.id === lessonId ? { ...l, completed: !l.completed } : l,
        );
        const completedLessons = lessons.filter((l) => l.completed).length;
        const progress = Math.round((completedLessons / lessons.length) * 100);
        return { ...c, lessons, completedLessons, progress };
      }),
    })),
  submitAssignment: (id) =>
    set((state) => ({
      assignments: state.assignments.map((a) =>
        a.id === id ? { ...a, status: "submitted" as const } : a,
      ),
    })),
  updateUser: (patch) => set((state) => ({ user: { ...state.user, ...patch } })),
}));
