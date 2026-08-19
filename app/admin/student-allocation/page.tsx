"use client";

import { AppModal } from "@/components/ui/app-modal";
import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { TableScroll } from "@/components/ui/table-scroll";
import { SearchBar } from "@/components/ui/search-bar";
import { degreePrograms } from "@/lib/degree-programs";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import {
  digitsOnly,
  formFieldClassNames,
  getInitials,
  isValidEmail,
  isValidPassword,
  isValidPhone,
  isValidStudentId,
  passwordRequirementText,
} from "@/lib/utils";
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
import { Plus, UserCheck } from "lucide-react";
import { useMemo, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const departmentOptions = ["CMIS", "IMGT", "ELTN", "MATH & STAT"];
const departmentFilterOptions = [
  { key: "all", label: "All Departments" },
  ...departmentOptions.map((department) => ({ key: department, label: department })),
];

export default function AdminStudentAllocationPage() {
  const { students, supervisors, allocateStudents, addStudent } = useAppStore();
  const [search, setSearch] = useState("");
  const [studentIdFilter, setStudentIdFilter] = useState("");
  const [filter, setFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [targetSupervisor, setTargetSupervisor] = useState("");
  const [allocating, setAllocating] = useState(false);

  // Add Student state
  const [showAdd, setShowAdd] = useState(false);
  const [lookupId, setLookupId] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [addForm, setAddForm] = useState<Partial<Student>>({});
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const programOptions =
    addForm.program && !degreePrograms.includes(addForm.program as (typeof degreePrograms)[number])
      ? [addForm.program, ...degreePrograms]
      : degreePrograms;

  const supervisorMap = useMemo(
    () => Object.fromEntries(supervisors.map((s) => [s.id, s.name])),
    [supervisors]
  );
  const supervisorStudentCounts = useMemo(
    () =>
      students.reduce<Record<string, number>>((counts, student) => {
        if (student.supervisorId) {
          counts[student.supervisorId] = (counts[student.supervisorId] ?? 0) + 1;
        }
        return counts;
      }, {}),
    [students]
  );

  const filtered = useMemo(() => {
    const normalizeSearch = (value: unknown) =>
      String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .replace(/\s+/g, " ")
        .trim();
    const q = normalizeSearch(search);
    const studentIdQuery = studentIdFilter.replace(/\D/g, "");

    return students.filter((s) => {
      const studentId = String(s.studentId ?? "");
      const studentIdDigits = studentId.replace(/\D/g, "");
      const name = normalizeSearch(s.name);
      const email = normalizeSearch(s.email);
      const supervisorName = normalizeSearch(supervisorMap[s.supervisorId ?? ""]);
      const searchableText = [name, normalizeSearch(studentId), email, supervisorName].join(" ");
      const matchesSearch = !q || searchableText.includes(q);
      const matchesStudentId =
        !studentIdFilter || studentIdDigits.includes(studentIdQuery);
      const matchesFilter =
        filter === "all" ||
        (filter === "unassigned" && !s.supervisorId) ||
        (filter === "allocated" && !!s.supervisorId);
      const department = s.departmentCode ?? s.department ?? "";
      const matchesDepartment =
        departmentFilter === "all" || department === departmentFilter;
      return matchesSearch && matchesStudentId && matchesFilter && matchesDepartment;
    });
  }, [students, search, studentIdFilter, filter, departmentFilter, supervisorMap]);

  const handleAllocate = async () => {
    if (selected.size === 0) { notifyError("Select at least one student."); return; }
    if (!targetSupervisor) { notifyError("Select a supervisor to assign."); return; }
    setAllocating(true);
    try {
      await allocateStudents(Array.from(selected), targetSupervisor);
      setAllocating(false);
      setSelected(new Set());
      notifySuccess(`${selected.size} student(s) allocated successfully.`);
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to save supervisor allocation.");
      setAllocating(false);
    }
  };

  const handleUnassign = async () => {
    if (selected.size === 0) { notifyError("Select at least one student."); return; }
    setAllocating(true);
    try {
      await allocateStudents(Array.from(selected), null);
      setAllocating(false);
      setSelected(new Set());
      notifySuccess("Supervisor assignment removed for selected students.");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Failed to remove supervisor assignment.");
      setAllocating(false);
    }
  };

  const handleLookupStudent = async () => {
    setLookupError("");
    if (!lookupId.trim()) { setLookupError("Enter a Student ID to search."); return; }
    setLookupLoading(true);
    try {
      const response = await authFetch(`${API_BASE}/students`);
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to search students");
      const row = (result.data as Record<string, unknown>[]).find(
        (student) => String(student.student_id ?? student.studentId ?? "").toUpperCase() === lookupId.trim().toUpperCase()
      );
      const found: Partial<Student> | undefined = row
        ? {
            id: String(row.id ?? ""),
            name: String(row.name ?? ""),
            email: String(row.email ?? ""),
            role: "student",
            studentId: String(row.student_id ?? row.studentId ?? ""),
            program: String(row.program ?? row.department ?? ""),
            year: Number(row.year ?? 1),
            phone: row.phone ? String(row.phone) : undefined,
            department: row.department ? String(row.department) : undefined,
            departmentCode: row.department_code ? String(row.department_code) : String(row.department ?? ""),
            batch: row.batch ? String(row.batch) : undefined,
          }
        : undefined;
      if (!found) {
        setLookupError("Invalid Student ID. No matching record found.");
        setAddForm({});
        notifyError("Invalid Student ID. Please check and try again.");
        return;
      }
      const foundStudentId = found.studentId ?? "";
      const alreadyListed = students.some(
        (s) => s.studentId.toUpperCase() === foundStudentId.toUpperCase()
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

  const handleAddStudent = async () => {
    if (!addForm.studentId || !addForm.name || !addForm.email || !temporaryPassword) {
      notifyError("Student ID, name, email, and temporary password are required.");
      return;
    }
    if (!isValidStudentId(addForm.studentId)) {
      notifyError("Student ID must be exactly 6 digits, for example 222111.");
      return;
    }
    if (!isValidEmail(addForm.email)) {
      notifyError("Please enter a valid email address with @ sign.");
      return;
    }
    if (!isValidPassword(temporaryPassword)) {
      notifyError(passwordRequirementText);
      return;
    }
    if (addForm.phone && !isValidPhone(addForm.phone)) {
      notifyError("Phone number must be exactly 10 numbers.");
      return;
    }
    setSaving(true);
    try {
      const newStudent = {
        id: crypto.randomUUID(),
        name: addForm.name,
        email: addForm.email,
        password: temporaryPassword,
        role: "student",
        student_id: addForm.studentId,
        faculty: addForm.faculty ?? "Applied Sciences",
        department: addForm.department ?? "Applied Sciences",
        department_code: addForm.departmentCode,
        batch: addForm.batch,
        program: addForm.program,
        year: addForm.year ?? null,
        gpa: addForm.gpa ?? null,
        phone: addForm.phone,
        supervisor_id: null,
        allocation_status: "unassigned",
        internship_status: "pending",
      };
      const response = await authFetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to add student");
      const s = result.data;
      const entry: Student = {
        id: s.id,
        name: s.name,
        email: s.email,
        role: "student",
        studentId: s.student_id ?? addForm.studentId!,
        program: s.program ?? addForm.program ?? "",
        year: addForm.year ?? 0,
        gpa: addForm.gpa,
        phone: s.phone ?? addForm.phone ?? "",
        faculty: s.faculty ?? addForm.faculty ?? "Applied Sciences",
        department: s.department ?? addForm.department ?? "Applied Sciences",
        departmentCode: s.department_code ?? addForm.departmentCode ?? "",
        batch: s.batch ?? addForm.batch ?? "",
        internshipStatus: "pending",
        supervisorId: undefined,
        createdAt: s.created_at ?? new Date().toISOString(),
        allocationStatus: "unassigned",
      } as unknown as Student;
      addStudent(entry);
      notifySuccess(`${entry.name} added. Select them below to assign a supervisor.`);
      resetAdd();
    } catch (err: any) {
      notifyError(err?.message ?? "Failed to add student");
    } finally {
      setSaving(false);
    }
  };

  const resetAdd = () => {
    setShowAdd(false);
    setLookupId("");
    setLookupError("");
    setAddForm({});
    setTemporaryPassword("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Allocation"
        description="Add students and assign or reassign them to supervisors. Changes sync instantly across all portals."
        action={
          <Button color="primary" radius="lg" startContent={<Plus size={16} />} onPress={() => setShowAdd(true)}>
            Add Student
          </Button>
        }
      />

      <ContentCard>
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end">
          <SearchBar value={search} onChange={setSearch} placeholder="Search students..." className="flex-1" />
          <Input
            className="w-full sm:w-44"
            label="Student ID"
            placeholder="222111"
            value={studentIdFilter}
            onValueChange={(value) => setStudentIdFilter(digitsOnly(value, 6))}
            inputMode="numeric"
            maxLength={6}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
          />
          <Select
            className="w-full sm:w-52"
            label="Department"
            selectedKeys={[departmentFilter]}
            onSelectionChange={(keys) => setDepartmentFilter((Array.from(keys)[0] as string) ?? "all")}
            variant="bordered"
            radius="lg"
          >
            {departmentFilterOptions.map((department) => (
              <SelectItem key={department.key}>{department.label}</SelectItem>
            ))}
          </Select>
          <Select
            className="w-full sm:w-48"
            label="Filter"
            selectedKeys={[filter]}
            onSelectionChange={(keys) => setFilter((Array.from(keys)[0] as string) ?? "all")}
            variant="bordered"
            radius="lg"
          >
            <SelectItem key="all">All Students</SelectItem>
            <SelectItem key="allocated">Allocated</SelectItem>
            <SelectItem key="unassigned">Unassigned</SelectItem>
          </Select>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-card border border-border/60 bg-surface-muted p-4 lg:flex-row lg:items-end">
          <Select
            label="Assign to Supervisor"
            placeholder="Select supervisor"
            selectedKeys={targetSupervisor ? [targetSupervisor] : []}
            onSelectionChange={(keys) => setTargetSupervisor((Array.from(keys)[0] as string) ?? "")}
            variant="bordered"
            radius="lg"
            className="flex-1"
          >
            {supervisors.map((s) => (
              <SelectItem key={s.id} textValue={s.name}>
                {s.name} ({supervisorStudentCounts[s.id] ?? 0} students)
              </SelectItem>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary" radius="lg"
              startContent={<UserCheck size={16} />}
              isLoading={allocating}
              isDisabled={selected.size === 0}
              onPress={handleAllocate}
            >
              Allocate ({selected.size})
            </Button>
            <Button
              variant="bordered" radius="lg"
              isLoading={allocating}
              isDisabled={selected.size === 0}
              onPress={handleUnassign}
            >
              Remove Assignment
            </Button>
          </div>
        </div>

        <TableScroll>
          <Table
            aria-label="Student allocation"
            removeWrapper
            selectionMode="multiple"
            selectedKeys={selected}
            onSelectionChange={(keys) => {
              if (keys === "all") setSelected(new Set(filtered.map((s) => s.id)));
              else setSelected(new Set(Array.from(keys) as string[]));
            }}
          >
            <TableHeader>
              <TableColumn>STUDENT</TableColumn>
              <TableColumn>STUDENT ID</TableColumn>
              <TableColumn className="hidden md:table-cell">DEPARTMENT</TableColumn>
              <TableColumn>SUPERVISOR</TableColumn>
              <TableColumn>PLACEMENT</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {filtered.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={getInitials(student.name)} size="sm" getInitials={getInitials} />
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell className="hidden md:table-cell">{student.departmentCode ?? "—"}</TableCell>
                  <TableCell>{student.supervisorId ? supervisorMap[student.supervisorId] ?? "—" : "—"}</TableCell>
                  <TableCell><Chip size="sm" variant="flat" color={student.internshipStatus === "active" ? "success" : student.internshipStatus === "pending" ? "warning" : "default"}>{student.internshipStatus ?? "not_placed"}</Chip></TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color={student.supervisorId ? "success" : "warning"}>
                      {student.allocationStatus ?? (student.supervisorId ? "allocated" : "unassigned")}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableScroll>
      </ContentCard>

      <AppModal
        isOpen={showAdd}
        onClose={resetAdd}
        title="Add Student"
        size="3xl"
        footer={
          <>
            <Button variant="light" onPress={resetAdd}>Cancel</Button>
            <Button color="primary" isDisabled={!addForm.studentId || !addForm.name || !addForm.email || !temporaryPassword} isLoading={saving} onPress={handleAddStudent}>
              Add to Directory
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Input
              label="Student ID"
              placeholder="e.g. 222111"
              value={lookupId}
              onValueChange={(v) => { setLookupId(digitsOnly(v, 6)); setLookupError(""); }}
              inputMode="numeric"
              maxLength={6}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleLookupStudent(); } }}
              variant="bordered"
              radius="lg"
              className="flex-1"
              classNames={formFieldClassNames}
              isInvalid={!!lookupError}
              errorMessage={lookupError}
            />
            <Button color="primary" radius="lg" isLoading={lookupLoading} onPress={handleLookupStudent}>
              Fetch Existing
            </Button>
          </div>
          <div className="grid gap-4 rounded-button border border-border/60 bg-surface-muted p-4 sm:grid-cols-2">
            <Input
              label="Student ID"
              value={addForm.studentId ?? lookupId}
              onValueChange={(v) => {
                const value = digitsOnly(v, 6);
                setLookupId(value);
                setAddForm((f) => ({ ...f, studentId: value }));
              }}
              inputMode="numeric"
              maxLength={6}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!addForm.studentId && !isValidStudentId(addForm.studentId)}
              errorMessage="Student ID must be exactly 6 digits, for example 222111."
              isRequired
            />
            <Input
              label="Student Name"
              value={addForm.name ?? ""}
              onValueChange={(v) => setAddForm((f) => ({ ...f, name: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isRequired
            />
            <Input
              label="Email"
              type="email"
              value={addForm.email ?? ""}
              onValueChange={(v) => setAddForm((f) => ({ ...f, email: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!addForm.email && !isValidEmail(addForm.email)}
              errorMessage="Email must include @ sign."
              isRequired
            />
            <Input
              label="Phone"
              value={addForm.phone ?? ""}
              onValueChange={(v) => setAddForm((f) => ({ ...f, phone: digitsOnly(v, 10) }))}
              inputMode="numeric"
              maxLength={10}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!addForm.phone && !isValidPhone(addForm.phone)}
              errorMessage="Phone number must be exactly 10 numbers."
            />
            <Input
              label="Temporary Password"
              type="password"
              placeholder="Min 8 chars, upper, lower, number"
              value={temporaryPassword}
              onValueChange={setTemporaryPassword}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              description={passwordRequirementText}
              isInvalid={!!temporaryPassword && !isValidPassword(temporaryPassword)}
              errorMessage={passwordRequirementText}
              isRequired
              className="sm:col-span-2"
            />
            <Select
              label="Faculty"
              selectedKeys={[addForm.faculty ?? "Applied Sciences"]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                if (value) setAddForm((f) => ({ ...f, faculty: value, department: value }));
              }}
              variant="bordered"
              radius="lg"
            >
              <SelectItem key="Applied Sciences">Applied Sciences</SelectItem>
            </Select>
            <Select
              label="Department"
              selectedKeys={addForm.departmentCode ? [addForm.departmentCode] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                if (value) setAddForm((f) => ({ ...f, departmentCode: value }));
              }}
              variant="bordered"
              radius="lg"
            >
              <SelectItem key="CMIS">CMIS</SelectItem>
              <SelectItem key="IMGT">IMGT</SelectItem>
              <SelectItem key="ELTN">ELTN</SelectItem>
              <SelectItem key="MATH & STAT">MATH & STAT</SelectItem>
            </Select>
            <Select
              label="Program"
              selectedKeys={addForm.program ? [addForm.program] : []}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                if (value) setAddForm((f) => ({ ...f, program: value }));
              }}
              variant="bordered"
              radius="lg"
              className="sm:col-span-2"
              classNames={formFieldClassNames}
            >
              {programOptions.map((program) => (
                <SelectItem key={program}>{program}</SelectItem>
              ))}
            </Select>
            <Input
              label="Batch"
              value={addForm.batch ?? ""}
              onValueChange={(v) => setAddForm((f) => ({ ...f, batch: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Year"
              type="number"
              value={addForm.year != null ? String(addForm.year) : ""}
              onValueChange={(v) => setAddForm((f) => ({ ...f, year: Number(v) || undefined }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="GPA"
              value={addForm.gpa != null ? String(addForm.gpa) : ""}
              onValueChange={(v) => setAddForm((f) => ({ ...f, gpa: v ? Number(v) : undefined }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
          </div>
        </div>
      </AppModal>
    </div>
  );
}
