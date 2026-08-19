"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAppStore } from "@/lib/store/app-store";
import { formatDate } from "@/lib/utils";
import { Button, Chip } from "@heroui/react";
import { ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function SupervisorReportsPage() {
  const router = useRouter();
  const { currentUser, loadRealData, logbookReports, students, supervisors } = useAppStore();
  const [search, setSearch] = useState("");
  const supervisorRecord = useMemo(
    () =>
      supervisors.find((supervisor) => supervisor.id === currentUser?.id) ??
      supervisors.find((supervisor) => supervisor.email === currentUser?.email),
    [currentUser?.email, currentUser?.id, supervisors]
  );
  const supervisorId = supervisorRecord?.id ?? currentUser?.id ?? "";

  useEffect(() => {
    loadRealData();
  }, [loadRealData, supervisorId]);

  const assignedStudentIds = new Set(
    students.filter((s) => !supervisorId || s.supervisorId === supervisorId).map((s) => s.id)
  );
  const myReports = logbookReports.filter((r) => assignedStudentIds.has(r.studentId));

  const filtered = useMemo(() => {
    if (!search) return myReports;
    const q = search.toLowerCase();
    return myReports.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.excerpt.toLowerCase().includes(q)
    );
  }, [myReports, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Fortnightly reports submitted by your students"
        action={
          <Button
            color="primary"
            radius="lg"
            startContent={<ClipboardCheck size={16} />}
            onPress={() => router.push("/supervisor/reviews")}
          >
            Review Reports
          </Button>
        }
      />

      <div className="mb-2">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search reports..."
          className="max-w-md"
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <ContentCard>
            <p className="py-8 text-center text-sm text-text-secondary">No reports found</p>
          </ContentCard>
        ) : (
          filtered.map((report) => (
            <ContentCard key={report.id}>
              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{report.studentName}</h3>
                      <Chip size="sm" variant="flat">
                        Report #{report.monthNumber}
                      </Chip>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Submitted {formatDate(report.submittedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={report.status} />
                    {report.status === "pending" && (
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        radius="lg"
                        startContent={<ClipboardCheck size={14} />}
                        onPress={() => router.push("/supervisor/reviews")}
                      >
                        Review
                      </Button>
                    )}
                  </div>
                </div>

                <p className="text-sm">{report.excerpt}</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                      Details
                    </p>
                    <ul className="space-y-1 text-sm">
                      {[report.period, report.pdfFileName].filter(Boolean).map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-success">✓</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">Feedback</p>
                    <p className="text-sm text-text-secondary">{report.feedback || "No feedback yet."}</p>
                  </div>
                </div>
              </div>
            </ContentCard>
          ))
        )}
      </div>
    </div>
  );
}
