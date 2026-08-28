import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function ServiceCard({ icon, title, description, link }) {
  return (
    <article className="group relative h-full min-w-0 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-10">
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-[#0066D6] transition-transform duration-300 group-hover:scale-x-100" />
      <div className="text-[#0066D6] transition-colors duration-300 group-hover:text-[#0052AB]">
        {icon}
      </div>
      <h2 className="mt-6 font-heading text-xl font-700 uppercase tracking-[0.02em] text-[#123B63] sm:text-2xl">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[#123B63]/65 sm:text-base">
        {description}
      </p>
      <Link
        to={link}
        className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-600 uppercase tracking-[0.1em] text-[#0066D6] transition-colors hover:text-[#123B63]"
      >
        Know More
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </article>
  );
}

export default ServiceCard;
