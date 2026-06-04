"use client";

import { AppModal } from "@/components/ui/app-modal";
import { TableScroll } from "@/components/ui/table-scroll";
import { InternshipStatusPill } from "@/components/supervisor/internship-status-pill";
import { currentAdmin, supervisors } from "@/data/mock";
import { useAppStore } from "@/lib/store/app-store";
import { fetchStudentByStudentId } from "@/lib/mock-api";
import { notifyError, notifySuccess } from "@/lib/notify";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import type { Student } from "@/types";
import {
  Avatar,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { ChevronDown, ChevronRight, Eye, Pencil, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

const ALL = "all";

export default function AdminSupervisorStudentDirectoryPage() {
  const { students, allocateStudents, updateStudentRecord, addStudent } = useAppStore();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState(ALL);
  const [batch, setBatch] = useState(ALL);
  const [supervisorFilter, setSupervisorFilter] = useState(ALL);
  const [expandedSupervisors, setExpandedSupervisors] = useState<Set<string>>(
    () => new Set(supervisors.map((s) => s.id))
  );
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [addForm, setAddForm] = useState<Partial<Student>>({});
  const [saving, setSaving] = useState(false);

  const canEdit = currentAdmin.permissions.includes("all");

  const departments = useMemo(
    () => [ALL, ...Array.from(new Set(students.map((s) => s.departmentCode).filter(Boolean)))],
    [students]
  );
  const batches = useMemo(
    () => [ALL, ...Array.from(new Set(students.map((s) => s.batch).filter(Boolean)))],
    [students]
  );

  const supervisorMap = Object.fromEntries(supervisors.map((s) => [s.id, s.name]));

  const supervisorFilterOptions = useMemo(
    () => [
      { key: ALL, label: "All Supervisors" },
      { key: "unassigned", label: "Unassigned" },
      ...supervisors.map((s) => ({ key: s.id, label: s.name })),
    ],
    []
  );

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const q = search.toLowerCase();
      const supervisorName = student.supervisorId
        ? supervisorMap[student.supervisorId]?.toLowerCase() ?? ""
        : "";

      const matchesSearch =
        !search ||
        student.name.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        (student.departmentCode?.toLowerCase().includes(q) ?? false) ||
        (student.batch?.toLowerCase().includes(q) ?? false) ||
        supervisorName.includes(q);

      const matchesDepartment =
        department === ALL || student.departmentCode === department;
      const matchesBatch = batch === ALL || student.batch === batch;
      const matchesSupervisor =
        supervisorFilter === ALL ||
        (supervisorFilter === "unassigned"
          ? !student.supervisorId
          : student.supervisorId === supervisorFilter);

      return matchesSearch && matchesDepartment && matchesBatch && matchesSupervisor;
    });
  }, [students, search, department, batch, supervisorFilter, supervisorMap]);

  const groupedBySupervisor = useMemo(() => {
    return supervisors.map((supervisor) => ({
      supervisor,
      students: filteredStudents.filter((s) => s.supervisorId === supervisor.id),
    }));
  }, [filteredStudents]);

  const unassignedStudents = filteredStudents.filter((s) => !s.supervisorId);

  const toggleSupervisor = (id: string) => {
    setExpandedSupervisors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openStudent = (student: Student, editing: boolean) => {
    setSelectedStudent(student);
    setEditMode(editing);
    setEditForm({ ...student });
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setEditMode(false);
    setEditForm({});
  };

  const handleLookupStudent = async () => {
    setLookupError("");
    if (!lookupId.trim()) {
      setLookupError("Enter a Student ID to search.");
      return;
    }
    setLookupLoading(true);
    try {
      const found = await fetchStudentByStudentId(lookupId);
      if (!found) {
        setLookupError("Invalid Student ID. No matching record found.");
        setAddForm({});
        notifyError("Invalid Student ID. Please check and try again.");
        return;
      }
      const alreadyListed = students.some(
        (s) => s.studentId.toUpperCase() === found.studentId.toUpperCase()
      );
      if (alreadyListed) {
        setLookupError("This student is already in the directory.");
        setAddForm({});
        notifyError("Student is already listed in the directory.");
        return;
      }
      setAddForm({ ...found });
      notifySuccess("Student details loaded successfully.");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleAddToDirectory = () => {
    if (!addForm.studentId || !addForm.name) {
      notifyError("Fetch student details before adding to the directory.");
      return;
    }
    const entry: Student = {
      ...(addForm as Student),
      id: addForm.id?.startsWith("reg-") ? `stu-${Date.now()}` : (addForm.id ?? `stu-${Date.now()}`),
      role: "student",
      allocationStatus: "unassigned",
    };
    addStudent(entry);
    notifySuccess(`${entry.name} added. Assign a supervisor via Student Allocation.`);
    resetAddStudent();
  };

  const handleSaveEdit = () => {
    if (!selectedStudent) return;
    setSaving(true);
    setTimeout(() => {
      const prevSupervisor = selectedStudent.supervisorId;
      const nextSupervisor = editForm.supervisorId;
      updateStudentRecord(selectedStudent.id, editForm as Partial<Student>, "directory record");
      if (prevSupervisor !== nextSupervisor) {
        allocateStudents(
          [selectedStudent.id],
          nextSupervisor ?? null
        );
      }
      setSaving(false);
      notifySuccess("Student updated successfully.");
      closeModal();
    }, 600);
  };

  const resetAddStudent = () => {
    setShowAddStudent(false);
    setLookupId("");
    setLookupError("");
    setAddForm({});
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">
          Administration <span className="mx-1 text-text-secondary/60">&gt;</span> Supervisor Student
          Directory
        </p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
              Supervisor Student Directory
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              View all supervisors and students assigned to each supervisor across the faculty.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="flat" color="primary">
              {filteredStudents.length} students · {supervisors.length} supervisors
            </Chip>
            <Button
              color="primary"
              radius="lg"
              startContent={<Plus size={16} />}
              onPress={() => {
                setShowAddStudent(true);
                setLookupId("");
                setLookupError("");
                setAddForm({});
              }}
            >
              Add Student
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-4 shadow-card sm:p-6">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
              size={18}
            />
            <input
              type="search"
              placeholder="Search by Student ID, Name, Department, Batch, or Supervisor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-input border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select
            aria-label="Department filter"
            selectedKeys={[department]}
            onSelectionChange={(keys) => setDepartment((Array.from(keys)[0] as string) ?? ALL)}
            variant="bordered"
            radius="lg"
            className="min-w-[150px]"
            classNames={{ trigger: "border-border bg-white" }}
          >
            {departments.map((d) => (
              <SelectItem key={d}>{d === ALL ? "All Departments" : d}</SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Batch filter"
            selectedKeys={[batch]}
            onSelectionChange={(keys) => setBatch((Array.from(keys)[0] as string) ?? ALL)}
            variant="bordered"
            radius="lg"
            className="min-w-[130px]"
            classNames={{ trigger: "border-border bg-white" }}
          >
            {batches.map((b) => (
              <SelectItem key={b}>{b === ALL ? "All Batches" : b}</SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Supervisor filter"
            items={supervisorFilterOptions}
            selectedKeys={[supervisorFilter]}
            onSelectionChange={(keys) =>
              setSupervisorFilter((Array.from(keys)[0] as string) ?? ALL)
            }
            variant="bordered"
            radius="lg"
            className="min-w-[180px]"
            classNames={{ trigger: "border-border bg-white" }}
          >
            {(item) => <SelectItem key={item.key}>{item.label}</SelectItem>}
          </Select>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No students match your filters</p>
          <p className="mt-1 text-sm text-text-secondary">Try adjusting search or filter options.</p>
        </div>
      )}

      <div className="space-y-4">
        {groupedBySupervisor.map(({ supervisor, students: assigned }) => {
          if (assigned.length === 0) return null;
          const isExpanded = expandedSupervisors.has(supervisor.id);

          return (
            <section
              key={supervisor.id}
              className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card"
            >
              <button
                type="button"
                onClick={() => toggleSupervisor(supervisor.id)}
                className="flex w-full items-center justify-between gap-4 border-b border-border/60 bg-surface-muted/50 px-4 py-4 text-left sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown size={18} className="shrink-0 text-text-secondary" />
                  ) : (
                    <ChevronRight size={18} className="shrink-0 text-text-secondary" />
                  )}
                  <Avatar name={getInitials(supervisor.name)} size="sm" color="secondary" />
                  <div className="min-w-0">
                    <p className="font-semibold text-text-primary">{supervisor.name}</p>
                    <p className="text-xs text-text-secondary">
                      {supervisor.title} · {supervisor.department}
                    </p>
                  </div>
                </div>
                <Chip size="sm" variant="flat">
                  {assigned.length} student{assigned.length !== 1 ? "s" : ""}
                </Chip>
              </button>

              {isExpanded && (
                <TableScroll>
                  <Table aria-label={`Students for ${supervisor.name}`} removeWrapper>
                    <TableHeader>
                      <TableColumn>STUDENT</TableColumn>
                      <TableColumn>STUDENT ID</TableColumn>
                      <TableColumn>DEPARTMENT</TableColumn>
                      <TableColumn className="hidden sm:table-cell">BATCH</TableColumn>
                      <TableColumn className="hidden md:table-cell">STATUS</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {assigned.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar name={getInitials(student.name)} size="sm" color="primary" />
                              <div>
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-text-secondary">{student.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.departmentCode ?? "—"}</TableCell>
                          <TableCell className="hidden sm:table-cell">{student.batch ?? "—"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {student.internshipStatus ? (
                              <InternshipStatusPill status={student.internshipStatus} />
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                aria-label="View student"
                                onPress={() => openStudent(student, false)}
                              >
                                <Eye size={16} />
                              </Button>
                              {canEdit && (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  aria-label="Edit student"
                                  onPress={() => openStudent(student, true)}
                                >
                                  <Pencil size={16} />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableScroll>
              )}
            </section>
          );
        })}

        {unassignedStudents.length > 0 && (
          <section className="overflow-hidden rounded-card border border-border/60 bg-white shadow-card">
            <div className="border-b border-border/60 bg-surface-muted/50 px-4 py-4 sm:px-6">
              <p className="font-semibold text-text-primary">Unassigned Students</p>
              <p className="text-xs text-text-secondary">Students without a supervisor</p>
            </div>
            <TableScroll>
              <Table aria-label="Unassigned students" removeWrapper>
                <TableHeader>
                  <TableColumn>STUDENT</TableColumn>
                  <TableColumn>STUDENT ID</TableColumn>
                  <TableColumn>DEPARTMENT</TableColumn>
                  <TableColumn>BATCH</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {unassignedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.departmentCode ?? "—"}</TableCell>
                      <TableCell>{student.batch ?? "—"}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            aria-label="View student"
                            onPress={() => openStudent(student, false)}
                          >
                            <Eye size={16} />
                          </Button>
                          {canEdit && (
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              aria-label="Edit student"
                              onPress={() => openStudent(student, true)}
                            >
                              <Pencil size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableScroll>
          </section>
        )}
      </div>

      <AppModal
        isOpen={showAddStudent}
        onClose={resetAddStudent}
        title="Add Student"
        footer={
          <>
            <Button variant="light" onPress={resetAddStudent}>
              Cancel
            </Button>
            <Button
              color="primary"
              isDisabled={!addForm.studentId}
              isLoading={saving}
              onPress={handleAddToDirectory}
            >
              Add to Directory
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Input
              label="Student ID"
              placeholder="e.g. ENG-2024-099 (registry demo)"
              value={lookupId}
              onValueChange={(v) => {
                setLookupId(v);
                setLookupError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleLookupStudent();
                }
              }}
              variant="bordered"
              radius="lg"
              className="flex-1"
              classNames={formFieldClassNames}
              isInvalid={!!lookupError}
              errorMessage={lookupError}
            />
            <Button
              color="primary"
              radius="lg"
              isLoading={lookupLoading}
              onPress={handleLookupStudent}
            >
              Fetch Details
            </Button>
          </div>
          {addForm.studentId && (
            <div className="grid gap-4 rounded-button border border-border/60 bg-surface-muted p-4 sm:grid-cols-2">
              <Input label="Student Name" value={addForm.name ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Department" value={addForm.departmentCode ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Email" value={addForm.email ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Batch" value={addForm.batch ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} />
              <Input label="Contact" value={addForm.phone ?? ""} isReadOnly variant="bordered" radius="lg" classNames={formFieldClassNames} className="sm:col-span-2" />
            </div>
          )}
        </div>
      </AppModal>

      <AppModal
        isOpen={!!selectedStudent}
        onClose={closeModal}
        title={editMode ? "Edit Student" : "Student Details"}
        footer={
          editMode ? (
            <>
              <Button variant="light" onPress={closeModal}>
                Cancel
              </Button>
              <Button color="primary" isLoading={saving} onPress={handleSaveEdit}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="light" onPress={closeModal}>
                Close
              </Button>
              {canEdit && selectedStudent && (
                <Button color="primary" onPress={() => setEditMode(true)}>
                  Edit
                </Button>
              )}
            </>
          )
        }
      >
        {selectedStudent && (
          <div className="grid gap-4 sm:grid-cols-2">
            {editMode ? (
              <>
                <Input
                  label="Full Name"
                  value={editForm.name ?? ""}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, name: v }))}
                  variant="bordered"
                  radius="lg"
                  classNames={formFieldClassNames}
                />
                <Input
                  label="Student ID"
                  value={editForm.studentId ?? ""}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, studentId: v }))}
                  variant="bordered"
                  radius="lg"
                  classNames={formFieldClassNames}
                />
                <Input
                  label="Department"
                  value={editForm.departmentCode ?? ""}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, departmentCode: v }))}
                  variant="bordered"
                  radius="lg"
                  classNames={formFieldClassNames}
                />
                <Input
                  label="Batch"
                  value={editForm.batch ?? ""}
                  onValueChange={(v) => setEditForm((f) => ({ ...f, batch: v }))}
                  variant="bordered"
                  radius="lg"
                  classNames={formFieldClassNames}
                />
                <Select
                  label="Supervisor"
                  selectedKeys={editForm.supervisorId ? [editForm.supervisorId] : []}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setEditForm((f) => ({ ...f, supervisorId: val }));
                  }}
                  variant="bordered"
                  radius="lg"
                  className="sm:col-span-2"
                >
                  {supervisors.map((s) => (
                    <SelectItem key={s.id}>{s.name}</SelectItem>
                  ))}
                </Select>
              </>
            ) : (
              <>
                <DetailField label="Name" value={selectedStudent.name} />
                <DetailField label="Student ID" value={selectedStudent.studentId} />
                <DetailField label="Email" value={selectedStudent.email} />
                <DetailField label="Department" value={selectedStudent.departmentCode ?? "—"} />
                <DetailField label="Batch" value={selectedStudent.batch ?? "—"} />
                <DetailField label="Program" value={selectedStudent.program} />
                <DetailField
                  label="Supervisor"
                  value={
                    selectedStudent.supervisorId
                      ? supervisorMap[selectedStudent.supervisorId] ?? "—"
                      : "Unassigned"
                  }
                />
                <DetailField label="GPA" value={selectedStudent.gpa?.toString() ?? "—"} />
              </>
            )}
          </div>
        )}
      </AppModal>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</p>
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
