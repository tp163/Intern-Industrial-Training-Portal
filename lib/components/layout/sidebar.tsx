"use client";

import { Avatar } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn, getInitials } from "@/lib/utils";
import type { NavItem } from "@/types";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  items: NavItem[];
  roleLabel: string;
  userName?: string;
  userRoleBadge?: string;
  portalTitle?: string;
  variant?: "default" | "portal";
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  items,
  roleLabel,
  userName,
  userRoleBadge,
  portalTitle = "Intern & Training Portal",
  variant = "default",
  collapsed = false,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const isPortal = variant === "portal";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border transition-all duration-300",
        isPortal ? "bg-surface-sidebar" : "bg-surface-sidebar",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className={cn("px-5 pt-6", isPortal ? "pb-8" : "border-b border-border pb-4")}>
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center text-primary",
              isPortal ? "h-8 w-8" : "h-9 w-9 rounded-button bg-primary text-white shadow-card"
            )}
          >
            <GraduationCap size={isPortal ? 28 : 20} strokeWidth={isPortal ? 1.75 : 2} />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              {isPortal ? (
                <p className="font-serif text-[15px] font-bold leading-snug text-text-primary">
                  {portalTitle}
                </p>
              ) : (
                <>
                  <p className="truncate text-sm font-bold text-text-primary">IITS</p>
                  <p className="truncate text-xs text-text-secondary">{roleLabel}</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-button px-4 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <DynamicIcon name={item.icon} size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isPortal && userName && !collapsed && (
        <div className="border-t border-border px-5 py-5">
          <div className="flex items-center gap-3">
            <Avatar
              name={getInitials(userName)}
              size="sm"
              classNames={{
                base: "h-10 w-10 bg-surface-muted text-text-primary ring-2 ring-border",
              }}
              getInitials={getInitials}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">{userName}</p>
              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {userRoleBadge ?? roleLabel}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
