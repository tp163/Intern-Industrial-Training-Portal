"use client";

import { Input } from "@heroui/react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onValueChange={onChange}
      startContent={<Search className="text-text-secondary" size={18} />}
      variant="bordered"
      radius="lg"
      size="md"
      isClearable
      onClear={() => onChange("")}
      classNames={{
        inputWrapper: "border-border bg-surface-card shadow-none rounded-input",
        input: "text-text-primary placeholder:text-text-secondary",
      }}
    />
  );
}
