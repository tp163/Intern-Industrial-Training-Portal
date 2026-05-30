"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { roleDashboardPaths } from "@/lib/navigation";
import { formFieldClassNames } from "@/lib/utils";
import { Button, Input, Link, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(roleDashboardPaths[role]);
    }, 500);
  };

  return (
    <AuthLayout title="Create account" subtitle="Register to start your internship journey">
      <form onSubmit={handleRegister} className="space-y-4">
        <Select
          label="Register as"
          selectedKeys={[role]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as UserRole;
            if (selected) setRole(selected);
          }}
          variant="bordered"
          radius="lg"
          classNames={formFieldClassNames}
        >
          <SelectItem key="student">Student</SelectItem>
          <SelectItem key="supervisor">Supervisor</SelectItem>
          <SelectItem key="admin">Administrator</SelectItem>
        </Select>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="First Name" placeholder="John" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
          <Input label="Last Name" placeholder="Doe" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
        />

        {role === "student" && (
          <Input label="Student ID" placeholder="STU2024001" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
        )}

        {role === "supervisor" && (
          <Input label="Department" placeholder="Computer Science" variant="bordered" radius="lg" isRequired classNames={formFieldClassNames} />
        )}

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-secondary hover:text-text-primary"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          variant="bordered"
          radius="lg"
          isRequired
          classNames={formFieldClassNames}
        />

        <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link as={NextLink} href="/login" size="sm" color="primary">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
