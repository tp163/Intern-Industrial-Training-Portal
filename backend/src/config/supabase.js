import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_KEY;

if (!url) {
  console.error("Missing SUPABASE_URL in environment variables");
}

if (!serviceKey && !anonKey) {
  console.error("Missing SUPABASE_KEY or SUPABASE_SERVICE_KEY / SUPABASE_SERVICE_ROLE_KEY in environment variables");
}

if (anonKey && anonKey.startsWith("sb_publishable")) {
  console.warn(
    "Warning: SUPABASE_KEY looks like a publishable (anon) key. For server-side inserts with RLS enabled use SUPABASE_SERVICE_KEY (service_role)."
  );
}

export const supabase = createClient(url, serviceKey || anonKey, {
  auth: { persistSession: false },
});
