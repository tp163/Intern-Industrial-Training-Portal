"use client";

import { ContentCard, PageHeader } from "@/components/ui/page-header";
import { useAppStore } from "@/lib/store/app-store";
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
import { useEffect } from "react";

export default function AdminReportsPage() {
  const { applications, loadRealData } = useAppStore();

  useEffect(() => {
    loadRealData();
  }, [loadRealData]);

  const now = new Date();
  const thisMonthApplications = applications.filter((app) => {
    const appliedAt = new Date(app.appliedAt);
    return (
      !Number.isNaN(appliedAt.getTime()) &&
      appliedAt.getMonth() === now.getMonth() &&
      appliedAt.getFullYear() === now.getFullYear()
    );
  });
  const monthlyApplications = Object.entries(
    applications.reduce<Record<string, number>>((acc, app) => {
      const date = new Date(app.appliedAt);
      if (Number.isNaN(date.getTime())) return acc;
      const key = date.toLocaleString("en-US", { month: "short" });
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([month, count]) => ({ month, count }));
  const statusDistribution = Object.entries(
    applications.reduce<Record<string, number>>((acc, app) => {
      acc[app.status] = (acc[app.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count, color: "#6E5C4F" }));
  const topCompanies = Object.entries(
    applications.reduce<Record<string, number>>((acc, app) => {
      acc[app.companyName] = (acc[app.companyName] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, applications: count })).sort((a, b) => b.applications - a.applications).slice(0, 5);
  const totalApplications = applications.length;
  const maxMonthly = Math.max(...monthlyApplications.map((d) => d.count), 1);

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
            {thisMonthApplications.length}
          </p>
        </ContentCard>
        <ContentCard>
          <p className="text-sm text-text-secondary">Approved Applications</p>
          <p className="mt-1 text-3xl font-bold">
            {applications.filter((application) => application.status === "approved").length}
          </p>
        </ContentCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ContentCard title="Applications by Month">
          {monthlyApplications.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-secondary">
              No application data yet.
            </p>
          ) : (
            <div className="flex h-52 items-end justify-between gap-2">
              {monthlyApplications.map((item) => (
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
          )}
        </ContentCard>

        <ContentCard title="Status Breakdown">
          {statusDistribution.length === 0 ? (
            <p className="py-16 text-center text-sm text-text-secondary">
              No application statuses yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {statusDistribution.map((item) => (
                <Chip
                  key={item.status}
                  variant="flat"
                  style={{ backgroundColor: `${item.color}20`, color: item.color }}
                >
                  {item.status}: {item.count}
                </Chip>
              ))}
            </div>
          )}
        </ContentCard>
      </div>

      <ContentCard title="Recent Applications">
        <Table aria-label="Recent applications" removeWrapper>
          <TableHeader>
            <TableColumn>STUDENT</TableColumn>
            <TableColumn>INTERNSHIP</TableColumn>
            <TableColumn>COMPANY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>APPLIED ON</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No applications submitted yet.">
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
                <TableCell>
                  {app.appliedAt
                    ? new Date(app.appliedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ContentCard>

      <ContentCard title="Top Companies">
        {topCompanies.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-secondary">
            No company application data yet.
          </p>
        ) : (
          <div className="space-y-4">
            {topCompanies.map((company, i) => {
              const max = topCompanies[0]?.applications ?? 1;
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
        )}
      </ContentCard>

    </div>
  );
}
