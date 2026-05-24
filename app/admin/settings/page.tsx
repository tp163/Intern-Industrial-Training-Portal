"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { systemSettings } from "@/data/mock";
import type { SystemSetting } from "@/types";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
} from "@heroui/react";
import { Save } from "lucide-react";
import { useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>(systemSettings);
  const [saving, setSaving] = useState(false);

  const updateSetting = (id: string, value: string | boolean | number) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Configure platform-wide settings and preferences"
      />

      <form onSubmit={handleSave}>
        <ContentCard>
          <div className="space-y-6">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="flex flex-col gap-3 border-b border-default-100 pb-6 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="max-w-md">
                  <p className="font-medium">{setting.label}</p>
                  <p className="text-sm text-default-500">{setting.description}</p>
                </div>

                <div className="w-full sm:w-64">
                  {setting.type === "boolean" && (
                    <Switch
                      isSelected={setting.value as boolean}
                      onValueChange={(v) => updateSetting(setting.id, v)}
                      color="primary"
                    />
                  )}
                  {setting.type === "number" && (
                    <Input
                      type="number"
                      value={String(setting.value)}
                      onValueChange={(v) => updateSetting(setting.id, Number(v) || 0)}
                      variant="bordered"
                      radius="lg"
                    />
                  )}
                  {setting.type === "text" && (
                    <Input
                      value={String(setting.value)}
                      onValueChange={(v) => updateSetting(setting.id, v)}
                      variant="bordered"
                      radius="lg"
                    />
                  )}
                  {setting.type === "select" && setting.options && (
                    <Select
                      selectedKeys={[String(setting.value)]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        if (selected) updateSetting(setting.id, selected);
                      }}
                      variant="bordered"
                      radius="lg"
                    >
                      {setting.options.map((opt) => (
                        <SelectItem key={opt}>{opt}</SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end border-t border-default-100 pt-6">
            <Button
              type="submit"
              color="primary"
              radius="lg"
              startContent={<Save size={18} />}
              isLoading={saving}
            >
              Save Settings
            </Button>
          </div>
        </ContentCard>
      </form>
    </div>
  );
}
