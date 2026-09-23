"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setIsSubmitting(true);
    setError(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "" : "http://localhost:5000");
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        window.location.href = "/dashboard";
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      {/* Mobile Header Logo */}
      <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-black fill-current">
            <path d="M12 2L4 12l8 10 8-10L12 2zm0 4.5l4.5 5.5L12 17.5 7.5 12 12 6.5z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white">
          Rent<span className="text-[#CCFF00]">Fin</span>
        </span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h1>
        <p className="text-sm text-slate-400 font-medium">
          Log in to manage your active rent financing & applications
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-xs font-semibold text-red-400" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="ada@example.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
          />
          <button
            type="button"
            className="absolute right-3.5 top-[2.4rem] text-slate-400 hover:text-white transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="text-xs text-[#CCFF00] hover:underline font-bold">
            Forgot password?
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#CCFF00]/15"
          >
            <span>{isSubmitting ? "Logging in..." : "Log In"}</span>
            {!isSubmitting && (
              <span className="w-6 h-6 rounded-full bg-black text-[#CCFF00] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-xs text-slate-400 font-medium">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-bold text-[#CCFF00] hover:underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
