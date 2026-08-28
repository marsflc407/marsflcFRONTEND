import { createElement } from "react";
import { HeartHandshake, Lightbulb, ShieldCheck, Target } from "lucide-react";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import { COMPANY } from "@/config/company";
import useEditableContent from "@/hooks/useEditableContent";

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
  const { get, getItems } = useEditableContent("about");
  const editableValues = getItems("value");

  return (
    <>
      <PageHero
        label={get("hero", "subtitle", "About MARS FLC")}
        title={get("hero", "title", COMPANY.name)}
        intro={get("hero", "content", COMPANY.category)}
      />
      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto grid max-w-[1400px] gap-14 px-4 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <SectionLabel>{get("work", "subtitle", "Our Work")}</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.1] text-[#123B63] sm:text-4xl">
              {get(
                "work",
                "title",
                "Practical support for financial institutions",
              )}
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#123B63]/75">
              <p>{get("work", "content", COMPANY.description)}</p>
              <p>
                {get(
                  "work-continued",
                  "content",
                  "Our work is focused on responsible service delivery, clear communication, and careful handling of institutional needs.",
                )}
              </p>
            </div>
          </div>
          <div className="border-l-2 border-[#0066D6] bg-[#EFF6FF] p-8 lg:col-span-5">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              {get("focus", "subtitle", "Our Focus")}
            </div>
            <p className="mt-4 font-heading text-2xl font-700 leading-tight text-[#123B63]">
              {get(
                "focus",
                "content",
                "Legal, financial, recovery, verification, and administrative support.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={get("values", "subtitle", "Core Values")}
            title={get(
              "values",
              "title",
              "Professional service, carefully delivered",
            )}
            intro={get(
              "values",
              "content",
              "The principles that shape how MARS FLC supports banking and non-banking financial institutions.",
            )}
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] sm:grid-cols-2 lg:grid-cols-4">
            {(editableValues.length ? editableValues : values).map(
              ({ icon, title, description }, index) => (
                <article
                  key={title}
                  className="group bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  {createElement(
                    icon
                      ? { ShieldCheck, Target, HeartHandshake, Lightbulb }[
                          icon
                        ] || ShieldCheck
                      : values[index]?.icon || ShieldCheck,
                    {
                      className: "h-7 w-7 text-[#0066D6]",
                      "aria-hidden": true,
                    },
                  )}
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
              ),
            )}
          </div>
        </div>
      </section>
    </>
  );
}
