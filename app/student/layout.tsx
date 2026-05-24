import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentStudent } from "@/data/mock";
import { roleLabels, studentNavItems } from "@/lib/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navItems={studentNavItems}
      roleLabel={roleLabels.student}
      userName={currentStudent.name}
      userEmail={currentStudent.email}
    >
      {children}
    </DashboardLayout>
  );
}
