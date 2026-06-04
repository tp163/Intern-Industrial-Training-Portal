import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentSupervisor, supervisorConsoleMeta } from "@/data/mock";
import { roleLabels, supervisorNavItems } from "@/lib/navigation";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navItems={supervisorNavItems}
      roleLabel={roleLabels.supervisor}
      userName={currentSupervisor.name}
      userEmail={currentSupervisor.email}
      profileHref="/supervisor/settings"
      variant="portal"
      userRoleBadge="Faculty Supervisor"
      consoleTitle={supervisorConsoleMeta.consoleTitle}
      consoleVersion={supervisorConsoleMeta.consoleVersion}
      notificationAudience="supervisor"
      notificationUserId={currentSupervisor.id}
    >
      {children}
    </DashboardLayout>
  );
}
