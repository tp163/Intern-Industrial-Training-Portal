"use client";

import { useAppStore } from "@/lib/store/app-store";
import { authFetch } from "@/lib/auth-fetch";
import { getInternshipProgress } from "@/lib/internship-progress";
import { formatDate } from "@/lib/utils";
import { Button, Chip } from "@heroui/react";
import { Calendar, Mail, Megaphone, Phone, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function normalizeStudentName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

type ReportDeadline = {
  id: string;
  student_id: string;
  student_name?: string;
  month_number: number;
  period: string;
  due_date: string;
  report_type?: string;
  status: string;
};

export default function StudentDashboardPage() {
  const {
    currentUser,
    getAssignedSupervisorForStudent,
    getPublishedAnnouncementsForStudent,
    getStudentById,
    loadRealData,
  } = useAppStore();

  const userId = currentUser?.id ?? "";
  const student = userId ? getStudentById(userId) : undefined;
  const supervisor = userId ? getAssignedSupervisorForStudent(userId) : undefined;
  const latestAnnouncements = userId
    ? getPublishedAnnouncementsForStudent(userId).slice(0, 2)
    : [];
  const [nextDeadline, setNextDeadline] = useState<ReportDeadline | null>(null);

  const progress = getInternshipProgress(
    student?.internshipMonthsCompleted,
    student?.internshipTotalMonths
  );

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

  useEffect(() => {
    const expectedStudentName = normalizeStudentName(student?.name ?? currentUser?.name ?? "");
    if (!userId || !expectedStudentName) {
      setNextDeadline(null);
      return;
    }

    let cancelled = false;

    async function loadNextDeadline() {
      try {
        const response = await authFetch(
          `${API_BASE}/report_deadlines?student_id=${encodeURIComponent(userId)}`
        );
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message);
        const deadlines = (result.data ?? []) as ReportDeadline[];
        const upcoming = deadlines
          .filter((deadline) => {
            const sameStudentId = String(deadline.student_id) === String(userId);
            const deadlineName = normalizeStudentName(String(deadline.student_name ?? ""));
            const sameStudentName = deadlineName === expectedStudentName;
            return sameStudentId && sameStudentName && deadline.status === "pending" && deadline.due_date;
          })
          .sort(
            (a, b) =>
              new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          )[0] ?? null;
        if (!cancelled) setNextDeadline(upcoming);
      } catch {
        if (!cancelled) setNextDeadline(null);
      }
    }

    loadNextDeadline();

    const refreshOnFocus = () => loadNextDeadline();
    const refreshInterval = window.setInterval(loadNextDeadline, 30_000);
    window.addEventListener("focus", refreshOnFocus);

    return () => {
      cancelled = true;
      window.clearInterval(refreshInterval);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [currentUser?.name, student?.name, userId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div>
          <h1 className="ds-page-title">Hello, {student?.name ?? currentUser?.name ?? "Student"}</h1>
          <p className="ds-page-description">
            {student?.internshipCompany
              ? `Active placement at ${student.internshipCompany}`
              : "Track your internship progress and updates"}
          </p>
        </div>
      </div>

      {/* Row 2: Supervisor + Announcements (side by side) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Supervisor Card */}
        <div className="rounded-card border border-border/60 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <User size={20} className="text-primary" />
            <h2 className="text-base font-semibold text-text-primary">Assigned Supervisor</h2>
          </div>
          {supervisor ? (
            <div className="space-y-3">
              <p className="text-lg font-semibold text-text-primary">
                {supervisor.title} {supervisor.name}
              </p>
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

        {/* Announcements Card */}
        <div className="rounded-card border border-border/60 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Megaphone size={20} className="text-primary" />
              <h2 className="text-base font-semibold text-text-primary">Announcements</h2>
            </div>
            <Button
              as={Link}
              href="/student/announcements"
              size="sm"
              variant="flat"
              color="primary"
              radius="lg"
            >
              View all
            </Button>
          </div>
          {latestAnnouncements.length === 0 ? (
            <p className="text-sm text-text-secondary">No announcements at this time.</p>
          ) : (
            <ul className="space-y-3">
              {latestAnnouncements.map((a) => (
                <li
                  key={a.id}
                  className="rounded-button border border-border/60 bg-surface-muted p-3"
                >
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

      {/* Row 3: Progress + Next report due */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_220px]">
        <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-text-primary">Internship Progress</h2>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#FFF0E0] px-3 py-1 text-xs font-semibold text-[#C06027]">
                {progress.percent}% Complete
              </span>
              <Button
                as={Link}
                href="/student/profile#internship-details"
                size="sm"
                variant="flat"
                color="primary"
                radius="lg"
              >
                Update
              </Button>
            </div>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#EDE4DC]">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <p className="mt-4 text-sm text-text-secondary">
            {progress.monthsCompleted} of {progress.totalMonths} months completed.{" "}
            {progress.monthsRemaining > 0
              ? `${progress.monthsRemaining} month${progress.monthsRemaining !== 1 ? "s" : ""} remaining.`
              : "Internship complete!"}
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-card bg-primary p-5 text-white shadow-card">
          <Calendar size={22} className="opacity-90" strokeWidth={1.75} />
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">
              Next Report Due
            </p>
            <p className="mt-1 text-2xl font-bold leading-tight">
              {nextDeadline ? formatDate(nextDeadline.due_date) : "Not scheduled"}
            </p>
            <p className="mt-3 text-sm opacity-90">
              {nextDeadline?.report_type ?? "Monthly Logbook"}
            </p>
            {nextDeadline?.period && (
              <p className="mt-1 text-xs opacity-80">{nextDeadline.period}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
