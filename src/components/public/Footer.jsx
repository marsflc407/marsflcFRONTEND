import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { COMPANY } from "@/config/company";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Contact Point Verification", to: "/cpv" },
  { label: "Debt Collection", to: "/debt-collection" },
  { label: "About Us", to: "/company-overview" },
  { label: "Contact", to: "/contact" },
];

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
                {COMPANY.name}
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              {COMPANY.description}
            </p>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Quick Links
            </h2>
            <ul className="space-y-2.5 text-sm text-white/70">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Head Office
            </h2>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0066D6]" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#0066D6]" />
                <a
                  href={COMPANY.phoneHref}
                  className="font-mono transition-colors hover:text-white"
                >
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#0066D6]" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="font-mono transition-colors hover:text-white"
                >
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Operational Hours
            </h2>
            <div className="space-y-3 text-sm text-white/70">
              <div className="border-l-2 border-[#0066D6] pl-3">
                <div className="font-heading font-600 text-white">
                  Call Center
                </div>
                <div className="font-mono text-xs">24 / 7 / 365</div>
              </div>
              <div className="border-l-2 border-white/30 pl-3">
                <div className="font-heading font-600 text-white">
                  Field Operations
                </div>
                <div className="font-mono text-xs">Sun-Fri - 8AM-8PM</div>
              </div>
              <div className="border-l-2 border-white/30 pl-3">
                <div className="font-heading font-600 text-white">
                  Reporting TAT
                </div>
                <div className="font-mono text-xs">30-Minute Feedback</div>
              </div>
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
          <p>
            Copyright {new Date().getFullYear()} Mars Financial & Legal
            Consultancy (MARS FLC). All rights reserved.
          </p>
          <a
            href={COMPANY.websiteHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono uppercase tracking-[0.2em] hover:text-white"
          >
            {COMPANY.website}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
