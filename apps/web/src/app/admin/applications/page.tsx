"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Eye, CheckCircle2, XCircle, FileText } from "lucide-react";

interface Application {
  id: string;
  status: string;
  annualRent: number;
  requestedAmount: number;
  tenantContribution: number;
  leaseDuration: number;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
  riskAssessment?: { riskLevel: string; recommendation: string; riskScore: number };
}

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  submitted: "info",
  under_review: "warning",
  approved: "success",
  declined: "danger",
  verification: "info",
  draft: "default",
  additional_information_required: "warning",
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);
  const [actionNote, setActionNote] = React.useState("");
  const [acting, setActing] = React.useState(false);

  const fetchApps = React.useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (filter !== "all") params.set("status", filter);
    if (search) params.set("search", search);
    api.get<{ data: Application[] }>(`/api/v1/applications/admin/all?${params}`).then((res) => {
      setApplications(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filter, search]);

  React.useEffect(() => { fetchApps(); }, [fetchApps]);

  const handleAction = async (status: "approved" | "declined") => {
    if (!selectedApp) return;
    setActing(true);
    try {
      await api.patch(`/api/v1/applications/admin/${selectedApp.id}/status`, { status, note: actionNote || undefined });
      setSelectedApp(null);
      setActionNote("");
      fetchApps();
    } catch {}
    setActing(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Applications</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-tertiary)]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-[var(--color-border)] bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 focus:border-[var(--color-accent)]"
          />
        </div>
        <div className="flex gap-2">
          {["all", "submitted", "under_review", "approved", "declined"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                filter === s
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-gray-50"
              }`}
            >
              {s === "all" ? "All" : s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 skeleton rounded" />)}
            </div>
          ) : applications.length === 0 ? (
            <EmptyState icon={<FileText className="h-7 w-7" />} title="No applications found" description="No applications match your current filters." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-light)]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Applicant</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Amount</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Risk</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Date</th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-[var(--color-text)]">{app.user?.firstName} {app.user?.lastName}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{app.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[var(--color-text)]">₦{app.requestedAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        {app.riskAssessment ? (
                          <Badge variant={app.riskAssessment.riskLevel === "low" ? "success" : app.riskAssessment.riskLevel === "moderate" ? "warning" : "danger"}>
                            {app.riskAssessment.riskLevel}
                          </Badge>
                        ) : (
                          <span className="text-xs text-[var(--color-text-tertiary)]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={statusColors[app.status] || "default"}>{app.status.replace(/_/g, " ")}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--color-text-tertiary)]">
                        {new Date(app.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="icon-sm" onClick={() => setSelectedApp(app)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Modal open={!!selectedApp} onOpenChange={(open) => { if (!open) setSelectedApp(null); }}>
        <ModalContent size="lg">
          {selectedApp && (
            <>
              <ModalHeader>
                <ModalTitle>Application Details</ModalTitle>
                <ModalDescription>
                  {selectedApp.user?.firstName} {selectedApp.user?.lastName} &middot; {selectedApp.user?.email}
                </ModalDescription>
              </ModalHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-tertiary)]">Annual Rent</p>
                    <p className="text-lg font-bold text-[var(--color-text)]">₦{selectedApp.annualRent.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-tertiary)]">Requested</p>
                    <p className="text-lg font-bold text-[var(--color-text)]">₦{selectedApp.requestedAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-tertiary)]">Contribution</p>
                    <p className="text-lg font-bold text-[var(--color-text)]">₦{selectedApp.tenantContribution.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-tertiary)]">Duration</p>
                    <p className="text-lg font-bold text-[var(--color-text)]">{selectedApp.leaseDuration} months</p>
                  </div>
                </div>
                {selectedApp.riskAssessment && (
                  <div className="p-3 bg-[var(--color-surface)] rounded-lg">
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Risk Assessment</p>
                    <div className="flex items-center gap-3">
                      <Badge variant={selectedApp.riskAssessment.riskLevel === "low" ? "success" : selectedApp.riskAssessment.riskLevel === "moderate" ? "warning" : "danger"}>
                        {selectedApp.riskAssessment.riskLevel}
                      </Badge>
                      <span className="text-sm text-[var(--color-text-secondary)]">Score: {(selectedApp.riskAssessment.riskScore * 100).toFixed(0)}%</span>
                      <span className="text-sm text-[var(--color-text-secondary)]">Recommendation: {selectedApp.riskAssessment.recommendation}</span>
                    </div>
                  </div>
                )}
                <Input
                  label="Note (optional)"
                  placeholder="Add a note for this action..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                />
              </div>
              <ModalFooter>
                <Button variant="ghost" onClick={() => setSelectedApp(null)}>Close</Button>
                {["submitted", "under_review", "verification", "additional_information_required"].includes(selectedApp.status) && (
                  <>
                    <Button variant="danger" onClick={() => handleAction("declined")} disabled={acting}>
                      <XCircle className="h-4 w-4" /> Decline
                    </Button>
                    <Button onClick={() => handleAction("approved")} disabled={acting}>
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </Button>
                  </>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
