import dotenv from "dotenv";
dotenv.config();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const createTableSQL = `
create table if not exists public.students (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  student_id text unique,
  email text not null unique,
  department text,
  department_code text,
  batch text,
  program text,
  year int default 1,
  gpa numeric(3,2),
  phone text,
  supervisor_id uuid references public.users(id),
  internship_status text default 'not_placed',
  internship_company text,
  internship_role text,
  cv_url text,
  cv_file_name text,
  created_at timestamptz default now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO service_role;
`;

async function createTable() {
  const res = await fetch(`${url}/rest/v1/rpc/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: createTableSQL }),
  });

  if (!res.ok) {
    // Try Supabase SQL API (newer versions)
    const res2 = await fetch(`${url}/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: createTableSQL }),
    });
    const body2 = await res2.text();
    console.log("SQL API response:", res2.status, body2);
    return;
  }

  const body = await res.text();
  console.log("Response:", res.status, body);
}

createTable().catch(console.error);
