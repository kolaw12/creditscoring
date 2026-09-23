"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const channels = [
  {
    icon: Mail,
    title: "Email Support",
    detail: "support@rentfin.ng",
    sub: "Response within 24 hours",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Phone,
    title: "Phone Support",
    detail: "+234 800 RENTFIN",
    sub: "Mon-Fri, 9am-5pm WAT",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: MapPin,
    title: "Office",
    detail: "Lagos, Nigeria",
    sub: "Visit by appointment",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    title: "Response Time",
    detail: "Within 24 hours",
    sub: "For all support channels",
    color: "bg-amber-100 text-amber-600",
  },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Support</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          We&apos;re here to help. Reach out through any of these channels.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {channels.map((ch) => (
          <Card key={ch.title} hover className="p-5">
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ch.color}`}>
                <ch.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{ch.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{ch.detail}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{ch.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
