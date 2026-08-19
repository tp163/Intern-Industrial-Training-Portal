/**
 * seed-update.js
 * Updates existing Sri Lankan users with full fields and seeds internship listings.
 * Safe to run multiple times (uses upsert on email conflict).
 */
import { supabase } from "./config/supabase.js";

// ─── 1. Get existing supervisor IDs ──────────────────────────────────────────
async function getSupervisorIds() {
  const { data } = await supabase
    .from("users")
    .select("id, email")
    .eq("role", "supervisor")
    .in("email", ["c.rathnayake@university.lk", "n.perera@university.lk"]);
  const map = {};
  for (const r of data ?? []) map[r.email] = r.id;
  return map;
}

// ─── 2. Upsert students with full data ───────────────────────────────────────
async function upsertStudents(supMap) {
  const sup1 = supMap["c.rathnayake@university.lk"] ?? null;
  const sup2 = supMap["n.perera@university.lk"] ?? null;

  const students = [
    {
      name: "Kavindu Jayasinghe",
      email: "kavindu.j@student.lk",
      role: "student",
      password_hash: "",
      phone: "+94 77 901 2345",
      department: "CMIS",
      student_id: "UOM-2024-001",
      program: "Computer Science & Engineering",
      year: 3,
      gpa: 3.75,
      department_code: "CMIS",
      batch: "2024",
      internship_status: "active",
      supervisor_id: sup1,
      allocation_status: sup1 ? "allocated" : "unassigned",
    },
    {
      name: "Sanduni Wickramasinghe",
      email: "sanduni.w@student.lk",
      role: "student",
      password_hash: "",
      phone: "+94 76 234 5678",
      department: "CMIS",
      student_id: "UOM-2024-002",
      program: "Information Management",
      year: 2,
      gpa: 3.60,
      department_code: "IMGT",
      batch: "2024",
      internship_status: "pending",
      supervisor_id: sup1,
      allocation_status: sup1 ? "allocated" : "unassigned",
    },
    {
      name: "Thisara Bandara",
      email: "thisara.b@student.lk",
      role: "student",
      password_hash: "",
      phone: "+94 71 345 6789",
      department: "ELTN",
      student_id: "UOM-2024-003",
      program: "Electronics & Telecommunication Engineering",
      year: 3,
      gpa: 3.40,
      department_code: "ELTN",
      batch: "2024",
      internship_status: "not_placed",
      supervisor_id: sup2,
      allocation_status: sup2 ? "allocated" : "unassigned",
    },
    {
      name: "Amaya Dissanayake",
      email: "amaya.d@student.lk",
      role: "student",
      password_hash: "",
      phone: "+94 75 456 7890",
      department: "CMIS",
      student_id: "UOM-2024-004",
      program: "Software Engineering",
      year: 4,
      gpa: 3.85,
      department_code: "CMIS",
      batch: "2023",
      internship_status: "active",
      supervisor_id: sup1,
      allocation_status: sup1 ? "allocated" : "unassigned",
    },
    {
      name: "Dulith Fernando",
      email: "dulith.f@student.lk",
      role: "student",
      password_hash: "",
      phone: "+94 70 567 8901",
      department: "IMGT",
      student_id: "UOM-2024-005",
      program: "Management Information Systems",
      year: 2,
      gpa: 3.20,
      department_code: "IMGT",
      batch: "2024",
      internship_status: "not_placed",
      supervisor_id: null,
      allocation_status: "unassigned",
    },
  ];

  const { data, error } = await supabase
    .from("users")
    .upsert(students, { onConflict: "email" })
    .select();

  if (error) {
    console.error("Student upsert error:", error.message);
  } else {
    console.log(`Upserted ${data.length} students with full data:`);
    data.forEach((s) =>
      console.log(`  - ${s.student_id} | ${s.name} | ${s.program} | GPA ${s.gpa}`)
    );
  }
}

