"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { NotificationBell } from "@/components/ui/notification-bell";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Wallet,
  FolderOpen,
  User,
  LifeBuoy,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Application", href: "/dashboard/application", icon: FileText },
  { label: "My Loan", href: "/dashboard/loan", icon: CreditCard },
  { label: "Payments", href: "/dashboard/payments", icon: Wallet },
  { label: "Documents", href: "/dashboard/documents", icon: FolderOpen },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Support", href: "/dashboard/support", icon: LifeBuoy },
];

interface DashboardNavProps {
  user: { firstName: string; lastName: string; email: string } | null;
  onLogout: () => void;
}

export function DashboardNav({ user, onLogout }: DashboardNavProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[var(--color-border-light)] shadow-[var(--shadow-xs)] lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-[var(--color-text)]" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-accent)]">
              <span className="text-[10px] font-bold text-white">R</span>
            </div>
            <span className="text-sm font-bold text-[var(--color-text)]">
              Rent<span className="text-[var(--color-accent)]">Fin</span>
            </span>
          </Link>
          <NotificationBell />
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-[var(--color-primary)] flex flex-col anim-slide-left">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
              <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
                  <span className="text-xs font-bold text-white">R</span>
                </div>
                <span className="text-base font-bold text-white">
                  Rent<span className="text-[var(--color-accent)]">Fin</span>
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                    {item.label}
                    {active && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3">
                <Avatar
                  firstName={user?.firstName}
                  lastName={user?.lastName}
                  size="sm"
                  className="bg-white/10 text-white"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-white/40 truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="mt-3 flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-[var(--color-primary)] border-r border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-16 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <span className="text-xs font-bold text-white">R</span>
            </div>
            <span className="text-base font-bold text-white">
              Rent<span className="text-[var(--color-accent)]">Fin</span>
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 flex-shrink-0" />
                  {item.label}
                  {active && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Avatar
                firstName={user?.firstName}
                lastName={user?.lastName}
                size="sm"
                className="bg-white/10 text-white"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-white/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="mt-3 flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
