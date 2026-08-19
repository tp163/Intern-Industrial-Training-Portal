"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAppStore } from "@/lib/store/app-store";
import { roleLabels, supervisorNavItems } from "@/lib/navigation";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();

  const name = currentUser?.name ?? "Supervisor";
  const email = currentUser?.email ?? "";
  const userId = currentUser?.id ?? "";

  return (
    <DashboardLayout
      navItems={supervisorNavItems}
      roleLabel={roleLabels.supervisor}
      userName={name}
      userEmail={email}
      profileHref="/supervisor/settings"
      variant="portal"
      userRoleBadge="Faculty Supervisor"
      consoleTitle="Applied Sciences Console"
      consoleVersion="v1.1"
      notificationAudience="supervisor"
      notificationUserId={userId}
    >
      {children}
    </DashboardLayout>
  );
}
