"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import { useAppStore } from "@/lib/store/app-store";
import { digitsOnly, formFieldClassNames, getInitials, isValidEmail, isValidPhone } from "@/lib/utils";
import { Avatar, Button, Input } from "@heroui/react";
import { Save, User } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function formatChange(label: string, before?: string, after?: string) {
  const from = before || "Not set";
  const to = after || "Not set";
  return from === to ? null : `${label} changed to ${to}`;
}

export default function SupervisorSettingsPage() {
  const { currentUser, updateCurrentUser } = useAppStore();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
    title: currentUser?.title ?? "Faculty Supervisor",
    department: currentUser?.department ?? "",
  });

  useEffect(() => {
    setProfileForm({
      name: currentUser?.name ?? "",
      email: currentUser?.email ?? "",
      phone: currentUser?.phone ?? "",
      title: currentUser?.title ?? "Faculty Supervisor",
      department: currentUser?.department ?? "",
    });
  }, [currentUser]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (!currentUser?.id) throw new Error("No logged-in supervisor profile was found.");
      if (!isValidEmail(profileForm.email)) throw new Error("Please enter a valid email address with @ sign.");
      if (profileForm.phone && !isValidPhone(profileForm.phone)) throw new Error("Phone number must be exactly 10 numbers.");

      const response = await authFetch(`${API_BASE}/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone,
          title: profileForm.title,
          department: profileForm.department,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Failed to update profile");

      updateCurrentUser({
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        title: profileForm.title,
        department: profileForm.department,
      });
      const details = [
        formatChange("Name", currentUser.name, profileForm.name),
        formatChange("Email", currentUser.email, profileForm.email),
        formatChange("Phone", currentUser.phone, profileForm.phone),
        formatChange("Title", currentUser.title, profileForm.title),
        formatChange("Department", currentUser.department, profileForm.department),
      ].filter(Boolean).join("\n") || "No field-level details were available.";
      await authFetch(`${API_BASE}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "admin",
          user_id: null,
          title: "Supervisor Profile Updated",
          message: `${profileForm.name || "A supervisor"} updated their profile information.\n${details}`,
          read: false,
          created_at: new Date().toISOString(),
          type: "warning",
          category: "profile",
        }),
      }).catch(() => {});
      notifySuccess("Profile updated successfully.");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      notifyError("Failed to update profile: " + message);
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your supervisor profile" />

      <ContentCard>
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            name={getInitials(profileForm.name)}
            size="lg"
            className="h-16 w-16 text-lg"
            color="primary"
          />
          <div>
            <p className="text-lg font-semibold text-text-primary">{profileForm.name || "Supervisor"}</p>
            <p className="text-sm text-text-secondary">{profileForm.title}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Input
              label="Full Name"
              value={profileForm.name}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, name: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              startContent={<User className="text-text-secondary" size={18} />}
              isRequired
            />
            <Input
              label="Email"
              type="email"
              value={profileForm.email}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, email: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!profileForm.email && !isValidEmail(profileForm.email)}
              errorMessage="Email must include @ sign."
              isRequired
            />
            <Input
              label="Phone"
              value={profileForm.phone}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, phone: digitsOnly(v, 10) }))}
              inputMode="numeric"
              maxLength={10}
              placeholder="0770000000"
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
              isInvalid={!!profileForm.phone && !isValidPhone(profileForm.phone)}
              errorMessage="Phone number must be exactly 10 numbers."
            />
            <Input
              label="Title / Role"
              value={profileForm.title}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, title: v }))}
              variant="bordered"
              radius="lg"
              classNames={formFieldClassNames}
            />
            <Input
              label="Department"
              value={profileForm.department}
              onValueChange={(v) => setProfileForm((p) => ({ ...p, department: v }))}
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
              isLoading={savingProfile}
            >
              Save Profile
            </Button>
          </div>
        </form>
      </ContentCard>

    </div>
  );
}
