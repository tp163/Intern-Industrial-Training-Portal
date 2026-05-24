"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { roleDashboardPaths } from "@/lib/navigation";
import { Button, Input, Link, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { UserRole } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push(roleDashboardPaths[role]);
    }, 500);
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleLogin} className="space-y-5">
        <Select
          label="Login as"
          selectedKeys={[role]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as UserRole;
            if (selected) setRole(selected);
          }}
          variant="bordered"
          radius="lg"
        >
          <SelectItem key="student">Student</SelectItem>
          <SelectItem key="supervisor">Supervisor</SelectItem>
          <SelectItem key="admin">Administrator</SelectItem>
        </Select>

        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onValueChange={setEmail}
          variant="bordered"
          radius="lg"
          isRequired
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onValueChange={setPassword}
          variant="bordered"
          radius="lg"
          isRequired
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-default-400 hover:text-default-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Link as={NextLink} href="/forgot-password" size="sm" color="primary">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
            Sign In
          </Button>

          <p className="text-center text-sm text-default-500">
            Don&apos;t have an account?{" "}
            <Link as={NextLink} href="/register" size="sm" color="primary">
              Register
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
