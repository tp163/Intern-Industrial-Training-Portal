import { systemSettings } from "@/data/mock";
import type { SystemSetting } from "@/types";

const ACADEMIC_YEAR_ID = "set-003";
const INTERNSHIP_DURATION_ID = "set-004";

export const adminSettings: SystemSetting[] = systemSettings.filter(
  (s) => s.id !== ACADEMIC_YEAR_ID
);

export const supervisorSettings: SystemSetting[] = systemSettings.filter(
  (s) => s.id === INTERNSHIP_DURATION_ID
);
