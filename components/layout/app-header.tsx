"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { cn, getInitials } from "@/lib/utils";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import type { NotificationAudience } from "@/types";
import { ChevronDown, GraduationCap, LogOut, Menu, PanelLeft, PanelLeftClose, User, X } from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  userName: string;
  userEmail: string;
  userRoleBadge: string;
  profileHref: string;
  onSidebarToggle: () => void;
  showSidebarToggle?: boolean;
  sidebarCollapsed?: boolean;
  mobileMenuOpen?: boolean;
  modeBadge?: string;
  notificationAudience?: NotificationAudience;
  notificationUserId?: string;
}

export function AppHeader({
  userName,
  userEmail,
  userRoleBadge,
  profileHref,
  onSidebarToggle,
  showSidebarToggle = true,
  sidebarCollapsed = false,
  mobileMenuOpen = false,
  modeBadge,
  notificationAudience,
  notificationUserId,
}: AppHeaderProps) {
  const ToggleIcon = mobileMenuOpen ? X : Menu;
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {showSidebarToggle && (
            <Button
              isIconOnly
              variant="light"
              radius="lg"
              aria-label={mobileMenuOpen ? "Close menu" : sidebarCollapsed ? "Expand sidebar" : "Toggle sidebar"}
              onPress={onSidebarToggle}
              className="shrink-0 text-text-secondary"
            >
              <span className="lg:hidden">
                <ToggleIcon size={22} />
              </span>
              <span className="hidden lg:inline-flex">
                {sidebarCollapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
              </span>
            </Button>
          )}
          <div className="flex min-w-0 items-center gap-2.5">
            <GraduationCap size={22} className="shrink-0 text-primary" strokeWidth={1.75} />
            <span className="truncate font-sans text-base font-semibold text-text-primary sm:text-lg">
              Intern &amp; Training Portal
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {modeBadge && (
            <span className="hidden rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary sm:inline">
              {modeBadge}
            </span>
          )}

          {notificationAudience && (
            <NotificationPanel audience={notificationAudience} userId={notificationUserId} />
          )}

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="light"
                radius="lg"
                className={cn(
                  "h-auto min-h-10 gap-2 px-2 py-1.5 font-sans",
                  "data-[hover=true]:bg-surface-muted"
                )}
              >
                <Avatar
                  name={getInitials(userName)}
                  size="sm"
                  classNames={{
                    base: "h-9 w-9 bg-primary/10 text-primary ring-2 ring-border sm:h-10 sm:w-10",
                  }}
                  getInitials={getInitials}
                />
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight text-text-primary">{userName}</p>
                  <p className="text-xs font-medium text-text-secondary">{userRoleBadge}</p>
                </div>
                <ChevronDown size={16} className="hidden text-text-secondary sm:block" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile menu"
              className="min-w-[220px] rounded-card border border-border bg-surface-card font-sans text-base shadow-card"
            >
              <DropdownItem
                key="profile"
                href={profileHref}
                as={Link}
                startContent={<User size={18} />}
                description={userEmail}
                classNames={{ title: "text-base font-medium" }}
              >
                View Profile
              </DropdownItem>
              <DropdownItem
                key="logout"
                href="/login"
                as={Link}
                color="danger"
                startContent={<LogOut size={18} />}
                className="text-danger"
                classNames={{ title: "text-base font-medium" }}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
