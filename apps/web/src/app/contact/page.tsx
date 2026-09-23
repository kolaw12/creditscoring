"use client";

import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  { icon: Mail, title: "Email", detail: "support@rentfin.ng", description: "We respond within 24 hours" },
  { icon: Phone, title: "Phone", detail: "+234 800 RENTFIN", description: "Mon-Fri, 9am-5pm WAT" },
  { icon: MapPin, title: "Office", detail: "Lagos, Nigeria", description: "Visit by appointment" },
  { icon: Clock, title: "Support Hours", detail: "Mon-Fri: 9am - 5pm", description: "Weekend inquiries answered next business day" },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 via-white to-purple-50/30">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Contact</p>
              <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</h1>
              <p className="mt-4 text-gray-500">Have a question? We&apos;re here to help.</p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-bold text-gray-900">Contact Channels</h2>
                <div className="mt-8 space-y-6">
                  {contactInfo.map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
                        <item.icon className="h-5 w-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.detail}</p>
                        <p className="text-xs text-gray-400">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
                  {submitted ? (
                    <div className="py-8 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                        <Send className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-gray-900">Message Sent</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Input label="First Name" name="firstName" required placeholder="Ada" />
                        <Input label="Last Name" name="lastName" required placeholder="Okonkwo" />
                      </div>
                      <Input label="Email" name="email" type="email" required placeholder="ada@example.com" />
                      <Input label="Phone Number" name="phone" type="tel" placeholder="+2348012345678" />
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Subject</label>
                        <select
                          name="subject"
                          className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="application">Application Help</option>
                          <option value="payment">Payment Issue</option>
                          <option value="account">Account Support</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                          name="message"
                          rows={5}
                          required
                          placeholder="How can we help you?"
                          className="flex w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all duration-200 resize-none"
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
