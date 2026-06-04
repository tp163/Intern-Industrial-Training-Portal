import type { NavItem } from "@/types";

export const studentTopNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { id: "placements", label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { id: "logbook", label: "Logbook", href: "/student/reports", icon: "BookOpen" },
  { id: "profile", label: "Profile", href: "/student/profile", icon: "User" },
];

export const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student/dashboard", icon: "LayoutDashboard" },
  { label: "Placements", href: "/student/internships", icon: "Briefcase" },
  { label: "Logbook", href: "/student/reports", icon: "BookOpen" },
  { label: "Company Directory", href: "/student/companies", icon: "Building2" },
  { label: "CV Management", href: "/student/cv", icon: "FileText" },
];

export const supervisorTopNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { id: "students", label: "Students", href: "/supervisor/students", icon: "GraduationCap" },
  { id: "reports", label: "Reports", href: "/supervisor/reviews", icon: "FileText" },
  { id: "profile", label: "Profile", href: "/supervisor/settings", icon: "User" },
];

export const supervisorNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/supervisor/dashboard", icon: "LayoutDashboard" },
  { id: "students", label: "Students", href: "/supervisor/students", icon: "GraduationCap" },
  { id: "reports", label: "Reports", href: "/supervisor/reviews", icon: "FileText" },
];

export const adminTopNavItems: NavItem[] = [
  { id: "placements", label: "Placements", href: "/admin/supervisor-student-directory", icon: "Briefcase" },
  { id: "logbook", label: "Logbook", href: "/admin/reports", icon: "BookOpen" },
  { id: "profile", label: "Profile", href: "/admin/settings", icon: "User" },
];

export const adminNavItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  {
    id: "supervisor-student-directory",
    label: "Supervisor Student Directory",
    href: "/admin/supervisor-student-directory",
    icon: "FolderTree",
  },
  { id: "supervisors", label: "Supervisors", href: "/admin/supervisors", icon: "UserCheck" },
  { id: "companies", label: "Company Directory", href: "/admin/companies", icon: "Building2" },
  { id: "internships", label: "Internships", href: "/admin/internships", icon: "Briefcase" },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: "BarChart3" },
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
