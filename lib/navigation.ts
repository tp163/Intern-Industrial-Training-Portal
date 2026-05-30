import type { NavItem } from "@/types";

export const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { label: "Logbook", href: "/student/applications", icon: "BookOpen" },
  { label: "Company Directory", href: "/student/companies", icon: "Building2" },
  { label: "Assessments", href: "/student/cv", icon: "BarChart3" },
];

export const supervisorNavItems: NavItem[] = [
  { label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { label: "Students", href: "/supervisor/students", icon: "Users" },
  { label: "Reviews", href: "/supervisor/reviews", icon: "FileCheck" },
  { label: "Reports", href: "/supervisor/reports", icon: "BarChart3" },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Students", href: "/admin/students", icon: "GraduationCap" },
  { label: "Supervisors", href: "/admin/supervisors", icon: "UserCheck" },
  { label: "Companies", href: "/admin/companies", icon: "Building2" },
  { label: "Internships", href: "/admin/internships", icon: "Briefcase" },
  { label: "Reports", href: "/admin/reports", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export const roleLabels = {
  student: "Student",
  supervisor: "Supervisor",
  admin: "Administrator",
} as const;

export const roleDashboardPaths = {
  student: "/student/dashboard",
  supervisor: "/supervisor/dashboard",
  admin: "/admin/dashboard",
} as const;
