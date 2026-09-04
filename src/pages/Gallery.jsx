import { useEffect, useState } from "react";
import { ImageOff, Loader2, Maximize2, X } from "lucide-react";
import { SectionHeader } from "@/components/site/primitives";
import { uploadAPI } from "@/utils/api";

const DEMO_GALLERY_IMAGES = [
  {
    _id: "demo-gallery-1",
    title: "Professional Collaboration",
    description: "People and ideas moving in the same direction.",
    url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    alt: "Professionals collaborating around a table",
  },
  {
    _id: "demo-gallery-2",
    title: "Focused Operations",
    description: "A disciplined approach to every client assignment.",
    url: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=85",
    alt: "Team meeting in a modern office",
  },
  {
    _id: "demo-gallery-3",
    title: "Trusted Service",
    description: "Clear communication supporting confident decisions.",
    url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    alt: "Business team standing together",
  },
  {
    _id: "demo-gallery-4",
    title: "Connected Teams",
    description: "Shared standards across every level of the organisation.",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
    alt: "Colleagues working together in an office",
  },
  {
    _id: "demo-gallery-5",
    title: "Modern Infrastructure",
    description: "Practical systems built for reliable delivery.",
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    alt: "Bright modern office interior",
  },
  {
    _id: "demo-gallery-6",
    title: "Work With Purpose",
    description: "Professional energy behind every outcome.",
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
    alt: "Team discussing work in an office",
  },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadGallery = async () => {
      try {
        const response = await uploadAPI.getGalleryImages();
        const galleryImages = (response?.data || []).slice(0, 20);
        if (isMounted)
          setImages(galleryImages.length ? galleryImages : DEMO_GALLERY_IMAGES);
      } catch {
        if (isMounted) {
          setImages(DEMO_GALLERY_IMAGES);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  return (
    <>
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="MARS FLC / Gallery"
            title="Gallery"
            intro="A closer look at the people, work, and moments behind our professional services."
          />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center border border-[#EFF6FF] bg-[#EFF6FF]/40">
              <div className="flex items-center gap-3 text-sm text-[#123B63]/65">
                <Loader2 className="h-5 w-5 animate-spin text-[#0066D6]" />
                Loading gallery...
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center border border-[#EFF6FF] bg-[#EFF6FF]/40 px-6 text-center">
              <ImageOff className="h-8 w-8 text-[#0066D6]" />
              <h2 className="mt-4 font-heading text-xl font-700 text-[#123B63]">
                No gallery images yet
              </h2>
              <p className="mt-2 text-sm text-[#123B63]/60">
                New images will appear here as they are added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image) => (
                <div
                  key={image._id || image.publicId || image.url}
                  className="group overflow-hidden border border-[#EFF6FF] bg-white"
                >
                  <button
                    type="button"
                    className="relative block aspect-[4/3] w-full overflow-hidden bg-[#123B63] text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0066D6]"
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View ${image.title || "gallery image"} full size`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || image.title || "MARS FLC gallery"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#123B63]/70 via-transparent to-transparent opacity-70" />
                    <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/40 bg-[#123B63]/40 text-white backdrop-blur-sm transition-colors group-hover:bg-[#0066D6]">
                      <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                  <div className="min-h-28 border-t-2 border-[#C62828] p-5">
                    <h2 className="font-heading text-lg font-700 text-[#123B63]">
                      {image.title || "Gallery image"}
                    </h2>
                    {image.description && (
                      <p className="mt-2 text-sm leading-relaxed text-[#123B63]/70">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071D30]/95 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title || "Full-size gallery image"}
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-white/30 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close full-size image"
          >
            <X className="h-5 w-5" />
          </button>
          <figure
            className="relative flex max-h-full max-w-6xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={
                selectedImage.alt || selectedImage.title || "MARS FLC gallery"
              }
              className="max-h-[80vh] max-w-full object-contain"
            />
            {(selectedImage.title || selectedImage.description) && (
              <figcaption className="mt-4 max-w-2xl text-center text-white">
                {selectedImage.title && (
                  <div className="font-heading text-xl font-700">
                    {selectedImage.title}
                  </div>
                )}
                {selectedImage.description && (
                  <div className="mt-1 text-sm text-white/70">
                    {selectedImage.description}
                  </div>
                )}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
