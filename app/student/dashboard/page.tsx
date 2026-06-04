"use client";

import { NotificationPanel } from "@/components/notifications/notification-panel";
import { currentStudent, studentPortalDashboard } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { Button, Chip } from "@heroui/react";
import { Calendar, Mail, Megaphone, Phone, User } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { reportProgress, nextReport } = studentPortalDashboard;
  const { getAssignedSupervisorForStudent, getPublishedAnnouncementsForStudent } = useAppStore();
  const progress = reportProgress;
  const supervisor = getAssignedSupervisorForStudent(currentStudent.id);
  const latestAnnouncements = getPublishedAnnouncementsForStudent(currentStudent.id).slice(0, 2);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="ds-page-title">Hello, {currentStudent.name}</h1>
          <p className="ds-page-description">
            {currentStudent.internshipCompany
              ? `Active placement at ${currentStudent.internshipCompany}`
              : "Track your internship progress and updates"}
          </p>
        </div>
        <NotificationPanel audience="student" userId={currentStudent.id} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="rounded-card border border-border/60 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="text-base font-semibold text-text-primary">Assigned Supervisor</h2>
          </div>
          {supervisor ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-text-primary">{supervisor.name}</p>
              <p className="text-sm text-text-secondary">{supervisor.title}</p>
              <div className="space-y-1.5 text-sm text-text-secondary">
                <p className="inline-flex items-center gap-2">
                  <Mail size={14} className="text-primary" />
                  {supervisor.email}
                </p>
                {supervisor.phone && (
                  <p className="inline-flex items-center gap-2">
                    <Phone size={14} className="text-primary" />
                    {supervisor.phone}
                  </p>
                )}
              </div>
              <Chip color="success" variant="flat" size="sm">
                Allocated
              </Chip>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-secondary">
                No supervisor assigned yet. Administration will allocate a supervisor soon.
              </p>
              <Chip color="warning" variant="flat" size="sm" className="mt-2">
                Unassigned
              </Chip>
            </div>
          )}
        </div>

        <div className="rounded-card border border-border/60 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Megaphone size={20} className="text-primary" />
              <h2 className="text-base font-semibold text-text-primary">Announcements</h2>
            </div>
            <Button as={Link} href="/student/announcements" size="sm" variant="flat" color="primary" radius="lg">
              View all
            </Button>
          </div>
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm text-text-secondary">No announcements at this time.</p>
          ) : (
            <ul className="space-y-3">
              {latestAnnouncements.map((a) => (
                <li key={a.id} className="rounded-button border border-border/60 bg-surface-muted p-3">
                  <p className="font-medium text-text-primary">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{a.message}</p>
                  <p className="mt-1 text-xs text-text-secondary capitalize">
                    {a.priority} · {a.category}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
    </div>
  );
}
