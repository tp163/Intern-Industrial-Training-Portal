"use client";

import {
  Briefcase,
  Building2,
  BarChart3,
  CheckCircle,
  ClipboardList,
  Clock,
  FileCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Settings,
  TrendingUp,
  User,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  User,
  FileText,
  ClipboardList,
  Briefcase,
  Users,
  FileCheck,
  BarChart3,
  GraduationCap,
  UserCheck,
  Building2,
  Settings,
  CheckCircle,
  TrendingUp,
  Clock,
};

export function DynamicIcon({
  name,
  className,
  size = 20,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Icon = iconMap[name] ?? LayoutDashboard;
  return <Icon className={className} size={size} />;
}
