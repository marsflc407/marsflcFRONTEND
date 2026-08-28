function ValueCard({ icon, title, description, index }) {
  return (
    <article className="group relative h-full min-w-0 border border-[#EFF6FF] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0066D6] hover:shadow-xl sm:p-8">
      <div className="absolute left-0 top-0 h-1 w-0 bg-[#0066D6] transition-all duration-500 group-hover:w-full" />
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[#0066D6]">{icon}</div>
        {index !== undefined && (
          <span className="font-mono text-xs text-[#123B63]/30">
            {String(index).padStart(2, "0")}
          </span>
        )}
      </div>
      <h2 className="font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63] sm:text-lg">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
        {description}
      </p>
    </article>
  );
}

export default ValueCard;
