import { createElement } from "react";
import {
  ArrowRight,
  Building2,
  FileText,
  ImagePlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    title: "Overview Content",
    description:
      "Create, edit, activate or delete Company Overview page sections.",
    to: "/admin/content?page=company-overview",
    icon: Building2,
  },
  {
    title: "About Us",
    description:
      "Manage all About Us headings, descriptions, buttons and links.",
    to: "/admin/content?page=about",
    icon: FileText,
  },
  {
    title: "Management",
    description: "Manage leadership, principles, focus areas and team content.",
    to: "/admin/content?page=management",
    icon: Users,
  },
  {
    title: "Our Family",
    description: "Manage family, hierarchy and employee profile content.",
    to: "/admin/content?page=family",
    icon: Users,
  },
  {
    title: "Sister Concern",
    description:
      "Manage sister concern headings, service cards and descriptions.",
    to: "/admin/content?page=sister-concern",
    icon: FileText,
  },
  {
    title: "Company Images",
    description:
      "Upload, replace and delete images used by Company Overview pages.",
    to: "/admin/images",
    icon: ImagePlus,
  },
];

export default function CompanyOverviewManager() {
  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Site Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Company Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#123B63]/65">
            Manage the overview page and every linked Company Overview page from
            one control center.
          </p>
        </div>
        <div className="mt-8 grid gap-px bg-[#123B63]/10 sm:grid-cols-2 lg:grid-cols-3">
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
                Open manager <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-8 border-l-2 border-[#0066D6] bg-white px-4 py-3 text-sm text-[#123B63]/70">
          Use Company Overview images in the Image Manager with the Company
          Overview section selected. Changes to active content and images are
          reflected on the public site.
        </p>
      </div>
    </div>
  );
}
