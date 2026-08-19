import { getAuthToken } from "@/lib/session";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function request<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Request failed");
  return json;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function apiUpdateUser(id: string, patch: Record<string, unknown>) {
  return request(`/users/${id}`, { method: "PUT", body: JSON.stringify(patch) });
}

export async function apiCreateUser(payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiDeleteUser(id: string) {
  return request(`/users/${id}`, { method: "DELETE" });
}

// ─── File upload ─────────────────────────────────────────────────────────────

export async function apiUploadFile(file: File): Promise<{ url: string; path: string }> {
  const form = new FormData();
  form.append("file", file);
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/uploads`, {
    method: "POST",
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.message || "Upload failed");
  return { url: json.url, path: json.path };
}

// ─── Logbook reports ─────────────────────────────────────────────────────────

export async function apiCreateLogbookReport(payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>("/logbook_reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateLogbookReport(id: string, patch: Record<string, unknown>) {
  return request(`/logbook_reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function apiDeleteLogbookReport(id: string) {
  return request(`/logbook_reports/${id}`, { method: "DELETE" });
}

// Internships

export async function apiUpdateInternship(id: string, patch: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>(`/internships/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function apiCreateTrainingRecord(resource: string, payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>(`/training-monitoring/${resource}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiListTrainingRecords(resource: string) {
  return request<{ success: boolean; data: Record<string, unknown>[] }>(`/training-monitoring/${resource}`);
}

export async function apiUpdateTrainingRecord(resource: string, id: string, patch: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown>}>(`/training-monitoring/${resource}/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function apiSendExternalSupervisorAppointment(payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>("/training-monitoring/external-supervisor-appointments/send", { method: "POST", body: JSON.stringify(payload) });
}

export type ConductResource =
  | "leave_requests"
  | "absence_reports"
  | "placement_change_requests"
  | "student_issues"
  | "communication_messages";

export async function apiListConductRecords(resource: ConductResource) {
  return request<{ success: boolean; data: Record<string, unknown>[] }>(`/conduct/${resource}`);
}

export async function apiCreateConductRecord(resource: ConductResource, payload: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>(`/conduct/${resource}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateConductRecord(resource: ConductResource, id: string, patch: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>(`/conduct/${resource}/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

// Applications

export async function apiUpdateApplication(id: string, patch: Record<string, unknown>) {
  return request<{ success: boolean; data: Record<string, unknown> }>(`/applications/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

// ─── Reviews (Daily Logs) ──────────────────────────────────────────────────

export async function apiListReviews() {
  return request<{ success: boolean; data: any[] }>("/reviews");
}

export async function apiCreateReview(payload: Record<string, unknown>) {
  return request<{ success: boolean; data: any }>("/reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function apiUpdateReview(id: string, patch: Record<string, unknown>) {
  return request<{ success: boolean; data: any }>(`/reviews/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function apiDeleteReview(id: string) {
  return request<{ success: boolean }>(`/reviews/${id}`, { method: "DELETE" });
}
