"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .regex(/^\+234[789][01]\d{8}$/, "Please enter a valid Nigerian phone number (+234...)"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupForm) {
    setIsSubmitting(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? "" : "http://localhost:5000");
      const res = await fetch(`${baseUrl}/api/v1/auth/signup`, {
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
        alert(result.message || "Signup failed");
      }
    } catch {
      alert("Network error. Please try again.");
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
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Create your account</h1>
        <p className="text-sm text-slate-400 font-medium">
          Start your journey to affordable, transparent rent financing
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="Ada"
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            placeholder="Okonkwo"
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="ada@example.com"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+2348012345678"
          hint="Nigerian phone format (+234...)"
          {...register("phone")}
          error={errors.phone?.message}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
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

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#CCFF00]/15"
          >
            <span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
            {!isSubmitting && (
              <span className="w-6 h-6 rounded-full bg-black text-[#CCFF00] flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-xs text-slate-400 font-medium">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#CCFF00] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
