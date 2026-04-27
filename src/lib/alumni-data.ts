export type AlumniProfile = {
  id: string;
  name: string;
  gradYear: number;
  program: string;
  industry: string;
  location: string;
  role: string;
  company?: string;
  avatar?: string;
  isMentor: boolean;
  skills: string[];
};

export type JobPosting = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  postedBy: string;
  date: string;
  description: string;
};

export type AlumniEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "In-person" | "Virtual";
  attendees: number;
  image: string;
};

export const mockAlumni: AlumniProfile[] = [
  { 
    id: "alm1", 
    name: "Tobi Adebayo", 
    gradYear: 2022, 
    program: "Full-Stack Web Development", 
    industry: "Fintech", 
    location: "Lagos, Nigeria", 
    role: "Senior Frontend Engineer", 
    company: "Paystack", 
    isMentor: true, 
    skills: ["React", "TypeScript", "Node.js"] 
  },
  { 
    id: "alm2", 
    name: "Chioma Nwosu", 
    gradYear: 2021, 
    program: "UI/UX Design", 
    industry: "E-commerce", 
    location: "Remote", 
    role: "Product Designer", 
    company: "Kuda", 
    isMentor: false, 
    skills: ["Figma", "Prototyping", "User Research"] 
  },
  { 
    id: "alm3", 
    name: "Emeka Okafor", 
    gradYear: 2023, 
    program: "Data Science", 
    industry: "Healthtech", 
    location: "Abuja, Nigeria", 
    role: "Data Analyst", 
    company: "Helium Health", 
    isMentor: false, 
    skills: ["Python", "SQL", "Tableau"] 
  },
];

export const mockJobs: JobPosting[] = [
  {
    id: "job1",
    title: "Full Stack Developer",
    company: "TechNexus",
    location: "Lagos (Hybrid)",
    type: "Full-time",
    postedBy: "Sarah Smith",
    date: "2 days ago",
    description: "Looking for an experienced developer to join our growing team..."
  },
  {
    id: "job2",
    title: "Junior Product Designer",
    company: "DesignHub",
    location: "Remote",
    type: "Internship",
    postedBy: "Emily Chen",
    date: "1 week ago",
    description: "Great opportunity for recent graduates to learn and grow..."
  }
];

export const mockAlumniEvents: AlumniEvent[] = [
  {
    id: "evt1",
    title: "Annual Alumni Networking Gala",
    date: "May 24, 2024",
    time: "18:00",
    location: "Eko Hotels, Lagos",
    type: "In-person",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: "evt2",
    title: "Web3 & Blockchain Opportunities",
    date: "June 05, 2024",
    time: "15:00",
    location: "Zoom",
    type: "Virtual",
    attendees: 45,
    image: "https://images.unsplash.com/photo-1591115765373-520b7a21769b?w=800&auto=format&fit=crop&q=60"
  }
];
