import { supabase } from "../config/supabase.js";

const allowedStatuses = new Set(["active"]);

function isEligibleStatus(status) {
  if (!status) return false;
  return allowedStatuses.has(String(status).trim().toLowerCase());
}

export async function requireStudentEligibleInternshipStatus(req, res, next) {
  try {
    // This guard only applies to students. Admin and supervisors are not blocked.
    if (req.user?.role !== "student") {
      return next();
    }

    const { data, error } = await supabase
      .from("users")
      .select("internship_status")
      .eq("id", req.user.id)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    if (!isEligibleStatus(data?.internship_status)) {
      return res.status(403).json({
        success: false,
        message:
          "Please update your internship status to Active before submitting. Go to Profile -> Internship Details.",
      });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
