"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { ContentCard } from "@/components/ui/page-header";
import { currentStudent } from "@/data/mock";
import { formFieldClassNames, getInitials } from "@/lib/utils";
import {
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Save, User } from "lucide-react";
import { useState } from "react";

const programs = ["Computer Science", "Information Technology", "Software Engineering"];

export default function StudentProfilePage() {
  const [form, setForm] = useState({
    name: currentStudent.name,
    email: currentStudent.email,
    phone: currentStudent.phone ?? "",
    studentId: currentStudent.studentId,
    program: currentStudent.program,
    year: String(currentStudent.year),
    gpa: currentStudent.gpa?.toString() ?? "",
    department: currentStudent.department ?? "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
              isRequired
            />
            <Input
              label="Phone"
              value={form.phone}
              onValueChange={(v) => update("phone", v)}
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
              {programs.map((p) => (
                <SelectItem key={p}>{p}</SelectItem>
              ))}
            </Select>
            <Select
              label="Year"
              selectedKeys={[form.year]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                if (selected) update("year", selected);
              }}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            >
              {[1, 2, 3, 4].map((y) => (
                <SelectItem key={String(y)}>Year {y}</SelectItem>
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
            />
            <Input
              label="Department"
              value={form.department}
              onValueChange={(v) => update("department", v)}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
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
    </div>
  );
}
