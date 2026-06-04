import { redirect } from "next/navigation";

export default function AdminStudentsRedirectPage() {
  redirect("/admin/supervisor-student-directory");
}
