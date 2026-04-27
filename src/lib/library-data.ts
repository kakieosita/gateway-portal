export type ResourceFormat = "video" | "pdf" | "ebook" | "article" | "link";
export type AccessLevel = "public" | "student" | "instructor" | "admin";

export type LibraryResource = {
  id: string;
  title: string;
  author: string;
  format: ResourceFormat;
  category: string;
  accessLevel: AccessLevel;
  dateAdded: string;
  description: string;
  thumbnail?: string;
  url: string;
  isFeatured: boolean;
};

export type ReadingList = {
  id: string;
  title: string;
  instructor: string;
  courseId: string;
  resourceIds: string[];
};

export const mockResources: LibraryResource[] = [
  {
    id: "res-1",
    title: "Introduction to React Hooks",
    author: "Jane Smith",
    format: "video",
    category: "Web Development",
    accessLevel: "student",
    dateAdded: "2024-03-10",
    description: "A comprehensive guide to using useEffect and useState in modern React applications.",
    isFeatured: true,
    url: "#"
  },
  {
    id: "res-2",
    title: "UI Design Patterns for Mobile",
    author: "Alex Rivera",
    format: "pdf",
    category: "Design",
    accessLevel: "public",
    dateAdded: "2024-02-15",
    description: "A deep dive into mobile-first design principles and common interaction patterns.",
    isFeatured: true,
    url: "#"
  },
  {
    id: "res-3",
    title: "Advanced Instructor Pedagogy",
    author: "Dr. Robert Brown",
    format: "ebook",
    category: "Education",
    accessLevel: "instructor",
    dateAdded: "2024-01-20",
    description: "Best practices for teaching technical subjects to diverse cohorts.",
    isFeatured: false,
    url: "#"
  },
  {
    id: "res-4",
    title: "SQL Performance Tuning",
    author: "Sarah Connor",
    format: "article",
    category: "Data Science",
    accessLevel: "student",
    dateAdded: "2024-03-01",
    description: "Learn how to optimize complex queries for large-scale databases.",
    isFeatured: false,
    url: "#"
  }
];

export const mockReadingLists: ReadingList[] = [
  {
    id: "rl-1",
    title: "Full-Stack Fundamentals",
    instructor: "Jane Smith",
    courseId: "fs-101",
    resourceIds: ["res-1", "res-4"]
  }
];
