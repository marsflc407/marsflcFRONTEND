import React, { useEffect, useRef, useState } from "react";
import { SectionHeader, SectionLabel } from "@/components/site/primitives";
import { applicationAPI, careerAPI, uploadAPI } from "@/utils/api";
import careerHeroImage from "@/assets/carrerHero.jpeg";
import {
  ShieldCheck,
  Search,
  FileText,
  CheckCircle2,
  Send,
} from "lucide-react";
const BG_CHECK = [
  {
    group: "Professional History",
    items: [
      "Employment tenure verification",
      "Previous role performance",
      "Industry references",
    ],
  },
  {
    group: "Legal & Conduct",
    items: [
      "Criminal record check",
      "Civil litigation history",
      "Conduct & integrity review",
    ],
  },
  {
    group: "Financial & Personal",
    items: ["Credit standing assessment", "Address and identity verification"],
  },
];

const APPLICATION_IMAGE =
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=85";

const formatDeadline = (value) => {
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "Deadline unavailable";

  return deadline.toLocaleDateString();
};

const isDeadlinePassed = (value) => {
  if (!value) return false;
  const deadline = new Date(value);
  return !Number.isNaN(deadline.getTime()) && deadline < new Date();
};

export default function Careers() {
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    cv: null,
    coverLetter: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const applicationRef = useRef(null);
  const selectedCareer = positions.find(
    (career) => career.position === form.position,
  );

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const response = await careerAPI.getAll();
        setPositions(response?.data || []);
      } catch (loadError) {
        setError(
          loadError.response?.data?.message || "Unable to load open roles.",
        );
      } finally {
        setLoadingPositions(false);
      }
    };
    loadPositions();
  }, []);

  const scrollToApplication = (position = "") => {
    setForm((current) => ({ ...current, position }));
    applicationRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const update = (field) => (event) => {
    const value =
      field === "cv" ? event.target.files?.[0] || null : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (!form.cv) throw new Error("Please upload your CV.");
      const uploadData = new FormData();
      uploadData.append("cv", form.cv);
      const uploadResponse = await uploadAPI.uploadCv(uploadData);
      await applicationAPI.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        cv: uploadResponse?.data?.url || "",
        cvPublicId: uploadResponse?.data?.publicId || "",
        cvOriginalName: uploadResponse?.data?.originalName || form.cv.name,
        cvFormat: uploadResponse?.data?.format || form.cv.name.split(".").pop(),
        coverLetter: form.coverLetter,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError.response?.data?.message ||
          "We could not submit your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      cv: null,
      coverLetter: "",
    });
    setSubmitted(false);
    setError("");
  };

  const inputClass =
    "w-full rounded-md border border-[#123B63]/15 bg-white px-4 py-2.5 font-body text-base text-[#123B63] transition-colors focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

  return (
    <>
      <section className="bg-[#123B63] text-white">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-4 lg:min-h-[520px] lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col justify-center py-20 lg:col-span-7 lg:py-24">
            <SectionLabel>We're Hiring</SectionLabel>
            <h1 className="mt-5 max-w-3xl font-heading text-4xl font-800 leading-[1.05] sm:text-5xl md:text-6xl">
              The Talent Gateway
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              MARS FLC welcomes professionals interested in legal, financial,
              recovery, verification, and administrative support work.
            </p>
          </div>
          <div className="flex items-center py-6 lg:col-span-5 lg:py-10">
            <div className="h-full max-h-[460px] w-full overflow-hidden rounded-xl border border-white/20 shadow-2xl">
              <img
                src={careerHeroImage}
                alt="Professionals collaborating during a job application meeting"
                className="h-full min-h-[280px] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Available Positions */}
      <section className="border-b border-[#EFF6FF] py-16">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Available Positions"
            title="Open Roles"
            intro="We are seeking disciplined, trustworthy professionals for field and verification operations."
          />
          <div className="mt-8 space-y-px bg-[#EFF6FF]">
            {loadingPositions ? (
              <p className="bg-white p-6 text-sm text-[#123B63]/60">
                Loading open roles...
              </p>
            ) : positions.length === 0 ? (
              <p className="bg-white p-6 text-sm text-[#123B63]/60">
                No open roles are available right now.
              </p>
            ) : (
              positions.map((career) => {
                const deadlinePassed = isDeadlinePassed(
                  career.applicationDeadline,
                );

                return (
                  <div
                    key={career._id}
                    className="grid gap-5 bg-white p-6 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-7">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="font-heading text-lg font-700 uppercase tracking-[0.02em] text-[#123B63]">
                          {career.position}
                        </h3>
                        <span className="border border-[#0066D6] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#0066D6]">
                          {career.department || "Full-Time"}
                        </span>
                        {deadlinePassed && (
                          <span className="border border-[#123B63]/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#123B63]/55">
                            Closed
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[#123B63]/70">
                        {career.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[#123B63]/55">
                        <span>Vacancies: {career.vacancy || 1}</span>
                        <span>
                          Deadline: {formatDeadline(career.applicationDeadline)}
                        </span>
                      </div>
                      {career.requirements?.length > 0 && (
                        <ul className="mt-3 list-inside list-disc text-xs text-[#123B63]/60">
                          {career.requirements.map((requirement) => (
                            <li key={requirement}>{requirement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="md:col-span-5 md:text-right">
                      <button
                        type="button"
                        disabled={deadlinePassed}
                        onClick={() => scrollToApplication(career.position)}
                        className="rounded-md border border-[#27578d] bg-[#27578d] px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-white transition-colors hover:border-[#1f4775] hover:bg-[#1f4775] disabled:cursor-not-allowed disabled:border-[#123B63]/20 disabled:bg-[#123B63]/10 disabled:text-[#123B63]/45"
                      >
                        {deadlinePassed ? "Closed" : "Apply"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-16">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader label="How to Apply" title="Send Your CV" />
          <div className="mt-8 grid gap-px bg-[#123B63]/10 md:grid-cols-3">
            {[
              {
                icon: <FileText className="h-5 w-5" />,
                step: "01",
                title: "Prepare CV",
                desc: "Include experience, references and contact details.",
              },
              {
                icon: <FileText className="h-5 w-5" />,
                step: "02",
                title: "Submit Application",
                desc: "Complete the application form with your CV and details.",
              },
              {
                icon: <Search className="h-5 w-5" />,
                step: "03",
                title: "Background Check",
                desc: "Shortlisted candidates undergo our 8-point verification.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-white p-7">
                <div className="flex items-center justify-between">
                  <div className="text-[#0066D6]">{s.icon}</div>
                  <span className="font-mono text-xl font-700 text-[#123B63]/15">
                    {s.step}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#123B63]/65">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background Check */}
      <section className="py-16">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Employment Background Check"
            title="Our 8-Point Integrity Standard"
            intro="Every MSI professional is held to the same verification standard we apply to the field — because trust begins at home."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {BG_CHECK.map((g, i) => (
              <div key={g.group} className="border border-[#EFF6FF] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center bg-[#123B63] text-[#0066D6]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-xs text-[#123B63]/40">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-heading text-sm font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {g.group}
                </h3>
                <ul className="mt-3 space-y-2">
                  {g.items.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 text-sm text-[#123B63]/70"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0066D6]" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section
        ref={applicationRef}
        className="border-t border-[#EFF6FF] bg-[#123B63] py-16 text-white"
      >
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label="Application Form"
            title={<span className="text-white">Join the MARS FLC Team</span>}
            intro="Submit your details and our recruitment team will review your application."
          />
          <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-stretch">
            <div className="rounded-lg bg-white p-6 text-[#123B63] shadow-xl md:p-8 lg:col-span-7">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <CheckCircle2 className="h-12 w-12 text-[#0066D6]" />
                  <h3 className="mt-4 font-heading text-xl font-700">
                    Application Received
                  </h3>
                  <p className="mt-2 text-sm text-[#123B63]/65">
                    Thank you, {form.name}. Our recruitment team will be in
                    touch.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-5 rounded-md btn-outline-obsidian"
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="application-name"
                        className="mb-1.5 block font-heading text-xs font-600 uppercase tracking-[0.05em]"
                      >
                        Name
                      </label>
                      <input
                        id="application-name"
                        type="text"
                        required
                        value={form.name}
                        onChange={update("name")}
                        className={inputClass}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="application-email"
                        className="mb-1.5 block font-heading text-xs font-600 uppercase tracking-[0.05em]"
                      >
                        Email
                      </label>
                      <input
                        id="application-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={update("email")}
                        className={inputClass}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="application-phone"
                        className="mb-1.5 block font-heading text-xs font-600 uppercase tracking-[0.05em]"
                      >
                        Phone
                      </label>
                      <input
                        id="application-phone"
                        type="tel"
                        required
                        value={form.phone}
                        onChange={update("phone")}
                        className={inputClass}
                        placeholder="+88 01XXX-XXXXXX"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="application-position"
                        className="mb-1.5 block font-heading text-xs font-600 uppercase tracking-[0.05em]"
                      >
                        Position
                      </label>
                      <select
                        id="application-position"
                        required
                        value={form.position}
                        onChange={update("position")}
                        className={inputClass}
                      >
                        <option value="">Select a position</option>
                        {positions.map((position) => (
                          <option key={position._id} value={position.position}>
                            {position.position}
                          </option>
                        ))}
                      </select>
                      {selectedCareer && (
                        <p className="mt-2 text-xs text-[#123B63]/60">
                          Vacancies: {selectedCareer.vacancy || 1} | Deadline:{" "}
                          {formatDeadline(selectedCareer.applicationDeadline)}
                          {isDeadlinePassed(
                            selectedCareer.applicationDeadline,
                          ) && (
                            <span className="ml-2 font-700 text-[#0066D6]">
                              Closed
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="application-cv"
                      className="mb-1.5 block font-heading text-xs font-600 uppercase tracking-[0.05em]"
                    >
                      CV Upload
                    </label>
                    <input
                      id="application-cv"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      onChange={update("cv")}
                      className={`${inputClass} file:mr-4 file:rounded file:border-0 file:bg-[#123B63] file:px-4 file:py-2 file:text-white file:text-sm`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="application-cover-letter"
                      className="mb-1.5 block font-heading text-xs font-600 uppercase tracking-[0.05em]"
                    >
                      Cover Letter
                    </label>
                    <textarea
                      id="application-cover-letter"
                      required
                      rows={5}
                      value={form.coverLetter}
                      onChange={update("coverLetter")}
                      className={inputClass}
                      placeholder="Tell us why you are a strong fit for this role."
                    />
                  </div>
                  {error && (
                    <p
                      role="alert"
                      className="border-l-2 border-[#0066D6] bg-[#0066D6]/10 px-4 py-2 text-sm text-[#0066D6]"
                    >
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}{" "}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
            <div className="relative hidden min-h-[560px] overflow-hidden rounded-lg lg:col-span-5 lg:block">
              <img
                src={APPLICATION_IMAGE}
                alt="Professionals collaborating during a job application meeting"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[#123B63]/90 p-7 text-white">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#6EC1FF]">
                  Build Your Future
                </p>
                <p className="mt-2 font-heading text-xl font-700">
                  Bring your discipline, skill, and ambition to MARS FLC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
