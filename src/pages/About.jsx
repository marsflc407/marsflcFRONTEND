import { createElement } from "react";
import { HeartHandshake, Lightbulb, ShieldCheck, Target } from "lucide-react";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import { COMPANY } from "@/config/company";

const values = [
  {
    icon: ShieldCheck,
    title: "Dependable",
    description:
      "Reliable delivery, careful governance, and confidentiality in every engagement.",
  },
  {
    icon: Target,
    title: "Proficient",
    description:
      "Disciplined processes that support clear legal and financial outcomes.",
  },
  {
    icon: HeartHandshake,
    title: "Professional",
    description:
      "Ethical conduct and high standards guide every client interaction.",
  },
  {
    icon: Lightbulb,
    title: "Innovative",
    description:
      "Practical methods and technology continuously improve our service.",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        label="About MARS FLC"
        title={COMPANY.name}
        intro={COMPANY.category}
      />
      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto grid max-w-[1400px] gap-14 px-4 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionLabel>Our Work</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.1] text-[#123B63] sm:text-4xl">
              Practical support for financial institutions
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#123B63]/75">
              <p>{COMPANY.description}</p>
              <p>
                Our work is focused on responsible service delivery, clear
                communication, and careful handling of institutional needs.
              </p>
            </div>
          </div>
          <div className="border-l-2 border-[#0066D6] bg-[#EFF6FF] p-8 lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Our Focus
            </div>
            <p className="mt-4 font-heading text-2xl font-700 leading-tight text-[#123B63]">
              Legal, financial, recovery, verification, and administrative
              support.
            </p>
          </div>
        </div>
      </section>
      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Core Values"
            title="Professional service, carefully delivered"
            intro="The principles that shape how MARS FLC supports banking and non-banking financial institutions."
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="group bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {createElement(Icon, {
                  className: "h-7 w-7 text-[#0066D6]",
                  "aria-hidden": true,
                })}
                <div className="mt-6 font-mono text-xs text-[#123B63]/30">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-3 font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
