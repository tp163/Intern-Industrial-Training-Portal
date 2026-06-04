"use client";

import { supervisors } from "@/data/mock";
import { getInitials } from "@/lib/utils";
import { Avatar } from "@heroui/react";

export default function SupervisorDirectoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">Engineering Faculty</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Supervisors Directory
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Faculty supervisors available for student assignments
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {supervisors.map((supervisor) => (
          <div
            key={supervisor.id}
            className="flex items-center gap-4 rounded-card border border-border/60 bg-white p-5 shadow-card"
          >
            <Avatar name={getInitials(supervisor.name)} size="md" color="secondary" />
            <div>
              <p className="font-semibold text-text-primary">{supervisor.name}</p>
              <p className="text-sm text-text-secondary">{supervisor.title}</p>
              <p className="text-xs text-text-secondary">
                {supervisor.department} · {supervisor.assignedStudents} students
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
