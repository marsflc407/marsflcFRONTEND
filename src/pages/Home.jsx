import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileSearch,
  Users,
  Award,
  Target,
  Lightbulb,
  PhoneCall,
  Database,
  Clock,
  Bike,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  SectionLabel,
  SectionHeader,
  ValueCard,
} from "@/components/site/primitives";
import HeroSlider from "@/components/public/HeroSlider";
import ServiceCard from "@/components/public/ServiceCard";
import { COMPANY, SERVICES as COMPANY_SERVICES } from "@/config/company";
import { serviceAPI } from "@/utils/api";

const HERO_IMG =
  "https://media.base44.com/images/public/6a722bde599ffd853c421721/64e1feac0_generated_a2814cae.png";

function Welcome() {
  return (
    <section className="border-b border-[#EFF6FF] py-24">
      <div className="container-custom mx-auto max-w-[1400px] px-4">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel>Welcome to MARS FLC</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.15] text-[#123B63] sm:text-4xl md:text-5xl">
              The Metric of Certainty in Credit Risk Management
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-[#123B63]/75">
              <p>{COMPANY.description}</p>
              <p>
                MARS FLC provides practical, confidential support for financial
                institutions through disciplined processes and professional
                service delivery.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/company-overview"
                className="border border-[#27578d] bg-[#27578d] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white rounded-md transition-colors hover:bg-[#1f4775] hover:border-[#1f4775]"
              >
                About MARS FLC
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-[#EFF6FF]">
              {COMPANY_SERVICES.map((service, index) => (
                <div key={service} className="bg-white p-8">
                  <div className="font-mono text-4xl font-700 text-[#0066D6]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-[0.15em] text-[#123B63]/60">
                    {service}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    serviceAPI
      .getAll()
      .then((response) => {
        if (response?.data?.length) setServices(response.data);
      })
      .catch(() => {});
  }, []);

  const serviceItems = services.length
    ? services.map((service) => ({
        title: service.title,
        description: service.description,
        to: service.type === "cpv" ? "/cpv" : "/debt-collection",
      }))
    : [
        {
          title: "Contact Point Verification (CPV)",
          description:
            "Structured contact point verification for financial and legal decision-making.",
          to: "/cpv",
        },
        {
          title: "Debt Collection",
          description:
            "Professional debt collection and recovery support for banking and non-banking financial institutions.",
          to: "/debt-collection",
        },
      ];

  return (
    <section className="border-b border-[#EFF6FF] py-24">
      <div className="container-custom mx-auto max-w-[1400px] px-4">
        <SectionHeader
          label="Our Services"
          title="The Triptych of Trust"
          intro="Consultancy services for banking and non-banking financial institutions."
        />
        <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-2">
          {serviceItems.map((s) => (
            <ServiceCard
              key={s.title}
              icon={
                s.title.toLowerCase().includes("contact") ? (
                  <FileSearch className="h-10 w-10" />
                ) : (
                  <ShieldCheck className="h-10 w-10" />
                )
              }
              title={s.title}
              description={s.description}
              link={s.to}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Values() {
  const values = [
    {
      icon: <ShieldCheck className="h-7 w-7" />,
      title: "Dependable",
      description:
        "Client confidentiality and staff reliability form the bedrock of every engagement.",
    },
    {
      icon: <Target className="h-7 w-7" />,
      title: "Proficient",
      description:
        "High accuracy and on-time delivery, governed by disciplined operational protocols.",
    },
    {
      icon: <Award className="h-7 w-7" />,
      title: "Professional",
      description:
        "A team of watchdogs ensuring ethical conduct and uncompromising standards.",
    },
    {
      icon: <Users className="h-7 w-7" />,
      title: "Dedication",
      description:
        "A committed workforce aligned to recovery targets and client outcomes.",
    },
    {
      icon: <Lightbulb className="h-7 w-7" />,
      title: "Innovation",
      description:
        "Fostering creativity in risk management through technology and method.",
    },
  ];
  return (
    <section className="border-b border-[#EFF6FF] py-24">
      <div className="container-custom mx-auto max-w-[1400px] px-4">
        <SectionHeader
          label="Values & Philosophy"
          title="Five Principles, One Standard"
          intro="The principles that guide MARS FLC in legal and financial consultancy work."
        />
        <div className="mt-12 grid gap-px bg-[#EFF6FF] sm:grid-cols-2 lg:grid-cols-5">
          {values.map((v, i) => (
            <ValueCard key={v.title} index={i + 1} {...v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OperationalExcellence() {
  const items = [
    {
      icon: <PhoneCall className="h-6 w-6" />,
      title: "WhatsApp-Based Feedback",
      desc: "Real-time reporting loop with clients for verified outcomes.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Custom CRM",
      desc: "Proprietary system driving automated MIS and traceable workflows.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "30-Minute Reporting",
      desc: "Industry-leading turnaround on every verification and recovery action.",
    },
    {
      icon: <PhoneCall className="h-6 w-6" />,
      title: "24/7 Call Center",
      desc: "High-capacity operations with full call recording facilities.",
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: "Cloud-Based Data",
      desc: "Secure, redundant data facilities protecting client information.",
    },
    {
      icon: <Bike className="h-6 w-6" />,
      title: "Field Logistics",
      desc: "Auto repossession team, bikes and cars for emergency visits.",
    },
  ];
  return (
    <section className="bg-[#123B63] py-24 text-white">
      <div className="container-custom mx-auto max-w-[1400px] px-4">
        <SectionHeader
          label="Operational Excellence & Infrastructure"
          title={<span className="text-white">Architected for Velocity</span>}
          intro="Technology, infrastructure and logistics engineered into a single recovery machine."
        />
        <div className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="bg-[#123B63] p-8 transition-colors hover:bg-[#0D2F4E]"
            >
              <div className="text-[#0066D6]">{it.icon}</div>
              <h3 className="mt-5 font-heading text-base font-700 uppercase tracking-[0.05em]">
                {it.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExpertInsight() {
  const points = [
    "Regulatory compliance and ethical recovery methodology.",
    "Demonstrable technology Ã¢â‚¬â€ CRM, MIS and real-time reporting.",
    "Verifiable track record with named financial institutions.",
    "Dedicated field infrastructure, not outsourced contractors.",
    "Strict confidentiality and data governance protocols.",
  ];
  return (
    <section className="border-b border-[#EFF6FF] py-24">
      <div className="container-custom mx-auto max-w-[1400px] px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel>Expert Insight</SectionLabel>
            <h2 className="mt-4 font-heading text-3xl font-700 leading-[1.15] text-[#123B63] sm:text-4xl">
              Top 5 Things to Look for When Choosing a Debt Collection Agency
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[#123B63]/70">
              Not all recovery partners are built on the same infrastructure.
              These are the evaluation criteria that separate a dependable
              agency from a liability.
            </p>
          </div>
          <div className="border border-[#EFF6FF] bg-white p-8">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Evaluation Criteria
            </div>
            <ol className="mt-6 space-y-5">
              {points.map((p, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#123B63] font-mono text-sm font-700 text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 leading-relaxed text-[#123B63]/80">
                    {p}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Welcome />
      <Services />
      <Values />
      <OperationalExcellence />
      <ExpertInsight />
    </>
  );
}
