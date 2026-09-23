import Link from "next/link";
import { ShieldCheck, Building2, ArrowUpRight } from "lucide-react";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Rent Calculator", href: "#calculator" },
      { label: "Loan Opportunities", href: "#" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About RentFin", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal & Regulatory",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Security & Audits", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#04080C] text-slate-400 border-t border-slate-800/80">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        
        {/* Main Footer Links */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-12">
          
          {/* Brand Column */}
          <div className="col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20 font-black text-lg">
                R
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Rent<span className="text-[#CCFF00]">Fin</span>
              </span>
            </Link>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              RentFin empowers tenants with transparent rent financing solutions. 
              We pay 100% of your annual rent upfront directly to your landlord, giving you flexible monthly repayment terms.
            </p>

            <div className="flex items-center gap-2 text-[#CCFF00] font-bold text-xs pt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>CBN Licensed &middot; 256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Section Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs font-medium text-slate-400 hover:text-[#CCFF00] transition-colors inline-flex items-center gap-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} RentFin Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Powered by high-security credit scoring engines.
          </p>
        </div>

      </div>
    </footer>
  );
}
