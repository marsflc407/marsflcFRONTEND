import React from "react";
import { Link } from "react-router-dom";
import { PageHero, SectionHeader } from "@/components/site/primitives";
import {
  ArrowRight,
  Car,
  Scale,
  ShieldCheck,
  Eye,
  Users2,
  Cpu,
  PhoneCall,
  Bike,
  Coins,
  MapPin,
  FileWarning,
} from "lucide-react";

const FLEET_IMG = [
  "https://media.base44.com/images/public/6a722bde599ffd853c421721/64fac9e0d_generated_603e1514.png",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85",
];

const SERVICES = [
  {
    icon: <Coins className="h-7 w-7" />,
    title: "Standard Debt Collection",
    desc: "Early-stage amicable recovery designed to preserve the client-borrower relationship.",
  },
  {
    icon: <MapPin className="h-7 w-7" />,
    title: "Field Visit & Skip Tracing",
    desc: "Locating and engaging delinquent borrowers through disciplined field intelligence.",
  },
  {
    icon: <FileWarning className="h-7 w-7" />,
    title: "Long Overdue & NPL Recovery",
    desc: "Resolution of non-performing loans through structured, persistent engagement.",
  },
];

const SPECIALIZED = [
  {
    icon: <Car className="h-7 w-7" />,
    title: "Asset Repossession Support",
    desc: "A dedicated auto repossession team for secured-loan recovery, operating within legal boundaries.",
  },
  {
    icon: <Scale className="h-7 w-7" />,
    title: "Legal Collection Support",
    desc: "Documentation preparation and coordination with legal counsel for escalated matters.",
  },
];

const ADVANTAGES = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Ethical & Law-Compliant Recovery",
    desc: "Every action governed by regulatory and ethical boundaries.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Professional Oversight",
    desc: "A team of watchdogs ensuring conduct at every level.",
  },
  {
    icon: <Users2 className="h-5 w-5" />,
    title: "Dedicated Recovery Team",
    desc: "Specialised squads aligned to portfolio and geography.",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Technology-Driven MIS",
    desc: "Daily reports and 30-minute feedback on every action.",
  },
];

export default function DebtCollection() {
  return (
    <>
      <PageHero
        label="Debt Collection"
        title="Sovereign Authority in Recovery"
        intro="Debt collection and recovery support for banking and non-banking financial institutions, delivered with professional and responsible service."
        image={FLEET_IMG}
      />

      {/* Core Collection Services */}
      <section className="border-b border-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Core Collection Services"
            title="Three Tiers of Recovery"
            intro="Structured recovery modules covering the full lifecycle of delinquency."
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="group bg-white p-10 transition-colors hover:bg-[#123B63] hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <div className="text-[#0066D6] transition-colors group-hover:text-white">
                    {s.icon}
                  </div>
                  <span className="font-mono text-xs text-[#123B63]/30 group-hover:text-white/30">
                    TIER 0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-heading text-lg font-700 uppercase tracking-[0.03em]">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65 group-hover:text-white/65">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Support */}
      <section className="border-b border-[#EFF6FF] bg-[#123B63] py-24 text-white">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Specialized Support"
            title={<span className="text-white">Beyond Amicable Recovery</span>}
            intro="MARS FLC also provides legal and financial support relevant to recovery requirements."
          />
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-2">
            {SPECIALIZED.map((s) => (
              <div key={s.title} className="bg-[#123B63] p-10">
                <div className="text-[#0066D6]">{s.icon}</div>
                <h3 className="mt-5 font-heading text-xl font-700 uppercase tracking-[0.03em]">
                  {s.title}
                </h3>
                <p className="mt-3 leading-relaxed text-white/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Competitive Advantages"
            title="Focused recovery support"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {ADVANTAGES.map((a) => (
              <div
                key={a.title}
                className="flex gap-5 border border-[#123B63]/10 bg-white p-8"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#0066D6] text-white">
                  {a.icon}
                </div>
                <div>
                  <h3 className="font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#123B63]/65">
                    {a.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Infrastructure"
            title="A Recovery Machine, Always Running"
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-3">
            {[
              {
                icon: <PhoneCall className="h-7 w-7" />,
                title: "24/7 High-Capacity Call Center",
                desc: "Continuous outreach with full recording facilities.",
              },
              {
                icon: <Users2 className="h-7 w-7" />,
                title: "Rapid Movement Team",
                desc: "Squads on standby for emergency field deployment.",
              },
              {
                icon: <Bike className="h-7 w-7" />,
                title: "Dedicated Vehicle Fleet",
                desc: "Bikes and cars enabling nationwide reach.",
              },
            ].map((it) => (
              <div key={it.title} className="bg-white p-10">
                <div className="text-[#0066D6]">{it.icon}</div>
                <h3 className="mt-5 font-heading text-lg font-700 uppercase tracking-[0.03em] text-[#123B63]">
                  {it.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                  {it.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/contact" className="btn-crimson">
              Engage MARS FLC for Recovery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
