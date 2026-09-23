"use client";

import * as React from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  subject: string | null;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get<{ data: Notification[] }>("/api/v1/notifications?limit=50").then((res) => {
      setNotifications(res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const markRead = async (id: string) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      );
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.patch("/api/v1/notifications/read-all");
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() }))
      );
    } catch {}
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 skeleton rounded" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 skeleton rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs font-bold text-white">
                {unreadCount}
              </span>
            )}
          </h1>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-7 w-7" />}
          title="No Notifications"
          description="You're all caught up. Notifications about your application and payments will appear here."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--color-border-light)]">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.readAt && markRead(n.id)}
                  className={cn(
                    "w-full text-left px-5 py-4 transition-colors hover:bg-gray-50",
                    !n.readAt && "bg-[var(--color-accent-light)]/20"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {!n.readAt && (
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      {n.subject && (
                        <p className="text-sm font-semibold text-[var(--color-text)] mb-0.5">
                          {n.subject}
                        </p>
                      )}
                      <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                        {n.body}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1.5">
                        {new Date(n.createdAt).toLocaleDateString("en-NG", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
