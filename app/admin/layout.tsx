"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAppStore } from "@/lib/store/app-store";
import { adminNavItems, roleLabels } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { adminProfile, currentUser } = useAppStore();

  return (
    <DashboardLayout
      navItems={adminNavItems}
      roleLabel={roleLabels.admin}
      userName={currentUser?.name ?? adminProfile.name}
      userEmail={currentUser?.email ?? adminProfile.email}
      profileHref="/admin/settings"
      variant="portal"
      userRoleBadge="Faculty Admin"
      consoleTitle="Applied Sciences Console"
      consoleVersion="v1.1"
      notificationAudience="admin"
      notificationUserId={currentUser?.id}
    >
      {children}
    </DashboardLayout>
  );
}
