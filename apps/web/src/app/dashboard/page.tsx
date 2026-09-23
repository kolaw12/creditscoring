"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import {
  ArrowRight,
  FileText,
  CreditCard,
  Clock,
  User,
  Wallet,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

interface Application {
  id: string;
  status: string;
  annualRent: number;
  requestedAmount: number;
  createdAt: string;
}

interface Completion {
  steps: Record<string, boolean>;
  completedSteps: number;
  totalSteps: number;
  completionPercent: number;
}

export default function DashboardHome() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [completion, setCompletion] = React.useState<Completion | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showProfileModal, setShowProfileModal] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      api.get<{ data: Application[] }>("/api/v1/applications/my").catch(() => ({ data: [] })),
      api.get<{ data: Completion }>("/api/v1/tenants/profile/status").catch(() => ({ data: null })),
    ]).then(([apps, comp]) => {
      setApplications(apps.data || []);
      setCompletion(comp.data);
      setLoading(false);

      // Trigger Profile Completion Modal if profile is incomplete (< 100%)
      if (comp.data && comp.data.completionPercent < 100) {
        setShowProfileModal(true);
      }
    });
  }, []);

  const activeApp = applications.find((a) => !["declined", "cancelled"].includes(a.status));
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800 animate-pulse rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-800 animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="h-48 bg-slate-800 animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ═══════════════════════════════════════════════════════════════
          POPUP MODAL: COMPLETE YOUR PROFILE ON LOGIN
      ═══════════════════════════════════════════════════════════════ */}
      <Modal open={showProfileModal} onOpenChange={setShowProfileModal}>
        <ModalContent size="md">
          <ModalHeader>
            <div className="w-12 h-12 rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00] flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <ModalTitle>Action Required: Complete Your Profile</ModalTitle>
            <ModalDescription>
              To access annual rent financing and unlock 24-hour direct landlord payouts, please complete your profile details.
            </ModalDescription>
          </ModalHeader>

          <div className="py-4 space-y-4">
            <div className="bg-[#070D12] p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Profile Completion Status</span>
                <span className="text-[#CCFF00] font-mono font-bold">{completion?.completionPercent || 0}%</span>
              </div>
              <ProgressBar
                value={completion?.completionPercent || 0}
                size="md"
              />
              <p className="text-xs text-slate-400 pt-1">
                Completed {completion?.completedSteps || 0} of {completion?.totalSteps || 5} onboarding steps.
              </p>
            </div>
          </div>

          <ModalFooter>
            <button
              type="button"
              onClick={() => setShowProfileModal(false)}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Remind Me Later
            </button>
            <Link href="/dashboard/profile">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#CCFF00]/20"
              >
                Complete Profile Now <ArrowUpRight className="w-4 h-4" />
              </button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">
          {greeting}, {user?.firstName}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Here&apos;s what&apos;s happening with your rent financing.
        </p>
      </div>

      {/* Active Financing Card */}
      {activeApp ? (
        <Card className="debitum-loan-card border-slate-800 text-white overflow-hidden">
          <CardContent className="p-6 lg:p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-[#CCFF00] font-mono uppercase tracking-wider mb-1">Active Application</p>
                <h2 className="text-3xl font-black text-white font-mono">₦{activeApp.annualRent.toLocaleString()}</h2>
                <p className="text-sm text-slate-400 mt-1">Annual rent financing</p>
              </div>
              <Badge
                variant={
                  activeApp.status === "approved"
                    ? "success"
                    : activeApp.status === "submitted"
                    ? "info"
                    : "warning"
                }
                className="text-xs px-3 py-1"
              >
                {activeApp.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-slate-800/80">
              <div>
                <p className="text-xs text-slate-500">Requested</p>
                <p className="text-base font-bold font-mono text-white">₦{activeApp.requestedAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-base font-bold capitalize text-white">{activeApp.status.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Applied</p>
                <p className="text-base font-bold text-white">{new Date(activeApp.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}</p>
              </div>
            </div>
            <Link href="/dashboard/application">
              <button className="h-10 px-5 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
                View Application Detail <ArrowUpRight className="h-4 w-4 text-[#CCFF00]" />
              </button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-slate-800 bg-[#0C1A24]/60">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#CCFF00]/10 text-[#CCFF00]">
              <Plus className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Ready to finance your rent?
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Apply for rent financing and receive 100% upfront landlord disbursement.
            </p>
            <Link href="/dashboard/application">
              <button className="h-11 px-7 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs inline-flex items-center gap-2 transition-all cursor-pointer">
                Start Application <ArrowUpRight className="h-4 w-4" />
              </button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Applications"
          value={applications.length}
          icon={<FileText className="h-5 w-5 text-[#CCFF00]" />}
        />
        <StatCard
          label="Profile"
          value={`${completion?.completionPercent || 0}%`}
          icon={<User className="h-5 w-5 text-[#CCFF00]" />}
          trend={completion && completion.completionPercent === 100 ? "flat" : "down"}
          trendValue={completion && completion.completionPercent === 100 ? "Complete" : "Incomplete"}
        />
        <StatCard
          label="Active Loans"
          value="0"
          icon={<CreditCard className="h-5 w-5 text-[#CCFF00]" />}
        />
        <StatCard
          label="Next Payment"
          value="—"
          icon={<Clock className="h-5 w-5 text-[#CCFF00]" />}
        />
      </div>

      {/* Profile Completion Card */}
      {completion && completion.completionPercent < 100 && (
        <Card>
          <CardHeader>
            <CardTitle>Complete your profile</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar
              value={completion.completionPercent}
              label={`${completion.completedSteps} of ${completion.totalSteps} steps completed`}
              size="lg"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              {!completion.steps.personalInfo && (
                <Link href="/dashboard/profile">
                  <Button variant="secondary" size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#CCFF00]" />
                    Personal Info
                  </Button>
                </Link>
              )}
              {!completion.steps.employment && (
                <Link href="/dashboard/employment">
                  <Button variant="secondary" size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#CCFF00]" />
                    Employment
                  </Button>
                </Link>
              )}
              {!completion.steps.application && (
                <Link href="/dashboard/application">
                  <Button variant="secondary" size="sm" className="bg-slate-800 text-white hover:bg-slate-700">
                    <FileText className="h-3.5 w-3.5 text-[#CCFF00]" />
                    Application
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/dashboard/payments" className="block">
          <Card hover className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-[#CCFF00]">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Payments</p>
                <p className="text-xs text-slate-400">View transaction history</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/documents" className="block">
          <Card hover className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-[#CCFF00]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Documents</p>
                <p className="text-xs text-slate-400">Manage your files</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/support" className="block">
          <Card hover className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-[#CCFF00]">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Support</p>
                <p className="text-xs text-slate-400">Get help when you need it</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

    </div>
  );
}
