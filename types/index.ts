export type UserRole = "student" | "supervisor" | "admin";

export type ApplicationStatus =
  | "pending"
  | "reviewing"
  | "approved"
  | "rejected"
  | "withdrawn";

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: string;
}

export interface Student extends User {
  role: "student";
  studentId: string;
  program: string;
  year: number;
  gpa?: number;
  cvUrl?: string;
  supervisorId?: string;
}

export interface Supervisor extends User {
  role: "supervisor";
  title: string;
  assignedStudents: number;
}

export interface Admin extends User {
  role: "admin";
  permissions: string[];
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  email: string;
  phone: string;
  website?: string;
  status: "pending" | "approved" | "rejected";
  logo?: string;
  description: string;
  createdAt: string;
}

export interface Internship {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  duration: string;
  deadline: string;
  description: string;
  requirements: string[];
  slots: number;
  applied: number;
  status: "open" | "closed" | "draft";
  stipend?: string;
}

export interface Application {
  id: string;
  studentId: string;
  studentName: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string;
  coverLetter?: string;
}

export interface Review {
  id: string;
  studentId: string;
  studentName: string;
  supervisorId: string;
  title: string;
  type: "weekly" | "midterm" | "final";
  submittedAt: string;
  status: ReviewStatus;
  content: string;
  feedback?: string;
  score?: number;
}

export interface ProgressReport {
  id: string;
  studentId: string;
  studentName: string;
  week: number;
  submittedAt: string;
  status: ReviewStatus;
  summary: string;
  achievements: string[];
  challenges: string[];
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "info" | "success" | "warning" | "error";
}

export interface SystemSetting {
  id: string;
  label: string;
  description: string;
  value: string | boolean | number;
  type: "text" | "boolean" | "number" | "select";
  options?: string[];
}
