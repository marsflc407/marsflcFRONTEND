import React, { createElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  FileText,
  Settings2,
  Shield,
  Users,
} from "lucide-react";
import {
  contentAPI,
  serviceAPI,
  sisterConcernAPI,
  applicationAPI,
  partnerCompanyAPI,
  contactAPI,
} from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { NAV_ITEMS } from "@/components/admin/AdminLayout";

const STAT_CONFIG = [
  { key: "content", label: "Total Content", icon: FileText },
  { key: "services", label: "Services", icon: BriefcaseBusiness },
  { key: "sisterConcerns", label: "Sister Concerns", icon: Shield },
  { key: "partnerCompanies", label: "Partner Companies", icon: Building2 },
  { key: "applications", label: "Applications", icon: Users },
  { key: "messages", label: "Messages", icon: Mail },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    content: 0,
    services: 0,
    sisterConcerns: 0,
    partnerCompanies: 0,
    applications: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const responses = await Promise.all([
          contentAPI.getByPage("home"),
          serviceAPI.getAll(),
          sisterConcernAPI.getAll(),
          partnerCompanyAPI.getAll(),
          applicationAPI.getAll(),
          contactAPI.getMessages(),
        ]);
        setStats({
          content: responses[0]?.data?.length || 0,
          services: responses[1]?.data?.length || 0,
          sisterConcerns: responses[2]?.data?.length || 0,
          partnerCompanies: responses[3]?.data?.length || 0,
          applications: responses[4]?.data?.length || 0,
          messages: responses[5]?.data?.length || 0,
        });
      } catch (loadError) {
        setError(
          loadError?.response?.data?.message ||
            "Unable to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
          Control Center
        </p>
        <h1 className="mt-3 font-heading text-3xl font-700 md:text-4xl">
          Welcome back, {user?.name || "Administrator"}
        </h1>
        <p className="mt-2 text-[#123B63]/65">
          Here is the current shape of your MARS FLC workspace.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-8 border-l-2 border-[#0066D6] bg-white px-4 py-3 text-sm text-[#0066D6]"
        >
          {error}
        </p>
      )}
      <div className="mt-10 grid gap-px bg-[#123B63]/10 sm:grid-cols-2 xl:grid-cols-4">
        {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
          <div key={key} className="bg-white p-6">
            <div className="flex items-center justify-between">
              {createElement(Icon, {
                className: "h-5 w-5 text-[#0066D6]",
                "aria-hidden": true,
              })}
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#123B63]/40">
                Live
              </span>
            </div>
            <div className="mt-8 font-mono text-4xl font-700 text-[#123B63]">
              {loading ? "--" : stats[key]}
            </div>
            <div className="mt-2 text-sm text-[#123B63]/60">{label}</div>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Quick Actions
            </p>
            <h2 className="mt-2 font-heading text-2xl font-700">
              Keep the system moving
            </h2>
          </div>
          <Settings2 className="h-6 w-6 text-[#0066D6]" aria-hidden="true" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {NAV_ITEMS.slice(1).map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center justify-between border border-[#123B63]/10 bg-white p-5 transition-colors hover:border-[#0066D6]"
            >
              <span className="flex items-center gap-3 text-sm font-600">
                {createElement(Icon, {
                  className: "h-5 w-5 text-[#0066D6]",
                  "aria-hidden": true,
                })}{" "}
                Manage {label}
              </span>
              <span className="text-[#123B63]/30 transition-colors group-hover:text-[#0066D6]">
                -&gt;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
