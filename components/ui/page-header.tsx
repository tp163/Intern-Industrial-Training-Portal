"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div>
        <h1 className="ds-page-title">{title}</h1>
        {description && <p className="ds-page-description">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}

interface ContentCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, description, action, children, className }: ContentCardProps) {
  return (
    <Card className={cn("ds-card ds-card-hover rounded-card", className)}>
      {(title || action) && (
        <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
            {description && <p className="text-sm text-text-secondary">{description}</p>}
          </div>
          {action}
        </CardHeader>
      )}
      <CardBody className="p-6">{children}</CardBody>
    </Card>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-card bg-surface-sidebar text-text-secondary">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}
