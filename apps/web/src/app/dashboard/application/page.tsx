"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Stepper } from "@/components/ui/stepper";
import { ArrowRight, CheckCircle2, Clock, FileText, Send } from "lucide-react";

const applicationSchema = z.object({
  annualRent: z.coerce.number().positive("Annual rent must be positive"),
  leaseDuration: z.coerce.number().int().min(1, "Lease duration is required"),
  tenantContribution: z.coerce.number().min(0),
  requestedAmount: z.coerce.number().positive("Requested amount must be positive"),
}).refine(
  (data) => data.tenantContribution + data.requestedAmount <= data.annualRent,
  { message: "Contribution + requested amount cannot exceed annual rent", path: ["requestedAmount"] }
);

type ApplicationForm = z.infer<typeof applicationSchema>;

const onboardingSteps = [
  { label: "Personal Info", description: "Identity & address" },
  { label: "Employment", description: "Work details" },
  { label: "Property", description: "Rent details" },
  { label: "Documents", description: "Upload files" },
  { label: "Review", description: "Submit application" },
];

interface Application {
  id: string;
  status: string;
  annualRent: string;
  monthlyRent: string;
  requestedAmount: string;
  tenantContribution: string;
  leaseDuration: number;
  createdAt: string;
  submittedAt: string | null;
}

const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  draft: { label: "Draft", variant: "default" },
  submitted: { label: "Submitted", variant: "default" },
  verification: { label: "Under Verification", variant: "warning" },
  under_review: { label: "Under Review", variant: "warning" },
  additional_information_required: { label: "Info Required", variant: "danger" },
  approved: { label: "Approved", variant: "success" },
  declined: { label: "Declined", variant: "danger" },
  expired: { label: "Expired", variant: "danger" },
};

export default function ApplicationPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      annualRent: 0,
      leaseDuration: 12,
      tenantContribution: 0,
      requestedAmount: 0,
    },
  });

  const annualRent = watch("annualRent");
  const tenantContribution = watch("tenantContribution");
  const requestedAmount = watch("requestedAmount");

  React.useEffect(() => {
    async function load() {
      try {
        const res = await api.get<{ data: Application[] }>("/api/v1/applications/my");
        setApplications(res.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const activeApplication = applications.find(
    (a) => !["approved", "declined", "expired"].includes(a.status)
  );

  async function onSubmit(data: ApplicationForm) {
    setSubmitting(true);
    try {
      const monthlyRent = Math.round(data.annualRent / 12);
      await api.post("/api/v1/applications", {
        annualRent: data.annualRent,
        monthlyRent,
        leaseDuration: data.leaseDuration,
        tenantContribution: data.tenantContribution,
        requestedAmount: data.requestedAmount,
      });
      setCreated(true);
      // Reload applications
      const res = await api.get<{ data: Application[] }>("/api/v1/applications/my");
      setApplications(res.data);
    } catch (err: any) {
      alert(err.message || "Failed to create application");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitApplication(appId: string) {
    try {
      await api.post(`/api/v1/applications/${appId}/submit`);
      const res = await api.get<{ data: Application[] }>("/api/v1/applications/my");
      setApplications(res.data);
    } catch (err: any) {
      alert(err.message || "Failed to submit");
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <div className="h-4 w-48 animate-pulse rounded bg-[var(--color-surface)]" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded bg-[var(--color-surface)]" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Rent Financing Application</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Apply for rent financing to spread your rent into monthly payments.
        </p>
      </div>

      {/* Show existing applications */}
      {applications.length > 0 && !created && (
        <div className="space-y-4">
          {applications.map((app) => {
            const config = statusConfig[app.status] || statusConfig.draft;
            return (
              <Card key={app.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[var(--color-text)]">
                          Application #{app.id.slice(-6).toUpperCase()}
                        </h3>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
                        <span>Annual Rent: ₦{Number(app.annualRent).toLocaleString()}</span>
                        <span>Requested: ₦{Number(app.requestedAmount).toLocaleString()}</span>
                        <span>Duration: {app.leaseDuration} months</span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        Created: {new Date(app.createdAt).toLocaleDateString("en-NG")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === "draft" && (
                        <Button size="sm" onClick={() => submitApplication(app.id)}>
                          <Send className="h-4 w-4" />
                          Submit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* New application form or success */}
      {(!activeApplication || created) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {created ? "Application Created" : "New Application"}
            </CardTitle>
            {!created && (
              <CardDescription>
                Provide your rent details to create a financing application.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {created ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--color-success)]" />
                <h3 className="mt-4 text-lg font-semibold">Application Created!</h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  Your application is now in draft. Submit it when you&apos;re ready for review.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setCreated(false)}>
                    View Applications
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Annual Rent (₦)"
                  type="number"
                  placeholder="1200000"
                  {...register("annualRent")}
                  error={errors.annualRent?.message}
                />
                <Input
                  label="Lease Duration (months)"
                  type="number"
                  placeholder="12"
                  {...register("leaseDuration")}
                  error={errors.leaseDuration?.message}
                  hint="Most leases are 12 months"
                />
                <div className="border-t border-[var(--color-border)] pt-4">
                  <p className="mb-3 text-sm font-medium text-[var(--color-text)]">
                    Financing Details
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Your Contribution (₦)"
                      type="number"
                      placeholder="200000"
                      {...register("tenantContribution")}
                      error={errors.tenantContribution?.message}
                      hint="Amount you can pay upfront"
                    />
                    <Input
                      label="Requested Financing (₦)"
                      type="number"
                      placeholder="1000000"
                      {...register("requestedAmount")}
                      error={errors.requestedAmount?.message}
                    />
                  </div>
                </div>

                {/* Live preview */}
                {annualRent > 0 && (
                  <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <p className="text-sm font-medium text-[var(--color-text)]">Summary</p>
                    <div className="mt-2 space-y-1 text-sm text-[var(--color-text-secondary)]">
                      <div className="flex justify-between">
                        <span>Monthly Rent</span>
                        <span>₦{Math.round(annualRent / 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Contribution</span>
                        <span>₦{tenantContribution.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium text-[var(--color-text)]">
                        <span>Financing Needed</span>
                        <span>₦{requestedAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Monthly Payment</span>
                        <span>
                          ~₦{requestedAmount > 0 ? Math.round((requestedAmount * 1.12) / 12).toLocaleString() : 0}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-[var(--color-muted)]">
                      * Estimated. Final terms depend on approval.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Application"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
