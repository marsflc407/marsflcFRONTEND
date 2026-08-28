import React from "react";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import { Users, Target, Eye, Handshake } from "lucide-react";
import { COMPANY, SERVICES } from "@/config/company";

const CHART = [
  { role: "Chairman", desc: "Strategic vision & governance" },
  { role: "Managing Director", desc: "Operational leadership" },
  { role: "Head of Operations", desc: "Field & call center command" },
  { role: "Team Leaders", desc: "Squad-level recovery oversight" },
  { role: "Field Executives", desc: "Doorstep verification & recovery" },
];

export default function CompanyOverview() {
  return (
    <>
      <PageHero
        label="Company Overview"
        title={COMPANY.name}
        intro={COMPANY.category}
      />

      {/* About Us */}
      <section
        id="about"
        className="scroll-mt-32 border-b border-[#EFF6FF] py-24"
      >
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <SectionLabel>About Us</SectionLabel>
              <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.15] text-[#123B63] sm:text-4xl">
                A Decade of Disciplined Recovery
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#123B63]/75">
                <p>{COMPANY.description}</p>
                <p>
                  MARS FLC provides professional legal and financial support
                  with clear communication and careful handling of institutional
                  requirements.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid gap-6">
                <div className="border-l-2 border-[#0066D6] bg-[#EFF6FF] p-8">
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
                    Our Mission
                  </div>
                  <p className="mt-3 text-lg leading-relaxed text-[#123B63]/80">
                    To recover funds swiftly and amicably, avoiding legal
                    resources wherever possible Ã¢â‚¬â€ preserving client
                    relationships while delivering outcomes.
                  </p>
                </div>
                <div className="border-l-2 border-[#123B63] bg-[#123B63] p-8 text-white">
                  <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
                    Our Vision
                  </div>
                  <p className="mt-3 text-lg leading-relaxed text-white/80">
                    To be the leading credit risk management agency in
                    Bangladesh Ã¢â‚¬â€ the metric by which all others are
                    measured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Management */}
      <section
        id="management"
        className="scroll-mt-32 border-b border-[#EFF6FF] py-24"
      >
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Our Management"
            title="Governance Built on Integrity"
            intro="Integrity, accountability and client trust guide the leadership philosophy of MARS FLC."
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-3">
            {[
              {
                icon: <Eye className="h-7 w-7" />,
                title: "Core Philosophy",
                desc: "Integrity, accountability and unwavering client trust at every layer of decision-making.",
              },
              {
                icon: <Target className="h-7 w-7" />,
                title: "Strategic Focus",
                desc: "Operational discipline and strong governance ensuring predictable, measurable outcomes.",
              },
              {
                icon: <Handshake className="h-7 w-7" />,
                title: "Service Philosophy",
                desc: "Responsible, clear, and professional support for institutional requirements.",
              },
            ].map((c) => (
              <div key={c.title} className="bg-white p-10">
                <div className="text-[#0066D6]">{c.icon}</div>
                <h3 className="mt-5 font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Family */}
      <section
        id="family"
        className="scroll-mt-32 border-b border-[#EFF6FF] bg-[#123B63] py-24 text-white"
      >
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Our Family"
            title={<span className="text-white">Our Greatest Strength</span>}
            intro="A clear operating structure supports accountable consultancy, recovery, verification, and administrative work."
          />
          <div className="mt-12 space-y-px">
            {CHART.map((node, i) => (
              <div
                key={node.role}
                className="group flex items-center gap-6 bg-[#0D2F4E] p-6 transition-colors hover:bg-[#16456D]"
                style={{ marginLeft: `${i * 24}px` }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#0066D6] font-mono text-sm font-700">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <div className="font-heading text-lg font-700 uppercase tracking-[0.05em]">
                    {node.role}
                  </div>
                  <div className="text-sm text-white/50">{node.desc}</div>
                </div>
                <Users className="h-5 w-5 text-white/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sister Concern */}
      <section id="sister-concern" className="scroll-mt-32 py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Our Services"
            title="Focused institutional support"
            intro="Debt collection and recovery, Contact Point Verification, legal and financial support, and administrative support."
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((service, i) => (
              <div
                key={service}
                className="group bg-white p-8 text-center transition-colors hover:bg-[#123B63] hover:text-white"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#0066D6] text-[#0066D6] transition-colors group-hover:border-white group-hover:text-white">
                  <span className="font-heading text-lg font-700">{i + 1}</span>
                </div>
                <div className="mt-4 font-heading text-sm font-700 uppercase tracking-[0.05em]">
                  {service}
                </div>
                <div className="mt-1 font-mono text-[10px] text-[#123B63]/40 group-hover:text-white/40">
                  0{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
