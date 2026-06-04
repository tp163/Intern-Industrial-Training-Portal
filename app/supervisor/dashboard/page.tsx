"use client";

import { StatCard } from "@/components/ui/stat-card";
import { currentSupervisor, supervisorDashboardStats } from "@/data/mock";

export default function SupervisorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-text-secondary">Engineering Faculty</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Welcome, {currentSupervisor.name.split(" ").slice(-1)[0]}!
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Overview of your assigned students and report activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {supervisorDashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  );
}
