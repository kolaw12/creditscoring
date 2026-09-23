"use client";

import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";

interface Application {
  id: string;
  status: string;
  requestedAmount: number;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
}

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  submitted: "info",
  under_review: "warning",
  approved: "success",
  declined: "danger",
  verification: "info",
  draft: "default",
};

export default function AdminDashboard() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [allApps, setAllApps] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      api.get<{ data: Application[] }>("/api/v1/applications/admin/all?limit=5"),
      api.get<{ data: Application[] }>("/api/v1/applications/admin/all?limit=100"),
    ]).then(([recent, all]) => {
      setApplications(recent.data || []);
      setAllApps(all.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = React.useMemo(() => ({
    total: allApps.length,
    pending: allApps.filter((a) => ["submitted", "under_review", "verification"].includes(a.status)).length,
    approved: allApps.filter((a) => a.status === "approved").length,
    declined: allApps.filter((a) => a.status === "declined").length,
  }), [allApps]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 skeleton rounded" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applications" value={stats.total} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Pending Review" value={stats.pending} icon={<Clock className="h-5 w-5" />} trend="down" trendValue={`${stats.pending} awaiting`} />
        <StatCard label="Approved" value={stats.approved} icon={<CheckCircle2 className="h-5 w-5" />} />
        <StatCard label="Declined" value={stats.declined} icon={<XCircle className="h-5 w-5" />} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Link href="/admin/applications">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border-light)]">
                  <th className="text-left py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Applicant</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Amount</th>
                  <th className="text-center py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-3 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-[var(--color-border-light)] last:border-0">
                    <td className="py-3 px-3">
                      <p className="font-medium text-[var(--color-text)]">{app.user?.firstName} {app.user?.lastName}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{app.user?.email}</p>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-[var(--color-text)]">₦{app.requestedAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={statusColors[app.status] || "default"}>{app.status.replace(/_/g, " ")}</Badge>
                    </td>
                    <td className="py-3 px-3 text-right text-[var(--color-text-tertiary)]">
                      {new Date(app.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
