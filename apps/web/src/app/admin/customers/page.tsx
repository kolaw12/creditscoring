"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Avatar } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get<{ data: any[] }>("/api/v1/applications/admin/all?limit=100").then((res) => {
      const map = new Map<string, Customer>();
      (res.data || []).forEach((app: any) => {
        if (app.user && !map.has(app.user.id)) {
          map.set(app.user.id, {
            firstName: app.user.firstName,
            lastName: app.user.lastName,
            email: app.user.email,
            phone: app.user.phone,
            status: app.user.status,
          });
        }
      });
      setCustomers(Array.from(map.values()));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Customers</h1>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-14 skeleton rounded" />)}
            </div>
          ) : customers.length === 0 ? (
            <EmptyState icon={<Users className="h-7 w-7" />} title="No customers yet" description="Customers will appear here once they sign up." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border-light)]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Phone</th>
                    <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.email} className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar firstName={c.firstName} lastName={c.lastName} size="sm" />
                          <span className="font-medium text-[var(--color-text)]">{c.firstName} {c.lastName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{c.email}</td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{c.phone || "—"}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={c.status === "active" ? "success" : "secondary"}>
                          {c.status || "active"}
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
    </div>
  );
}
