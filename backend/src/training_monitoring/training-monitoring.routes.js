import { Router } from "express";
import { supabase } from "../config/supabase.js";
import { sendExternalSupervisorAppointmentEmail } from "../config/mailer.js";

const router = Router();
const tables = new Set([
  "weekly_certifications",
  "placement_confirmations",
  "site_visits",
  "meeting_attendance",
  "completion_recommendations",
  "attendance_records",
  "completion_certifications",
  "external_monthly_progress",
  "evaluation_records",
  "training_documents",
  "commencement_confirmations",
  "external_supervisor_appointments",
  "seminar_events",
]);

const externalOwnerColumn = new Set([
  "weekly_certifications",
  "attendance_records",
  "completion_certifications",
  "external_monthly_progress",
]);

const supervisorOwnerColumn = new Set(["evaluation_records"]);
const supervisorStudentResources = new Set([
  "placement_confirmations",
  "commencement_confirmations",
  "weekly_certifications",
  "completion_recommendations",
  "site_visits",
  "meeting_attendance",
]);

const getTable = (resource) => resource === "completion_certifications" ? "completion_certifications" : resource;

async function getOwnedQuery(resource, req) {
  let query = supabase.from(getTable(resource)).select("*");
  if (req.user.role === "student" && resource === "training_documents") query = query.or(`student_id.eq.${req.user.id},student_id.is.null`);
  if (req.user.role === "student" && ["commencement_confirmations", "placement_confirmations", "weekly_certifications"].includes(resource)) query = query.eq("student_id", req.user.id);
  if (req.user.role === "external_supervisor" && externalOwnerColumn.has(resource)) {
    query = query.eq("external_supervisor_id", req.user.id);
  }
  if (req.user.role === "supervisor" && supervisorOwnerColumn.has(resource)) {
    query = query.eq("evaluator_id", req.user.id);
  }
  if (req.user.role === "supervisor" && supervisorStudentResources.has(resource)) {
    const { data: assignedStudents, error } = await supabase.from("users").select("id").eq("supervisor_id", req.user.id);
    if (error) throw error;
    const studentIds = (assignedStudents ?? []).map((student) => student.id);
    query = query.in("student_id", studentIds.length ? studentIds : ["00000000-0000-0000-0000-000000000000"]);
  }
  return query;
}

router.get("/:resource", async (req, res) => {
  if (!tables.has(req.params.resource)) return res.status(404).json({ success: false, message: "Unknown training resource" });
  try {
    const { data, error } = await getOwnedQuery(req.params.resource, req);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/external-supervisor-appointments/send", async (req, res) => {
  if (!['admin', 'supervisor'].includes(req.user.role)) return res.status(403).json({ success: false, message: "Access denied" });
  try {
    const { student_id, placement_confirmation_id, external_supervisor_name, external_supervisor_email, internal_supervisor_id } = req.body;
    const { data: student } = await supabase.from("users").select("name").eq("id", student_id).single();
    const { data: internal } = internal_supervisor_id ? await supabase.from("users").select("name").eq("id", internal_supervisor_id).single() : { data: null };
    await sendExternalSupervisorAppointmentEmail({ to: external_supervisor_email, name: external_supervisor_name, studentName: student?.name ?? "the student", internalSupervisorName: internal?.name, coordinatorName: req.user.name });
    const { data, error } = await supabase.from("external_supervisor_appointments").insert([{ student_id, placement_confirmation_id, external_supervisor_name, external_supervisor_email, internal_supervisor_id, coordinator_id: req.user.id, status: "sent" }]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(201).json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post("/:resource", async (req, res) => {
  if (!tables.has(req.params.resource)) return res.status(404).json({ success: false, message: "Unknown training resource" });
  const studentResources = new Set(["placement_confirmations", "commencement_confirmations", "weekly_certifications"]);
  if (req.user.role !== "external_supervisor" && req.user.role !== "supervisor" && req.user.role !== "admin" && !(req.user.role === "student" && studentResources.has(req.params.resource))) return res.status(403).json({ success: false, message: "Access denied" });
  const payload = { ...req.body };
  if (req.user.role === "student") payload.student_id = req.user.id;
  if (req.user.role === "external_supervisor" && externalOwnerColumn.has(req.params.resource)) payload.external_supervisor_id = req.user.id;
  if (req.user.role === "supervisor" && supervisorOwnerColumn.has(req.params.resource)) payload.evaluator_id = req.user.id;
  let operation = supabase.from(req.params.resource).insert([payload]);
  if (["completion_certifications", "evaluation_records"].includes(req.params.resource)) operation = supabase.from(req.params.resource).upsert([payload], { onConflict: "student_id" });
  const { data, error } = await operation.select().single();
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.status(201).json({ success: true, data });
});


router.put("/:resource/:id", async (req, res) => {
  if (!tables.has(req.params.resource)) return res.status(404).json({ success: false, message: "Unknown training resource" });
  if (req.user.role === "external_supervisor" && externalOwnerColumn.has(req.params.resource)) {
    const { data: owned } = await supabase.from(req.params.resource).select("id").eq("id", req.params.id).eq("external_supervisor_id", req.user.id).maybeSingle();
    if (!owned) return res.status(403).json({ success: false, message: "You can only update your assigned training records" });
  }
  if (req.user.role === "supervisor" && supervisorOwnerColumn.has(req.params.resource)) {
    const { data: owned } = await supabase.from(req.params.resource).select("id").eq("id", req.params.id).eq("evaluator_id", req.user.id).maybeSingle();
    if (!owned) return res.status(403).json({ success: false, message: "You can only update your own evaluation records" });
  }
  const { data, error } = await supabase.from(req.params.resource).update(req.body).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ success: false, message: error.message });
  if (req.params.resource === "placement_confirmations" && req.body.status === "approved" && data?.student_id) {
    await supabase.from("users").update({
      internship_status: "active",
      internship_company: data.organization ?? null,
      internship_role: data.role ?? null,
    }).eq("id", data.student_id);
  }
  res.json({ success: true, data });
});

export default router;
