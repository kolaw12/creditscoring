"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { StatCard } from "@/components/ui/stat-card";
import { Wallet, Receipt, CheckCircle2 } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  status: string;
  paymentMethod?: string;
  provider?: string;
  createdAt: string;
  loan?: { loanNumber: string };
  repaymentSchedule?: { installmentNo: number; dueDate: string };
}

const statusColors: Record<string, "success" | "warning" | "danger" | "info"> = {
  successful: "success",
  completed: "success",
  pending: "warning",
  failed: "danger",
  processing: "info",
};

export default function PaymentsPage() {
  const [payments, setPayments] = React.useState<Payment[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get<{ data: Payment[] }>("/api/v1/payments/history").then((res) => {
      setPayments(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalPaid = payments
    .filter((p) => p.status === "successful" || p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 skeleton rounded" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Payments</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={`₦${totalPaid.toLocaleString()}`}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Transactions"
          value={payments.length}
          icon={<Receipt className="h-5 w-5" />}
        />
        <StatCard
          label="Successful"
          value={payments.filter((p) => p.status === "successful" || p.status === "completed").length}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <EmptyState
              icon={<Wallet className="h-7 w-7" />}
              title="No Payments Yet"
              description="Your payment history will appear here once you make your first payment."
            />
          ) : (
            <div className="divide-y divide-[var(--color-border-light)]">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface)]">
                      <Receipt className="h-4.5 w-4.5 text-[var(--color-text-tertiary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {payment.repaymentSchedule
                          ? `Installment #${payment.repaymentSchedule.installmentNo}`
                          : "Repayment"}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        {new Date(payment.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {payment.provider && ` · ${payment.provider}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[var(--color-text)]">
                      -₦{payment.amount.toLocaleString()}
                    </p>
                    <Badge variant={statusColors[payment.status] || "secondary"} size="sm">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
