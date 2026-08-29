import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, ChevronDown } from "lucide-react";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import useEditableContent from "@/hooks/useEditableContent";
import { uploadAPI } from "@/utils/api";
const employees = [
  {
    name: "Ayesha Rahman",
    role: "Chairman",
    description: "Strategic vision and governance for MARS FLC.",
    level: "Board leadership",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Tanvir Hasan",
    role: "Managing Director",
    description: "Enterprise direction and client stewardship.",
    level: "Executive leadership",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Nusrat Jahan",
    role: "Head of Operations",
    description: "Field and call center command.",
    level: "Operational leadership",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Mahin Chowdhury",
    role: "Team Leaders",
    description: "Squad-level recovery oversight.",
    level: "Team leadership",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sadia Karim",
    role: "Field Executives",
    description: "Doorstep verification and recovery.",
    level: "Frontline execution",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Rafiq Ahmed",
    role: "Senior Recovery Executive",
    description: "Professional recovery support for institutional assignments.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Moumita Sultana",
    role: "CPV Executive",
    description: "Careful contact point verification and reporting support.",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Imran Hossain",
    role: "Legal Support Associate",
    description: "Organized support for legal consultancy requirements.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Farzana Akter",
    role: "Financial Support Associate",
    description: "Practical support for financial consultancy work.",
    image:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Arif Mahmud",
    role: "Administrative Coordinator",
    description: "Reliable coordination across administrative workflows.",
    image:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=80",
  },
];

const DUMMY_EMPLOYEE_IMAGE =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80";
const DUMMY_FAMILY_HERO_IMAGE =
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85";

