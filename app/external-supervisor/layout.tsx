"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAppStore } from "@/lib/store/app-store";

const items = [
  { id: "training", label: "Training Overview", href: "/external-supervisor/training", icon: "LayoutDashboard" },
  { id: "weekly", label: "Weekly Certification", href: "/external-supervisor/weekly-certification", icon: "BookOpen" },
  { id: "monthly", label: "Monthly Progress", href: "/external-supervisor/monthly-progress", icon: "FileText" },
  { id: "evaluation", label: "Performance Evaluation", href: "/external-supervisor/performance-evaluation", icon: "ClipboardCheck" },
];

export default function ExternalSupervisorLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();
  return <DashboardLayout navItems={items} roleLabel="External Supervisor" userName={currentUser?.name ?? "External Supervisor"} userEmail={currentUser?.email ?? ""} profileHref="/external-supervisor/training" variant="portal" userRoleBadge="External Supervisor" consoleTitle="Training Partner Portal" notificationAudience="supervisor" notificationUserId={currentUser?.id ?? ""}>{children}</DashboardLayout>;
}
