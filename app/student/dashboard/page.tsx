"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  applications,
  currentStudent,
  internships,
  notifications,
  studentDashboardStats,
} from "@/data/mock";
import { formatDate } from "@/lib/utils";
import { Button } from "@heroui/react";
import { ArrowRight, Briefcase } from "lucide-react";
import Link from "next/link";

export default function StudentDashboardPage() {
  const myApplications = applications.filter((a) => a.studentId === currentStudent.id);
  const openInternships = internships.filter((i) => i.status === "open").slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${currentStudent.name.split(" ")[0]}!`}
        description="Here's an overview of your internship journey"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studentDashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentCard
          title="Recent Applications"
          action={
            <Button
              as={Link}
              href="/student/applications"
              size="sm"
              variant="light"
              endContent={<ArrowRight size={16} />}
            >
              View all
            </Button>
          }
        >
          <div className="space-y-3">
            {myApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-xl border border-default-200 p-4 transition-colors hover:bg-default-50"
              >
                <div>
                  <p className="font-medium">{app.internshipTitle}</p>
                  <p className="text-sm text-default-500">{app.companyName}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard title="Recommended Internships">
          <div className="space-y-3">
            {openInternships.map((internship) => (
              <div
                key={internship.id}
                className="flex items-start gap-3 rounded-xl border border-default-200 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{internship.title}</p>
                  <p className="text-sm text-default-500">
                    {internship.companyName} · {internship.location}
                  </p>
                  <p className="mt-1 text-xs text-default-400">
                    Deadline: {formatDate(internship.deadline)}
                  </p>
                </div>
              </div>
            ))}
            <Button
              as={Link}
              href="/student/internships"
              color="primary"
              variant="flat"
              className="w-full"
              radius="lg"
            >
              Browse All Internships
            </Button>
          </div>
        </ContentCard>
      </div>

      <ContentCard title="Notifications">
        <div className="space-y-3">
          {notifications.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 ${n.read ? "border-default-200" : "border-primary/30 bg-primary/5"}`}
            >
              <p className="font-medium">{n.title}</p>
              <p className="mt-1 text-sm text-default-500">{n.message}</p>
            </div>
          ))}
        </div>
      </ContentCard>
    </div>
  );
}
