"use client";

import { PortalPageHeader } from "@/components/student/portal-page-header";
import { SearchBar } from "@/components/ui/search-bar";
import { companies } from "@/data/mock";
import { Building2, Globe, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

export default function StudentCompaniesPage() {
  const [search, setSearch] = useState("");

  const approvedCompanies = companies.filter((c) => c.status === "approved");

  const filtered = useMemo(() => {
    if (!search) return approvedCompanies;
    const q = search.toLowerCase();
    return approvedCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
    );
  }, [approvedCompanies, search]);

  return (
    <div className="space-y-8">
      <PortalPageHeader
        title="Company Directory"
        description="Browse approved partner companies offering internships"
      />

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search companies..."
        className="max-w-xl"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.map((company) => (
          <article
            key={company.id}
            className="rounded-card border border-border/60 bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-button bg-surface-muted text-primary">
                <Building2 size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-text-primary">{company.name}</h2>
                <p className="mt-0.5 text-sm text-text-secondary">{company.industry}</p>
              </div>
            </div>
            <p className="mt-4 line-clamp-2 text-sm text-text-secondary">{company.description}</p>
            <div className="mt-4 space-y-1.5 text-sm text-text-secondary">
              <p className="inline-flex items-center gap-2">
                <MapPin size={14} className="shrink-0 text-primary" />
                {company.location}
              </p>
              {company.website && (
                <p className="inline-flex items-center gap-2">
                  <Globe size={14} className="shrink-0 text-primary" />
                  {company.website.replace(/^https?:\/\//, "")}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