// ─── 3. Upsert supervisors with title ────────────────────────────────────────
async function upsertSupervisors() {
  const supervisors = [
    {
      name: "Dr. Chaminda Rathnayake",
      email: "c.rathnayake@university.lk",
      role: "supervisor",
      password_hash: "",
      phone: "+94 77 123 4567",
      department: "CMIS",
      title: "Senior Lecturer",
      assigned_students: 3,
    },
    {
      name: "Prof. Niluka Perera",
      email: "n.perera@university.lk",
      role: "supervisor",
      password_hash: "",
      phone: "+94 77 234 5678",
      department: "ELTN",
      title: "Professor",
      assigned_students: 1,
    },
  ];

  const { data, error } = await supabase
    .from("users")
    .upsert(supervisors, { onConflict: "email" })
    .select();

  if (error) {
    console.error("Supervisor upsert error:", error.message);
  } else {
    console.log(`Upserted ${data.length} supervisors with title:`);
    data.forEach((s) => console.log(`  - ${s.name} | ${s.title}`));
  }
  return data ?? [];
}

// ─── 4. Seed internship listings ─────────────────────────────────────────────
async function seedInternships() {
  // Skip if internships already exist
  const { count } = await supabase
    .from("internships")
    .select("id", { count: "exact", head: true })
    .in("company_name", ["WSO2 Lanka (Pvt) Ltd", "Dialog Axiata PLC"]);
  if ((count ?? 0) > 0) {
    console.log("Internships already seeded — deduplicating and skipping insert.");
    // Remove any extras beyond the first 5
    const { data: all } = await supabase
      .from("internships")
      .select("id, title, company_name")
      .order("id", { ascending: true });
    const seenTitles = new Set();
    const toDelete = [];
    for (const r of all ?? []) {
      const key = `${r.title}|${r.company_name}`;
      if (seenTitles.has(key)) toDelete.push(r.id);
      else seenTitles.add(key);
    }
    if (toDelete.length) {
      await supabase.from("internships").delete().in("id", toDelete);
      console.log(`Removed ${toDelete.length} duplicate internship rows.`);
    }
    return;
  }

  // Fetch the company IDs we inserted earlier
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .in("name", [
      "WSO2 Lanka (Pvt) Ltd",
      "Dialog Axiata PLC",
      "IFS R&D International (Pvt) Ltd",
      "Virtusa Corporation",
      "Hatch Works (Pvt) Ltd",
    ])
    .order("created_at", { ascending: false })
    .limit(5);

  if (!companies?.length) {
    console.log("No companies found — skipping internships.");
    return;
  }

  // Map company name → id (take first match to avoid duplicates)
  const cmap = {};
  for (const c of companies) {
    if (!cmap[c.name]) cmap[c.name] = { id: c.id, name: c.name };
  }

  const wso2 = cmap["WSO2 Lanka (Pvt) Ltd"];
  const dialog = cmap["Dialog Axiata PLC"];
  const ifs = cmap["IFS R&D International (Pvt) Ltd"];
  const virtusa = cmap["Virtusa Corporation"];
  const hatch = cmap["Hatch Works (Pvt) Ltd"];

  const internships = [
    {
      title: "Software Engineering Intern",
      company_id: wso2?.id,
      company_name: "WSO2 Lanka (Pvt) Ltd",
      location: "Colombo 03, Sri Lanka",
      type: "hybrid",
      duration: "6 months",
      deadline: "2025-09-30T00:00:00Z",
      description:
        "Work alongside the WSO2 core engineering team on open-source middleware, API gateways, and identity management products. Hands-on exposure to enterprise-grade distributed systems.",
      requirements: ["Java", "REST APIs", "Git", "Linux"],
      slots: 4,
      applied: 0,
      status: "open",
      stipend: "LKR 60,000/month",
      department_category: "CMIS",
    },
    {
      title: "Network & Systems Intern",
      company_id: dialog?.id,
      company_name: "Dialog Axiata PLC",
      location: "Colombo 03, Sri Lanka",
      type: "onsite",
      duration: "3 months",
      deadline: "2025-08-15T00:00:00Z",
      description:
        "Join Dialog's infrastructure team and gain experience in telecom network operations, 5G rollout, and IT systems administration across Sri Lanka's largest mobile network.",
      requirements: ["Networking", "Linux", "Cisco", "Python"],
      slots: 3,
      applied: 0,
      status: "open",
      stipend: "LKR 55,000/month",
      department_category: "ELTN",
    },
    {
      title: "Enterprise Software Development Intern",
      company_id: ifs?.id,
      company_name: "IFS R&D International (Pvt) Ltd",
      location: "Colombo 02, Sri Lanka",
      type: "hybrid",
      duration: "6 months",
      deadline: "2025-10-01T00:00:00Z",
      description:
        "Contribute to IFS Applications — a leading ERP platform — working on modules for manufacturing, field service, and asset management used by global enterprises.",
      requirements: ["C#", ".NET", "SQL Server", "Agile"],
      slots: 5,
      applied: 0,
      status: "open",
      stipend: "LKR 70,000/month",
      department_category: "CMIS",
    },
    {
      title: "Business Analyst Intern",
      company_id: virtusa?.id,
      company_name: "Virtusa Corporation",
      location: "Colombo 07, Sri Lanka",
      type: "hybrid",
      duration: "3 months",
      deadline: "2025-07-31T00:00:00Z",
      description:
        "Support client-facing digital transformation projects by gathering requirements, creating process models, and coordinating between business stakeholders and development teams.",
      requirements: ["Business Analysis", "UML", "Excel", "Communication"],
      slots: 2,
      applied: 0,
      status: "open",
      stipend: "LKR 50,000/month",
      department_category: "IMGT",
    },
    {
      title: "FinTech Product Intern",
      company_id: hatch?.id,
      company_name: "Hatch Works (Pvt) Ltd",
      location: "Colombo 01, Sri Lanka",
      type: "onsite",
      duration: "4 months",
      deadline: "2025-08-01T00:00:00Z",
      description:
        "Join the product team building next-generation digital payment and lending solutions. Involves market research, prototyping, user testing, and sprint-based delivery.",
      requirements: ["Product Thinking", "Figma", "Data Analysis", "Agile"],
      slots: 2,
      applied: 0,
      status: "open",
      stipend: "LKR 45,000/month",
      department_category: "IMGT",
    },
  ].filter((i) => i.company_id); // skip any whose company wasn't found

  if (!internships.length) {
    console.log("No valid internship rows to insert.");
    return;
  }

  const { data, error } = await supabase.from("internships").insert(internships).select();
  if (error) {
    console.error("Internship insert error:", error.message);
  } else {
    console.log(`Inserted ${data.length} internship listings:`);
    data.forEach((i) => console.log(`  - "${i.title}" @ ${i.company_name}`));
  }
}

// ─── 5. Remove duplicate companies ───────────────────────────────────────────
async function deduplicateCompanies() {
  const { data: all } = await supabase
    .from("companies")
    .select("id, name, created_at")
    .order("created_at", { ascending: true }); // oldest first

  if (!all?.length) return;

  const seen = new Map();
  const toDelete = [];
  for (const c of all) {
    if (seen.has(c.name)) {
      toDelete.push(c.id); // delete the later duplicate
    } else {
      seen.set(c.name, c.id);
    }
  }

  if (!toDelete.length) {
    console.log("No duplicate companies found.");
    return;
  }

  const { error } = await supabase.from("companies").delete().in("id", toDelete);
  if (error) {
    console.error("Dedup error:", error.message);
  } else {
    console.log(`Removed ${toDelete.length} duplicate company rows.`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("=== Step 1: Fix duplicate companies ===");
  await deduplicateCompanies();

  console.log("\n=== Step 2: Upsert supervisors with full fields ===");
  await upsertSupervisors();

  console.log("\n=== Step 3: Upsert students with full fields ===");
  const supMap = await getSupervisorIds();
  await upsertStudents(supMap);

  console.log("\n=== Step 4: Seed internship listings ===");
  await seedInternships();

  console.log("\nAll done!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
