import { Router } from "express";
import { supabase } from "../config/supabase.js";

const router = Router();
const resources = new Map([
  ["leave_requests", { table: "leave_requests", status: ["pending", "approved", "rejected"] }],
  ["absence_reports", { table: "absence_reports", status: ["pending", "approved", "rejected"] }],
  ["placement_change_requests", { table: "placement_change_requests", status: ["pending", "approved", "rejected"] }],
  ["student_issues", { table: "student_issues", status: ["open", "in_progress", "resolved", "rejected"] }],
  ["communication_messages", { table: "communication_messages", status: [] }],
]);

async function visibleStudentIds(req) {
  if (req.user.role === "admin") return null;
  if (req.user.role === "student") return [req.user.id];
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("role", "student")
    .eq("supervisor_id", req.user.id);
  if (error) throw error;
  return (data ?? []).map((row) => row.id);
}

function getResource(req, res) {
  const resource = resources.get(req.params.resource);
  if (!resource) {
    res.status(404).json({ success: false, message: "Unknown conduct resource" });
    return null;
  }
  return resource;
}

router.get("/:resource", async (req, res) => {
  const resource = getResource(req, res);
  if (!resource) return;
  try {
    const studentIds = await visibleStudentIds(req);
    let query = supabase.from(resource.table).select("*").order("created_at", { ascending: false });
    if (studentIds) {
      if (studentIds.length === 0) return res.json({ success: true, data: [] });
      if (resource.table === "communication_messages") {
        query = query.or(`sender_id.in.(${studentIds.join(",")}),recipient_id.eq.${req.user.id}`);
      } else {
        query = query.in("student_id", studentIds);
      }
    }
    const { data, error } = await query;
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data: data ?? [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/:resource", async (req, res) => {
  const resource = getResource(req, res);
  if (!resource) return;
  if (req.user.role !== "student") return res.status(403).json({ success: false, message: "Only students can submit conduct requests" });
  const payload = { ...req.body, student_id: req.user.id };
  if (resource.table === "communication_messages") {
    payload.sender_id = req.user.id;
    delete payload.student_id;
  }
  const { data, error } = await supabase.from(resource.table).insert([payload]).select().single();
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.status(201).json({ success: true, data });
});

router.put("/:resource/:id", async (req, res) => {
  const resource = getResource(req, res);
  if (!resource) return;
  if (!['admin', 'supervisor'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Only staff can review conduct records" });
  }
  if (req.user.role === "supervisor" && resource.table !== "communication_messages") {
    const { data: record, error: recordError } = await supabase
      .from(resource.table)
      .select("student_id")
      .eq("id", req.params.id)
      .maybeSingle();
    if (recordError) return res.status(400).json({ success: false, message: recordError.message });
    if (!record) return res.status(404).json({ success: false, message: "Conduct record not found" });
    const { data: student, error: studentError } = await supabase
      .from("users")
      .select("id")
      .eq("id", record.student_id)
      .eq("supervisor_id", req.user.id)
      .maybeSingle();
    if (studentError) return res.status(400).json({ success: false, message: studentError.message });
    if (!student) return res.status(403).json({ success: false, message: "You can only review assigned students" });
  }
  const patch = { ...req.body, reviewer_id: req.user.id, reviewed_at: new Date().toISOString() };
  if (resource.status.length && (!resource.status.includes(patch.status))) {
    return res.status(400).json({ success: false, message: "Invalid conduct status" });
  }
  const { data, error } = await supabase.from(resource.table).update(patch).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.json({ success: true, data });
});

export default router;
