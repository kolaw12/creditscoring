import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Clock, Users, Lock, ArrowUpRight } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#060C10] text-slate-100 font-sans selection:bg-[#CCFF00] selection:text-black">
      
      {/* Left panel — Debitum Brand & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 debitum-hero-bg relative overflow-hidden border-r border-slate-800/80 p-12 flex-col justify-between">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#CCFF00]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-black fill-current">
                <path d="M12 2L4 12l8 10 8-10L12 2zm0 4.5l4.5 5.5L12 17.5 7.5 12 12 6.5z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Rent<span className="text-[#CCFF00]">Fin</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1A24] border border-slate-700/80 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
            SECURE HOUSING PLATFORM
          </span>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto py-12">
          <div className="space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#CCFF00]">
              RENTER FREEDOM
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Rent Financing Designed For Modern Tenants
            </h1>
            <p className="text-base text-slate-400 font-normal leading-relaxed">
              Split your annual rent into flexible, predictable monthly payments. Zero saving depletion, direct landlord wire, and decisions in under 24 hours.
            </p>
          </div>

          {/* 4 Trust Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-[#0C1A24]/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-[#CCFF00]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold text-white">CBN Licensed</span>
              </div>
              <p className="text-[11px] text-slate-400">Fully regulated financial platform</p>
            </div>

            <div className="bg-[#0C1A24]/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-[#CCFF00]">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold text-white">24-Hour Approval</span>
              </div>
              <p className="text-[11px] text-slate-400">Fast digital application review</p>
            </div>

            <div className="bg-[#0C1A24]/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-[#CCFF00]">
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold text-white">12,500+ Tenants</span>
              </div>
              <p className="text-[11px] text-slate-400">Trusted across major Nigerian cities</p>
            </div>

            <div className="bg-[#0C1A24]/90 p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-[#CCFF00]">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold text-white">256-Bit SSL</span>
              </div>
              <p className="text-[11px] text-slate-400">Bank-grade data encryption</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer note */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-6 border-t border-slate-800/80">
          <p>&copy; {new Date().getFullYear()} RentFin Technologies Inc.</p>
          <Link href="/" className="text-slate-400 hover:text-[#CCFF00] flex items-center gap-1 transition-colors">
            Back to home <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Right panel — High-contrast Dark Form Container */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 bg-[#08131B]">
        <div className="w-full max-w-md space-y-8">
          {children}
        </div>
      </div>

    </div>
  );
}
