import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function test() {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

test().catch(console.error);