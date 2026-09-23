"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
    if (!isLoading && isAuthenticated && user && !["admin", "super_admin", "credit_officer", "operations", "finance", "collections_officer"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
          <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[var(--color-border-light)] shadow-[var(--shadow-xs)] lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <button onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100">
            <Menu className="h-5 w-5 text-[var(--color-text)]" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-primary)]">
              <span className="text-[10px] font-bold text-white">R</span>
            </div>
            <span className="text-sm font-bold text-[var(--color-text)]">
              Rent<span className="text-[var(--color-accent)]">Fin</span>
              <span className="ml-1.5 text-xs font-medium text-[var(--color-text-tertiary)]">Admin</span>
            </span>
          </Link>
          <div className="w-9" />
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-[var(--color-primary)] flex flex-col anim-slide-left">
            <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
              <span className="text-base font-bold text-white">Admin Panel</span>
              <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10">
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>
            <nav className="flex-1 py-4 px-3 space-y-0.5">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive(item.href) ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                  )}>
                  <item.icon className="h-4.5 w-4.5" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3">
                <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" className="bg-white/10 text-white" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-white/40 capitalize">{user.role.replace(/_/g, " ")}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10">
                  User View <ArrowUpRight className="h-3 w-3" />
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-[var(--color-primary)]">
          <div className="flex items-center gap-2.5 px-5 h-16 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <span className="text-xs font-bold text-white">R</span>
            </div>
            <span className="text-base font-bold text-white">
              Rent<span className="text-[var(--color-accent)]">Fin</span>
              <span className="ml-1.5 text-xs font-medium text-white/40">Admin</span>
            </span>
          </div>
          <nav className="flex-1 py-4 px-3 space-y-0.5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive(item.href) ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                )}>
                <item.icon className="h-4.5 w-4.5" />
                {item.label}
                {isActive(item.href) && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />}
              </Link>
            ))}
          </nav>
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" className="bg-white/10 text-white" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-white/40 capitalize">{user.role.replace(/_/g, " ")}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 border border-white/10">
                User View <ArrowUpRight className="h-3 w-3" />
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="pt-14 lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
