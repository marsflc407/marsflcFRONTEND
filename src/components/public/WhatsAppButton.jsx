import { Phone } from "lucide-react";
import { COMPANY } from "@/config/company";

function WhatsAppButton() {
  return (
    <a
      href={COMPANY.phoneHref}
      aria-label={`Call ${COMPANY.shortName}`}
      title={`Call ${COMPANY.shortName}`}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 active:scale-95"
    >
      <Phone className="relative z-10 h-7 w-7" />
      <span
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30"
        aria-hidden="true"
      />
    </a>
  );
}

export default WhatsAppButton;