export default function Family() {
  const { records, get } = useEditableContent("family");
  const [employeeStart, setEmployeeStart] = useState(0);
  const [visibleEmployees, setVisibleEmployees] = useState(5);
  const [employeeImages, setEmployeeImages] = useState([]);
  const editableEmployees = records
    .filter(
      (record) => record.section === "employee" && record.isActive !== false,
    )
    .map((record) => ({
      name: record.subtitle || "MARS FLC Team",
      role: record.title || "Team Member",
      description: record.content || "",
      level: record.section,
      image: record.image,
    }));
  const displayedEmployees = (
    editableEmployees.length ? editableEmployees : employees
  ).map((employee, index) => ({
    ...employee,
    image:
      employee.image ||
      employeeImages[index]?.url ||
      employees[index]?.image ||
      DUMMY_EMPLOYEE_IMAGE,
  }));

  useEffect(() => {
    uploadAPI
      .getAll()
      .then((response) => {
        setEmployeeImages(
          (response?.data || []).filter(
            (image) =>
              image.section === "company-overview" && image.isActive !== false,
          ),
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const updateVisibleEmployees = () => {
      if (window.innerWidth < 640) setVisibleEmployees(1);
      else if (window.innerWidth < 1024) setVisibleEmployees(2);
      else if (window.innerWidth < 1280) setVisibleEmployees(3);
      else setVisibleEmployees(5);
    };

    updateVisibleEmployees();
    window.addEventListener("resize", updateVisibleEmployees);
    return () => window.removeEventListener("resize", updateVisibleEmployees);
  }, []);

  useEffect(() => {
    setEmployeeStart((start) =>
      Math.min(
        start,
        Math.max(0, displayedEmployees.length - visibleEmployees),
      ),
    );
  }, [visibleEmployees, displayedEmployees.length]);

  const visibleEmployeeCards = displayedEmployees.slice(
    employeeStart,
    employeeStart + visibleEmployees,
  );
  const canGoBack = employeeStart > 0;
  const canGoForward =
    employeeStart + visibleEmployees < displayedEmployees.length;

  return (
    <>
      <PageHero
        label={get("hero", "subtitle", "Our Family")}
        title={get("hero", "title", "Strength in Structure")}
        intro={get(
          "hero",
          "content",
          "A coordinated team with one standard of accountability, from the boardroom to every field visit.",
        )}
        image={get("hero", "image", DUMMY_FAMILY_HERO_IMAGE)}
      />

      <section className="border-b border-[#EFF6FF] py-20 md:py-24">
        <div className="container-custom mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionLabel>
              {get("strength", "subtitle", "Team Strength")}
            </SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.1] text-[#123B63] sm:text-4xl">
              {get("strength", "title", "One team, focused support")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[#123B63]/70">
              {get(
                "strength",
                "content",
                "MARS FLC's strength comes from a disciplined team that shares information, owns outcomes, and understands institutional needs.",
              )}
            </p>
          </div>
          <div className="border-l-2 border-[#0066D6] bg-[#EFF6FF] p-8 lg:col-span-7 md:p-10">
            <Building2 className="h-8 w-8 text-[#0066D6]" aria-hidden="true" />
            <p className="mt-6 font-heading text-3xl font-700 leading-tight text-[#123B63] sm:text-4xl">
              {get(
                "structure",
                "title",
                "We provide professional recovery and consultancy support.",
              )}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#123B63]/65">
              {get(
                "structure",
                "content",
                "Our structure makes responsibility visible and keeps every level connected to the client outcome.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#EFF6FF] bg-[#123B63] py-20 text-white md:py-24">
        <div className="container-custom mx-auto max-w-[1000px] px-4">
          <SectionHeader
            label={get("chart", "subtitle", "Organizational Chart")}
            title={
              <span className="text-white">
                {get("chart", "title", "A clear line of responsibility")}
              </span>
            }
            intro={get(
              "chart",
              "content",
              "Every role contributes to a single accountable recovery and verification workflow.",
            )}
          />
          <div className="relative mt-12">
            <div className="absolute bottom-10 left-5 top-10 w-px bg-white/20 sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-4">
              {displayedEmployees.slice(0, 5).map((node, index) => (
                <div
                  key={node.role}
                  className={`relative flex items-center gap-4 sm:gap-8 ${index % 2 === 1 ? "sm:flex-row-reverse" : ""}`}
                >
                  <div className="flex-1 rounded-none border border-white/10 bg-[#0D2F4E] p-5 sm:p-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={node.image}
                        alt={`${node.name} - ${node.role}`}
                        className="h-14 w-14 shrink-0 rounded-full border-2 border-[#0066D6] bg-white object-cover p-1"
                      />
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066D6]">
                          {node.level}
                        </div>
                        <p className="mt-1 text-sm font-600 text-white/75">
                          {node.name}
                        </p>
                        <h2 className="mt-1 font-heading text-lg font-700 uppercase tracking-[0.05em]">
                          {node.role}
                        </h2>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-white/55">
                      {node.description}
                    </p>
                  </div>
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-[#0066D6] font-mono text-sm font-700 sm:h-12 sm:w-12">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="hidden flex-1 sm:block" />
                </div>
              ))}
            </div>
            <ChevronDown
              className="absolute -bottom-4 left-0 h-5 w-5 translate-x-[10px] text-[#0066D6] sm:left-1/2 sm:-translate-x-1/2"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-custom mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={get("employees", "subtitle", "Our Employees")}
            title={get("employees", "title", "People behind the process")}
            intro={get(
              "employees",
              "content",
              "Professional roles supporting one accountable recovery and verification workflow.",
            )}
          />
          <div className="mt-12 flex items-center justify-between gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#123B63]/55">
              Showing {employeeStart + 1}-
              {Math.min(employeeStart + visibleEmployees, employees.length)} of{" "}
              {displayedEmployees.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setEmployeeStart((start) => Math.max(0, start - 1))
                }
                disabled={!canGoBack}
                aria-label="Previous employees"
                className="flex h-10 w-10 items-center justify-center border border-[#123B63]/20 text-[#123B63] transition-colors hover:border-[#0066D6] hover:bg-[#0066D6] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setEmployeeStart((start) =>
                    Math.min(employees.length - visibleEmployees, start + 1),
                  )
                }
                disabled={!canGoForward}
                aria-label="Next employees"
                className="flex h-10 w-10 items-center justify-center border border-[#123B63]/20 text-[#123B63] transition-colors hover:border-[#0066D6] hover:bg-[#0066D6] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {visibleEmployeeCards.map((member, index) => (
              <article
                key={member.role}
                className="group border border-[#EFF6FF] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0066D6] hover:shadow-xl sm:p-8"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#EFF6FF]">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 bg-[#123B63] px-3 py-1 font-mono text-xs text-white">
                    {String(employeeStart + index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-[#0066D6]">
                  {member.name}
                </p>
                <h2 className="mt-2 font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {member.role}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
