"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAppStore } from "@/lib/store/app-store";
import { roleLabels, studentNavItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { getStudentById, currentUser, loadRealData } = useAppStore();

  // Re-fetch all data when the tab becomes visible again (admin may have made changes)
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") loadRealData();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [loadRealData]);

  // Poll every 30 seconds so supervisor assignment changes appear without a manual reload
  useEffect(() => {
    const id = setInterval(() => loadRealData(), 30_000);
    return () => clearInterval(id);
  }, [loadRealData]);

  const userId = currentUser?.id ?? "";
  const student = getStudentById(userId);
  const name = student?.name ?? currentUser?.name ?? "Student";
  const email = student?.email ?? currentUser?.email ?? "";

  const modeBadge = pathname.startsWith("/student/reports") ? "Review Mode" : undefined;

  return (
    <DashboardLayout
      navItems={studentNavItems}
      roleLabel={roleLabels.student}
      userName={name}
      userEmail={email}
      profileHref="/student/profile"
      variant="portal"
      userRoleBadge="Student Intern"
      modeBadge={modeBadge}
      notificationAudience="student"
      notificationUserId={userId}
    >
      {children}
    </DashboardLayout>
  );
}
