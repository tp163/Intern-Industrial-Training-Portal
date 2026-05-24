"use client";

import { Button } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { ChevronLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
  onToggle?: () => void;
  roleLabel: string;
}

export function Sidebar({ items, collapsed = false, onToggle, roleLabel }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-default-200 bg-content1 transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-default-200 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <GraduationCap size={20} />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">IITS</p>
            <p className="truncate text-xs text-default-500">{roleLabel}</p>
          </div>
        )}
        {onToggle && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={onToggle}
            className={cn("shrink-0", collapsed && "mx-auto")}
            aria-label="Toggle sidebar"
          >
            <ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} size={18} />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-default-600 hover:bg-default-100 hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <DynamicIcon name={item.icon} size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
