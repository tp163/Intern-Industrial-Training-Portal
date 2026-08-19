import { supabase } from "./config/supabase.js";

const companies = [
  {
    name: "WSO2 Lanka (Pvt) Ltd",
    industry: "Technology",
    location: "Colombo 03, Sri Lanka",
    email: "internships@wso2.com",
    phone: "+94 11 214 9100",
    website: "https://wso2.com",
    status: "approved",
    description: "Open-source technology company specializing in middleware and API management solutions.",
    company_letter: "MOU-2025-WSO2",
  },
  {
    name: "Dialog Axiata PLC",
    industry: "Telecommunications",
    location: "Colombo 03, Sri Lanka",
    email: "careers@dialog.lk",
    phone: "+94 11 767 8900",
    website: "https://dialog.lk",
    status: "approved",
    description: "Sri Lanka's largest telecommunications service provider offering mobile, broadband and TV services.",
    company_letter: "MOU-2025-DLG",
  },
  {
    name: "IFS R&D International (Pvt) Ltd",
    industry: "Enterprise Software",
    location: "Colombo 02, Sri Lanka",
    email: "talent@ifs.com",
    phone: "+94 11 235 0000",
    website: "https://ifs.com",
    status: "approved",
    description: "Global enterprise application software company with a major R&D hub in Sri Lanka.",
    company_letter: "MOU-2025-IFS",
  },
  {
    name: "Virtusa Corporation",
    industry: "IT Services",
    location: "Colombo 07, Sri Lanka",
    email: "lk-careers@virtusa.com",
    phone: "+94 11 235 7000",
    website: "https://virtusa.com",
    status: "approved",
    description: "Global digital engineering company providing IT services and solutions.",
    company_letter: "MOU-2025-VRT",
  },
  {
    name: "Hatch Works (Pvt) Ltd",
    industry: "FinTech",
    location: "Colombo 01, Sri Lanka",
    email: "hello@hatch.lk",
    phone: "+94 11 456 7890",
    website: "https://hatch.lk",
    status: "approved",
    description: "Leading fintech and innovation studio building digital financial products for the South Asian market.",
    company_letter: "MOU-2025-HCH",
  },
];

const supervisors = [
  {
    name: "Dr. Chaminda Rathnayake",
    email: "c.rathnayake@university.lk",
    role: "supervisor",
    password_hash: "",
    phone: "+94 77 123 4567",
    department: "CMIS",
  },
  {
    name: "Prof. Niluka Perera",
    email: "n.perera@university.lk",
    role: "supervisor",
    password_hash: "",
    phone: "+94 77 234 5678",
    department: "ELTN",
  },
];

const students = [
  {
    name: "Kavindu Jayasinghe",
    email: "kavindu.j@student.lk",
    role: "student",
    password_hash: "",
    phone: "+94 77 901 2345",
    department: "CMIS",
  },
  {
    name: "Sanduni Wickramasinghe",
    email: "sanduni.w@student.lk",
    role: "student",
    password_hash: "",
    phone: "+94 76 234 5678",
    department: "CMIS",
  },
  {
    name: "Thisara Bandara",
    email: "thisara.b@student.lk",
    role: "student",
    password_hash: "",
    phone: "+94 71 345 6789",
    department: "ELTN",
  },
  {
    name: "Amaya Dissanayake",
    email: "amaya.d@student.lk",
    role: "student",
    password_hash: "",
    phone: "+94 75 456 7890",
    department: "CMIS",
  },
  {
    name: "Dulith Fernando",
    email: "dulith.f@student.lk",
    role: "student",
    password_hash: "",
    phone: "+94 70 567 8901",
    department: "IMGT",
  },
];

async function seed() {
  // Companies are already inserted from previous run — skip if exist
  console.log("Checking companies...");
  const { data: existing } = await supabase
    .from("companies")
    .select("id")
    .eq("email", "internships@wso2.com")
    .limit(1);

  if (existing && existing.length > 0) {
    console.log("Companies already seeded — skipping.");
  } else {
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert(companies)
      .select();

    if (companyError) {
      console.error("Company insert error:", companyError.message);
    } else {
      console.log(`Inserted ${companyData.length} companies:`);
      companyData.forEach((c) => console.log("  -", c.name));
    }
  }

  // Upsert supervisors (on conflict on email — skip duplicates)
  console.log("\nUpserting supervisors...");
  const { data: supData, error: supError } = await supabase
    .from("users")
    .upsert(supervisors, { onConflict: "email", ignoreDuplicates: true })
    .select();

  if (supError) {
    console.error("Supervisor upsert error:", supError.message);
  } else {
    console.log(`Upserted ${supData?.length ?? 0} supervisors.`);
    supData?.forEach((s) => console.log("  -", s.name, "|", s.id));
  }

  // Upsert students
  console.log("\nUpserting Sri Lankan students...");
  const { data: studentData, error: studentError } = await supabase
    .from("users")
    .upsert(students, { onConflict: "email", ignoreDuplicates: true })
    .select();

  if (studentError) {
    console.error("Student upsert error:", studentError.message);
  } else {
    console.log(`Upserted ${studentData?.length ?? 0} students:`);
    studentData?.forEach((s) => console.log("  -", s.name, "|", s.id));
  }

  console.log("\nAll done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
