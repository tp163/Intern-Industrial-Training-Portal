"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { currentSupervisor, progressReports, students } from "@/data/mock";
import { formatDate } from "@/lib/utils";
import { Chip } from "@heroui/react";
import { useMemo, useState } from "react";

export default function SupervisorReportsPage() {
  const [search, setSearch] = useState("");

  const assignedStudentIds = new Set(
    students.filter((s) => s.supervisorId === currentSupervisor.id).map((s) => s.id)
  );

  const myReports = progressReports.filter((r) => assignedStudentIds.has(r.studentId));

  const filtered = useMemo(() => {
    if (!search) return myReports;
    const q = search.toLowerCase();
    return myReports.filter(
      (r) =>
        r.studentName.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
    );
  }, [myReports, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Progress Reports"
        description="Weekly progress reports submitted by your students"
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
                        Week {report.week}
                      </Chip>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Submitted {formatDate(report.submittedAt)}
                    </p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>

                <p className="text-sm">{report.summary}</p>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                      Achievements
                    </p>
                    <ul className="space-y-1 text-sm">
                      {report.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-success">✓</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase text-text-secondary">
                      Challenges
                    </p>
                    <ul className="space-y-1 text-sm">
                      {report.challenges.map((c, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning">!</span>
                          {c}
                        </li>
                      ))}
                    </ul>
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
