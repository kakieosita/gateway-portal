import { create } from "zustand";
import { 
  PartnerProfile, 
  Engagement, 
  MOUDocument, 
  PartnerInvoice,
  mockPartner,
  mockEngagements,
  mockMOUs,
  mockPartnerInvoices
} from "@/lib/partner-data";

interface PartnerState {
  profile: PartnerProfile;
  engagements: Engagement[];
  mous: MOUDocument[];
  invoices: PartnerInvoice[];
  
  // Actions
  updateProfile: (updates: Partial<PartnerProfile>) => void;
  enrollStaff: (engagementId: string, count: number) => void;
  submitTrainingRequest: (request: any) => void;
}

export const usePartnerStore = create<PartnerState>((set) => ({
  profile: mockPartner,
  engagements: mockEngagements,
  mous: mockMOUs,
  invoices: mockPartnerInvoices,

  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),

  enrollStaff: (engagementId, count) => set((state) => ({
    engagements: state.engagements.map(e => e.id === engagementId ? { ...e, enrolledStaff: e.enrolledStaff + count } : e)
  })),

  submitTrainingRequest: (request) => {
    console.log("New Training Request:", request);
    // Logic to save request
  },
}));
