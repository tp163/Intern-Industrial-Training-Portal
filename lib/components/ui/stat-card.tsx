"use client";

import { Card, CardBody } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { DashboardStat } from "@/types";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const TrendIcon =
    stat.trend === "up" ? ArrowUpRight : stat.trend === "down" ? ArrowDownRight : Minus;

  const trendColor =
    stat.trend === "up"
      ? "text-success"
      : stat.trend === "down"
        ? "text-danger"
        : "text-text-secondary";

  return (
    <Card
      className={cn(
        "animate-fade-in rounded-card border border-border bg-surface-card shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-text-primary">{stat.value}</p>
            {stat.change && (
              <span className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", trendColor)}>
                <TrendIcon size={14} />
                {stat.change}
              </span>
            )}
          </div>
          <div className="ds-icon-badge h-11 w-11">
            <DynamicIcon name={stat.icon} size={22} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
