import { useEffect, useState } from "react";
import { PARTNERS } from "@/config/partners";
import { partnerCompanyAPI } from "@/utils/api";

function PartnerGroup({ partners, hidden = false }) {
  return (
    <div className="partner-ticker__group" aria-hidden={hidden}>
      {partners.map((partner) => (
        <div key={partner.name} className="partner-ticker__item">
          {partner.image ? (
            <img
              src={partner.image}
              alt={hidden ? "" : `${partner.name} logo`}
              className="partner-ticker__logo"
            />
          ) : (
            <span
              className="partner-ticker__logo flex items-center justify-center bg-[#123B63] font-heading text-[10px] font-700 uppercase text-white"
              aria-hidden="true"
            >
              {partner.monogram || partner.name.slice(0, 2)}
            </span>
          )}
          <span>{partner.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function PartnerTicker({ compact = false }) {
  const [partners, setPartners] = useState(PARTNERS);

  useEffect(() => {
    let active = true;

    partnerCompanyAPI
      .getAll()
      .then((response) => {
        if (active && response?.data?.length) setPartners(response.data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section
      className={`partner-ticker ${compact ? "partner-ticker--compact" : ""}`}
      aria-label="Partner and company ticker"
    >
      {!compact && (
        <div className="mx-auto max-w-[1400px] px-4 py-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#0066D6]" aria-hidden="true" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#0066D6]">
              Partner Network
            </p>
          </div>
        </div>
      )}
      <div className="partner-ticker__viewport">
        <div className="partner-ticker__track">
          <PartnerGroup partners={partners} />
          <PartnerGroup partners={partners} hidden />
        </div>
      </div>
    </section>
  );
}
