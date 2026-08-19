"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { notifyError } from "@/lib/notify";
import { roleDashboardPaths, roleLabels } from "@/lib/navigation";
import { formFieldClassNames, isValidEmail } from "@/lib/utils";
import { Button, Checkbox, Input, Link, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types";
import { clearSession, mapDbUser, saveAuthToken, saveSession } from "@/lib/session";
import { authFetch } from "@/lib/auth-fetch";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const REMEMBERED_LOGIN_KEY = "iits-remembered-login";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBERED_LOGIN_KEY);
      if (!saved) return;

      const remembered = JSON.parse(saved) as { email?: string; role?: UserRole };
      if (remembered.email) setEmail(remembered.email);
      if (remembered.role) setRole(remembered.role);
      setRememberMe(true);
    } catch {
      localStorage.removeItem(REMEMBERED_LOGIN_KEY);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isValidEmail(email)) {
        notifyError("Please enter a valid email address with @ sign.");
        return;
      }

      clearSession();

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      if (rememberMe) {
        localStorage.setItem(
          REMEMBERED_LOGIN_KEY,
          JSON.stringify({ email, role })
        );
      } else {
        localStorage.removeItem(REMEMBERED_LOGIN_KEY);
      }

      saveAuthToken(result.token);

      // Fetch full profile so all dashboard fields are available
      const profileRes = await authFetch(`${API_BASE}/users/${result.user.id}`, {
        headers: { Authorization: `Bearer ${result.token}` },
      });
      const profileJson = await profileRes.json();
      const fullUser = profileJson.success ? profileJson.data : result.user;
      const sessionUser = mapDbUser({ ...result.user, ...fullUser });

      if (sessionUser.role !== role) {
        throw new Error(
          `This account is registered as ${roleLabels[sessionUser.role]}, not ${roleLabels[role]}. Please choose the correct role.`
        );
      }

      saveSession(sessionUser);

      const resultRole = sessionUser.role as UserRole;
      window.location.href = roleDashboardPaths[resultRole];
    } catch (err: any) {
      console.error(err);
      notifyError(err.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleLogin} className="space-y-5">
        <Select
          label="Sign in as"
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
          <SelectItem key="external_supervisor">External Supervisor</SelectItem>
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
          isInvalid={!!email && !isValidEmail(email)}
          errorMessage="Email must include @ sign."
          classNames={formFieldClassNames}
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Checkbox
              size="sm"
              isSelected={rememberMe}
              onValueChange={setRememberMe}
              classNames={{ label: "text-sm text-text-secondary" }}
            >
              Remember me
            </Checkbox>
            <Link as={NextLink} href="/forgot-password" size="sm" color="primary">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
            Sign In
          </Button>

          <p className="text-center text-sm text-text-secondary">
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
