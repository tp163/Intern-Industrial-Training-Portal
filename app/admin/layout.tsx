import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentAdmin } from "@/data/mock";
import { adminNavItems, roleLabels } from "@/lib/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navItems={adminNavItems}
      roleLabel={roleLabels.admin}
      userName={currentAdmin.name}
      userEmail={currentAdmin.email}
    >
      {children}
    </DashboardLayout>
  );
}
