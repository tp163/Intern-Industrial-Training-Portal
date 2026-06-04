"use client";

import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { useCallback, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userEmail: string;
  profileHref: string;
  variant?: "default" | "portal";
  userRoleBadge?: string;
  consoleTitle?: string;
  consoleVersion?: string;
  modeBadge?: string;
}

export function DashboardLayout({
  children,
  navItems,
  roleLabel,
  userName,
  userEmail,
  profileHref,
  variant = "default",
  userRoleBadge,
  consoleTitle,
  consoleVersion,
  modeBadge,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isPortal = variant === "portal";
  const showSidebar = navItems.length > 0;
  const sidebarWidth = showSidebar
    ? collapsed
      ? "lg:ml-[72px]"
      : "lg:ml-[260px]"
    : "";

  const handleSidebarToggle = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      setMobileOpen((open) => !open);
    } else {
      setCollapsed((c) => !c);
    }
  }, []);

  return (
    <div className="min-h-screen bg-surface font-sans">
      {showSidebar && (
        <Sidebar
          items={navItems}
          collapsed={collapsed}
          onToggle={handleSidebarToggle}
          roleLabel={roleLabel}
          userName={userName}
          userRoleBadge={userRoleBadge}
          variant={variant}
          consoleTitle={consoleTitle}
          consoleVersion={consoleVersion}
          sidebarCollapsed={collapsed}
        />
      )}

      {mobileOpen && showSidebar && (
        <div
          className="fixed inset-0 z-50 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          items={navItems}
          roleLabel={roleLabel}
          userName={userName}
          userRoleBadge={userRoleBadge}
          variant={variant}
          consoleTitle={consoleTitle}
          consoleVersion={consoleVersion}
          mobile
          onNavigate={() => setMobileOpen(false)}
        />
      </div>

      <div className={cn("flex min-h-screen flex-col transition-all duration-300", sidebarWidth)}>
        {isPortal ? (
          <AppHeader
            userName={userName}
            userEmail={userEmail}
            userRoleBadge={userRoleBadge ?? roleLabel}
            profileHref={profileHref}
            modeBadge={modeBadge}
            showSidebarToggle={showSidebar}
            sidebarCollapsed={collapsed}
            mobileMenuOpen={mobileOpen}
            onSidebarToggle={handleSidebarToggle}
          />
        ) : (
          <Navbar
            userName={userName}
            userEmail={userEmail}
            showMenuButton={showSidebar}
            onMenuClick={handleSidebarToggle}
          />
        )}

        <main className={cn("flex-1", isPortal ? "p-4 sm:p-6 lg:p-8 xl:p-10" : "p-4 md:p-6 lg:p-8")}>
          <div className="animate-slide-up mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
