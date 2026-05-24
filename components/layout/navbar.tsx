"use client";

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroNavbar,
  NavbarContent,
  NavbarItem,
} from "@heroui/react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getInitials } from "@/lib/utils";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import Link from "next/link";
import { notifications } from "@/data/mock";

interface NavbarProps {
  userName: string;
  userEmail: string;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Navbar({ userName, userEmail, onMenuClick, showMenuButton = false }: NavbarProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <HeroNavbar
      maxWidth="full"
      className="sticky top-0 z-30 border-b border-default-200 bg-content1/80 backdrop-blur-md"
      height="4rem"
    >
      <NavbarContent justify="start">
        {showMenuButton && (
          <NavbarItem>
            <Button isIconOnly variant="light" onPress={onMenuClick} aria-label="Open menu">
              <Menu size={20} />
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <NavbarItem>
          <ThemeToggle />
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button isIconOnly variant="light" aria-label="Notifications">
                <Badge content={unreadCount} color="danger" size="sm" isInvisible={unreadCount === 0}>
                  <Bell size={20} />
                </Badge>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications" className="w-80">
              {notifications.map((n) => (
                <DropdownItem key={n.id} description={n.message} className="py-2">
                  {n.title}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" className="gap-2 px-2">
                <Avatar
                  name={userName}
                  size="sm"
                  classNames={{ base: "bg-primary/10 text-primary" }}
                  getInitials={getInitials}
                />
                <span className="hidden text-sm font-medium md:inline">{userName}</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="profile" startContent={<User size={16} />} description={userEmail}>
                Profile
              </DropdownItem>
              <DropdownItem key="settings" startContent={<Settings size={16} />}>
                Settings
              </DropdownItem>
              <DropdownItem
                key="logout"
                startContent={<LogOut size={16} />}
                color="danger"
                className="text-danger"
                href="/login"
                as={Link}
              >
                Log out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </HeroNavbar>
  );
}
