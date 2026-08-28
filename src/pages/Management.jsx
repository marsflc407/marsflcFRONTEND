import { createElement } from "react";
import { Eye, Handshake, ShieldCheck, Target, Users } from "lucide-react";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import useEditableContent from "@/hooks/useEditableContent";

const principles = [
  {
    icon: ShieldCheck,
    title: "Integrity",
    description:
      "We act transparently, protect sensitive information, and keep every recovery engagement accountable.",
  },
  {
    icon: Target,
    title: "Accountability",
    description:
      "Clear ownership and measurable reporting keep decisions aligned from leadership to field execution.",
  },
  {
    icon: Handshake,
    title: "Client Trust",
    description:
      "Long-term partnerships are built through dependable communication, ethical conduct, and consistent delivery.",
  },
];

const team = [
  {
    initials: "MD",
    role: "Managing Director",
    description:
      "Strategic direction, governance, and long-term client relationships.",
  },
  {
    initials: "HO",
    role: "Head of Operations",
    description:
      "Coordinates field teams, call center performance, and reporting standards.",
  },
  {
    initials: "TL",
    role: "Team Leadership",
    description:
      "Guides recovery squads with practical oversight and disciplined execution.",
  },
];

export default function Management() {
  const { get, getItems } = useEditableContent("management");
  const editablePrinciples = getItems("principle");
  const editableTeam = getItems("team-member");
  const editableFocus = getItems("focus-item");

  return (
    <>
      <PageHero
        label={get("hero", "subtitle", "Our Management")}
        title={get("hero", "title", "Governance Built on Integrity")}
        intro={get(
          "hero",
          "content",
          "Leadership at MARS FLC connects principled decision-making with disciplined legal and financial consultancy.",
        )}
      />

      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={get("philosophy", "subtitle", "Core Philosophy")}
            title={get(
              "philosophy",
              "title",
              "Three commitments guide every decision",
            )}
            intro={get(
              "philosophy",
              "content",
              "Integrity, accountability, and client trust guide MARS FLC's professional service.",
            )}
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-3">
            {(editablePrinciples.length ? editablePrinciples : principles).map(
              ({ icon, title, description }, index) => (
                <article key={title} className="bg-white p-8 md:p-10">
                  {createElement(
                    icon
                      ? { ShieldCheck, Target, Handshake }[icon] || ShieldCheck
                      : principles[index]?.icon || ShieldCheck,
                    {
                      className: "h-7 w-7 text-[#0066D6]",
                      "aria-hidden": true,
                    },
                  )}
                  <div className="mt-6 font-mono text-xs text-[#123B63]/30">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-3 font-heading text-xl font-700 uppercase tracking-[0.05em] text-[#123B63]">
                    {title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                    {description}
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[#EFF6FF] bg-[#123B63] py-20 text-white md:py-24">
        <div className="container-custom mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionLabel>
              {get("focus", "subtitle", "Strategic Focus")}
            </SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.1] sm:text-4xl">
              {get(
                "focus",
                "title",
                "A measured path from evidence to outcome",
              )}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-3">
              {(editableFocus.length
                ? editableFocus
                : [
                    "Operational discipline",
                    "Technology-led reporting",
                    "Institutional support",
                  ]
              ).map((focus, index) => (
                <div
                  key={focus}
                  className="border-l-2 border-[#0066D6] bg-[#0D2F4E] p-6"
                >
                  <div className="font-mono text-xs text-white/40">
                    0{index + 1}
                  </div>
                  <div className="mt-5 font-heading text-sm font-700 uppercase tracking-[0.05em]">
                    {focus.title || focus}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/65">
              {get(
                "focus",
                "content",
                "Management invests in the systems, people, and feedback loops that make recovery work visible, responsible, and repeatable for every client.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel>
                {get("service-philosophy", "subtitle", "Service Philosophy")}
              </SectionLabel>
              <h2 className="mt-4 font-heading text-4xl font-800 leading-[1.05] text-[#123B63] sm:text-5xl">
                {get(
                  "service-philosophy",
                  "title",
                  "Professional support, clearly delivered",
                )}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-[#123B63]/70 lg:col-span-5">
              {get(
                "service-philosophy",
                "content",
                "Every management decision is measured against the client outcome: certainty, responsiveness, and a partner that stays accountable through completion.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={get("team", "subtitle", "Management Team")}
            title={get("team", "title", "Leadership with field awareness")}
            intro={get(
              "team",
              "content",
              "MARS FLC's team structure supports accountable delivery across its service areas.",
            )}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(editableTeam.length ? editableTeam : team).map((member) => (
              <article
                key={member.role}
                className="border border-[#EFF6FF] bg-white p-6 transition-shadow hover:shadow-xl sm:p-8"
              >
                <div className="flex aspect-[4/3] items-end justify-between bg-[#123B63] p-6 text-white">
                  <span className="font-heading text-4xl font-800 text-[#0066D6]">
                    {member.initials || member.subtitle || "TM"}
                  </span>
                  <Users className="h-6 w-6 text-white/40" aria-hidden="true" />
                </div>
                <h2 className="mt-6 font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {member.role}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                  {member.description}
                </p>
                <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066D6]">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                  MARS FLC team profile
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
