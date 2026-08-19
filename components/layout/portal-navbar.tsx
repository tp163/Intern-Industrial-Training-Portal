"use client";

import { BrandMark } from "@/components/ui/brand-mark";
import { Avatar } from "@heroui/react";
import { cn, getInitials } from "@/lib/utils";
import type { NavItem } from "@/types";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PortalNavbarProps {
  items: NavItem[];
  userName: string;
  userRoleBadge: string;
  modeBadge?: string;
  onMenuClick?: () => void;
}

export function PortalNavbar({
  items,
  userName,
  userRoleBadge,
  modeBadge,
  onMenuClick,
}: PortalNavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-button p-2 text-text-secondary hover:bg-surface-muted lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2.5">
            <BrandMark className="h-6 w-6 shrink-0 text-primary lg:hidden" />
            <span className="hidden font-serif text-base font-bold text-text-primary sm:inline md:text-lg">
              Intern &amp; Training Portal
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/supervisor/dashboard" &&
                item.href !== "/student/dashboard" &&
                item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.id ?? item.href}
                href={item.href}
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-widest transition-colors",
                  isActive
                    ? "border-b-2 border-primary pb-0.5 text-primary"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {modeBadge && (
            <span className="hidden rounded-full border border-border bg-surface-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-text-secondary sm:inline">
              {modeBadge}
            </span>
          )}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-text-primary">{userName}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
              {userRoleBadge}
            </p>
          </div>
          <Avatar
            name={getInitials(userName)}
            size="sm"
            classNames={{
              base: "h-10 w-10 bg-surface-muted text-text-primary ring-2 ring-border",
            }}
            getInitials={getInitials}
          />
        </div>
      </div>
    </header>
  );
}
