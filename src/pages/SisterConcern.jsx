import { createElement } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { COMPANY, SERVICES } from "@/config/company";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import useEditableContent from "@/hooks/useEditableContent";

export default function SisterConcern() {
  const { get, getItems } = useEditableContent("sister-concern");
  const editableServices = getItems("service");

  return (
    <>
      <PageHero
        label={get("hero", "subtitle", "Sister Concerns")}
        title={get("hero", "title", COMPANY.name)}
        intro={get(
          "hero",
          "content",
          "MARS FLC is a Bangladeshi consultancy firm specializing in legal and financial services.",
        )}
      />

      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <SectionLabel>{get("focus", "subtitle", "Our Focus")}</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.1] text-[#123B63] sm:text-4xl">
              {get("focus", "title", "Shared values make the family stronger")}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#123B63]/70">
              {get(
                "focus",
                "content",
                "MARS FLC partners with banking and non-banking financial institutions across its core legal, financial, recovery, verification, and administrative support services.",
              )}
            </p>
          </div>
          <div className="border-l-2 border-[#0066D6] bg-[#123B63] p-8 text-white lg:col-span-5">
            <BriefcaseBusiness
              className="h-8 w-8 text-[#0066D6]"
              aria-hidden="true"
            />
            <p className="mt-5 font-heading text-2xl font-700 leading-tight">
              {get(
                "purpose",
                "content",
                "Diversified by purpose. Unified by standard.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={get("services", "subtitle", "Our Services")}
            title={get("services", "title", "Focused institutional support")}
            intro={get(
              "services",
              "content",
              "Explore the services provided by Mars Financial & Legal Consultancy.",
            )}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(editableServices.length
              ? editableServices.map((item) => item.title)
              : SERVICES
            ).map((name, index) => (
              <article
                key={name}
                className="group flex h-full flex-col border border-[#EFF6FF] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#0066D6] hover:shadow-xl sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center border border-[#0066D6] bg-[#123B63] font-heading text-lg font-800 text-[#0066D6] transition-colors group-hover:bg-[#0066D6] group-hover:text-white">
                    {index + 1}
                  </div>
                </div>
                <div className="mt-8 font-mono text-xs text-[#0066D6]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className="mt-3 font-heading text-xl font-700 uppercase tracking-[0.03em] text-[#123B63]">
                  {name}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#123B63]/65">
                  {name} provided by MARS FLC for institutional clients.
                </p>
                <div className="mt-7 border-t border-[#EFF6FF] pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#123B63]/40">
                  MARS FLC Service
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
