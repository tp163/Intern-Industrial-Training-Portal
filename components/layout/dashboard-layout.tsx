"use client";

import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleLabel: string;
  userName: string;
  userEmail: string;
}

export function DashboardLayout({
  children,
  navItems,
  roleLabel,
  userName,
  userEmail,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-default-50">
      <Sidebar
        items={navItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        roleLabel={roleLabel}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
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
        <Sidebar items={navItems} roleLabel={roleLabel} />
      </div>

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        <Navbar
          userName={userName}
          userEmail={userEmail}
          showMenuButton
          onMenuClick={() => setMobileOpen(!mobileOpen)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="animate-slide-up mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
