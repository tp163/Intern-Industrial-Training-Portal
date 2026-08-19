import { supabase } from "./config/supabase.js";

async function run() {
  try {
    const row = {
      name: "Direct Insert Student",
      student_id: `ENG-DIRECT-${Date.now()}`,
      email: `direct.insert.${Date.now()}@example.com`,
      department: "Engineering",
      department_code: "ENG",
      batch: "2026",
      program: "Software Engineering",
      phone: "+1 555 000 000",
      supervisor_id: null,
    };

    const { data, error } = await supabase.from("students").insert([row]).select().single();

    if (error) {
      console.error("Insert error:", error);
      process.exit(1);
    }

    console.log("Insert succeeded:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

run();
