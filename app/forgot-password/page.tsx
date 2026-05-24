"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button, Input, Link } from "@heroui/react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import NextLink from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a reset link"
    >
      {submitted ? (
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="mt-2 text-sm text-default-500">
              We sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          <Button as={NextLink} href="/login" color="primary" variant="flat" radius="lg" className="w-full">
            Back to Sign In
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
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

          <Button type="submit" color="primary" size="lg" radius="lg" className="w-full font-semibold" isLoading={loading}>
            Send Reset Link
          </Button>

          <Link as={NextLink} href="/login" size="sm" color="primary" className="flex items-center justify-center gap-1">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
