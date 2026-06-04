"use client";

import { AppModal } from "@/components/ui/app-modal";
import { PdfViewer } from "@/components/reports/pdf-viewer";
import { TableScroll } from "@/components/ui/table-scroll";
import { ReportStatusBadge } from "@/components/reports/report-status-badge";
import { InternshipStatusPill } from "@/components/supervisor/internship-status-pill";
import { currentSupervisor, supervisorConsoleMeta } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { getInitialCvFileName } from "@/lib/cv-storage";
import { getInitials } from "@/lib/utils";
import type { Student } from "@/types";
import {
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Download, Eye, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function SupervisorStudentsPage() {
  const { students, getReportsForStudent } = useAppStore();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [cvPreviewUrl, setCvPreviewUrl] = useState<string | undefined>();

  const assignedStudents = useMemo(
    () => students.filter((s) => s.supervisorId === currentSupervisor.id),
    [students]
  );

  const filtered = useMemo(() => {
    if (!search) return assignedStudents;
    const q = search.toLowerCase();
    return assignedStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
    );
  }, [assignedStudents, search]);

  useEffect(() => {
    if (!selectedStudent) {
      setCvPreviewUrl(undefined);
      return;
    }
    const cvName =
      selectedStudent.id === "stu-001"
        ? getInitialCvFileName(selectedStudent.cvFileName ?? "alex-morgan-cv.pdf")
        : selectedStudent.cvFileName;
    if (cvName) {
      setCvPreviewUrl("https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf");
    } else {
      setCvPreviewUrl(undefined);
    }
  }, [selectedStudent]);

  const openProfile = (student: Student) => setSelectedStudent(student);
  const closeModal = () => setSelectedStudent(null);

  const studentReports = selectedStudent
    ? getReportsForStudent(selectedStudent.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">
          {supervisorConsoleMeta.facultyName}{" "}
          <span className="mx-1 text-text-secondary/60">&gt;</span> Students
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="ds-page-title">Students</h1>
            <p className="ds-page-description">
              View complete profiles, CVs, and internship details for assigned students.
            </p>
          </div>
          <div className="rounded-card border border-border/60 bg-surface-muted px-4 py-2 text-sm font-semibold text-text-primary">
            {filtered.length} assigned
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="relative max-w-xl">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="search"
            placeholder="Search by Student ID or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-input border border-border bg-white py-2.5 pl-10 pr-4 text-base text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card">
        <TableScroll>
          <Table aria-label="Assigned students" removeWrapper>
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn className="hidden sm:table-cell">STUDENT ID</TableColumn>
              <TableColumn>DEPARTMENT</TableColumn>
              <TableColumn className="hidden md:table-cell">BATCH</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No students assigned to you match this search.">
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={getInitials(student.name)}
                        size="sm"
                        getInitials={getInitials}
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-text-primary">{student.name}</p>
                        <p className="text-xs text-text-secondary sm:hidden">{student.studentId}</p>
                        <p className="text-xs text-text-secondary">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell font-medium text-text-secondary">
                    {student.studentId}
                  </TableCell>
                  <TableCell>{student.departmentCode ?? student.program}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.batch ?? "—"}</TableCell>
                  <TableCell>
                    {student.internshipStatus ? (
                      <InternshipStatusPill status={student.internshipStatus} />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<Eye size={14} />}
                      onPress={() => openProfile(student)}
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </div>

      <AppModal
        isOpen={!!selectedStudent}
        onClose={closeModal}
        title={selectedStudent ? `${selectedStudent.name} — Profile` : "Student Profile"}
        size="3xl"
        footer={
          <Button variant="light" onPress={closeModal}>Close</Button>
        }
      >
        {selectedStudent && (
          <div className="space-y-6">
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Personal &amp; Academic
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField label="Name" value={selectedStudent.name} />
                <ProfileField label="Student ID" value={selectedStudent.studentId} />
                <ProfileField label="Email" value={selectedStudent.email} />
                <ProfileField label="Phone" value={selectedStudent.phone ?? "—"} />
                <ProfileField label="Department" value={selectedStudent.departmentCode ?? "—"} />
                <ProfileField label="Program" value={selectedStudent.program} />
                <ProfileField label="Batch" value={selectedStudent.batch ?? "—"} />
                <ProfileField label="Year" value={`Year ${selectedStudent.year}`} />
                <ProfileField label="GPA" value={selectedStudent.gpa?.toString() ?? "—"} />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Internship Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="Company"
                  value={selectedStudent.internshipCompany ?? "—"}
                />
                <ProfileField label="Role" value={selectedStudent.internshipRole ?? "—"} />
                <div>
                  <p className="text-xs font-semibold uppercase text-text-secondary">Placement Status</p>
                  <div className="mt-2">
                    {selectedStudent.internshipStatus ? (
                      <InternshipStatusPill status={selectedStudent.internshipStatus} />
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
                <ProfileField
                  label="Logbook Submissions"
                  value={`${studentReports.length} report(s)`}
                />
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-secondary">
                Logbook Reports
              </h3>
              {studentReports.length === 0 ? (
                <p className="text-sm text-text-secondary">No reports submitted yet.</p>
              ) : (
                <ul className="max-h-48 space-y-2 overflow-y-auto">
                  {studentReports.map((r) => (
                    <li
                      key={r.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-button border border-border/60 bg-surface-muted p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {r.period} · #{r.monthNumber}
                        </p>
                        {r.marks != null && (
                          <p className="text-xs text-text-secondary">Marks: {r.marks}</p>
                        )}
                        {r.feedback && (
                          <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                            {r.feedback}
                          </p>
                        )}
                      </div>
                      <ReportStatusBadge status={r.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-text-secondary">
                  Latest CV
                </h3>
                {selectedStudent.cvFileName && (
                  <Button
                    size="sm"
                    variant="bordered"
                    startContent={<Download size={14} />}
                    onPress={() => window.open(cvPreviewUrl, "_blank")}
                  >
                    Download CV
                  </Button>
                )}
              </div>
              {selectedStudent.cvFileName ? (
                <>
                  <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <FileText size={16} />
                    {selectedStudent.cvFileName}
                  </p>
                  <PdfViewer url={cvPreviewUrl} fileName={selectedStudent.cvFileName} />
                </>
              ) : (
                <p className="rounded-button border border-dashed border-border p-6 text-center text-sm text-text-secondary">
                  No CV uploaded yet.
                </p>
              )}
            </section>
          </div>
        )}
      </AppModal>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-base font-medium text-text-primary">{value}</p>
    </div>
  );
}
