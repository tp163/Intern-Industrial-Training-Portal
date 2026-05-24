"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GraduationCap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-lg font-bold">IITS</p>
            <p className="text-sm text-white/70">Intern & Industrial Training</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Streamline your
            <br />
            internship journey
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/80">
            Connect students, supervisors, and companies in one unified platform for
            industrial training management.
          </p>
        </div>

        <p className="text-sm text-white/50">© 2025 Intern & Industrial Training System</p>
      </div>

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex justify-end p-4">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md animate-slide-up">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <GraduationCap size={20} />
              </div>
              <span className="text-lg font-bold">IITS</span>
            </div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="mt-2 text-default-500">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
