"use client";

import { supervisorSettings } from "@/lib/settings";
import { notifySuccess } from "@/lib/notify";
import type { SystemSetting } from "@/types";
import { Button, Select, SelectItem } from "@heroui/react";
import { Save } from "lucide-react";
import { useState } from "react";

export default function SupervisorSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>(supervisorSettings);
  const [saving, setSaving] = useState(false);

  const durationSetting = settings[0];

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      notifySuccess("Settings saved.");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-text-secondary">Engineering Faculty</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-text-primary md:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Console preferences</p>
      </div>

      <div className="rounded-card border border-border/60 bg-white p-6 shadow-card">
        {durationSetting?.type === "select" && durationSetting.options && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">{durationSetting.label}</p>
              <p className="text-sm text-text-secondary">{durationSetting.description}</p>
            </div>
            <Select
              className="w-full sm:w-64"
              selectedKeys={[String(durationSetting.value)]}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string;
                if (val) {
                  setSettings((prev) =>
                    prev.map((s) => (s.id === durationSetting.id ? { ...s, value: val } : s))
                  );
                }
              }}
              variant="bordered"
              radius="lg"
            >
              {durationSetting.options.map((opt) => (
                <SelectItem key={opt}>{opt}</SelectItem>
              ))}
            </Select>
          </div>
        )}
        <div className="mt-6 flex justify-end border-t border-border pt-6">
          <Button color="primary" radius="lg" startContent={<Save size={16} />} isLoading={saving} onPress={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
