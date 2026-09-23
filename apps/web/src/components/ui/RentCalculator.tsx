"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calculator, ShieldCheck } from "lucide-react";

function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function RentCalculator() {
  const [rentAmount, setRentAmount] = useState<number>(2500000);
  const [depositPercent, setDepositPercent] = useState<number>(15);
  const [tenure, setTenure] = useState<number>(12);

  // Calculations
  const depositAmount = Math.round((rentAmount * depositPercent) / 100);
  const financedAmount = rentAmount - depositAmount;
  const totalFee = Math.round(financedAmount * (0.012 * tenure));
  const totalRepayment = financedAmount + totalFee;
  const monthlyPayment = Math.round(totalRepayment / tenure);

  return (
    <div id="calculator" className="w-full rounded-[2rem] bg-[#0E1721]/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Rent Financing Calculator
            </h3>
            <p className="text-xs text-slate-400 font-medium">Estimate monthly repayments instantly</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> 0% Hidden Fees
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-8 items-start">
        
        {/* Left Inputs */}
        <div className="space-y-5">
          {/* Input 1: Rent Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">
                Annual Rent Amount
              </label>
              <span className="text-[#CCFF00] font-mono font-bold">{formatNaira(rentAmount)}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="100000"
                value={rentAmount}
                onChange={(e) => setRentAmount(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-xl border border-slate-700 bg-[#070D12] text-white font-bold text-base focus:outline-none focus:border-[#CCFF00] transition-colors font-mono"
              />
            </div>
          </div>

          {/* Input 2: Deposit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300 uppercase tracking-wider">
                Upfront Down Payment
              </label>
              <span className="text-[#CCFF00] font-mono font-bold">{depositPercent}% ({formatNaira(depositAmount)})</span>
            </div>
            <input
              type="range"
              min={10}
              max={40}
              step={5}
              value={depositPercent}
              onChange={(e) => setDepositPercent(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#CCFF00]"
            />
          </div>

          {/* Input 3: Tenure Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Repayment Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[6, 9, 12].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTenure(t)}
                  className={`h-11 rounded-xl font-bold text-xs transition-all ${
                    tenure === t
                      ? "bg-[#CCFF00] text-black shadow-md shadow-[#CCFF00]/20"
                      : "bg-[#070D12] border border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {t} Months
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Box */}
        <div className="rounded-2xl bg-[#070D12] p-6 border border-slate-800/90 space-y-5 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Estimated Monthly Repayment
              </p>
              <p className="text-3xl sm:text-4xl font-black text-[#CCFF00] font-mono tracking-tight leading-none">
                {formatNaira(monthlyPayment)}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-2">
                Spread across {tenure} equal monthly installments.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Landlord Gets Paid (100%):</span>
                <span className="text-white font-mono font-bold">{formatNaira(rentAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Down Payment ({depositPercent}%):</span>
                <span className="text-slate-200 font-mono">{formatNaira(depositAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/40">
                <span className="font-semibold text-slate-300">Total Loan Amount:</span>
                <span className="text-white font-mono font-bold">{formatNaira(totalRepayment)}</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link href={`/signup?amount=${rentAmount}&tenure=${tenure}`}>
              <Button className="w-full lime-glow-btn text-black font-extrabold h-12 rounded-xl text-sm transition-all cursor-pointer">
                Apply For Rent Financing
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
