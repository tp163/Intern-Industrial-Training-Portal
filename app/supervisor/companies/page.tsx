"use client";

import { CompanyDirectoryView } from "@/components/companies/company-directory-view";

export default function SupervisorCompaniesPage() {
  return (
    <CompanyDirectoryView
      title="Company Directory"
      description="View all partner companies maintained by administration"
      readOnly
    />
  );
}
