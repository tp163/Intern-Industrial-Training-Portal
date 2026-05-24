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
      startContent={<Search className="text-default-400" size={18} />}
      variant="bordered"
      radius="lg"
      size="md"
      isClearable
      onClear={() => onChange("")}
    />
  );
}
