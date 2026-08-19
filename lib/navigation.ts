import type { NavItem } from "@/types";

export const studentTopNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { id: "placements", label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { id: "logbook", label: "Reports", href: "/student/reports", icon: "FileText" },
  { id: "profile", label: "Profile", href: "/student/profile", icon: "User" },
];

export const studentNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { id: "announcements", label: "Announcements", href: "/student/announcements", icon: "Megaphone" },
  { id: "placements", label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { id: "daily-log", label: "Daily Log Book", href: "/student/daily-log", icon: "BookOpen" },
  { id: "conduct", label: "Conduct & Support", href: "/student/conduct", icon: "MessageSquare" },
  { id: "documents", label: "Training Documents", href: "/student/documents", icon: "FileText" },
  { id: "logbook", label: "Reports", href: "/student/reports", icon: "FileText" },
  { id: "companies", label: "Company Directory", href: "/student/companies", icon: "Building2" },
  { id: "cv", label: "CV Management", href: "/student/cv", icon: "FileText" },
];

export const supervisorTopNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { id: "students", label: "Students", href: "/supervisor/students", icon: "GraduationCap" },
  { id: "daily-logs", label: "Daily Logs", href: "/supervisor/daily-logs", icon: "BookOpen" },
  { id: "reports", label: "Reports", href: "/supervisor/reviews", icon: "FileText" },
  { id: "completion", label: "Completion Recommendation", href: "/supervisor/performance-evaluation", icon: "ClipboardCheck" },
  { id: "profile", label: "Profile", href: "/supervisor/settings", icon: "User" },
];

export const supervisorNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { id: "students", label: "Students", href: "/supervisor/students", icon: "GraduationCap" },
  { id: "daily-logs", label: "Daily Logs", href: "/supervisor/daily-logs", icon: "BookOpen" },
  { id: "reports", label: "Reports", href: "/supervisor/reviews", icon: "FileText" },
  { id: "evaluations", label: "Evaluations", href: "/supervisor/evaluations", icon: "ClipboardCheck" },
  { id: "completion", label: "Completion Recommendation", href: "/supervisor/performance-evaluation", icon: "ClipboardCheck" },
  { id: "broadcast", label: "Broadcast", href: "/supervisor/broadcast", icon: "Megaphone" },
  { id: "companies", label: "Company Directory", href: "/supervisor/companies", icon: "Building2" },
];

export const adminTopNavItems: NavItem[] = [
  { id: "placements", label: "Placements", href: "/admin/supervisor-student-directory", icon: "Briefcase" },
  { id: "logbook", label: "Reports", href: "/admin/reports", icon: "BarChart3" },
  { id: "profile", label: "Profile", href: "/admin/settings", icon: "User" },
];

export const adminNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  {
    id: "student-allocation",
    label: "Student Allocation",
    href: "/admin/student-allocation",
    icon: "UserCheck",
  },
  {
    id: "supervisor-student-directory",
    label: "Supervisor Student Directory",
    href: "/admin/supervisor-student-directory",
    icon: "FolderTree",
  },
  { id: "broadcast", label: "Broadcast", href: "/admin/broadcast", icon: "Megaphone" },
  { id: "supervisors", label: "Supervisors", href: "/admin/supervisors", icon: "Users" },
  { id: "companies", label: "Company Directory", href: "/admin/companies", icon: "Building2" },
  { id: "internships", label: "Internships", href: "/admin/internships", icon: "Briefcase" },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: "BarChart3" },
  { id: "training-monitoring", label: "Training Monitoring", href: "/admin/training-monitoring", icon: "ClipboardCheck" },
  { id: "training-documents", label: "Training Documents", href: "/admin/training-documents", icon: "FileText" },
  { id: "conduct", label: "Conduct Review", href: "/admin/conduct-review", icon: "MessageSquare" },
];

export const roleLabels = {
  student: "Student",
  supervisor: "Supervisor",
  external_supervisor: "External Supervisor",
  admin: "Administrator",
} as const;

export const roleDashboardPaths = {
  student: "/student/dashboard",
  supervisor: "/supervisor/dashboard",
  external_supervisor: "/external-supervisor/training",
  admin: "/admin/dashboard",
} as const;
