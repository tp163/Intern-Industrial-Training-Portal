import { supabase } from "../config/supabase.js";

const isPositiveInteger = (value) => Number.isInteger(Number(value)) && Number(value) > 0;
const isFutureDate = (value) => {
  const selected = new Date(value);
  if (Number.isNaN(selected.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected >= today;
};

export const listReportDeadlines = async (req, res) => {
  try {
    let query = supabase
      .from("report_deadlines")
      .select("*")
      .order("due_date", { ascending: true });

    if (req.query.student_id) query = query.eq("student_id", req.query.student_id);
    const requestedStatus = req.query.status;

    const { data, error } = await query;
    if (error) return res.status(500).json({ success: false, message: error.message, error });

    // Keep deadline status accurate even for reports submitted before the
    // submission-to-deadline sync was added.
    const deadlineRows = data ?? [];
    const studentIds = [...new Set(deadlineRows.map((deadline) => deadline.student_id).filter(Boolean))];
    let submittedKeys = new Set();
    if (studentIds.length > 0) {
      const { data: reports, error: reportsError } = await supabase
        .from("logbook_reports")
        .select("student_id, month_number")
        .in("student_id", studentIds);
      if (reportsError) return res.status(500).json({ success: false, message: reportsError.message, error: reportsError });
      submittedKeys = new Set(
        (reports ?? []).map((report) => `${report.student_id}:${report.month_number}`)
      );
    }

    const currentData = deadlineRows.map((deadline) => ({
      ...deadline,
      status: submittedKeys.has(`${deadline.student_id}:${deadline.month_number}`)
        ? "submitted"
        : deadline.status,
    }));
    const filteredData = requestedStatus
      ? currentData.filter((deadline) => deadline.status === requestedStatus)
      : currentData;
    res.json({ success: true, data: filteredData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createReportDeadline = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      status: req.body.status ?? "pending",
    };
    if (!payload.student_id || !payload.period || !payload.due_date) {
      return res.status(400).json({ success: false, message: "Student, period, and due date are required" });
    }
    if (!isPositiveInteger(payload.month_number)) {
      return res.status(400).json({ success: false, message: "Report number must be positive" });
    }
    if (!isFutureDate(payload.due_date)) {
      return res.status(400).json({ success: false, message: "Deadline cannot be in the past" });
    }
    const { data, error } = await supabase
      .from("report_deadlines")
      .insert([payload])
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReportDeadline = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("report_deadlines")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReportDeadline = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("report_deadlines").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
