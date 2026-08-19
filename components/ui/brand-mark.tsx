import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  title?: string;
}

export function BrandMark({ className, title = "Intern & Training Portal logo" }: BrandMarkProps) {
  return (
    <img
      src="/university-logo.png"
      alt={title}
      className={cn("block object-contain", className)}
    />
  );
}
