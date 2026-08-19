"use client";

import { BrandMark } from "@/components/ui/brand-mark";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { Button } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useState } from "react";
import { PanelLeft, PanelLeftClose } from "lucide-react";

const MIN_SIDEBAR_WIDTH = 220;
const MAX_SIDEBAR_WIDTH = 360;

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
  width?: number;
  onToggle?: () => void;
  onResize?: (width: number) => void;
  mobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({
  items,
  roleLabel,
  portalTitle = "Intern & Industrial Training Portal",
  consoleTitle,
  consoleVersion,
  variant = "default",
  collapsed = false,
  width = 260,
  onToggle,
  onResize,
  mobile = false,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const isPortal = variant === "portal";
  const isCollapsed = mobile ? false : collapsed;
  const [isResizing, setIsResizing] = useState(false);

  const startResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (mobile || isCollapsed || !onResize) return;

      event.preventDefault();
      setIsResizing(true);
    },
    [isCollapsed, mobile, onResize]
  );

  useEffect(() => {
    if (!isResizing || !onResize) return;

    const handlePointerMove = (event: PointerEvent) => {
      const nextWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, event.clientX));
      onResize(nextWidth);
    };

    const stopResize = () => setIsResizing(false);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResize);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResize);
    };
  }, [isResizing, onResize]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface-sidebar font-sans",
        isResizing ? "transition-none" : "transition-all duration-300",
        mobile ? "flex w-[260px]" : "hidden lg:flex",
        isCollapsed && "w-[72px]"
      )}
      style={!mobile && !isCollapsed ? { width } : undefined}
    >
      <div
        className={cn(
          "relative flex h-16 items-center border-b border-border",
          isCollapsed ? "justify-between px-2 gap-1" : "justify-between gap-2 pl-4 pr-12"
        )}
      >
        {isCollapsed ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-button bg-primary/10 text-primary">
            <BrandMark className="h-4 w-4 text-primary" />
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-button bg-primary/10 text-primary">
              <BrandMark className="h-5 w-5 text-primary" />
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

        {!mobile && onToggle && (
          <Button
            isIconOnly
            size="sm"
            variant="light"
            radius="md"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onPress={onToggle}
            className={cn(
              "text-text-secondary hover:bg-surface-muted",
              isCollapsed ? "h-7 w-7 min-w-7 p-0" : "absolute right-3 top-3.5"
            )}
          >
            {isCollapsed ? <PanelLeft size={14} /> : <PanelLeftClose size={16} />}
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

      {!mobile && !isCollapsed && onResize && (
        <button
          type="button"
          aria-label="Resize sidebar"
          onPointerDown={startResize}
          className={cn(
            "absolute -right-1 top-0 hidden h-full w-2 cursor-col-resize touch-none lg:block",
            "after:absolute after:right-1 after:top-0 after:h-full after:w-px after:bg-transparent after:transition-colors",
            "hover:after:bg-primary/60 focus-visible:outline-none focus-visible:after:bg-primary",
            isResizing && "after:bg-primary"
          )}
        />
      )}
    </aside>
  );
}
