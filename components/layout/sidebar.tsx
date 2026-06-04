"use client";

import { Button } from "@heroui/react";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { GraduationCap, PanelLeft, PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  items: NavItem[];
  roleLabel: string;
  userName?: string;
  userRoleBadge?: string;
  portalTitle?: string;
  consoleTitle?: string;
  consoleVersion?: string;
  variant?: "default" | "portal";
  collapsed?: boolean;
  sidebarCollapsed?: boolean;
  onToggle?: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  items,
  roleLabel,
  portalTitle = "Intern & Training Portal",
  consoleTitle,
  consoleVersion,
  variant = "default",
  collapsed = false,
  sidebarCollapsed = false,
  onToggle,
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const isPortal = variant === "portal";
  const isCollapsed = mobile ? false : collapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface-sidebar font-sans transition-all duration-300",
        mobile ? "flex w-[260px]" : "hidden lg:flex",
        isCollapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-border/60",
          isCollapsed ? "justify-center px-2 py-4" : "justify-between gap-2 px-4 py-4"
        )}
      >
        {!isCollapsed && (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-primary/10 text-primary">
              <GraduationCap size={20} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              {isPortal && consoleTitle ? (
                <>
                  <p className="truncate text-base font-semibold leading-snug text-text-primary">
                    {consoleTitle}
                  </p>
                  {consoleVersion && (
                    <p className="truncate text-sm text-text-secondary">{consoleVersion}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="truncate text-base font-semibold text-text-primary">
                    {isPortal ? portalTitle : "IITS"}
                  </p>
                  <p className="truncate text-sm text-text-secondary">{roleLabel}</p>
                </>
              )}
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex h-9 w-9 items-center justify-center rounded-button bg-primary/10 text-primary">
            <GraduationCap size={20} strokeWidth={1.75} />
          </div>
        )}

        {onToggle && !mobile && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="lg"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onPress={onToggle}
            className={cn("shrink-0 text-text-secondary", isCollapsed && "mt-0")}
          >
            {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/supervisor/dashboard" &&
              item.href !== "/admin/dashboard" &&
              item.href !== "/student/dashboard" &&
              pathname.startsWith(`${item.href}`));
          return (
            <Link
              key={item.id ?? item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-button px-3 py-3 text-base font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <DynamicIcon name={item.icon} size={20} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isPortal && !isCollapsed && (
        <div className="border-t border-border px-4 py-4">
          <div className="flex gap-4 text-sm font-medium text-text-secondary">
            <button type="button" className="hover:text-text-primary">
              Help
            </button>
            <button type="button" className="hover:text-text-primary">
              Support
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
