"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RentCalculator } from "@/components/ui/RentCalculator";
import {
  ArrowUpRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  Award,
  Users,
  PieChart,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Home,
  CheckCircle2,
  Lock,
} from "lucide-react";

// Top Left Quadrant: 4 White Rounded Stat Cards
const statCards = [
  {
    icon: (
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-extrabold text-sm">
        ₦
      </div>
    ),
    value: "₦4.8B+",
    label: "Amount Funded",
  },
  {
    icon: (
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
        <Users className="w-4 h-4" />
      </div>
    ),
    value: "12,500+",
    label: "Active Tenants",
  },
  {
    icon: (
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
        <TrendingUp className="w-4 h-4" />
      </div>
    ),
    value: "9.7%",
    label: "Average Subsidy",
  },
  {
    icon: (
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
        <ShieldCheck className="w-4 h-4" />
      </div>
    ),
    value: "100%",
    label: "Secured Leases",
  },
];

// Top Right Quadrant: Real Estate Financing Opportunities
const loanOpportunities = [
  {
    title: "Lekki Luxury Apartment Lease",
    location: "Lekki Phase 1, Lagos",
    image: "/luxury_apartment.png",
    description: "Verified luxury apartment building in Lekki Phase 1. Annual rent paid 100% upfront directly to landlord.",
    annualReturn: "10.2%",
    term: "12 months",
    repaymentIn: "365 days",
    penalty: "+5.00 %",
    targetAmount: "₦15,000,000",
    fundedAmount: "₦18,000,000",
    progressPercent: 120,
  },
  {
    title: "Victoria Island Executive Suite",
    location: "Victoria Island, Lagos",
    image: "/living_room.png",
    description: "Asset-backed residential credit line to corporate property managers in Victoria Island.",
    annualReturn: "8.5%",
    term: "12 months",
    repaymentIn: "365 days",
    penalty: "+5.00 %",
    targetAmount: "₦25,000,000",
    fundedAmount: "₦25,000,000",
    progressPercent: 100,
  },
];

