import { create } from "zustand";
import {
  mockCourses,
  mockAssignments,
  mockCertificates,
  mockActivity,
  mockUser,
  mockQuizzes,
  mockGrades,
  mockAttendance,
  mockInvoices,
  mockForumPosts,
  mockEvents,
  mockAnnouncements,
  type Course,
  type Assignment,
  type Certificate,
  type Activity,
  type Quiz,
  type Grade,
  type Attendance,
  type Invoice,
  type ForumPost,
  type Event,
  type Announcement,
} from "@/lib/dashboard-data";

type User = typeof mockUser;

type DashboardState = {
  courses: Course[];
  assignments: Assignment[];
  certificates: Certificate[];
  activity: Activity[];
  user: User;
  quizzes: Quiz[];
  grades: Grade[];
  attendance: Attendance[];
  invoices: Invoice[];
  forumPosts: ForumPost[];
  events: Event[];
  announcements: Announcement[];
  loading: boolean;
  toggleLesson: (courseId: string, lessonId: string) => void;
  submitAssignment: (id: string) => void;
  updateUser: (patch: Partial<User>) => void;
  payInvoice: (id: string) => void;
  enrollCourse: (id: string) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  courses: mockCourses,
  assignments: mockAssignments,
  certificates: mockCertificates,
  activity: mockActivity,
  user: mockUser,
  quizzes: mockQuizzes,
  grades: mockGrades,
  attendance: mockAttendance,
  invoices: mockInvoices,
  forumPosts: mockForumPosts,
  events: mockEvents,
  announcements: mockAnnouncements,
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
  payInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.map((i) =>
        i.id === id ? { ...i, status: "paid" as const } : i,
      ),
    })),
  enrollCourse: (_id) => {
    // Mock implementation: normally we'd add the course from a global catalog
    // For now, we'll just show a success message or handle it in the component.
    // To make it simple, we don't mutate the courses list here because mockCourses
    // is already the list of enrolled courses. We will just use a toast in the UI.
  },
}));
