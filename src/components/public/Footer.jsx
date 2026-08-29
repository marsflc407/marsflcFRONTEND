import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { COMPANY } from "@/config/company";
import { footerSettingsAPI } from "@/utils/api";

const DEFAULT_SETTINGS = {
  brandName: COMPANY.name,
  description: COMPANY.description,
  quickLinks: [
    { label: "Home", to: "/" },
    { label: "Contact Point Verification", to: "/cpv" },
    { label: "Debt Collection", to: "/debt-collection" },
    { label: "About Us", to: "/company-overview" },
    { label: "Contact", to: "/contact" },
  ],
  officeTitle: "Head Office",
  address: COMPANY.address,
  phone: COMPANY.phone,
  phoneHref: COMPANY.phoneHref,
  email: COMPANY.email,
  hoursTitle: "Operational Hours",
  hours: [
    { title: "Call Center", value: "24 / 7 / 365" },
    { title: "Field Operations", value: "Sun-Fri - 8AM-8PM" },
    { title: "Reporting TAT", value: "30-Minute Feedback" },
  ],
  socialLinks: [],
  website: COMPANY.website,
  websiteHref: COMPANY.websiteHref,
  copyrightText: `${COMPANY.name} (MARS FLC). All rights reserved.`,
};

const buildings = [
  "h-8 w-6",
  "h-14 w-8",
  "h-10 w-7",
  "h-20 w-9",
  "h-12 w-6",
  "h-16 w-8",
  "h-9 w-7",
  "h-24 w-10",
  "h-13 w-7",
  "h-18 w-8",
  "h-11 w-6",
];

function Footer() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    footerSettingsAPI
      .get()
      .then((response) => {
        if (response?.data) {
          setSettings((current) => ({
            ...current,
            ...response.data,
            quickLinks: response.data.quickLinks?.length
              ? response.data.quickLinks
              : current.quickLinks,
            hours: response.data.hours?.length
              ? response.data.hours
              : current.hours,
            socialLinks: response.data.socialLinks || [],
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative overflow-hidden bg-[#123B63] text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <section>
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logo}
                alt="Mars Financial & Legal Consultancy (MARS FLC)"
                className="h-11 w-11 object-contain"
              />
              <div className="font-heading text-sm font-700 uppercase tracking-[0.15em]">
                {settings.brandName}
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              {settings.description}
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-sm text-white/70">
              {settings.quickLinks.map((link, index) => (
                <li key={`${link.to}-${index}`}>
                  {link.to?.startsWith("http") ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to || "/"}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            {settings.socialLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
                {settings.socialLinks.map((social, index) => (
                  <a
                    key={`${social.platform}-${index}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-white"
                  >
                    <ExternalLink
                      className="h-4 w-4 text-[#0066D6]"
                      aria-hidden="true"
                    />
                    {social.platform}
                  </a>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              {settings.officeTitle}
            </h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0066D6]" />
                <span>{settings.address}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0066D6]" />
                <a
                  href={settings.phoneHref}
                  className="font-mono transition-colors hover:text-white"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0066D6]" />
                <a
                  href={`mailto:${settings.email}`}
                  className="font-mono transition-colors hover:text-white"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              {settings.hoursTitle}
            </h2>
            <div className="space-y-3 text-sm text-white/70">
              {settings.hours.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className={`border-l-2 ${index === 0 ? "border-[#0066D6]" : "border-white/30"} pl-3`}
                >
                  <div className="font-heading font-600 text-white">
                    {item.title}
                  </div>
                  <div className="font-mono text-xs">{item.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="relative mt-14 h-24 border-b border-white/10">
          <div
            className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2 opacity-30"
            aria-hidden="true"
          >
            {buildings.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={`${height} bg-[#0066D6]`}
              />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-[#0066D6]" />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-white/40 sm:flex-row">
          <Link
            to="/admin/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white"
            aria-label="Open MARS FLC admin dashboard"
          >
            Copyright {new Date().getFullYear()} {settings.copyrightText}
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-end">
            <a
              href={settings.websiteHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono uppercase tracking-[0.2em] hover:text-white"
            >
              {settings.website}
            </a>
            <span className="text-white/25" aria-hidden="true">
              /
            </span>
            <a
              href="https://www.linkedin.com/in/fahim-bafu/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Developed By Bafu
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
