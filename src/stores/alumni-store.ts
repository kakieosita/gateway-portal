import { create } from "zustand";
import { 
  AlumniProfile, 
  JobPosting, 
  AlumniEvent,
  mockAlumni,
  mockJobs,
  mockAlumniEvents
} from "@/lib/alumni-data";

interface AlumniState {
  alumni: AlumniProfile[];
  jobs: JobPosting[];
  events: AlumniEvent[];
  connections: string[]; // IDs of connected alumni
  
  // Actions
  connectWithAlumni: (id: string) => void;
  postJob: (job: Omit<JobPosting, "id">) => void;
  registerForEvent: (id: string) => void;
  toggleMentorship: (isMentor: boolean) => void;
}

export const useAlumniStore = create<AlumniState>((set) => ({
  alumni: mockAlumni,
  jobs: mockJobs,
  events: mockAlumniEvents,
  connections: [],

  connectWithAlumni: (id) => set((state) => ({
    connections: state.connections.includes(id) 
      ? state.connections 
      : [...state.connections, id]
  })),

  postJob: (job) => set((state) => ({
    jobs: [{ ...job, id: `JOB-${Math.floor(Math.random() * 1000)}` }, ...state.jobs]
  })),

  registerForEvent: (id) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, attendees: e.attendees + 1 } : e)
  })),

  toggleMentorship: (isMentor) => set((state) => ({
    alumni: state.alumni.map(a => a.id === 'current_user_id' ? { ...a, isMentor } : a)
  })),
}));
