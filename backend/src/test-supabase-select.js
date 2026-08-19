import { supabase } from "./config/supabase.js";

async function testSelect() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Supabase select error:", error);
      process.exit(1);
    }

    console.log("Select succeeded, row:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

testSelect();
