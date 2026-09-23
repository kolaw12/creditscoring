"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, Target, Users, Heart } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Trust",
    description: "We earn trust through transparent terms, secure operations, and honest communication.",
  },
  {
    icon: Target,
    title: "Simplicity",
    description: "We make a complex financial product simple enough for anyone to understand and use.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "We serve working professionals who are underserved by traditional lending.",
  },
  {
    icon: Heart,
    title: "Responsibility",
    description: "We lend responsibly, ensuring our users can comfortably afford their repayments.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                About Us
              </p>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
                Making Rent Affordable for Young Nigeria
              </h1>
              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
                We believe every working professional deserves to live in a home they choose,
                without the financial stress of paying an entire year&apos;s rent upfront.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid items-start gap-12 md:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                  Mission
                </p>
                <h2 className="mt-3 text-3xl font-bold text-gray-900">Our Mission</h2>
                <p className="mt-6 text-gray-500 leading-relaxed">
                  In Nigeria, rent is typically paid annually — a system that creates enormous
                  financial pressure on tenants who earn monthly salaries. Young graduates and
                  professionals often find themselves choosing between overpriced short-term
                  accommodation and taking on informal debt.
                </p>
                <p className="mt-4 text-gray-500 leading-relaxed">
                  RentFin exists to solve this problem. We bridge the gap between how rent is
                  demanded and how people actually earn, making quality housing accessible to
                  hardworking young Nigerians.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="space-y-6">
                  {[
                    { label: "Target Users", value: "Graduates & young professionals" },
                    { label: "Market", value: "Nigeria" },
                    { label: "Product", value: "Rent financing" },
                    { label: "Model", value: "Monthly repayment plans" },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.label}</dt>
                      <dd className="mt-1 text-sm font-medium text-gray-700">{item.value}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">
              Values
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">Our Values</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
                    <value.icon className="h-6 w-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-gray-900">{value.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h2 className="text-lg font-bold text-gray-900">Important Notice</h2>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                RentFin is a financial technology platform. RentFin is not a bank or licensed
                financial institution. Financing services are subject to eligibility assessment
                and approval. Terms, fees, and interest rates vary based on individual assessment.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
