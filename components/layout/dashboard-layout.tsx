"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { Menu } from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userEmail: string;
  variant?: "default" | "portal";
  userRoleBadge?: string;
}

export function DashboardLayout({
  children,
  navItems,
  roleLabel,
  userName,
  userEmail,
  variant = "default",
  userRoleBadge,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPortal = variant === "portal";
  const sidebarWidth = collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]";

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar
        items={navItems}
        collapsed={collapsed}
        onToggle={isPortal ? undefined : () => setCollapsed(!collapsed)}
        roleLabel={roleLabel}
        userName={userName}
        userRoleBadge={userRoleBadge}
        variant={variant}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          items={navItems}
          roleLabel={roleLabel}
          userName={userName}
          userRoleBadge={userRoleBadge}
          variant={variant}
        />
      </div>

      <div className={cn("flex min-h-screen flex-col transition-all duration-300", sidebarWidth)}>
        {!isPortal && (
          <Navbar
            userName={userName}
            userEmail={userEmail}
            showMenuButton
            onMenuClick={() => setMobileOpen(!mobileOpen)}
          />
        )}

        {isPortal && (
          <div className="flex items-center border-b border-border px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-button p-2 text-text-secondary hover:bg-surface-muted"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        )}

        <main className={cn("flex-1", isPortal ? "p-6 lg:p-8 xl:p-10" : "p-4 md:p-6 lg:p-8")}>
          <div className="animate-slide-up mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
