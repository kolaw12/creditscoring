"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import {
  CreditCard,
  Wallet,
  Calendar,
  TrendingDown,
  CreditCard as PayIcon,
} from "lucide-react";

interface Loan {
  id: string;
  loanNumber: string;
  status: string;
  principalAmount: number;
  outstandingBalance: number;
  totalPayable: number;
  monthlyInstallment: number;
  disbursementDate?: string;
  offer?: {
    financingAmount: number;
    monthlyInstallment: number;
    repaymentPeriod: number;
  };
}

interface ScheduleItem {
  id: string;
  installmentNo: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  outstandingAmount: number;
  status: string;
  paidAt?: string;
}

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  active: "success",
  completed: "success",
  approved: "info",
  offer_accepted: "info",
  delinquent: "danger",
  defaulted: "danger",
  cancelled: "default",
  pending_disbursement: "warning",
};

export default function LoanPage() {
  const [loans, setLoans] = React.useState<Loan[]>([]);
  const [selectedLoan, setSelectedLoan] = React.useState<Loan | null>(null);
  const [schedule, setSchedule] = React.useState<ScheduleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scheduleLoading, setScheduleLoading] = React.useState(false);

  React.useEffect(() => {
    api.get<{ data: Loan[] }>("/api/v1/loans/my").then((res) => {
      setLoans(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    if (selectedLoan) {
      setScheduleLoading(true);
      api.get<{ data: ScheduleItem[] }>(`/api/v1/loans/${selectedLoan.id}/schedule`).then((res) => {
        setSchedule(res.data || []);
        setScheduleLoading(false);
      }).catch(() => setScheduleLoading(false));
    }
  }, [selectedLoan]);

  const activeLoan = loans.find((l) => ["active", "delinquent"].includes(l.status));

  React.useEffect(() => {
    if (activeLoan && !selectedLoan) setSelectedLoan(activeLoan);
  }, [activeLoan, selectedLoan]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 skeleton rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!loans.length) {
    return (
      <EmptyState
        icon={<CreditCard className="h-7 w-7" />}
        title="No Active Loans"
        description="Once your application is approved and you accept an offer, your loan will appear here."
      />
    );
  }

  const totalPaid = selectedLoan
    ? selectedLoan.principalAmount - selectedLoan.outstandingBalance
    : 0;
  const progressPercent = selectedLoan
    ? ((selectedLoan.principalAmount - selectedLoan.outstandingBalance) / selectedLoan.principalAmount) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">My Loan</h1>
        {loans.length > 1 && (
          <select
            className="text-sm border border-[var(--color-border)] rounded-lg px-3 py-2"
            value={selectedLoan?.id || ""}
            onChange={(e) => setSelectedLoan(loans.find((l) => l.id === e.target.value) || null)}
          >
            {loans.map((l) => (
              <option key={l.id} value={l.id}>{l.loanNumber}</option>
            ))}
          </select>
        )}
      </div>

      {selectedLoan && (
        <>
          {/* Loan Summary Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Loan Amount"
              value={`₦${selectedLoan.principalAmount.toLocaleString()}`}
              icon={<CreditCard className="h-5 w-5" />}
            />
            <StatCard
              label="Outstanding"
              value={`₦${selectedLoan.outstandingBalance.toLocaleString()}`}
              icon={<TrendingDown className="h-5 w-5" />}
              trend={selectedLoan.outstandingBalance > 0 ? "down" : "flat"}
              trendValue={selectedLoan.outstandingBalance > 0 ? "Remaining" : "Paid off"}
            />
            <StatCard
              label="Monthly Payment"
              value={`₦${selectedLoan.monthlyInstallment.toLocaleString()}`}
              icon={<Calendar className="h-5 w-5" />}
            />
            <StatCard
              label="Status"
              value={selectedLoan.status.replace(/_/g, " ")}
              icon={<Wallet className="h-5 w-5" />}
            />
          </div>

          {/* Repayment Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Repayment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-2">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  ₦{totalPaid.toLocaleString()} paid of ₦{selectedLoan.principalAmount.toLocaleString()}
                </p>
                <p className="text-sm font-bold text-[var(--color-accent)]">
                  {Math.round(progressPercent)}%
                </p>
              </div>
              <ProgressBar
                value={progressPercent}
                size="lg"
                color={progressPercent >= 100 ? "success" : "accent"}
              />
            </CardContent>
          </Card>

          {/* Payment Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {scheduleLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton rounded" />)}
                </div>
              ) : schedule.length === 0 ? (
                <p className="text-sm text-[var(--color-text-tertiary)] py-4">No schedule available</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border-light)]">
                        <th className="text-left py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">#</th>
                        <th className="text-left py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Due Date</th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Amount</th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Paid</th>
                        <th className="text-right py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.map((item) => (
                        <tr key={item.id} className="border-b border-[var(--color-border-light)] last:border-0">
                          <td className="py-3 px-3 font-medium text-[var(--color-text)]">{item.installmentNo}</td>
                          <td className="py-3 px-3 text-[var(--color-text-secondary)]">
                            {new Date(item.dueDate).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="py-3 px-3 text-right font-medium text-[var(--color-text)]">
                            ₦{item.amountDue.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-[var(--color-text-secondary)]">
                            ₦{item.amountPaid.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Badge variant={item.status === "paid" ? "success" : item.status === "late" ? "danger" : item.status === "partial" ? "warning" : "secondary"}>
                              {item.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
