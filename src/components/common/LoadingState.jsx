import { Loader2 } from "lucide-react";

export default function LoadingState({ label = "Loading...", className = "" }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex min-h-screen w-screen items-center justify-center overflow-hidden rounded-none border-0 bg-gradient-to-br from-[#EFF6FF]/60 via-white to-[#EFF6FF]/40 shadow-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Decorative gradient orbs */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-[#0066D6]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[#123B63]/10 blur-3xl" />

      {/* Subtle grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #123B63 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-5 px-6 py-10 text-center">
        {/* Spinner with outer glow ring */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#0066D6]/10" />
          <span className="absolute inset-0 rounded-full border border-[#0066D6]/20" />
          <span className="absolute inset-1.5 rounded-full border border-dashed border-[#0066D6]/15" />
          <Loader2
            className="relative h-7 w-7 animate-spin text-[#0066D6]"
            aria-hidden="true"
          />
        </div>

        {/* Animated gradient text label */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="bg-gradient-to-r from-[#123B63] via-[#0066D6] to-[#123B63] bg-[length:200%_auto] bg-clip-text text-base font-medium tracking-wide text-transparent animate-shimmer">
            {label}
          </span>
          <span className="h-1 w-16 overflow-hidden rounded-full bg-[#EFF6FF]">
            <span className="block h-full w-1/2 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-[#0066D6] to-transparent" />
          </span>
        </div>

        {/* Small caption */}
        <p className="text-xs uppercase tracking-[0.2em] text-[#123B63]/40">
          Please wait
        </p>
      </div>

      {/* Keyframes for shimmer — add once if not already in your global CSS */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}