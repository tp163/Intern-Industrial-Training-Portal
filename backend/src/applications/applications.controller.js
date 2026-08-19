import { supabase } from "../config/supabase.js";
import { sendStudentNotificationEmail } from "../config/mailer.js";

export const listApplications = async (req, res) => {
  try {
    const { data, error } = await supabase.from("applications").select("*").order("applied_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });
    // Older versions could create a second row when a withdrawn application
    // was submitted again. Return only the latest row for each student and
    // internship pair so reports do not count those legacy duplicates.
    const uniqueApplications = [];
    const seenPairs = new Set();
    for (const application of data ?? []) {
      const pairKey = `${application.student_id ?? ""}:${application.internship_id ?? ""}`;
      if (seenPairs.has(pairKey)) continue;
      seenPairs.add(pairKey);
      uniqueApplications.push(application);
    }
    res.json({ success: true, data: uniqueApplications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createApplication = async (req, res) => {
  try {
    const payload = req.body;

    // A withdrawn application can be submitted again, but it should remain
    // the same application record rather than creating a duplicate row.
    if (payload.student_id && payload.internship_id) {
      const { data: existingRows, error: lookupError } = await supabase
        .from("applications")
        .select("*")
        .eq("student_id", payload.student_id)
        .eq("internship_id", payload.internship_id)
        .order("applied_at", { ascending: false })
        .limit(1);

      if (lookupError) return res.status(400).json({ success: false, message: lookupError.message, error: lookupError });

      const existing = existingRows?.[0];
      if (existing && existing.status !== "withdrawn") {
        return res.status(409).json({
          success: false,
          message: "You already have an active application for this internship.",
        });
      }

      if (existing) {
        const { data, error } = await supabase
          .from("applications")
          .update({ ...payload, applied_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) return res.status(400).json({ success: false, message: error.message, error });
        return res.json({ success: true, data, reused: true });
      }
    }

    const { data, error } = await supabase
      .from("applications")
      .insert([payload])
      .select()
      .single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data, reused: false });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("applications").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    if (payload.status && data?.student_id) {
      await supabase.from("notifications").insert([{
        audience: "student",
        user_id: data.student_id,
        title: "Application Status Updated",
        message: `Your application for ${data.internship_title ?? "an internship"} at ${data.company_name ?? "the company"} is now ${payload.status}.`,
        read: false,
        type: payload.status === "approved" ? "success" : payload.status === "rejected" ? "error" : "info",
        category: "internship",
      }]);

      if (payload.status === "approved") {
        const { data: student } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", data.student_id)
          .eq("role", "student")
          .maybeSingle();
        if (student?.email) {
          const message = `Your application for ${data.internship_title ?? "an internship"} at ${data.company_name ?? "the company"} has been approved.`;
          sendStudentNotificationEmail({
            to: student.email,
            name: student.name,
            subject: "Internship Application Approved",
            message,
          }).catch((mailError) => console.error("Application approval email failed:", mailError.message));
        }
      }
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
