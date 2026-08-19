"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard } from "@/components/ui/page-header";
import { degreePrograms } from "@/lib/degree-programs";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import {
  DEFAULT_INTERNSHIP_TOTAL_MONTHS,
  getInternshipPermissions,
  getInternshipProgress,
} from "@/lib/internship-progress";
import type { InternshipPlacementStatus } from "@/types";
import {
  digitsOnly,
  formFieldClassNames,
  getInitials,
  isValidEmail,
  isValidGpa,
  isValidPhone,
} from "@/lib/utils";
import {
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Briefcase, Save, TrendingUp, User } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const yearOptions = [
  { key: "1", label: "Year 1" },
  { key: "2", label: "Year 2" },
  { key: "3", label: "Year 3" },
  { key: "4", label: "Year 4" },
];
const facultyOptions = ["Applied Sciences"];
const departmentOptions = ["CMIS", "IMGT", "ELTN", "MATH & STAT"];
const departmentOptionSet = new Set(departmentOptions);

function getProfileFaculty(data?: Record<string, any> | null) {
  if (!data) return "Applied Sciences";
  return data.faculty || "Applied Sciences";
}

function getProfileDepartment(data?: Record<string, any> | null) {
  if (!data) return "";
  if (data.department_code) return data.department_code;
  return departmentOptionSet.has(data.department) ? data.department : "";
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof TypeError && error.message === "fetch failed") {
    return `Cannot connect to the backend API at ${API_BASE}. Start the backend server or set NEXT_PUBLIC_API_URL to the correct API URL.`;
  }
  return error instanceof Error ? error.message : "Unknown error";
}

