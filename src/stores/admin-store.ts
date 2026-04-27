import { create } from "zustand";
import { 
  FeeStructure, 
  AdminPayment, 
  Scholarship, 
  Cohort, 
  TimetableEntry,
  mockFeeStructures,
  mockPayments,
  mockScholarships,
  mockCohorts
} from "@/lib/admin-data";

interface AdminState {
  fees: FeeStructure[];
  payments: AdminPayment[];
  scholarships: Scholarship[];
  cohorts: Cohort[];
  timetable: TimetableEntry[];
  
  // Actions
  updateFee: (id: string, updates: Partial<FeeStructure>) => void;
  addPayment: (payment: Omit<AdminPayment, "id">) => void;
  grantScholarship: (scholarship: Omit<Scholarship, "id">) => void;
  addCohort: (cohort: Omit<Cohort, "id">) => void;
  addTimetableEntry: (entry: Omit<TimetableEntry, "id">) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  fees: mockFeeStructures,
  payments: mockPayments,
  scholarships: mockScholarships,
  cohorts: mockCohorts,
  timetable: [],

  updateFee: (id, updates) => set((state) => ({
    fees: state.fees.map((f) => f.id === id ? { ...f, ...updates } : f)
  })),

  addPayment: (payment) => set((state) => ({
    payments: [{ ...payment, id: `PAY-${Math.floor(Math.random() * 1000)}` }, ...state.payments]
  })),

  grantScholarship: (scholarship) => set((state) => ({
    scholarships: [{ ...scholarship, id: `SCH-${Math.floor(Math.random() * 1000)}` }, ...state.scholarships]
  })),

  addCohort: (cohort) => set((state) => ({
    cohorts: [{ ...cohort, id: `COH-${Math.floor(Math.random() * 1000)}` }, ...state.cohorts]
  })),

  addTimetableEntry: (entry) => set((state) => ({
    timetable: [{ ...entry, id: `TT-${Math.floor(Math.random() * 1000)}` }, ...state.timetable]
  })),
}));
