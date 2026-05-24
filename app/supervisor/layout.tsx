import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentSupervisor } from "@/data/mock";
import { roleLabels, supervisorNavItems } from "@/lib/navigation";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navItems={supervisorNavItems}
      roleLabel={roleLabels.supervisor}
      userName={currentSupervisor.name}
      userEmail={currentSupervisor.email}
    >
      {children}
    </DashboardLayout>
  );
}