export default function StudentProfilePage() {
  const { updateStudentRecord, updateCurrentUser, getStudentById, currentUser } = useAppStore();
  const userId = currentUser?.id ?? "";
  const liveStudent = getStudentById(userId);
  const [form, setForm] = useState({
    name: liveStudent?.name ?? currentUser?.name ?? "",
    email: liveStudent?.email ?? currentUser?.email ?? "",
    phone: liveStudent?.phone ?? "",
    title: liveStudent?.title ?? currentUser?.title ?? "",
    studentId: liveStudent?.studentId ?? "",
    program: liveStudent?.program ?? "",
    year: String(liveStudent?.year ?? ""),
    gpa: liveStudent?.gpa?.toString() ?? "",
    faculty: liveStudent?.faculty ?? "Applied Sciences",
    department: liveStudent?.departmentCode ?? (departmentOptionSet.has(liveStudent?.department ?? "") ? liveStudent?.department ?? "" : ""),
  });
  const [internshipForm, setInternshipForm] = useState({
    internshipStatus: (liveStudent?.internshipStatus ?? "pending") as InternshipPlacementStatus,
    internshipCompany: liveStudent?.internshipCompany ?? "",
    internshipRole: liveStudent?.internshipRole ?? "",
    monthsCompleted: String(liveStudent?.internshipMonthsCompleted ?? 0),
    totalMonths: String(liveStudent?.internshipTotalMonths ?? DEFAULT_INTERNSHIP_TOTAL_MONTHS),
  });
  const [saving, setSaving] = useState(false);
  const [savingInternship, setSavingInternship] = useState(false);
  const [loading, setLoading] = useState(true);
  const programOptions =
    form.program && !degreePrograms.includes(form.program as (typeof degreePrograms)[number])
      ? [form.program, ...degreePrograms]
      : degreePrograms;

  // Initialize form only once from the API data loaded in the second useEffect
  // Do not depend on currentUser or liveStudent to avoid resetting form when user is editing

  useEffect(() => {
    async function loadProfile() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await authFetch(`${API_BASE}/users/${userId}`);
        const result = await response.json();
          
        if (!response.ok || !result.success) throw new Error(result.message || "Failed to load");
        
        const data = result.data;
        if (data) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            title: data.title || "",
            studentId: data.student_id || "",
            program: data.program || "",
            year: String(data.year || ""),
            gpa: data.gpa?.toString() || "",
            faculty: getProfileFaculty(data),
            department: getProfileDepartment(data),
          });
          const perms = getInternshipPermissions(data.permissions);
          const progress = getInternshipProgress(
            perms.internship_months_completed,
            perms.internship_total_months
          );
          setInternshipForm({
            internshipStatus: (data.internship_status || "pending") as InternshipPlacementStatus,
            internshipCompany: data.internship_company || "",
            internshipRole: data.internship_role || "",
            monthsCompleted: String(progress.monthsCompleted),
            totalMonths: String(progress.totalMonths),
          });
        }
      } catch (err) {
        console.warn("Failed to load profile:", getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!isValidEmail(form.email)) {
        notifyError("Please enter a valid email address with @ sign.");
        return;
      }

      if (form.phone && !isValidPhone(form.phone)) {
        notifyError("Phone number must be exactly 10 numbers.");
        return;
      }
      if (form.gpa && !isValidGpa(form.gpa)) {
        notifyError("GPA must be between 0.00 and 4.00 with up to 2 decimal places.");
        return;
      }

      const response = await authFetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          title: form.title,
          program: form.program,
          year: Number(form.year) || null,
          gpa: form.gpa ? Number(form.gpa) : null,
          faculty: form.faculty,
          department: form.department,
          department_code: form.department,
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      const saved = result.data ?? {};
      const savedYear = Number(saved.year ?? form.year) || liveStudent?.year || 1;
      const savedGpa = saved.gpa != null && saved.gpa !== "" ? Number(saved.gpa) : undefined;
      const savedFaculty = getProfileFaculty(saved);
      const savedDepartment = getProfileDepartment(saved) || form.department;

      updateStudentRecord(
        userId,
        {
          name: saved.name ?? form.name,
          email: saved.email ?? form.email,
          phone: saved.phone ?? form.phone,
          title: saved.title ?? form.title,
          program: saved.program ?? form.program,
          year: savedYear,
          gpa: savedGpa,
          faculty: savedFaculty,
          department: saved.department ?? savedDepartment,
          departmentCode: savedDepartment,
        },
        "personal and academic profile information"
      );
      updateCurrentUser({
        name: saved.name ?? form.name,
        email: saved.email ?? form.email,
        phone: saved.phone ?? form.phone,
        title: saved.title ?? form.title,
        faculty: savedFaculty,
        department: saved.department ?? savedDepartment,
        departmentCode: savedDepartment,
        program: saved.program ?? form.program,
        year: savedYear,
        gpa: savedGpa,
      });
      notifySuccess("Profile updated successfully.");
    } catch (err: unknown) {
      console.error(err);
      notifyError("Failed to update profile: " + getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInternshipSave = async () => {
    setSavingInternship(true);
    try {
      const monthsCompleted = Math.max(0, Number(internshipForm.monthsCompleted) || 0);
      const totalMonths = Math.max(1, Number(internshipForm.totalMonths) || 6);
      if (monthsCompleted > totalMonths) {
        notifyError("Months completed cannot be greater than total internship duration.");
        return;
      }
      if (totalMonths > 24) {
        notifyError("Total internship duration must be between 1 and 24 months.");
        return;
      }
      
      // Check if trying to update company or role without active status
      const isChangingToActive = internshipForm.internshipStatus === "active";
      const hasCompanyOrRole = internshipForm.internshipCompany?.trim() || internshipForm.internshipRole?.trim();
      if (hasCompanyOrRole && !isChangingToActive && liveStudent?.internshipStatus !== "active") {
        notifyError("Please update your internship status to Active before updating company name or role. Go to Profile -> Internship Details.");
        return;
      }

      const response = await authFetch(`${API_BASE}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internship_status: internshipForm.internshipStatus,
          internship_company: internshipForm.internshipCompany,
          internship_role: internshipForm.internshipRole,
          permissions: {
            internship_months_completed: monthsCompleted,
            internship_total_months: totalMonths,
          },
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message);
      const saved = result.data ?? {};
      const savedPermissions = getInternshipPermissions(saved.permissions);
      const savedProgress = getInternshipProgress(
        savedPermissions.internship_months_completed ?? monthsCompleted,
        savedPermissions.internship_total_months ?? totalMonths
      );
      setInternshipForm((form) => ({
        ...form,
        internshipStatus: saved.internship_status ?? form.internshipStatus,
        internshipCompany: saved.internship_company ?? form.internshipCompany,
        internshipRole: saved.internship_role ?? form.internshipRole,
        monthsCompleted: String(savedProgress.monthsCompleted),
        totalMonths: String(savedProgress.totalMonths),
      }));

      updateStudentRecord(
        userId,
        {
          internshipStatus: saved.internship_status ?? internshipForm.internshipStatus,
          internshipCompany: saved.internship_company || undefined,
          internshipRole: saved.internship_role || undefined,
          internshipMonthsCompleted: savedProgress.monthsCompleted,
          internshipTotalMonths: savedProgress.totalMonths,
        },
        "internship details"
      );
      updateCurrentUser({
        internshipStatus: saved.internship_status ?? internshipForm.internshipStatus,
        internshipCompany: saved.internship_company || undefined,
        internshipRole: saved.internship_role || undefined,
      });
      notifySuccess("Internship details updated.");
    } catch (err: unknown) {
      console.error(err);
      notifyError("Failed to update internship details: " + getApiErrorMessage(err));
    } finally {
      setSavingInternship(false);
    }
  };

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="My Profile"
        description="Update your personal and academic information"
      />

      <ContentCard>
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            name={getInitials(form.name)}
            size="lg"
            className="h-16 w-16 text-lg"
            color="primary"
          />
          <div>
            <p className="text-lg font-semibold text-text-primary">{form.name}</p>
            <p className="text-sm text-text-secondary">{form.studentId}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              value={form.name}
              onValueChange={(v) => update("name", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              startContent={<User className="text-text-secondary" size={18} />}
              isRequired
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onValueChange={(v) => update("email", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!form.email && !isValidEmail(form.email)}
              errorMessage="Email must include @ sign."
              isRequired
            />
            <Input
              label="Phone"
              value={form.phone}
              onValueChange={(v) => update("phone", digitsOnly(v, 10))}
              inputMode="numeric"
              maxLength={10}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!form.phone && !isValidPhone(form.phone)}
              errorMessage="Phone number must be exactly 10 numbers."
            />
            <Input
              label="Title"
              value={form.title}
              onValueChange={(v) => update("title", v)}
              placeholder="e.g. Student Intern"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Student ID"
              value={form.studentId}
              isReadOnly
              variant="bordered"
              radius="lg"
              classNames={{ ...formFieldClassNames, input: "text-text-secondary" }}
            />
            <Select
              label="Program"
              selectedKeys={[form.program]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("program", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {programOptions.map((p) => (
                <SelectItem key={p}>{p}</SelectItem>
              ))}
            </Select>
            <Select
              label="Year"
              placeholder="Select year"
              selectedKeys={form.year ? [form.year] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("year", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {yearOptions.map((year) => (
                <SelectItem key={year.key} textValue={year.label}>
                  {year.label}
                </SelectItem>
              ))}
            </Select>
            <Input
              label="GPA"
              value={form.gpa}
              onValueChange={(v) => update("gpa", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              placeholder="e.g. 3.75"
              isInvalid={!!form.gpa && !isValidGpa(form.gpa)}
              errorMessage="GPA must be 0.00 to 4.00."
            />
            <Select
              label="Faculty"
              selectedKeys={[form.faculty]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("faculty", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {facultyOptions.map((faculty) => (
                <SelectItem key={faculty}>{faculty}</SelectItem>
              ))}
            </Select>
            <Select
              label="Department"
              selectedKeys={form.department ? [form.department] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("department", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {departmentOptions.map((department) => (
                <SelectItem key={department}>{department}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </ContentCard>
      <div id="internship-details" className="scroll-mt-24">
        <ContentCard>
          <div className="mb-5 flex items-center gap-2">
            <Briefcase size={20} className="text-primary" />
            <h2 className="text-base font-semibold text-text-primary">Internship Details</h2>
          </div>
          <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Select
              label="Internship Status"
              selectedKeys={[internshipForm.internshipStatus]}
              onSelectionChange={(keys) => {
                const v = Array.from(keys)[0] as string;
                if (v) setInternshipForm((f) => ({ ...f, internshipStatus: v as InternshipPlacementStatus }));
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="not_placed">Not Placed</SelectItem>
            </Select>
            <Input
              label="Company Name"
              value={internshipForm.internshipCompany}
              onValueChange={(v) => setInternshipForm((f) => ({ ...f, internshipCompany: v }))}
              placeholder="e.g. TechNova Solutions"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Role / Position"
              value={internshipForm.internshipRole}
              onValueChange={(v) => setInternshipForm((f) => ({ ...f, internshipRole: v }))}
              placeholder="e.g. Software Engineering Intern"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              className="md:col-span-2"
            />
          </div>

          {/* ── Progress tracking ─────────────────────────────────── */}
          <div className="rounded-button border border-border/60 bg-surface-muted p-4">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              <p className="text-sm font-semibold text-text-primary">Internship Progress</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Months Completed"
                type="number"
                min={0}
                value={internshipForm.monthsCompleted}
                onValueChange={(v) => setInternshipForm((f) => ({ ...f, monthsCompleted: v }))}
                variant="bordered"
                radius="lg"
                classNames={formFieldClassNames}
                description="How many months have you completed so far?"
                isInvalid={Number(internshipForm.monthsCompleted) > Number(internshipForm.totalMonths)}
                errorMessage="Completed months cannot exceed total months."
              />
              <Input
                label="Total Duration (months)"
                type="number"
                min={1}
                value={internshipForm.totalMonths}
                onValueChange={(v) => setInternshipForm((f) => ({ ...f, totalMonths: v }))}
                variant="bordered"
                radius="lg"
                classNames={formFieldClassNames}
                description="Total length of your internship program"
                isInvalid={(Number(internshipForm.totalMonths) || 0) > 24}
                errorMessage="Total months must be 1 to 24."
              />
            </div>
            {/* Live preview bar */}
            {(() => {
              const progress = getInternshipProgress(
                internshipForm.monthsCompleted,
                internshipForm.totalMonths
              );
              return (
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-text-secondary">
                    <span>{progress.monthsCompleted} of {progress.totalMonths} months</span>
                    <span className="font-semibold text-primary">{progress.percent}% complete</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-border/40">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="flex justify-end">
            <Button
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={savingInternship}
              onPress={handleInternshipSave}
            >
              Save Internship Details
            </Button>
          </div>
          </div>
        </ContentCard>
      </div>
    </div>
  );
}
