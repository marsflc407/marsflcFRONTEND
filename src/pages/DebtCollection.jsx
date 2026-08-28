import React, { createElement, useEffect, useState } from "react";
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
import { debtCollectionSettingsAPI } from "@/utils/api";

const FLEET_IMG = [
  "https://media.base44.com/images/public/6a722bde599ffd853c421721/64fac9e0d_generated_603e1514.png",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85",
];

const DEFAULT_SETTINGS = {
  heroLabel: "Debt Collection",
  heroTitle: "Sovereign Authority in Recovery",
  heroIntro:
    "Debt collection and recovery support for banking and non-banking financial institutions, delivered with professional and responsible service.",
  heroImages: FLEET_IMG,
  servicesLabel: "Core Collection Services",
  servicesTitle: "Three Tiers of Recovery",
  servicesIntro:
    "Structured recovery modules covering the full lifecycle of delinquency.",
  services: [
    {
      icon: "Coins",
      title: "Standard Debt Collection",
      description:
        "Early-stage amicable recovery designed to preserve the client-borrower relationship.",
      isActive: true,
    },
    {
      icon: "MapPin",
      title: "Field Visit & Skip Tracing",
      description:
        "Locating and engaging delinquent borrowers through disciplined field intelligence.",
      isActive: true,
    },
    {
      icon: "FileWarning",
      title: "Long Overdue & NPL Recovery",
      description:
        "Resolution of non-performing loans through structured, persistent engagement.",
      isActive: true,
    },
  ],
  specializedLabel: "Specialized Support",
  specializedTitle: "Beyond Amicable Recovery",
  specializedIntro:
    "MARS FLC also provides legal and financial support relevant to recovery requirements.",
  specialized: [
    {
      icon: "Car",
      title: "Asset Repossession Support",
      description:
        "A dedicated auto repossession team for secured-loan recovery, operating within legal boundaries.",
      isActive: true,
    },
    {
      icon: "Scale",
      title: "Legal Collection Support",
      description:
        "Documentation preparation and coordination with legal counsel for escalated matters.",
      isActive: true,
    },
  ],
  advantagesLabel: "Competitive Advantages",
  advantagesTitle: "Focused recovery support",
  advantages: [
    {
      icon: "ShieldCheck",
      title: "Ethical & Law-Compliant Recovery",
      description:
        "Every action governed by regulatory and ethical boundaries.",
      isActive: true,
    },
    {
      icon: "Eye",
      title: "Professional Oversight",
      description: "A team of watchdogs ensuring conduct at every level.",
      isActive: true,
    },
    {
      icon: "Users2",
      title: "Dedicated Recovery Team",
      description: "Specialised squads aligned to portfolio and geography.",
      isActive: true,
    },
    {
      icon: "Cpu",
      title: "Technology-Driven MIS",
      description: "Daily reports and 30-minute feedback on every action.",
      isActive: true,
    },
  ],
  infrastructureLabel: "Infrastructure",
  infrastructureTitle: "A Recovery Machine, Always Running",
  infrastructure: [
    {
      icon: "PhoneCall",
      title: "24/7 High-Capacity Call Center",
      desc: "Continuous outreach with full recording facilities.",
    },
    {
      icon: "Users2",
      title: "Rapid Movement Team",
      desc: "Squads on standby for emergency field deployment.",
    },
    {
      icon: "Bike",
      title: "Dedicated Vehicle Fleet",
      desc: "Bikes and cars enabling nationwide reach.",
    },
  ],
  buttonLabel: "Engage MARS FLC for Recovery",
  buttonUrl: "/contact",
};

const ICONS = {
  Coins,
  MapPin,
  FileWarning,
  Car,
  Scale,
  ShieldCheck,
  Eye,
  Users2,
  Cpu,
  PhoneCall,
  Bike,
};

export default function DebtCollection() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    debtCollectionSettingsAPI
      .get()
      .then((response) => {
        if (response?.data)
          setSettings((current) => ({ ...current, ...response.data }));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageHero
        label={settings.heroLabel}
        title={settings.heroTitle}
        intro={settings.heroIntro}
        image={settings.heroImages}
      />

      {/* Core Collection Services */}
      <section className="border-b border-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={settings.servicesLabel}
            title={settings.servicesTitle}
            intro={settings.servicesIntro}
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-3">
            {settings.services
              .filter((item) => item.isActive !== false)
              .map((s, i) => (
                <div
                  key={s.title}
                  className="group bg-white p-10 transition-colors hover:bg-[#123B63] hover:text-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[#0066D6] transition-colors group-hover:text-white">
                      {createElement(ICONS[s.icon] || Coins, {
                        className: "h-7 w-7",
                      })}
                    </div>
                    <span className="font-mono text-xs text-[#123B63]/30 group-hover:text-white/30">
                      TIER 0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-700 uppercase tracking-[0.03em]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65 group-hover:text-white/65">
                    {s.description}
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
            label={settings.specializedLabel}
            title={
              <span className="text-white">{settings.specializedTitle}</span>
            }
            intro={settings.specializedIntro}
          />
          <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-2">
            {settings.specialized
              .filter((item) => item.isActive !== false)
              .map((s) => (
                <div key={s.title} className="bg-[#123B63] p-10">
                  <div className="text-[#0066D6]">
                    {createElement(ICONS[s.icon] || Car, {
                      className: "h-7 w-7",
                    })}
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-700 uppercase tracking-[0.03em]">
                    {s.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-white/65">
                    {s.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={settings.advantagesLabel}
            title={settings.advantagesTitle}
            intro={settings.advantagesIntro}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {settings.advantages
              .filter((item) => item.isActive !== false)
              .map((a) => (
                <div
                  key={a.title}
                  className="flex gap-5 border border-[#123B63]/10 bg-white p-8"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#0066D6] text-white">
                    {createElement(ICONS[a.icon] || ShieldCheck, {
                      className: "h-5 w-5",
                    })}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
                      {a.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#123B63]/65">
                      {a.description}
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
            label={settings.infrastructureLabel}
            title={settings.infrastructureTitle}
          />
          <div className="mt-12 grid gap-px bg-[#EFF6FF] md:grid-cols-3">
            {settings.infrastructure
              .filter((item) => item.isActive !== false)
              .map((it) => (
                <div key={it.title} className="bg-white p-10">
                  <div className="text-[#0066D6]">
                    {createElement(ICONS[it.icon] || PhoneCall, {
                      className: "h-7 w-7",
                    })}
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-700 uppercase tracking-[0.03em] text-[#123B63]">
                    {it.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                    {it.description || it.desc}
                  </p>
                </div>
              ))}
          </div>
          <div className="mt-12">
            <Link to={settings.buttonUrl || "/contact"} className="btn-crimson">
              {settings.buttonLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
