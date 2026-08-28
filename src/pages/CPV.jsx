import React from "react";
import { Link } from "react-router-dom";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import {
  Home,
  Briefcase,
  FileCheck,
  Users2,
  Wallet,
  Cpu,
  Clock,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Database,
  Bike,
} from "lucide-react";

const CPV_IMG = [
  "https://media.base44.com/images/public/6a722bde599ffd853c421721/19902aaec_generated_9e0400a9.png",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85",
];

const MODULES = [
  {
    icon: <Home className="h-7 w-7" />,
    title: "Applicant Verification",
    desc: "Doorstep visits and address confirmation at the point of contact.",
  },
  {
    icon: <Briefcase className="h-7 w-7" />,
    title: "Employment & Business Verification",
    desc: "On-site validation of employment status and business authenticity.",
  },
  {
    icon: <FileCheck className="h-7 w-7" />,
    title: "Document Verification",
    desc: "Authentication of NID, TIN, Bank Statements and supporting records.",
  },
  {
    icon: <Users2 className="h-7 w-7" />,
    title: "Guarantor & Reference Verification",
    desc: "Cross-checking guarantors and references for credit integrity.",
  },
  {
    icon: <Wallet className="h-7 w-7" />,
    title: "Financial & Credit Worthiness",
    desc: "Assessment of financial standing and repayment capacity.",
  },
];

const WHY = [
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Technology-Driven Reporting",
    desc: "Proprietary CRM and WhatsApp-based feedback loops.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Clear Communication",
    desc: "Structured updates for institutional requirements.",
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    title: "Professional Support",
    desc: "Careful handling of verification assignments.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Institutional Fit",
    desc: "Designed for banking and non-banking financial institutions.",
  },
  {
    icon: <FileCheck className="h-5 w-5" />,
    title: "Responsible Handling",
    desc: "Careful handling of information supplied for verification.",
  },
];

export default function CPV() {
  return (
    <>
      <PageHero
        label="Contact Point Verification (CPV)"
        title="The Verification Matrix"
        intro="Surgical, step-sequenced verification modules engineered for accuracy at the point of contact."
        image={CPV_IMG}
      />

      {/* Core Services */}
      <section className="border-b border-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Core Verification Services"
            title="Five Modules of Surgical Precision"
            intro="Each verification type is delivered as a discrete, traceable module within our CRM."
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m, i) => (
              <div
                key={m.title}
                className="group relative bg-white p-10 transition-colors hover:bg-[#123B63] hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[#0066D6] transition-colors group-hover:text-white">
                    {m.icon}
                  </div>
                  <span className="font-mono text-xs text-[#123B63]/30 group-hover:text-white/30">
                    M.0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-lg font-700 uppercase tracking-[0.03em]">
                  {m.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65 group-hover:text-white/65">
                  {m.desc}
                </p>
              </div>
            ))}
            <div className="flex flex-col justify-center bg-[#0066D6] p-10 text-white">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                Outcome
              </div>
              <p className="mt-3 font-heading text-xl font-700 leading-snug">
                Verified, traceable and decision-ready data â€” every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose MSI */}
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Why Institutions Choose MARS FLC"
            title="Focused support for financial work"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="flex gap-5 border border-[#123B63]/10 bg-white p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#123B63] text-[#0066D6]">
                  {w.icon}
                </div>
                <div>
                  <h3 className="font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
                    {w.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#123B63]/65">
                    {w.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Infrastructure */}
      <section className="bg-[#123B63] py-24 text-white">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Operational Infrastructure"
            inverse
            title={"Built for Continuous Verification"}
            intro="A professional operating backbone supporting contact point verification assignments."
          />
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
            {[
              {
                icon: <PhoneCall className="h-7 w-7" />,
                title: "24/7 Call Center",
                desc: "High-capacity operations with full call recording facilities.",
              },
              {
                icon: <Database className="h-7 w-7" />,
                title: "Cloud-Based Data",
                desc: "Secure, redundant data facilities protecting every record.",
              },
              {
                icon: <Bike className="h-7 w-7" />,
                title: "Dedicated Field Fleet",
                desc: "Bikes and cars for rapid doorstep deployment nationwide.",
              },
            ].map((it) => (
              <div key={it.title} className="bg-[#123B63] p-10">
                <div className="text-[#0066D6]">{it.icon}</div>
                <h3 className="mt-5 font-heading text-lg font-700 uppercase tracking-[0.05em]">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {it.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/contact" className="btn-crimson">
              Engage MARS FLC for Verification{" "}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
