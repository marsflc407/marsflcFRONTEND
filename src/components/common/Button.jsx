import { LoaderCircle } from "lucide-react";

const variantClasses = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary:
    "border border-primary text-primary hover:bg-primary hover:text-white",
  dark: "bg-dark text-white hover:bg-dark-light",
  link: "text-primary hover:text-dark hover:underline",
};

const sizeClasses = {
  sm: "min-h-8 px-3 py-1.5 text-xs",
  md: "min-h-10 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-7 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  onClick,
  children,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 font-heading font-600 uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60 ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {loading && (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}

export { variantClasses, sizeClasses };
