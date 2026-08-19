import { supabase } from "../config/supabase.js";

function periodToMonthKey(period = "") {
  const months = {
    jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
    jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const parts = String(period).trim().toLowerCase().split(/\s+/);
  if (parts.length >= 2) {
    const month = months[parts[0].slice(0, 3)] ?? "01";
    const year = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
    return `${year}-${month}`;
  }
  return String(period).trim();
}

const isValidReportPeriod = (value = "") => String(value).trim().length > 0;

function normalizeReportRow(row) {
  return {
    ...row,
    period: row.period ?? row["Report Name"] ?? row.report_name ?? "",
    report_type: row.report_type ?? (String(row.period ?? "").toLowerCase().includes("monthly") ? "monthly" : "fortnightly"),
  };
}

async function markReportDeadlineSubmitted(studentId, monthNumber) {
  if (!studentId || monthNumber == null) return;

  const { error } = await supabase
    .from("report_deadlines")
    .update({
      status: "submitted",
      updated_at: new Date().toISOString(),
    })
    .eq("student_id", studentId)
    .eq("month_number", monthNumber);

  if (error) {
    // The report has already been saved successfully. Keep submission intact
    // while surfacing the sync issue in the backend logs for investigation.
    console.error("Failed to update report deadline status:", error.message);
  }
}

async function getNextMonthNumber(studentId) {
  if (!studentId) return 1;
  const { data, error } = await supabase
    .from("logbook_reports")
    .select("month_number")
    .eq("student_id", studentId)
    .order("month_number", { ascending: false })
    .limit(1);

  if (error) throw error;
  return Number(data?.[0]?.month_number ?? 0) + 1;
}

export const listLogbookReports = async (req, res) => {
  try {
    const { data, error } = await supabase.from("logbook_reports").select("*").order("submitted_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    res.json({ success: true, data: (data ?? []).map(normalizeReportRow) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLogbookReport = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.month_number == null) {
      payload.month_number = await getNextMonthNumber(payload.student_id);
    }
    if (!payload.month_key) {
      payload.month_key = periodToMonthKey(payload.period);
    }
    payload.report_type = payload.report_type === "monthly" ? "monthly" : "fortnightly";
    if (!isValidReportPeriod(payload.period)) {
      return res.status(400).json({ success: false, message: "Report name cannot be empty" });
    }
    if (payload.pdf_file_name && !String(payload.pdf_file_name).toLowerCase().endsWith(".pdf")) {
      return res.status(400).json({ success: false, message: "Logbook report must be a PDF file" });
    }
    let { data, error } = await supabase.from("logbook_reports").insert([payload]).select().single();

    // Some deployed databases were created with legacy, space-containing
    // column names. Retry with the legacy report-name field when that schema
    // requires it, while keeping the current `period` field as the canonical
    // application field.
    if (error && /Report Name/i.test(error.message ?? "")) {
      const legacyPayload = {
        ...payload,
        "Report Name": payload.period,
      };
      ({ data, error } = await supabase
        .from("logbook_reports")
        .insert([legacyPayload])
        .select()
        .single());
    }
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    await markReportDeadlineSubmitted(payload.student_id, payload.month_number);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLogbookReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("logbook_reports").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data: normalizeReportRow(data) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateLogbookReport = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("logbook_reports").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLogbookReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("logbook_reports").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
