"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { notifyError } from "@/lib/notify";
import { formFieldClassNames } from "@/lib/utils";
import { Button, Input, Link } from "@heroui/react";
import { ArrowLeft, CheckCircle, KeyRound, Mail } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Step = "email" | "reset" | "success";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return notifyError("Please enter your email address");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to send reset code");
      setStep("reset");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetCode.trim()) return notifyError("Please enter the reset code");
    if (!newPassword) return notifyError("Please enter a new password");
    if (newPassword !== confirmPassword) return notifyError("Passwords do not match");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: resetCode.trim(), newPassword }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to reset password");
      setStep("success");
    } catch (err) {
      notifyError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep("email");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (step === "success") {
    return (
      <AuthLayout title="Password reset" subtitle="Your password has been updated">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Password updated</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Your password has been reset. You can now sign in with your new password.
            </p>
          </div>
          <Button as={NextLink} href="/login" color="primary" radius="lg" className="w-full">
            Back to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (step === "reset") {
    return (
      <AuthLayout title="Enter reset code" subtitle={`We sent a reset code to ${email}`}>
        <form onSubmit={handleReset} className="space-y-5">
          <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-text-secondary">
            Check your inbox for the 6-digit code. It expires in 15 minutes.
          </p>

          <Input
            label="Reset Code"
            placeholder="6-digit code"
            value={resetCode}
            onValueChange={setResetCode}
            variant="bordered"
            radius="lg"
            maxLength={6}
            startContent={<KeyRound size={16} className="text-text-secondary" />}
            classNames={formFieldClassNames}
            isRequired
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Min 8 chars, upper, lower, number"
            value={newPassword}
            onValueChange={setNewPassword}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
            isRequired
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onValueChange={setConfirmPassword}
            variant="bordered"
            radius="lg"
            classNames={formFieldClassNames}
            isRequired
          />

          <Button
            type="submit"
            color="primary"
            size="lg"
            radius="lg"
            className="w-full font-semibold"
            isLoading={loading}
          >
            Reset Password
          </Button>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-1 text-sm text-primary hover:underline"
            onClick={goBackToEmail}
          >
            <ArrowLeft size={14} />
            Request a new code
          </button>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset code"
    >
      <form onSubmit={handleRequestCode} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="you@university.edu"
          value={email}
          onValueChange={setEmail}
          variant="bordered"
          radius="lg"
          startContent={<Mail size={16} className="text-text-secondary" />}
          isRequired
          classNames={formFieldClassNames}
        />

        <Button
          type="submit"
          color="primary"
          size="lg"
          radius="lg"
          className="w-full font-semibold"
          isLoading={loading}
        >
          Send Reset Code
        </Button>

        <Link
          as={NextLink}
          href="/login"
          size="sm"
          color="primary"
          className="flex items-center justify-center gap-1"
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </Link>
      </form>
    </AuthLayout>
  );
}
