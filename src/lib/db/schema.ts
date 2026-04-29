// Schema types — Timestamp replaced with ISO date strings (Supabase).
type Timestamp = string;

// User Roles
export type UserRole = "admin" | "alumni" | "partner" | "student" | "instructor";

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  // Specific role data can be added as nested objects or separate collections,
  // but for simplicity we keep basic info here.
  bio?: string;
  phoneNumber?: string;
}



export interface PageSection {
  id: string;
  type: "hero" | "text" | "image" | "features" | "gallery" | "call_to_action";
  content: Record<string, any>;
  order: number;
}

export interface Page {
  id?: string;
  title: string;
  slug: string; // e.g. 'about-us', 'contact'
  description: string;
  status: "draft" | "published";
  sections: PageSection[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Program {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: "Degree" | "Certificate" | "Short Course";
  duration: string; // e.g., '4 Years', '6 Months'
  level: "Beginner" | "Intermediate" | "Advanced";
  tuitionFee?: number;
  featuredImage?: string;
  curriculum: { term: string; courses: string[] }[];
  isFeatured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Timestamp;
  location: string;
  isVirtual: boolean;
  registrationLink?: string;
  featuredImage?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Partner {
  id?: string;
  name: string;
  logoUrl: string;
  website?: string;
  partnershipType: "Industry" | "Academic" | "Technology" | "Corporate";
  description?: string;
  createdAt: Timestamp;
}

export interface Testimonial {
  id?: string;
  authorName: string;
  authorRole: string; // e.g., "Alumni, Class of 2023"
  authorImage?: string;
  content: string;
  rating?: number;
  isFeatured: boolean;
  createdAt: Timestamp;
}
