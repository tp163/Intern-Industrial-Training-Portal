import { supabase } from "./config/supabase.js";

async function test() {
  try {
    const { data, error } = await supabase.from("users").select("id").limit(1);

    if (error) {
      console.error("Supabase error:", error);
      process.exit(1);
    }

    console.log("Supabase query succeeded. Sample data:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

test();
