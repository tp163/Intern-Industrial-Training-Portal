"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  currentSupervisor,
  reviews,
  students,
  supervisorDashboardStats,
} from "@/data/mock";
import { formatDate, getInitials } from "@/lib/utils";
import { Avatar, Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SupervisorDashboardPage() {
  const assignedStudents = students.filter((s) => s.supervisorId === currentSupervisor.id);
  const pendingReviews = reviews.filter(
    (r) => r.supervisorId === currentSupervisor.id && r.status === "pending"
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${currentSupervisor.name.split(" ")[0]}!`}
        description="Overview of your assigned students and pending reviews"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {supervisorDashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentCard
          title="Pending Reviews"
          action={
            <Button
              as={Link}
              href="/supervisor/reviews"
              size="sm"
              variant="light"
              endContent={<ArrowRight size={16} />}
            >
              View all
            </Button>
          }
        >
          <div className="space-y-3">
            {pendingReviews.length === 0 ? (
              <p className="py-4 text-center text-sm text-text-secondary">No pending reviews</p>
            ) : (
              pendingReviews.slice(0, 4).map((review) => (
                <div
                  key={review.id}
                  className="flex items-center justify-between rounded-button border border-border p-4"
                >
                  <div>
                    <p className="font-medium">{review.title}</p>
                    <p className="text-sm text-text-secondary">{review.studentName}</p>
                    <p className="mt-1 text-xs text-text-secondary">
                      Submitted {formatDate(review.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge status={review.status} />
                </div>
              ))
            )}
          </div>
        </ContentCard>

        <ContentCard
          title="Assigned Students"
          action={
            <Button
              as={Link}
              href="/supervisor/students"
              size="sm"
              variant="light"
              endContent={<ArrowRight size={16} />}
            >
              View all
            </Button>
          }
        >
          <div className="space-y-3">
            {assignedStudents.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 rounded-button border border-border p-4"
              >
                <Avatar name={getInitials(student.name)} size="sm" color="primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-text-secondary">
                    {student.program} · Year {student.year}
                  </p>
                </div>
                {student.gpa && (
                  <span className="text-sm font-medium text-text-primary">GPA {student.gpa}</span>
                )}
              </div>
            ))}
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
