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
import { ArrowRight, CheckCircle2 } from "lucide-react";

const profileSchema = z.object({
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  bvn: z.string().optional(),
  nin: z.string().optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const onboardingSteps = [
  { label: "Personal Info", description: "Identity & address" },
  { label: "Employment", description: "Work details" },
  { label: "Property", description: "Rent details" },
  { label: "Documents", description: "Upload files" },
  { label: "Review", description: "Submit application" },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nassarawa",
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba",
  "Yobe", "Zamfara",
];

export default function ProfilePage() {
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  async function onSubmit(data: ProfileForm) {
    setSaving(true);
    try {
      await api.put("/api/v1/tenants/profile/personal", data);
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
        <h1 className="text-2xl font-extrabold text-white">Complete Your Profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          We need some basic information to get started.
        </p>
      </div>

      <Stepper steps={onboardingSteps} currentStep={0} />

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your identity and contact details. Sensitive information is encrypted and secured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {saved ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-[#CCFF00]" />
              <h3 className="mt-4 text-lg font-bold text-white">Profile Saved</h3>
              <p className="mt-2 text-sm text-slate-400">
                Your personal information has been saved.
              </p>
              <div className="mt-6">
                <a href="/dashboard/employment">
                  <Button className="debitum-lime-btn">
                    Continue to Employment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Date of Birth"
                type="date"
                {...register("dateOfBirth")}
                error={errors.dateOfBirth?.message}
              />

              <Input
                label="Residential Address"
                placeholder="123 Main Street, Lekki Phase 1"
                {...register("address")}
                error={errors.address?.message}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="City"
                  placeholder="Lagos"
                  {...register("city")}
                  error={errors.city?.message}
                />
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-200">
                    State
                  </label>
                  <select
                    {...register("state")}
                    className="flex h-12 w-full rounded-xl border border-slate-700 bg-[#070D12] px-4 py-3 text-sm font-medium text-white focus:border-[#CCFF00] focus:outline-none focus:ring-1 focus:ring-[#CCFF00]"
                  >
                    <option value="" className="bg-[#070D12] text-slate-400">Select state</option>
                    {nigerianStates.map((s) => (
                      <option key={s} value={s} className="bg-[#070D12] text-white">{s}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-xs text-red-400 font-medium">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#CCFF00]">
                  Identity Verification (Optional — improves approval chances)
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="BVN" placeholder="12345678901" {...register("bvn")} />
                  <Input label="NIN" placeholder="12345678901" {...register("nin")} />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Input label="ID Type" placeholder="e.g. National ID, Voter's Card" {...register("idType")} />
                  <Input label="ID Number" placeholder="ID number" {...register("idNumber")} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="h-12 px-6 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#CCFF00]/15"
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
