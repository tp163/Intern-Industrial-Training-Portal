"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { analyticsData, applications } from "@/data/mock";
import { capitalize } from "@/lib/utils";
import { Chip } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

export default function AdminReportsPage() {
  const totalApplications = analyticsData.statusDistribution.reduce((s, i) => s + i.count, 0);
  const maxMonthly = Math.max(...analyticsData.monthlyApplications.map((d) => d.count));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        description="Detailed insights into platform activity"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ContentCard>
          <p className="text-sm text-text-secondary">Total Applications</p>
          <p className="mt-1 text-3xl font-bold">{totalApplications}</p>
        </ContentCard>
        <ContentCard>
          <p className="text-sm text-text-secondary">This Month</p>
          <p className="mt-1 text-3xl font-bold">
            {analyticsData.monthlyApplications.at(-1)?.count ?? 0}
          </p>
        </ContentCard>
        <ContentCard>
          <p className="text-sm text-text-secondary">Active Listings</p>
          <p className="mt-1 text-3xl font-bold">34</p>
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentCard title="Applications by Month">
          <div className="flex h-52 items-end justify-between gap-2">
            {analyticsData.monthlyApplications.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="flex w-full flex-col items-center justify-end"
                  style={{ height: "180px" }}
                >
                  <span className="mb-1 text-xs font-medium">{item.count}</span>
                  <div
                    className="w-full rounded-t-md bg-primary"
                    style={{
                      height: `${(item.count / maxMonthly) * 100}%`,
                      minHeight: "6px",
                    }}
                  />
                </div>
                <span className="text-xs text-text-secondary">{item.month}</span>
              </div>
            ))}
          </div>
        </ContentCard>

        <ContentCard title="Status Breakdown">
          <div className="flex flex-wrap gap-3">
            {analyticsData.statusDistribution.map((item) => (
              <Chip
                key={item.status}
                variant="flat"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.status}: {item.count}
              </Chip>
            ))}
          </div>
        </ContentCard>
      </div>

      <ContentCard title="Recent Applications">
        <Table aria-label="Recent applications" removeWrapper>
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>INTERNSHIP</TableColumn>
            <TableColumn>COMPANY</TableColumn>
            <TableColumn>STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.studentName}</TableCell>
                <TableCell>{app.internshipTitle}</TableCell>
                <TableCell>{app.companyName}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="primary">
                    {capitalize(app.status)}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentCard>

      <ContentCard title="Top Companies">
        <div className="space-y-4">
          {analyticsData.topCompanies.map((company, i) => {
            const max = analyticsData.topCompanies[0].applications;
            return (
              <div key={company.name} className="flex items-center gap-4">
                <span className="w-8 text-lg font-bold text-text-secondary/50">#{i + 1}</span>
                <div className="flex-1">
                  <div className="mb-1 flex justify-between">
                    <span className="font-medium">{company.name}</span>
                    <span className="text-text-secondary">{company.applications} apps</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-sidebar">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(company.applications / max) * 100}%` }}
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
