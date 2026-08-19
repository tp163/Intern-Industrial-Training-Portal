"use client";

import { useAppStore } from "@/lib/store/app-store";
import { departmentOptions, formatDepartment, normalizeDepartment } from "@/lib/departments";
import { cn } from "@/lib/utils";
import { Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

const severityDot = {
  danger: "bg-danger",
  warning: "bg-warning",
};

export default function AdminDashboardPage() {
  const { students, internships, supervisors } = useAppStore();
  const departmentCounts = students.reduce<Record<string, number>>((acc, student) => {
    const key = normalizeDepartment(student.departmentCode || student.department);
    if (!key) return acc;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const departments = departmentOptions.map((department) => ({
    code: department,
    name: formatDepartment(department),
    count: departmentCounts[department] ?? 0,
  }));
  const activeInternships = internships.filter((i) => i.status === "open").length;
  const allocatedStudents = students.filter((student) => Boolean(student.supervisorId)).length;
  const supervisorDepartmentCounts = supervisors.reduce<Record<string, number>>((counts, supervisor) => {
    const department = normalizeDepartment(supervisor.department);
    if (department) counts[department] = (counts[department] ?? 0) + 1;
    return counts;
  }, {});
  const actionRequired = [
    {
      id: "act-unassigned",
      label: "Unassigned Students",
      detail: `${students.filter((s) => !s.supervisorId).length} students`,
      severity: "danger" as const,
      href: "/admin/supervisor-student-directory",
    },
    {
      id: "act-allocated",
      label: "Allocated Students",
      detail: `${allocatedStudents} students`,
      severity: "warning" as const,
      href: "/admin/student-allocation",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">Faculty Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">Overview of student placements and department activity.</p>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-6 shadow-card md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
          Total Students
        </p>
        <p className="mt-2 text-4xl font-bold text-text-primary md:text-5xl">
          {students.length.toLocaleString()}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-4">
          {departments.map((dept) => (
            <div key={dept.name}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {dept.name}
              </p>
              <p className="mt-1 text-xl font-bold text-text-primary">{dept.count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-card bg-primary p-6 text-white shadow-card">
          <p className="text-sm font-medium opacity-90">Active Internships</p>
          <p className="mt-2 text-4xl font-bold">{activeInternships.toLocaleString()}</p>
          <p className="mt-4 text-sm opacity-90">{internships.length.toLocaleString()} total listings</p>
        </div>

        <div
          className="rounded-card p-6 text-white shadow-card"
          style={{ backgroundColor: "#9B4D4D" }}
        >
          <p className="text-sm font-medium opacity-90">Supervisors by Department</p>
          <p className="mt-2 text-4xl font-bold">{supervisors.length.toLocaleString()}</p>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm opacity-90">
            {departments.map((department) => (
              <span key={department.code}>
                {department.code}: {supervisorDepartmentCounts[department.code] ?? 0}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center gap-2">
            <AlertTriangle size={18} className="text-primary" />
            <h2 className="font-semibold text-text-primary">Action Required</h2>
          </div>
          <ul className="space-y-4">
            {actionRequired.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="group flex items-start justify-between gap-3 rounded-button p-2 transition-colors hover:bg-surface-muted"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-text-primary group-hover:text-primary">
                      {item.label}
                    </p>
                    <p className="text-sm text-text-secondary">{item.detail}</p>
                  </div>
                  <span
                    className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", severityDot[item.severity])}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
