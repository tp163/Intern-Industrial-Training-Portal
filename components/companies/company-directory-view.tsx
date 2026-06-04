"use client";

import { useAppStore } from "@/lib/store/app-store";
import { SearchBar } from "@/components/ui/search-bar";
import { Building2, Globe, Mail, MapPin, Phone } from "lucide-react";
import { useMemo, useState } from "react";

interface CompanyDirectoryViewProps {
  title?: string;
  description?: string;
  readOnly?: boolean;
}

export function CompanyDirectoryView({
  title = "Company Directory",
  description = "Browse partner companies and internship opportunities",
  readOnly = true,
}: CompanyDirectoryViewProps) {
  const { getApprovedCompanies } = useAppStore();
  const [search, setSearch] = useState("");
  const companies = getApprovedCompanies();

  const filtered = useMemo(() => {
    if (!search) return companies;
    const q = search.toLowerCase();
    return companies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        (c.companyLetter?.toLowerCase().includes(q) ?? false)
    );
  }, [companies, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="ds-page-title">{title}</h1>
        <p className="ds-page-description">{description}</p>
        {readOnly && (
          <p className="mt-2 text-sm text-text-secondary">
            Directory is managed by administrators. Updates appear here automatically.
          </p>
        )}
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search companies..."
        className="max-w-xl"
      />

      {filtered.length === 0 ? (
        <div className="rounded-card border border-border/60 bg-white p-10 text-center shadow-card">
          <p className="font-medium text-text-primary">No companies found</p>
          <p className="mt-1 text-sm text-text-secondary">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((company) => (
            <article
              key={company.id}
              className="flex flex-col rounded-card border border-border/60 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover sm:p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-button bg-primary/10 text-primary">
                  <Building2 size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-text-primary">{company.name}</h2>
                  <p className="text-sm text-text-secondary">{company.industry}</p>
                  {company.companyLetter && (
                    <p className="mt-1 font-mono text-xs font-medium text-primary">
                      {company.companyLetter}
                    </p>
                  )}
                </div>
              </div>
              <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
                {company.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="shrink-0 text-primary" />
                  {company.location}
                </li>
                <li className="flex items-center gap-2 break-all">
                  <Mail size={14} className="shrink-0 text-primary" />
                  {company.email}
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="shrink-0 text-primary" />
                  {company.phone}
                </li>
                {company.website && (
                  <li className="flex items-center gap-2 break-all">
                    <Globe size={14} className="shrink-0 text-primary" />
                    {company.website.replace(/^https?:\/\//, "")}
                  </li>
                )}
              </ul>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
