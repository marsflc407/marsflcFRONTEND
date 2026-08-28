import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPANY } from "@/config/company";
import { heroSlideAPI } from "@/utils/api";

const heroImage =
  "https://media.base44.com/images/public/6a722bde599ffd853c421721/64e1feac0_generated_a2814cae.png";
const fallbackHeroImages = [
  heroImage,
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85",
];

const slides = [
  {
    eyebrow: "Mars Financial & Legal Consultancy",
    title: "Legal and Financial",
    highlight: "Consultancy Support",
    description: COMPANY.description,
    image: heroImage,
  },
  {
    eyebrow: "Debt Collection & Recovery",
    title: "Structured Recovery",
    highlight: "Support for Institutions",
    description:
      "Professional debt collection and recovery support for banking and non-banking financial institutions.",
    image: heroImage,
  },
  {
    eyebrow: "Contact Point Verification (CPV)",
    title: "Clear Information",
    highlight: "for Better Decisions",
    description:
      "Careful contact point verification supporting responsible legal and financial decisions.",
    image: heroImage,
  },
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [managedSlides, setManagedSlides] = useState([]);

  const visibleSlides = managedSlides.length ? managedSlides : slides;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentSlide((slide) => (slide + 1) % visibleSlides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [visibleSlides.length]);

  useEffect(() => {
    heroSlideAPI
      .getAll()
      .then((response) => {
        if (response?.data?.length) setManagedSlides(response.data);
      })
      .catch(() => {});
  }, []);

  const goToSlide = (slide) => {
    setCurrentSlide((slide + visibleSlides.length) % visibleSlides.length);
  };

  const slide = visibleSlides[currentSlide % visibleSlides.length];

  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-[#123B63] text-white sm:min-h-[84vh]">
      <div className="absolute inset-0">
        <img
          key={currentSlide}
          src={
            slide.image ||
            fallbackHeroImages[currentSlide % fallbackHeroImages.length]
          }
          alt=""
          className="hero-slide-in absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-20 sm:py-24">
        <div className="max-w-3xl" key={currentSlide}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            {slide.eyebrow}
          </p>
          <h1 className="mt-6 font-heading text-4xl font-800 uppercase leading-[1.05] sm:text-6xl lg:text-7xl">
            {slide.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            {slide.description}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/company-overview"
              className="border border-white/30 px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#123B63]"
            >
              Discover MARS FLC
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-7 left-4 right-4 flex items-center justify-between sm:bottom-10 sm:left-auto sm:right-10 sm:w-[220px]">
        <div className="flex items-center gap-2" aria-label="Choose slide">
          {visibleSlides.map((item, index) => (
            <button
              key={item._id || item.eyebrow}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : undefined}
              onClick={() => goToSlide(index)}
              className={`h-1.5 transition-all ${
                index === currentSlide
                  ? "w-10 bg-[#0066D6]"
                  : "w-5 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goToSlide(currentSlide - 1)}
            className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:border-[#0066D6] hover:bg-[#0066D6]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goToSlide(currentSlide + 1)}
            className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors hover:border-[#0066D6] hover:bg-[#0066D6]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
