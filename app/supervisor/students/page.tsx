"use client";

import { AppModal } from "@/components/ui/app-modal";
import { InternshipStatusPill } from "@/components/supervisor/internship-status-pill";
import { currentSupervisor, students, supervisorConsoleMeta } from "@/data/mock";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import type { InternshipPlacementStatus, Student } from "@/types";
import {
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from "@heroui/react";
import { Eye, FilePenLine, Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function SupervisorStudentsPage() {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [modalMode, setModalMode] = useState<"profile" | "update" | null>(null);
  const [evaluationNotes, setEvaluationNotes] = useState("");
  const [reportStatus, setReportStatus] = useState<InternshipPlacementStatus>("active");

  const assignedStudents = useMemo(
    () => students.filter((s) => s.supervisorId === currentSupervisor.id),
    []
  );

  const filtered = useMemo(() => {
    if (!search) return assignedStudents;
    const q = search.toLowerCase();
    return assignedStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
    );
  }, [assignedStudents, search]);

  const openProfile = (student: Student) => {
    setSelectedStudent(student);
    setModalMode("profile");
  };

  const openUpdate = (student: Student) => {
    setSelectedStudent(student);
    setReportStatus(student.internshipStatus ?? "active");
    setEvaluationNotes("");
    setModalMode("update");
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setModalMode(null);
    setEvaluationNotes("");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">
          {supervisorConsoleMeta.facultyName}{" "}
          <span className="mx-1 text-text-secondary/60">&gt;</span> Students
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              Students
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              View and manage students assigned to {currentSupervisor.name}.
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
            className="w-full rounded-input border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card">
        <Table
          aria-label="Assigned students"
          removeWrapper
          classNames={{
            th: "bg-surface-muted text-[11px] font-semibold uppercase tracking-wider text-text-secondary",
          }}
        >
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>STUDENT ID</TableColumn>
            <TableColumn>DEPARTMENT</TableColumn>
            <TableColumn>BATCH</TableColumn>
            <TableColumn>REPORT STATUS</TableColumn>
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
                      classNames={{ base: "bg-surface-muted text-text-primary" }}
                      getInitials={getInitials}
                    />
                    <div>
                      <p className="font-semibold text-text-primary">{student.name}</p>
                      <p className="text-xs text-text-secondary">{student.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-text-secondary">{student.studentId}</TableCell>
                <TableCell>{student.departmentCode ?? student.program}</TableCell>
                <TableCell>{student.batch ?? "—"}</TableCell>
                <TableCell>
                  {student.internshipStatus ? (
                    <InternshipStatusPill status={student.internshipStatus} />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="light"
                      startContent={<Eye size={14} />}
                      onPress={() => openProfile(student)}
                    >
                      Profile
                    </Button>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      startContent={<FilePenLine size={14} />}
                      onPress={() => openUpdate(student)}
                    >
                      Update
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AppModal
        isOpen={modalMode === "profile" && !!selectedStudent}
        onClose={closeModal}
        title="Student Profile"
        footer={
          <Button variant="light" onPress={closeModal}>
            Close
          </Button>
        }
      >
        {selectedStudent && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField label="Name" value={selectedStudent.name} />
            <ProfileField label="Student ID" value={selectedStudent.studentId} />
            <ProfileField label="Email" value={selectedStudent.email} />
            <ProfileField label="Department" value={selectedStudent.departmentCode ?? "—"} />
            <ProfileField label="Batch" value={selectedStudent.batch ?? "—"} />
            <ProfileField label="Program" value={selectedStudent.program} />
            <ProfileField label="Year" value={`Year ${selectedStudent.year}`} />
            <ProfileField label="GPA" value={selectedStudent.gpa?.toString() ?? "—"} />
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Report Status
              </p>
              <div className="mt-2">
                {selectedStudent.internshipStatus ? (
                  <InternshipStatusPill status={selectedStudent.internshipStatus} />
                ) : (
                  "—"
                )}
              </div>
            </div>
          </div>
        )}
      </AppModal>

      <AppModal
        isOpen={modalMode === "update" && !!selectedStudent}
        onClose={closeModal}
        title="Update Progress & Evaluation"
        footer={
          <>
            <Button variant="light" onPress={closeModal}>
              Cancel
            </Button>
            <Button color="primary" onPress={closeModal}>
              Save Update
            </Button>
          </>
        }
      >
        {selectedStudent && (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              Updating records for <span className="font-semibold">{selectedStudent.name}</span>
            </p>
            <Select
              label="Report / Placement Status"
              selectedKeys={[reportStatus]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as InternshipPlacementStatus;
                if (val) setReportStatus(val);
              }}
              variant="bordered"
              radius="lg"
            >
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="not_placed">Not Placed</SelectItem>
            </Select>
            <Input
              label="Evaluation Score"
              placeholder="e.g. 85"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Textarea
              label="Evaluation Notes"
              placeholder="Document progress, evaluations, and placement updates..."
              value={evaluationNotes}
              onValueChange={setEvaluationNotes}
              variant="bordered"
              radius="lg"
              minRows={4}
              classNames={{ inputWrapper: "border-border bg-white" }}
            />
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
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
