import React, { createElement } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  ImagePlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Hero Slides",
    description: "Manage Home hero images, titles, descriptions and order.",
    to: "/admin/hero-slides",
    icon: ImagePlus,
  },
  {
    title: "Home Content",
    description: "Create, edit, activate or delete text sections used by Home.",
    to: "/admin/content?page=home",
    icon: FileText,
  },
  {
    title: "Home Services",
    description: "Add, edit or delete the services shown on the Home page.",
    to: "/admin/services",
    icon: BriefcaseBusiness,
  },
];

export default function HomeManager() {
  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Admin Control Center
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Home Page
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#123B63]/65">
            Manage every database-backed part of the Home page from one place.
          </p>
        </div>
        <div className="mt-8 grid gap-px bg-[#123B63]/10 md:grid-cols-3">
          {tools.map(({ title, description, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group bg-white p-7 transition-colors hover:bg-[#123B63] hover:text-white"
            >
              {createElement(Icon, {
                className: "h-6 w-6 text-[#0066D6]",
                "aria-hidden": true,
              })}
              <h2 className="mt-8 font-heading text-xl font-700">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65 group-hover:text-white/70">
                {description}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[#0066D6]">
                Open manager{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 border-l-2 border-[#0066D6] bg-white px-4 py-3 text-sm text-[#123B63]/70">
          The Home page keeps its current default content until you add active
          records in these managers.
        </p>
      </div>
    </div>
  );
}
