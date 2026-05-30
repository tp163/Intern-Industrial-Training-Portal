"use client";

import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        size="sm"
        aria-label="Toggle theme"
        className="text-text-secondary"
      />
    );
  }

  return (
    <Button
      isIconOnly
      variant="light"
      size="sm"
      aria-label="Toggle theme"
      className="text-text-secondary hover:text-text-primary"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}
