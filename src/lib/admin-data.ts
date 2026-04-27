export type FeeStructure = {
  id: string;
  programId: string;
  programName: string;
  tuitionFee: number;
  registrationFee: number;
  currency: string;
};

export type AdminPayment = {
  id: string;
  studentName: string;
  programName: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "refunded";
  method: "bank_transfer" | "card" | "scholarship";
};

export type Scholarship = {
  id: string;
  studentName: string;
  programName: string;
  type: "full" | "partial";
  percentage: number;
  status: "active" | "expired";
};

export type CertificateTemplate = {
  id: string;
  name: string;
  lastUsed: string;
  thumbnail: string;
};

export type IssuedCertificate = {
  id: string;
  studentName: string;
  programName: string;
  issueDate: string;
  verificationId: string;
};

export type Cohort = {
  id: string;
  programId: string;
  name: string;
  startDate: string;
  endDate: string;
  instructorId: string;
  studentCount: number;
  status: "upcoming" | "active" | "completed";
};

export type TimetableEntry = {
  id: string;
  cohortId: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  startTime: string;
  endTime: string;
  subject: string;
  venue: string;
};

export const mockFeeStructures: FeeStructure[] = [
  { id: "fee1", programId: "p1", programName: "Full-Stack Web Development", tuitionFee: 450000, registrationFee: 25000, currency: "NGN" },
  { id: "fee2", programId: "p2", programName: "UI/UX Design Fundamentals", tuitionFee: 280000, registrationFee: 15000, currency: "NGN" },
  { id: "fee3", programId: "p3", programName: "Cloud Engineering with AWS", tuitionFee: 550000, registrationFee: 30000, currency: "NGN" },
];

export const mockPayments: AdminPayment[] = [
  { id: "PAY-001", studentName: "John Doe", programName: "Full-Stack Web Development", amount: 475000, date: "2024-03-15", status: "completed", method: "card" },
  { id: "PAY-002", studentName: "Sarah Smith", programName: "UI/UX Design Fundamentals", amount: 150000, date: "2024-03-12", status: "pending", method: "bank_transfer" },
  { id: "PAY-003", studentName: "Mike Johnson", programName: "Cloud Engineering with AWS", amount: 580000, date: "2024-03-10", status: "completed", method: "bank_transfer" },
  { id: "PAY-004", studentName: "Emily Chen", programName: "Full-Stack Web Development", amount: 0, date: "2024-03-05", status: "completed", method: "scholarship" },
];

export const mockScholarships: Scholarship[] = [
  { id: "SCH-001", studentName: "Emily Chen", programName: "Full-Stack Web Development", type: "full", percentage: 100, status: "active" },
  { id: "SCH-002", studentName: "Alex Brown", programName: "UI/UX Design Fundamentals", type: "partial", percentage: 50, status: "active" },
];

export const mockCohorts: Cohort[] = [
  { id: "coh1", programId: "p1", name: "Web Dev Batch A 2024", startDate: "2024-02-01", endDate: "2024-05-01", instructorId: "i1", studentCount: 24, status: "active" },
  { id: "coh2", programId: "p2", name: "Design Cohort 1", startDate: "2024-03-15", endDate: "2024-05-15", instructorId: "i2", studentCount: 18, status: "active" },
];
