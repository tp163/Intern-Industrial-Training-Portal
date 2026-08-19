"use client";

import { ReportDeadlineManager } from "@/components/supervisor/report-deadline-manager";
import { StatCard } from "@/components/ui/stat-card";
import { useAppStore } from "@/lib/store/app-store";
import { useEffect, useMemo } from "react";

export default function SupervisorDashboardPage() {
  const { currentUser, supervisors, getReportsForSupervisor, getStudentsBySupervisor, loadRealData } = useAppStore();
  const name = currentUser?.name ?? "Supervisor";
  const firstName = name.split(" ").slice(-1)[0];
  const supervisorRecord = useMemo(
    () =>
      supervisors.find((supervisor) => supervisor.id === currentUser?.id) ??
      supervisors.find((supervisor) => supervisor.email === currentUser?.email),
    [currentUser?.email, currentUser?.id, supervisors]
  );
  const supervisorId = supervisorRecord?.id ?? currentUser?.id ?? "";
  const assignedStudents = getStudentsBySupervisor(supervisorId);
  const reports = getReportsForSupervisor(supervisorId);

  useEffect(() => {
    loadRealData();
  }, [loadRealData, supervisorId]);

  const stats = [
    { label: "Assigned Students", value: assignedStudents.length, icon: "Users" },
    {
      label: "Pending Reports",
      value: reports.filter((r) => r.status === "pending" || r.status === "unreviewed").length,
      icon: "FileClock",
    },
    {
      label: "Reviewed Reports",
      value: reports.filter((r) => r.status === "accepted" || r.status === "rejected" || r.status === "reviewed").length,
      icon: "CheckCircle",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Welcome, {firstName}!
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of your assigned students and report activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <ReportDeadlineManager students={assignedStudents} />
    </div>
  );
}
