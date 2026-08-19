"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { apiUpdateUser } from "@/lib/api";
import { useAppStore } from "@/lib/store/app-store";
import { notifyError, notifySuccess } from "@/lib/notify";
import { authFetch } from "@/lib/auth-fetch";
import { digitsOnly, formFieldClassNames, getInitials, isValidEmail, isValidPhone } from "@/lib/utils";
import {
  Avatar,
  Button,
  Input,
} from "@heroui/react";
import { Save, User } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminSettingsPage() {
  const { adminProfile, currentUser, updateAdminProfile, updateCurrentUser } = useAppStore();
  const [profileForm, setProfileForm] = useState(adminProfile);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: currentUser?.name ?? adminProfile.name,
      email: currentUser?.email ?? adminProfile.email,
      phone: currentUser?.phone ?? adminProfile.phone,
      title: currentUser?.title ?? adminProfile.title,
    });
  }, [adminProfile, currentUser]);

  useEffect(() => {
    if (!currentUser?.id) return;

    let cancelled = false;
    authFetch(`${API_BASE}/users/${currentUser.id}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled || !result.success || !result.data) return;
        const nextProfile = {
          name: result.data.name ?? currentUser.name ?? adminProfile.name,
          email: result.data.email ?? currentUser.email ?? adminProfile.email,
          phone: result.data.phone ?? "",
          title: result.data.title ?? currentUser.title ?? adminProfile.title,
        };
        setProfileForm(nextProfile);
        updateAdminProfile(nextProfile);
        updateCurrentUser(nextProfile);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [adminProfile.email, adminProfile.name, adminProfile.title, currentUser?.id]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      if (!isValidEmail(profileForm.email)) throw new Error("Please enter a valid email address with @ sign.");
      if (profileForm.phone && !isValidPhone(profileForm.phone)) throw new Error("Phone number must be exactly 10 numbers.");

      if (currentUser?.id) {
        const result = await apiUpdateUser(currentUser.id, {
          name: profileForm.name,
          email: profileForm.email,
          phone: profileForm.phone || null,
          title: profileForm.title || null,
        }) as { data?: Record<string, unknown> };
        const saved = result.data ?? {};
        const nextProfile = {
          name: String(saved.name ?? profileForm.name),
          email: String(saved.email ?? profileForm.email),
          phone: saved.phone ? String(saved.phone) : "",
          title: saved.title ? String(saved.title) : profileForm.title,
        };
        updateAdminProfile(nextProfile);
        updateCurrentUser(nextProfile);
        setProfileForm(nextProfile);
      } else {
        updateAdminProfile(profileForm);
        setProfileForm(profileForm);
      }
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
      <PageHeader
        title="Settings"
        description="Manage your profile and platform-wide configuration"
      />

      <ContentCard>
        <div className="mb-6 flex items-center gap-4">
          <Avatar
            name={getInitials(profileForm.name)}
            size="lg"
            className="h-16 w-16 text-lg"
            color="secondary"
          />
          <div>
            <p className="text-lg font-semibold text-text-primary">{profileForm.name}</p>
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
