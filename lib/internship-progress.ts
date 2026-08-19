export const DEFAULT_INTERNSHIP_TOTAL_MONTHS = 6;

type ProgressValue = unknown;

function toNumber(value: ProgressValue): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getInternshipProgress(
  monthsCompleted?: ProgressValue,
  totalMonths?: ProgressValue
) {
  const total = Math.min(
    24,
    Math.max(1, toNumber(totalMonths) ?? DEFAULT_INTERNSHIP_TOTAL_MONTHS)
  );
  const completed = Math.min(total, Math.max(0, toNumber(monthsCompleted) ?? 0));

  return {
    monthsCompleted: completed,
    totalMonths: total,
    monthsRemaining: Math.max(0, total - completed),
    percent: Math.min(100, Math.round((completed / total) * 100)),
  };
}

export function getInternshipPermissions(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object") return value as Record<string, unknown>;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}
