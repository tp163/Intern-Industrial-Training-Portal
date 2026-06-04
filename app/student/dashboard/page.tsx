"use client";

import { currentStudent, notifications, studentPortalDashboard } from "@/data/mock";
import { Button } from "@heroui/react";
import { Bell, Calendar, Settings } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { reportProgress, nextReport, workshop, activeCompany } = studentPortalDashboard;
  const progress = reportProgress;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            Hello, {currentStudent.name}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Active placement at {activeCompany}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="bordered"
            radius="full"
            className="relative h-10 w-10 min-w-10 border-border bg-white text-text-secondary shadow-card"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger" />
            )}
          </Button>
          <Button
            isIconOnly
            variant="bordered"
            radius="full"
            className="h-10 w-10 min-w-10 border-border bg-white text-text-secondary shadow-card"
            aria-label="Settings"
            as={Link}
            href="/student/profile"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px]">
        <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text-primary">Report Progress</h2>
            <span className="rounded-full bg-[#FFF0E0] px-3 py-1 text-xs font-semibold text-[#C06027]">
              {progress.percent}% Complete
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#EDE4DC]">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            {progress.monthsCompleted} months completed. {progress.monthsRemaining} months remaining.
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-card bg-primary p-5 text-white shadow-card">
          <Calendar size={22} className="opacity-90" strokeWidth={1.75} />
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
              Next Report Due
            </p>
            <p className="mt-1 text-4xl font-bold leading-none">{nextReport.date}</p>
            <p className="mt-3 text-sm opacity-90">{nextReport.type}</p>
          </div>
        </div>
      </div>

      <div
        className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-card p-5 shadow-card"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(61, 46, 38, 0.85) 0%, rgba(61, 46, 38, 0.35) 60%, rgba(61, 46, 38, 0.15) 100%), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-white">{workshop.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{workshop.description}</p>
          <Button
            radius="full"
            className="mt-5 bg-white font-semibold text-primary hover:bg-white/90"
            size="sm"
          >
            Reserve Spot
          </Button>
        </div>
      </div>
    </div>
  );
}
