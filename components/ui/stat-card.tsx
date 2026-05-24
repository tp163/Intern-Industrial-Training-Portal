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
        : "text-default-400";

  return (
    <Card
      className={cn(
        "animate-fade-in border border-default-200 shadow-card transition-shadow hover:shadow-card-hover",
        className
      )}
    >
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-default-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{stat.value}</p>
            {stat.change && (
              <span className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium", trendColor)}>
                <TrendIcon size={14} />
                {stat.change}
              </span>
            )}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DynamicIcon name={stat.icon} size={22} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
