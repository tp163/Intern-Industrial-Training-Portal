"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { adminDashboardStats, analyticsData } from "@/data/mock";

export default function AdminDashboardPage() {
  const maxCount = Math.max(...analyticsData.monthlyApplications.map((d) => d.count));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="System overview and key metrics"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminDashboardStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentCard title="Monthly Applications">
          <div className="flex h-48 items-end justify-between gap-3 px-2">
            {analyticsData.monthlyApplications.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-col items-center justify-end" style={{ height: "160px" }}>
                  <span className="mb-1 text-xs font-medium text-default-600">{item.count}</span>
                  <div
                    className="w-full max-w-12 rounded-t-lg bg-primary transition-all"
                    style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: "8px" }}
                  />
                </div>
                <span className="text-xs font-medium text-default-500">{item.month}</span>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard title="Application Status Distribution">
          <div className="space-y-4">
            {analyticsData.statusDistribution.map((item) => {
              const total = analyticsData.statusDistribution.reduce((s, i) => s + i.count, 0);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.status}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{item.status}</span>
                    <span className="text-default-500">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-default-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ContentCard>
      </div>

      <ContentCard title="Top Companies by Applications">
        <div className="space-y-3">
          {analyticsData.topCompanies.map((company, i) => {
            const maxApps = analyticsData.topCompanies[0].applications;
            const pct = (company.applications / maxApps) * 100;
            return (
              <div key={company.name} className="flex items-center gap-4">
                <span className="w-6 text-sm font-medium text-default-400">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{company.name}</span>
                    <span className="text-default-500">{company.applications}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-default-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ContentCard>
    </div>
  );
}
