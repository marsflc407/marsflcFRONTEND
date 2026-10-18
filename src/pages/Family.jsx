import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, ChevronDown } from "lucide-react";
import {
  PageHero,
  SectionHeader,
  SectionLabel,
} from "@/components/site/primitives";
import useEditableContent from "@/hooks/useEditableContent";
import { uploadAPI } from "@/utils/api";
import LoadingState from "@/components/common/LoadingState";
import managingDirectorImage from "@/assets/Family/MD.jpeg";

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
    name: "Md. Rokon Uddin Miah",
    role: "Managing Director",
    description: "Enterprise direction and client stewardship.",
    level: "Executive leadership",
    image: managingDirectorImage,
  },
  {
    name: "Nusrat Jahan",
    role: "Director",
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

const rolePriority = {
  Chairman: 0,
  "Managing Director": 1,
  Director: 2,
  "Team Leaders": 3,
  "Field Executives": 4,
};

const leadershipRoles = new Set(Object.keys(rolePriority));

const DUMMY_EMPLOYEE_IMAGE =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=600&q=80";

export default function Family() {
  const { records, get, loading } = useEditableContent("family");
  const [employeeStart, setEmployeeStart] = useState(0);
  const [visibleEmployees, setVisibleEmployees] = useState(5);
  const [employeeImages, setEmployeeImages] = useState([]);

  const editableEmployees = records
    .filter(
      (record) => record.section === "employee" && record.isActive !== false,
    )
    .map((record) => ({
      name: record.subtitle || "MARS FLC Team",
      role:
        record.title === "Head of Operations"
          ? "Director"
          : record.title || "Team Member",
      description: record.content || "",
      level: record.section,
      image: record.image,
      order: record.order || 0,
    }))
    .sort(
      (first, second) =>
        (rolePriority[first.role] ?? 5) - (rolePriority[second.role] ?? 5) ||
        first.order - second.order,
    );

  const editableLeadership = editableEmployees.filter((employee) =>
    leadershipRoles.has(employee.role),
  );
  const editableGeneralEmployees = editableEmployees.filter(
    (employee) => !leadershipRoles.has(employee.role),
  );

  const displayedLeadership = (
    editableLeadership.length ? editableLeadership : employees.slice(0, 5)
  ).map((employee, index) => ({
    ...employee,
    image:
      employee.image ||
      employeeImages[index]?.url ||
      employees[index]?.image ||
      DUMMY_EMPLOYEE_IMAGE,
  }));

  const displayedGeneralEmployees = (
    editableGeneralEmployees.length
      ? editableGeneralEmployees
      : employees.slice(5)
  ).map((employee, index) => ({
    ...employee,
    image:
      employee.image ||
      employeeImages[index]?.url ||
      employees[index + 5]?.image ||
      DUMMY_EMPLOYEE_IMAGE,
  }));

  const displayedEmployees = [
    ...displayedLeadership,
    ...displayedGeneralEmployees,
  ];

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
      else setVisibleEmployees(4); // Changed to 4 so cards are wider and text is readable
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

  if (loading) {
    return <LoadingState label="Loading family information..." />;
  }

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
        image={get("hero", "image", "")}
        useUploadedImages={false}
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
          <div className="relative overflow-hidden border-l-2 border-[#0066D6] bg-gradient-to-br from-[#EFF6FF] to-white p-8 shadow-sm lg:col-span-7 md:p-10">
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
            <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-[#0066D6]/5 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Organizational Chart Section */}
      <section className="border-b border-[#EFF6FF] bg-[#123B63] py-20 text-white md:py-24">
        <div className="container-custom mx-auto max-w-[1100px] px-4">
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
          <div className="relative mt-16">
            {/* Vertical Line */}
            <div className="absolute bottom-10 left-5 top-10 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0 sm:left-1/2 sm:-translate-x-1/2" />
            
            <div className="space-y-6 sm:space-y-8">
              {displayedLeadership.map((node, index) => (
                <div
                  key={node.role}
                  className={`relative flex items-center gap-4 sm:gap-8 ${
                    index % 2 === 1 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Card */}
                  <div className="group flex-1 rounded-xl border border-white/10 bg-gradient-to-br from-[#0D2F4E] to-[#0A233B] p-5 shadow-2xl transition-all duration-300 hover:border-[#0066D6]/50 hover:shadow-[0_0_30px_rgba(0,102,214,0.15)] sm:p-6">
                    <div className="flex items-start gap-4 sm:gap-5">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 translate-x-1 translate-y-1 rounded-full bg-[#0066D6]/20" />
                        <img
                          src={node.image}
                          alt={`${node.name} - ${node.role}`}
                          className="relative h-20 w-20 rounded-full border-2 border-[#0066D6] bg-white object-contain p-1 sm:h-24 sm:w-24"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066D6]">
                          {node.level}
                        </div>
                        <p className="mt-1 text-sm font-600 text-white/90">
                          {node.name}
                        </p>
                        <h2 className="mt-1 font-heading text-lg font-700 uppercase tracking-[0.05em] text-white">
                          {node.role}
                        </h2>
                      </div>
                    </div>
                    
                    {/* INDIVIDUAL SCROLLER FOR LONG TEXT */}
                    <div className="mt-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                      <p className="text-sm leading-relaxed text-white/60">
                        {node.description}
                      </p>
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-[#123B63] bg-[#0066D6] font-mono text-sm font-700 shadow-lg sm:h-12 sm:w-12">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  
                  <div className="hidden flex-1 sm:block" />
                </div>
              ))}
            </div>
            
            <ChevronDown
              className="absolute -bottom-6 left-0 h-6 w-6 translate-x-[8px] text-[#0066D6] sm:left-1/2 sm:-translate-x-1/2"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Employees Carousel Section */}
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
          
          <div className="mt-12 flex items-center justify-between gap-4 border-b border-[#EFF6FF] pb-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#123B63]/60">
              Showing <span className="font-700 text-[#123B63]">{employeeStart + 1}-{Math.min(employeeStart + visibleEmployees, displayedEmployees.length)}</span> of {displayedEmployees.length}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEmployeeStart((start) => Math.max(0, start - 1))}
                disabled={!canGoBack}
                aria-label="Previous employees"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123B63]/15 bg-white text-[#123B63] shadow-sm transition-all duration-300 hover:-translate-x-0.5 hover:border-[#0066D6] hover:bg-[#0066D6] hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setEmployeeStart((start) =>
                    Math.min(displayedEmployees.length - visibleEmployees, start + 1),
                  )
                }
                disabled={!canGoForward}
                aria-label="Next employees"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123B63]/15 bg-white text-[#123B63] shadow-sm transition-all duration-300 hover:translate-x-0.5 hover:border-[#0066D6] hover:bg-[#0066D6] hover:text-white disabled:pointer-events-none disabled:opacity-30"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleEmployeeCards.map((member, index) => (
              <article
                key={member.role}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#EFF6FF] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0066D6]/30 hover:shadow-xl hover:shadow-[#0066D6]/5"
              >
                {/* Fixed image area */}
                <div className="relative h-64 w-full shrink-0 overflow-hidden bg-[#F8FAFC] sm:h-72">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 rounded-md bg-[#123B63] px-2.5 py-1 font-mono text-xs font-600 text-white shadow-sm">
                    {String(employeeStart + index + 1).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Content area */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0066D6]">
                    {member.name}
                  </p>
                  <h2 className="mt-1.5 font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
                    {member.role}
                  </h2>
                  
                  {/* INDIVIDUAL SCROLLER FOR EMPLOYEE TEXT (Fixed Height) */}
                  <div className="mt-3 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar-light">
                    <p className="text-sm leading-relaxed text-[#123B63]/70">
                      {member.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Scrollbar Styles */}
      <style>{`
        /* Scrollbar for Dark Chart Section */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 102, 214, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 102, 214, 0.8);
        }

        /* Scrollbar for Light Employee Cards */
        .custom-scrollbar-light::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-track {
          background: #F1F5F9;
          border-radius: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 4px;
        }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </>
  );
}