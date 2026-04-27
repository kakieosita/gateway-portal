export type PartnerProfile = {
  id: string;
  orgName: string;
  type: "Corporate" | "Government" | "Academic" | "NGO";
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
};

export type Engagement = {
  id: string;
  programName: string;
  enrolledStaff: number;
  startDate: string;
  status: "active" | "completed" | "upcoming";
  completionRate: number;
};

export type MOUDocument = {
  id: string;
  title: string;
  signDate: string;
  expiryDate: string;
  status: "active" | "expired" | "pending_renewal";
  fileUrl: string;
};

export type PartnerInvoice = {
  id: string;
  amount: number;
  date: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  description: string;
};

export const mockPartner: PartnerProfile = {
  id: "prt-001",
  orgName: "Global Tech Solutions Ltd",
  type: "Corporate",
  contactPerson: "David Miller",
  email: "d.miller@globaltech.com",
  phone: "+234 801 234 5678",
  location: "Lagos, Nigeria"
};

export const mockEngagements: Engagement[] = [
  { id: "eng-1", programName: "Corporate Software Engineering Boot Camp", enrolledStaff: 15, startDate: "2024-01-15", status: "active", completionRate: 85 },
  { id: "eng-2", programName: "Data Analytics for Managers", enrolledStaff: 8, startDate: "2024-03-01", status: "active", completionRate: 40 },
  { id: "eng-3", programName: "UI/UX Executive Training", enrolledStaff: 5, startDate: "2023-10-10", status: "completed", completionRate: 100 }
];

export const mockMOUs: MOUDocument[] = [
  { id: "mou-1", title: "Corporate Training Master Agreement", signDate: "2023-01-01", expiryDate: "2025-01-01", status: "active", fileUrl: "#" },
  { id: "mou-2", title: "Talent Pipeline Partnership", signDate: "2023-06-15", expiryDate: "2024-06-15", status: "active", fileUrl: "#" }
];

export const mockPartnerInvoices: PartnerInvoice[] = [
  { id: "INV-PRT-9901", amount: 1250000, date: "2024-03-01", dueDate: "2024-03-15", status: "paid", description: "Q1 Corporate Training Package" },
  { id: "INV-PRT-9902", amount: 450000, date: "2024-03-20", dueDate: "2024-04-03", status: "pending", description: "Staff Enrollment - Data Analytics" }
];
