"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { currentStudent } from "@/data/mock";
import { roleLabels, studentNavItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const modeBadge = pathname.startsWith("/student/reports") ? "Review Mode" : undefined;

  return (
    <DashboardLayout
      navItems={studentNavItems}
      roleLabel={roleLabels.student}
      userName={currentStudent.name}
      userEmail={currentStudent.email}
      profileHref="/student/profile"
      variant="portal"
      userRoleBadge="Student Intern"
      modeBadge={modeBadge}
      notificationAudience="student"
      notificationUserId={currentStudent.id}
    >
      {children}
    </DashboardLayout>
  );
}
