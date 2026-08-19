import { supabase } from "./config/supabase.js";

async function testInsert() {
  try {
    const newUser = {
      name: "Test Insert",
      email: `test_insert_${Date.now()}@example.com`,
      password_hash: "dummyhash",
      role: "student",
    };

    const { data, error } = await supabase.from("users").insert([newUser]).select();

    if (error) {
      console.error("Supabase insert error:", error);
      process.exit(1);
    }

    console.log("Insert succeeded, returned:", data);
    process.exit(0);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

testInsert();
