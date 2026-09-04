import { useEffect, useState } from "react";
import { CalendarDays, ImageOff, Loader2, UserRound } from "lucide-react";
import { SectionHeader } from "@/components/site/primitives";
import { newsfeedAPI } from "@/utils/api";

const DEMO_NEWSFEEDS = [
  {
    _id: "demo-newsfeed-1",
    title: "Professional service, carefully delivered",
    content:
      "MARS Financial and Legal Consultancy Limited brings disciplined processes, clear communication, and dependable support to every client engagement.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    author: "MARS FINANCIAL AND LEGAL CONSULTANCY LIMITED",
    date: new Date().toISOString(),
  },
  {
    _id: "demo-newsfeed-2",
    title: "Building confidence through reliable outcomes",
    content:
      "Our teams combine practical expertise and thoughtful technology to support financial institutions with confidence and consistency.",
    author: "MARS FINANCIAL AND LEGAL CONSULTANCY LIMITED",
    date: new Date(Date.now() - 86400000).toISOString(),
  },
];

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Newsfeed() {
  const [newsfeeds, setNewsfeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadNewsfeeds = async () => {
      try {
        const response = await newsfeedAPI.getAll();
        const items = (response?.data || []).slice(0, 20);
        const sortedItems = [...items].sort(
          (first, second) =>
            new Date(second.date).getTime() - new Date(first.date).getTime(),
        );

        if (isMounted)
          setNewsfeeds(sortedItems.length ? sortedItems : DEMO_NEWSFEEDS);
      } catch {
        if (isMounted) setNewsfeeds(DEMO_NEWSFEEDS);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadNewsfeeds();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="MARS FLC / Newsfeed"
            title="Newsfeed"
            intro="Updates, insights, and moments from across MARS Financial and Legal Consultancy Limited."
          />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center border border-[#EFF6FF] bg-[#EFF6FF]/40">
              <div className="flex items-center gap-3 text-sm text-[#123B63]/65">
                <Loader2 className="h-5 w-5 animate-spin text-[#0066D6]" />
                Loading newsfeed...
              </div>
            </div>
          ) : newsfeeds.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center border border-[#EFF6FF] bg-[#EFF6FF]/40 px-6 text-center">
              <ImageOff className="h-8 w-8 text-[#0066D6]" />
              <h2 className="mt-4 font-heading text-xl font-700 text-[#123B63]">
                No news yet
              </h2>
              <p className="mt-2 text-sm text-[#123B63]/60">
                New updates will appear here as they are published.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {newsfeeds.map((newsfeed) => (
                <article
                  key={newsfeed._id || newsfeed.title}
                  className={`group overflow-hidden border border-[#EFF6FF] bg-white transition-shadow duration-300 hover:shadow-xl ${newsfeed.image ? "grid sm:grid-cols-[minmax(180px,0.8fr)_1.2fr]" : "block"}`}
                >
                  {newsfeed.image && (
                    <div className="relative min-h-56 bg-[#123B63] sm:min-h-full">
                      <img
                        src={newsfeed.image}
                        alt={newsfeed.title || "Newsfeed image"}
                        className="h-full min-h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="flex flex-col p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0066D6]">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {formatDate(newsfeed.date)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#123B63]/50">
                        <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                        {newsfeed.author || "Admin"}
                      </span>
                    </div>
                    <h2 className="mt-5 font-heading text-2xl font-700 leading-tight text-[#123B63]">
                      {newsfeed.title}
                    </h2>
                    <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-[#123B63]/70">
                      {newsfeed.content}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
