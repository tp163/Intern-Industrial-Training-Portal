import { supabase } from "../config/supabase.js";

export const listAnnouncements = async (req, res) => {
  try {
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ success: false, message: error.message, error });

    let visibleData = data ?? [];
    if (req.user?.role === "student") {
      const { data: student, error: studentError } = await supabase
        .from("users")
        .select("supervisor_id")
        .eq("id", req.user.id)
        .eq("role", "student")
        .maybeSingle();
      if (studentError) return res.status(500).json({ success: false, message: studentError.message });

      const assignedSupervisorId = student?.supervisor_id ?? null;
      visibleData = visibleData.filter((announcement) => {
        if (announcement.target === "all_students") return true;
        if (announcement.target === "single_student") return announcement.student_id === req.user.id;
        if (announcement.target === "specific_students") {
          return Array.isArray(announcement.student_ids) && announcement.student_ids.includes(req.user.id);
        }
        return announcement.target === "supervisor_students" &&
          !!assignedSupervisorId &&
          announcement.supervisor_id === assignedSupervisorId;
      });
    }

    res.json({ success: true, data: visibleData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.title?.trim() || !payload.message?.trim()) {
      return res.status(400).json({ success: false, message: "Title and message are required" });
    }
    if (payload.title.trim().length > 100) {
      return res.status(400).json({ success: false, message: "Title must be 100 characters or fewer" });
    }
    if (payload.message.trim().length > 1000) {
      return res.status(400).json({ success: false, message: "Message must be 1000 characters or fewer" });
    }
    if (payload.scheduled_at && new Date(payload.scheduled_at) < new Date()) {
      return res.status(400).json({ success: false, message: "Scheduled date cannot be in the past" });
    }
    const entry = {
      ...payload,
      published_at: payload.scheduled_at ? payload.published_at ?? null : new Date().toISOString(),
    };
    const { data, error } = await supabase.from("announcements").insert([entry]).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message, error });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("announcements").select("*").eq("id", id).single();
    if (error) return res.status(404).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("announcements").update(payload).eq("id", id).select().single();
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
