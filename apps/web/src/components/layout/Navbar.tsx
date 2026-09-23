"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Protection Plus", href: "#protection" },
  { label: "Invest", href: "#calculator" },
  { label: "Statistics", href: "#statistics" },
  { label: "Media", href: "#media" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-5 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        
        {/* Debitum Brand Icon Logo (Left Quadrant) */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-black fill-current">
              <path d="M12 2L4 12l8 10 8-10L12 2zm0 4.5l4.5 5.5L12 17.5 7.5 12 12 6.5z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:inline-block">
            RentFin
          </span>
        </Link>

        {/* Center Pill Capsule Navigation Bar (Debitum Exact Center Header) */}
        <nav className="hidden md:flex items-center gap-7 px-8 py-2.5 rounded-full debitum-nav-pill">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action: Debitum Electric Lime Register Pill Button */}
        <div className="flex items-center gap-3">
          <Link href="/signup">
            <button className="debitum-lime-btn cursor-pointer">
              <span>Register</span>
              <span className="debitum-lime-btn-icon">
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
              </span>
            </button>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-[#0C1A24] border border-slate-700 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden bg-[#060C10]/98 backdrop-blur-md pt-8 px-6 space-y-4">
          {/* Close Button at Top Right */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-black fill-current">
                  <path d="M12 2L4 12l8 10 8-10L12 2zm0 4.5l4.5 5.5L12 17.5 7.5 12 12 6.5z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Rent<span className="text-[#CCFF00]">Fin</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C1A24] border border-slate-600 text-white hover:border-[#CCFF00] transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 border-b border-slate-800 text-lg font-bold text-white hover:text-[#CCFF00] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 space-y-3">
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <button className="w-full py-3 rounded-full bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-colors">
                Log In
              </button>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <button className="w-full py-3 rounded-full bg-[#CCFF00] text-black font-bold text-sm hover:bg-[#b8e600] transition-colors">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