const newsArticles = [
  {
    number: "01",
    title: "Temporary Suspension of Card Payment Option for Direct Wire",
    description:
      "This necessary measure is intended to facilitate important technical enhancements aimed at improving the reliability, security, and efficiency of our rent payout infrastructure.",
  },
  {
    number: "02",
    title: "RentFin Reaches ₦4.8 Billion In Total Financed Annual Leases",
    description:
      "Our quarter-three financial disclosures highlight key metrics, institutional partner integration, and expanding housing accessibility across major urban centers.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#060C10] min-h-screen font-sans text-slate-100 antialiased selection:bg-[#CCFF00] selection:text-black">
      <Navbar />

      <main className="pt-24 sm:pt-28 space-y-16">
        
        {/* ═══════════════════════════════════════════════════════════════
            QUADRANT 1 & 2: TOP HERO & LIVE REAL ESTATE OPPORTUNITIES GRID
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: HERO HEADLINE + REAL ESTATE IMAGE CARD + STATS */}
            <div className="lg:col-span-7 space-y-8 debitum-hero-bg p-6 sm:p-10 rounded-[2.5rem] border border-slate-800/80">
              
              {/* Top Pill Badge */}
              <div className="text-center pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0C1A24] border border-slate-700/70 text-slate-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                  SECURE RETURNS, REAL RENT HOUSING
                </span>
              </div>

              {/* Main Bold Hero Text */}
              <div className="text-center max-w-xl mx-auto space-y-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
                  Invest in Safe, Collateral-Backed Rents Across Nigeria
                </h1>
                <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-lg mx-auto">
                  Get stable returns by financing real-world annual rents. We pay landlords 100% upfront while tenants repay in flexible monthly installments.
                </p>
              </div>

              {/* Real Estate Featured Banner Image */}
              <div className="relative w-full h-56 sm:h-72 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
                <Image
                  src="/luxury_apartment.png"
                  alt="Luxury Apartment Rent Home"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060C10] via-[#060C10]/40 to-transparent flex items-end p-6">
                  <div className="flex justify-between items-center w-full">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#CCFF00] text-black">
                        FEATURED PROPERTY
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">Lekki Phase 1 Waterfront Apartments</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#CCFF00] bg-[#060C10]/80 px-3 py-1.5 rounded-full border border-slate-700">
                      ₦4.5M/yr Financed
                    </span>
                  </div>
                </div>
              </div>

              {/* Double Pill CTA Row */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/signup">
                  <button className="debitum-primary-btn cursor-pointer">
                    <span>Start Financing</span>
                    <span className="debitum-primary-btn-icon">
                      <ArrowUpRight className="w-5 h-5 stroke-[3]" />
                    </span>
                  </button>
                </Link>

                <a href="#calculator">
                  <button className="debitum-outline-btn cursor-pointer">
                    Rent Calculator
                  </button>
                </a>
              </div>

              {/* 4 White Rounded Stat Cards */}
              <div className="pt-6 border-t border-slate-800/80">
                <p className="text-sm font-bold text-white mb-4">
                  RentFin Investments In Numbers
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {statCards.map((stat, idx) => (
                    <div key={idx} className="debitum-white-stat-card space-y-3">
                      <div className="flex items-center justify-between">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight font-mono">
                          {stat.value}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: REAL ESTATE LEASE OPPORTUNITIES */}
            <div className="lg:col-span-5 space-y-6 bg-[#08131B] p-6 sm:p-8 rounded-[2.5rem] border border-slate-800/80">
              
              <div className="flex items-center justify-end">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1A24] border border-slate-700/80 text-xs font-semibold text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                  VERIFIED HOMES
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Finance Verified Rents From Trusted Property Managers
              </h2>

              {/* Loan Cards with Property Images */}
              <div className="space-y-4">
                {loanOpportunities.map((loan, idx) => (
                  <div key={idx} className="debitum-loan-card space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-700 flex-shrink-0">
                        <Image
                          src={loan.image}
                          alt={loan.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">{loan.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3.5 h-3.5 text-[#CCFF00]" /> {loan.location}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {loan.description}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800/60">
                      <div>
                        <span className="text-slate-500 font-medium block">Annual Return</span>
                        <span className="text-white font-bold font-mono text-sm">{loan.annualReturn}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Term</span>
                        <span className="text-white font-bold text-sm">{loan.term}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Repayment in</span>
                        <span className="text-white font-bold text-sm">{loan.repaymentIn}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">Penalty Rate</span>
                        <span className="text-[#CCFF00] font-bold text-sm">{loan.penalty}</span>
                      </div>
                    </div>

                    {/* Funding Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-300 font-bold">{loan.targetAmount}</span>
                        <span className="text-[#CCFF00] font-bold">{loan.progressPercent}% target</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-[#CCFF00] rounded-full"
                          style={{ width: `${Math.min(loan.progressPercent, 100)}%` }}
                        />
                      </div>
                    </div>

                    <button className="w-full h-11 rounded-full bg-[#CCFF00] hover:bg-[#b8e600] text-black font-extrabold text-xs transition-colors cursor-pointer">
                      Apply / Invest Now
                    </button>
                  </div>
                ))}
              </div>

            </div>

          </div>

        </section>

        {/* ═══════════════════════════════════════════════════════════════
            QUADRANT 3 & 4: LOWER CONTENT GRID (LIGHT vs DARK PANELS)
        ═══════════════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            
            {/* BOTTOM LEFT QUADRANT: WHITE BG CARD SECTION */}
            <div className="lg:col-span-6 bg-white text-slate-900 p-8 sm:p-12 rounded-[2.5rem] space-y-8 flex flex-col justify-between shadow-2xl">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  WHY CHOOSE RENTFIN
                </span>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  For Tenants & Investors Seeking Transparent Growth.
                </h2>
              </div>

              {/* 3D Interior Living Room Image Banner */}
              <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <Image
                  src="/living_room.png"
                  alt="Modern Luxury Apartment Living Room"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                  <p className="text-xs font-bold text-white">
                    Premium living spaces financed seamlessly with 0% upfront saving strain.
                  </p>
                </div>
              </div>

              {/* Rent Calculator Integration */}
              <div className="pt-4 border-t border-slate-200">
                <RentCalculator />
              </div>
            </div>

            {/* BOTTOM RIGHT QUADRANT: DARK BG NEWS SECTION */}
            <div className="lg:col-span-6 bg-[#08131B] text-white p-8 sm:p-12 rounded-[2.5rem] space-y-8 flex flex-col justify-between border border-slate-800/80">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0C1A24] border border-slate-700 text-slate-300 text-xs font-semibold">
                  OUR LATEST NEWS
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Discover The Latest News And Updates From Our Team.
                </h2>
              </div>

              {/* News Items list */}
              <div className="space-y-8 divide-y divide-slate-800/80">
                {newsArticles.map((article) => (
                  <div key={article.number} className="pt-6 first:pt-0 space-y-3">
                    <span className="text-sm font-extrabold text-slate-400 font-mono">
                      {article.number}
                    </span>
                    <h3 className="text-xl font-bold text-white hover:text-[#CCFF00] transition-colors cursor-pointer">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {article.description}
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CCFF00] hover:underline pt-1"
                    >
                      Learn More <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-800/80">
                <Link href="/signup">
                  <button className="w-full h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    Join Over 12,000 Verified Tenants <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
                  </button>
                </Link>
              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
