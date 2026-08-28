import React, { useEffect, useState } from "react";
import { heroImageAPI } from "@/utils/api";

export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#0066D6]" />
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
        {children}
      </span>
    </div>
  );
}

export function SectionHeader({
  label,
  title,
  intro,
  align = "left",
  inverse = false,
}) {
  return (
    <div
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {label && (
        <div className={align === "center" ? "flex justify-center" : ""}>
          <SectionLabel>{label}</SectionLabel>
        </div>
      )}
      <h2
        className={`mt-4 font-heading text-3xl font-700 leading-[1.1] sm:text-4xl md:text-5xl ${inverse ? "text-white" : "text-[#123B63]"}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-lg leading-relaxed ${inverse ? "text-white/70" : "text-[#123B63]/70"}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}

export function PageHero({ label, title, intro, image }) {
  const fallbackImages = Array.isArray(image) ? image : image ? [image] : [];
  const [heroImages, setHeroImages] = useState(fallbackImages);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setHeroImages(fallbackImages);
    setCurrentImage(0);
  }, [image]);

  useEffect(() => {
    heroImageAPI
      .getAll()
      .then((uploadedImages) => {
        if (uploadedImages.length) {
          setHeroImages([...new Set([...uploadedImages, ...fallbackImages])]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (heroImages.length < 2) return undefined;
    const interval = window.setInterval(() => {
      setCurrentImage((index) => (index + 1) % heroImages.length);
    }, 3000);
    return () => window.clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative bg-[#123B63] text-white">
      {image && (
        <div className="absolute inset-0">
          <img
            key={currentImage}
            src={heroImages[currentImage % heroImages.length]}
            alt=""
            className="hero-slide-in h-full w-full object-cover"
          />
        </div>
      )}
      <div className="relative mx-auto max-w-[1400px] px-4 py-24 md:py-32">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl font-800 leading-[1.05] sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}

export function ValueCard({ icon, title, description, index }) {
  return (
    <div className="group relative border border-[#EFF6FF] bg-white p-8 transition-all duration-300 hover:border-[#0066D6] hover:shadow-xl">
      <div className="absolute left-0 top-0 h-1 w-0 bg-[#0066D6] transition-all duration-500 group-hover:w-full" />
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[#0066D6]">{icon}</div>
        <span className="font-mono text-xs text-[#123B63]/30">0{index}</span>
      </div>
      <h3 className="font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
        {description}
      </p>
    </div>
  );
}
