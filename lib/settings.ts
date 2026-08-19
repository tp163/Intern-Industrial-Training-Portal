import type { SystemSetting } from "@/types";

const systemSettings: SystemSetting[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    label: "Platform Name",
    description: "Name shown across the portal",
    value: "Industrial Training Portal",
    type: "text",
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    label: "Application Window Open",
    description: "Allow students to submit internship applications",
    value: true,
    type: "boolean",
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    label: "Academic Year",
    description: "Current academic year",
    value: "2025/2026",
    type: "text",
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    label: "Internship Duration",
    description: "Default internship duration in months",
    value: 6,
    type: "number",
  },
];

const ACADEMIC_YEAR_ID = "33333333-3333-4333-8333-333333333333";
const INTERNSHIP_DURATION_ID = "44444444-4444-4444-8444-444444444444";

export const adminSettings: SystemSetting[] = systemSettings.filter(
  (s) => s.id !== ACADEMIC_YEAR_ID
);

export const supervisorSettings: SystemSetting[] = systemSettings.filter(
  (s) => s.id === INTERNSHIP_DURATION_ID
);
