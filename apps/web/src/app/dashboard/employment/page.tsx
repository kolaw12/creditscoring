"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const employmentSchema = z.object({
  employmentStatus: z.string().min(1, "Employment status is required"),
  employerName: z.string().min(1, "Employer name is required"),
  jobTitle: z.string().optional(),
  employmentStartDate: z.string().optional(),
  monthlyIncome: z.coerce.number().positive("Monthly income must be a positive number"),
  salaryFrequency: z.string().min(1, "Salary frequency is required"),
  salaryBank: z.string().optional(),
});

type EmploymentForm = z.infer<typeof employmentSchema>;

const onboardingSteps = [
  { label: "Personal Info", description: "Identity & address" },
  { label: "Employment", description: "Work details" },
  { label: "Property", description: "Rent details" },
  { label: "Documents", description: "Upload files" },
  { label: "Review", description: "Submit application" },
];

export default function EmploymentPage() {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmploymentForm>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      salaryFrequency: "monthly",
    },
  });

  async function onSubmit(data: EmploymentForm) {
    setSaving(true);
    try {
      await api.put("/api/v1/tenants/profile/employment", data);
      setSaved(true);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Employment & Income</h1>
        <p className="mt-1 text-sm text-slate-400">
          Tell us about your work and income so we can assess affordability.
        </p>
      </div>

      <Stepper steps={onboardingSteps} currentStep={1} />

      <Card>
        <CardHeader>
          <CardTitle>Employment Details</CardTitle>
          <CardDescription>
            This information helps us understand your ability to repay.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {saved ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#CCFF00]" />
              <h3 className="mt-4 text-lg font-bold text-white">Employment Saved</h3>
              <p className="mt-2 text-sm text-slate-400">
                Your employment information has been saved.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link href="/dashboard/profile">
                  <button className="h-11 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </Link>
                <a href="/dashboard/application">
                  <button className="h-11 px-6 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors">
                    Continue to Application
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                  Employment Status
                </label>
                <select
                  {...register("employmentStatus")}
                  className="flex h-12 w-full rounded-xl border border-slate-700 bg-[#070D12] px-4 py-3 text-sm font-medium text-white focus:border-[#CCFF00] focus:outline-none focus:ring-1 focus:ring-[#CCFF00]"
                >
                  <option value="" className="bg-[#070D12] text-slate-400">Select status</option>
                  <option value="employed" className="bg-[#070D12] text-white">Employed (Full-time)</option>
                  <option value="employed_part_time" className="bg-[#070D12] text-white">Employed (Part-time)</option>
                  <option value="self_employed" className="bg-[#070D12] text-white">Self-Employed</option>
                  <option value="contract" className="bg-[#070D12] text-white">Contract Worker</option>
                  <option value="intern" className="bg-[#070D12] text-white">Intern / NYSC</option>
                </select>
                {errors.employmentStatus && (
                  <p className="mt-1 text-xs text-red-400 font-medium">{errors.employmentStatus.message}</p>
                )}
              </div>

              <Input
                label="Employer / Company Name"
                placeholder="TechCorp Nigeria"
                {...register("employerName")}
                error={errors.employerName?.message}
              />

              <Input
                label="Job Title"
                placeholder="Software Engineer"
                {...register("jobTitle")}
              />

              <Input
                label="Employment Start Date"
                type="date"
                {...register("employmentStartDate")}
              />

              <div className="border-t border-slate-800/80 pt-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
                  Income Information
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Monthly Income (₦)"
                    type="number"
                    placeholder="350000"
                    {...register("monthlyIncome")}
                    error={errors.monthlyIncome?.message}
                  />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                      Salary Frequency
                    </label>
                    <select
                      {...register("salaryFrequency")}
                      className="flex h-12 w-full rounded-xl border border-slate-700 bg-[#070D12] px-4 py-3 text-sm font-medium text-white focus:border-[#CCFF00] focus:outline-none focus:ring-1 focus:ring-[#CCFF00]"
                    >
                      <option value="monthly" className="bg-[#070D12] text-white">Monthly</option>
                      <option value="bi_weekly" className="bg-[#070D12] text-white">Bi-Weekly</option>
                      <option value="weekly" className="bg-[#070D12] text-white">Weekly</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Salary Bank (Optional)"
                  placeholder="GTBank"
                  {...register("salaryBank")}
                  className="mt-4"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Link href="/dashboard/profile">
                  <button type="button" className="h-12 px-6 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 px-7 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#CCFF00]/15"
                >
                  <span>{saving ? "Saving..." : "Save & Continue"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
