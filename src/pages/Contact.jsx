// import React, { useEffect, useState } from "react";
// import { PageHero, SectionHeader } from "@/components/site/primitives";
// import { contactAPI, contactSettingsAPI } from "@/utils/api";
// import {
//   MapPin,
//   Phone,
//   Mail,
//   Clock,
//   Send,
//   CheckCircle2,
//   Headphones,
//   Wifi,
//   Database,
// } from "lucide-react";
// import { COMPANY } from "@/config/company";

// const DEFAULT_SETTINGS = {
//   heroLabel: "Contact Us",
//   heroTitle: "Engage MARS FLC",
//   heroIntro:
//     "Reach our 24/7 high-capacity call center, corporate team, or recruitment desk — whichever channel suits your need.",
//   informationTitle: "Direct Lines",
//   informationLabel: "Contact Information",
//   addressLabel: "Address",
//   address: COMPANY.address,
//   phoneLabel: "Hotline",
//   phone: COMPANY.phone,
//   emailLabel: "General Enquiries",
//   email: COMPANY.email,
//   callCenterTitle: "24/7 High-Capacity Call Center",
//   callCenterDescription:
//     "Full call recording facilities · Continuous operations, 365 days a year.",
//   infrastructureLabel: "Call Center Infrastructure",
//   infrastructureTitle: "Always Within Reach",
//   infrastructureIntro:
//     "Our operations team keeps communication open across every stage of recovery and verification.",
//   infrastructureItems: [
//     {
//       title: "24/7 Operations",
//       description:
//         "High-capacity support with recorded calls and continuous coverage.",
//     },
//     {
//       title: "Dedicated Lines",
//       description:
//         "Direct channels for clients, borrowers and field operations.",
//     },
//     {
//       title: "Recorded Reporting",
//       description:
//         "Structured call records and updates for accountable service.",
//     },
//   ],
//   digitalLabel: "Digital Connectivity",
//   digitalTitle: "Information That Moves With the Work",
//   digitalIntro:
//     "Digital channels keep every stakeholder aligned with timely, traceable communication.",
//   digitalItems: [
//     {
//       title: "Cloud-Based Coordination",
//       description:
//         "Secure systems connect field teams, call center operators and client reporting.",
//     },
//     {
//       title: "Responsive Email Channels",
//       description:
//         "Corporate, support and recruitment desks route every enquiry to the right team.",
//     },
//   ],
//   formLabel: "Contact Form",
//   formTitle: "Send a Message",
//   nameLabel: "Name",
//   contactLabel: "Contact Number",
//   messageLabel: "Message",
//   submitLabel: "Submit Message",
//   sendingLabel: "Sending...",
//   anotherMessageLabel: "Send Another Message",
//   submittedTitle: "Message Received",
//   submittedMessage: "Thank you. Our team will respond shortly.",
// };

// export default function Contact() {
//   const [settings, setSettings] = useState(DEFAULT_SETTINGS);
//   const [form, setForm] = useState({
//     name: "",
//     contact: "",
//     email: "",
//     message: "",
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     contactSettingsAPI
//       .get()
//       .then((response) => {
//         if (response?.data)
//           setSettings({ ...DEFAULT_SETTINGS, ...response.data });
//       })
//       .catch(() => {});
//   }, []);

//   const update = (field) => (e) => {
//     setForm((f) => ({ ...f, [field]: e.target.value }));
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setError("");

//     try {
//       await contactAPI.sendMessage({
//         name: form.name,
//         phone: form.contact,
//         email: form.email,
//         message: form.message,
//       });
//       setSubmitted(true);
//     } catch (submissionError) {
//       setError(
//         submissionError.response?.data?.message ||
//           "We could not send your message. Please try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const resetForm = () => {
//     setForm({ name: "", contact: "", email: "", message: "" });
//     setSubmitted(false);
//     setError("");
//   };

//   const inputClass =
//     "w-full border border-[#123B63]/15 bg-white px-4 py-3 font-body text-base text-[#123B63] transition-colors focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

//   return (
//     <>
//       <PageHero
//         label={settings.heroLabel}
//         title={settings.heroTitle}
//         intro={settings.heroIntro}
//       />

//       <section className="border-b border-[#EFF6FF] py-24">
//         <div className="mx-auto max-w-[1400px] px-4">
//           <div className="grid gap-16 lg:grid-cols-12">
//             {/* Contact info */}
//             <div className="lg:col-span-5">
//               <SectionHeader
//                 label={settings.informationLabel}
//                 title={settings.informationTitle}
//               />
//               <div className="mt-10 space-y-px bg-[#EFF6FF]">
//                 {[
//                   {
//                     icon: <MapPin className="h-5 w-5" />,
//                     label: settings.addressLabel,
//                     value: settings.address,
//                   },
//                   {
//                     icon: <Phone className="h-5 w-5" />,
//                     label: settings.phoneLabel,
//                     value: settings.phone,
//                     href: `tel:${settings.phone}`,
//                   },
//                 ].map((c) => (
//                   <div
//                     key={c.label}
//                     className="flex items-start gap-4 bg-white p-6"
//                   >
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#123B63] text-[#0066D6]">
//                       {c.icon}
//                     </div>
//                     <div>
//                       <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#123B63]/50">
//                         {c.label}
//                       </div>
//                       {c.href ? (
//                         <a
//                           href={c.href}
//                           className="font-mono text-base text-[#123B63] transition-colors hover:text-[#0066D6]"
//                         >
//                           {c.value}
//                         </a>
//                       ) : (
//                         <div className="font-body text-base text-[#123B63]">
//                           {c.value}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8 space-y-3">
//                 {[{ label: settings.emailLabel, value: settings.email }].map(
//                   (em) => (
//                     <div
//                       key={em.value}
//                       className="flex items-center justify-between border-l-2 border-[#0066D6] bg-[#EFF6FF] px-4 py-3"
//                     >
//                       <div>
//                         <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#123B63]/50">
//                           {em.label}
//                         </div>
//                         <a
//                           href={`mailto:${em.value}`}
//                           className="font-mono text-sm text-[#123B63] transition-colors hover:text-[#0066D6]"
//                         >
//                           {em.value}
//                         </a>
//                       </div>
//                       <Mail className="h-4 w-4 text-[#123B63]/40" />
//                     </div>
//                   ),
//                 )}
//               </div>

//               <div className="mt-8 flex items-start gap-4 border border-[#123B63]/10 p-6">
//                 <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#0066D6]" />
//                 <div>
//                   <div className="font-heading font-700 text-[#123B63]">
//                     {settings.callCenterTitle}
//                   </div>
//                   <p className="mt-1 text-sm text-[#123B63]/65">
//                     {settings.callCenterDescription}
//                   </p>
//                 </div>
//               </div>
//             </div>
//             Form
//             <div className="lg:col-span-7">
//               <div className="border border-[#EFF6FF] bg-white p-8 md:p-10">
//                 {submitted ? (
//                   <div className="flex flex-col items-center justify-center py-16 text-center">
//                     <CheckCircle2 className="h-16 w-16 text-[#0066D6]" />
//                     <h3 className="mt-6 font-heading text-2xl font-700 text-[#123B63]">
//                       {settings.submittedTitle}
//                     </h3>
//                     <p className="mt-3 max-w-md text-[#123B63]/65">
//                       {settings.submittedMessage} For urgent matters, call our
//                       hotline at {settings.phone}.
//                     </p>
//                     <button
//                       onClick={resetForm}
//                       className="mt-8 btn-outline-obsidian"
//                     >
//                       {settings.anotherMessageLabel}
//                     </button>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
//                       {settings.formLabel}
//                     </div>
//                     <h2 className="mt-2 font-heading text-2xl font-700 text-[#123B63]">
//                       {settings.formTitle}
//                     </h2>
//                     <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//                       <div>
//                         <label
//                           htmlFor="name"
//                           className="mb-2 block font-heading text-sm font-600 uppercase tracking-[0.05em] text-[#123B63]"
//                         >
//                           {settings.nameLabel}
//                         </label>
//                         <input
//                           id="name"
//                           type="text"
//                           required
//                           value={form.name}
//                           onChange={update("name")}
//                           className={inputClass}
//                           placeholder="Your full name"
//                         />
//                       </div>
//                       <div className="grid gap-6 sm:grid-cols-2">
//                         <div>
//                           <label
//                             htmlFor="contact"
//                             className="mb-2 block font-heading text-sm font-600 uppercase tracking-[0.05em] text-[#123B63]"
//                           >
//                             {settings.contactLabel}
//                           </label>
//                           <input
//                             id="contact"
//                             type="tel"
//                             required
//                             value={form.contact}
//                             onChange={update("contact")}
//                             className={inputClass}
//                             placeholder="+88 01XXX-XXXXXX"
//                           />
//                         </div>
//                         <div>
//                           <label
//                             htmlFor="email"
//                             className="mb-2 block font-heading text-sm font-600 uppercase tracking-[0.05em] text-[#123B63]"
//                           >
//                             Email
//                           </label>
//                           <input
//                             id="email"
//                             type="email"
//                             required
//                             value={form.email}
//                             onChange={update("email")}
//                             className={inputClass}
//                             placeholder="you@example.com"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label
//                           htmlFor="message"
//                           className="mb-2 block font-heading text-sm font-600 uppercase tracking-[0.05em] text-[#123B63]"
//                         >
//                           {settings.messageLabel}
//                         </label>
//                         <textarea
//                           id="message"
//                           required
//                           rows={5}
//                           value={form.message}
//                           onChange={update("message")}
//                           className={inputClass}
//                           placeholder="How can MARS FLC help you?"
//                         />
//                         <p className="mt-2 text-xs text-[#123B63]/55">
//                           For response, check your email which you provide.
//                         </p>
//                       </div>
//                       {error && (
//                         <p
//                           role="alert"
//                           className="border-l-2 border-[#0066D6] bg-[#0066D6]/10 px-4 py-3 text-sm text-[#0066D6]"
//                         >
//                           {error}
//                         </p>
//                       )}
//                       <button
//                         type="submit"
//                         disabled={submitting}
//                         className="btn-crimson w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
//                       >
//                         {submitting
//                           ? settings.sendingLabel
//                           : settings.submitLabel}{" "}
//                         <Send className="h-4 w-4" />
//                       </button>
//                     </form>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Call Center Infrastructure */}
//       <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-20">
//         <div className="mx-auto max-w-[1400px] px-4">
//           <SectionHeader
//             label={settings.infrastructureLabel}
//             title={settings.infrastructureTitle}
//             intro={settings.infrastructureIntro}
//           />
//           <div className="mt-10 grid gap-px bg-[#123B63]/10 md:grid-cols-3">
//             {settings.infrastructureItems.map((item, index) => (
//               <div key={item.title} className="bg-white p-8">
//                 <div className="text-[#0066D6]">
//                   {index === 0 ? (
//                     <Headphones className="h-7 w-7" />
//                   ) : index === 1 ? (
//                     <Phone className="h-7 w-7" />
//                   ) : (
//                     <Database className="h-7 w-7" />
//                   )}
//                 </div>
//                 <h3 className="mt-5 font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
//                   {item.title}
//                 </h3>
//                 <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
//                   {item.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Digital Connectivity */}
//       <section className="border-b border-[#EFF6FF] py-20">
//         <div className="mx-auto max-w-[1400px] px-4">
//           <SectionHeader
//             label={settings.digitalLabel}
//             title={settings.digitalTitle}
//             intro={settings.digitalIntro}
//           />
//           <div className="mt-10 grid gap-6 md:grid-cols-2">
//             {settings.digitalItems.map((item, index) => (
//               <div
//                 key={item.title}
//                 className="flex gap-5 border border-[#123B63]/10 p-8"
//               >
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#123B63] text-[#0066D6]">
//                   {index === 0 ? (
//                     <Wifi className="h-6 w-6" />
//                   ) : (
//                     <Mail className="h-6 w-6" />
//                   )}
//                 </div>
//                 <div>
//                   <h3 className="font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
//                     {item.title}
//                   </h3>
//                   <p className="mt-2 text-sm leading-relaxed text-[#123B63]/65">
//                     {item.description}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Map */}
//       <section className="bg-[#123B63] py-16">
//         <div className="mx-auto max-w-[1400px] px-4">
//           <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
//             Our Location
//           </div>
//           <h2 className="mt-2 font-heading text-2xl font-700 text-white">
//             Block D, Mirpur-12, Dhaka
//           </h2>
//           <div className="mt-6 h-80 w-full overflow-hidden border border-white/10">
//             <iframe
//               title="MARS FLC Head Office Location"
//               src="https://www.openstreetmap.org/export/embed.html?bbox=90.36%2C23.80%2C90.40%2C23.82&layer=mapnik&marker=23.8071%2C90.3676"
//               className="h-full w-full grayscale"
//               loading="lazy"
//             />
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { PageHero, SectionHeader } from "@/components/site/primitives";
import { contactAPI, contactSettingsAPI } from "@/utils/api";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  Wifi,
  Database,
} from "lucide-react";
import { COMPANY } from "@/config/company";

const DEFAULT_SETTINGS = {
  heroLabel: "Contact Us",
  heroTitle: "Engage MARS FLC",
  heroIntro:
    "Reach our 24/7 high-capacity call center, corporate team, or recruitment desk — whichever channel suits your need.",
  informationTitle: "Direct Lines",
  informationLabel: "Contact Information",
  addressLabel: "Address",
  address: COMPANY.address,
  phoneLabel: "Hotline",
  phone: COMPANY.phone,
  emailLabel: "General Enquiries",
  email: COMPANY.email,
  callCenterTitle: "24/7 High-Capacity Call Center",
  callCenterDescription:
    "Full call recording facilities · Continuous operations, 365 days a year.",
  infrastructureLabel: "Call Center Infrastructure",
  infrastructureTitle: "Always Within Reach",
  infrastructureIntro:
    "Our operations team keeps communication open across every stage of recovery and verification.",
  infrastructureItems: [
    {
      title: "24/7 Operations",
      description:
        "High-capacity support with recorded calls and continuous coverage.",
    },
    {
      title: "Dedicated Lines",
      description:
        "Direct channels for clients, borrowers and field operations.",
    },
    {
      title: "Recorded Reporting",
      description:
        "Structured call records and updates for accountable service.",
    },
  ],
  digitalLabel: "Digital Connectivity",
  digitalTitle: "Information That Moves With the Work",
  digitalIntro:
    "Digital channels keep every stakeholder aligned with timely, traceable communication.",
  digitalItems: [
    {
      title: "Cloud-Based Coordination",
      description:
        "Secure systems connect field teams, call center operators and client reporting.",
    },
    {
      title: "Responsive Email Channels",
      description:
        "Corporate, support and recruitment desks route every enquiry to the right team.",
    },
  ],
  formLabel: "Contact Form",
  formTitle: "Send a Message",
  nameLabel: "Name",
  contactLabel: "Contact Number",
  messageLabel: "Message",
  submitLabel: "Submit Message",
  sendingLabel: "Sending...",
  anotherMessageLabel: "Send Another Message",
  submittedTitle: "Message Received",
  submittedMessage: "Thank you. Our team will respond shortly.",
};

export default function Contact() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    contactSettingsAPI
      .get()
      .then((response) => {
        if (response?.data)
          setSettings({ ...DEFAULT_SETTINGS, ...response.data });
      })
      .catch(() => {});
  }, []);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await contactAPI.sendMessage({
        name: form.name,
        phone: form.contact,
        email: form.email,
        message: form.message,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError.response?.data?.message ||
          "We could not send your message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", contact: "", email: "", message: "" });
    setSubmitted(false);
    setError("");
  };

  const inputClass =
    "w-full border border-[#123B63]/15 bg-white px-4 py-3 font-body text-base text-[#123B63] transition-colors focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

  return (
    <>
      <PageHero
        label={settings.heroLabel}
        title={settings.heroTitle}
        intro={settings.heroIntro}
      />

      <section className="border-b border-[#EFF6FF] py-24">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Contact info */}
            <div className="lg:col-span-12">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Address */}
                <div className="border border-[#EFF6FF] bg-white p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#123B63] text-[#0066D6]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#123B63]/50">
                    {settings.addressLabel}
                  </div>
                  <div className="mt-2 font-body text-base text-[#123B63]">
                    {settings.address}
                  </div>
                </div>

                {/* Phone */}
                <div className="border border-[#EFF6FF] bg-white p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#123B63] text-[#0066D6]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#123B63]/50">
                    {settings.phoneLabel}
                  </div>
                  <a
                    href={`tel:${settings.phone}`}
                    className="mt-2 block font-mono text-base text-[#123B63] transition-colors hover:text-[#0066D6]"
                  >
                    {settings.phone}
                  </a>
                </div>

                {/* Email */}
                <div className="border border-[#EFF6FF] bg-white p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#123B63] text-[#0066D6]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#123B63]/50">
                    {settings.emailLabel}
                  </div>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-2 block font-mono text-base text-[#123B63] transition-colors hover:text-[#0066D6]"
                  >
                    {settings.email}
                  </a>
                </div>

                {/* Call Center */}
                <div className="border border-[#EFF6FF] bg-white p-8 transition-shadow hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center bg-[#123B63] text-[#0066D6]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-[#123B63]/50">
                    Call Center
                  </div>
                  <div className="mt-2 font-body text-sm text-[#123B63]">
                    {settings.callCenterTitle}
                  </div>
                  <p className="mt-1 text-xs text-[#123B63]/65">
                    {settings.callCenterDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call Center Infrastructure */}
      <section className="border-b border-[#EFF6FF] bg-[#EFF6FF] py-20">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={settings.infrastructureLabel}
            title={settings.infrastructureTitle}
            intro={settings.infrastructureIntro}
          />
          <div className="mt-10 grid gap-px bg-[#123B63]/10 md:grid-cols-3">
            {settings.infrastructureItems.map((item, index) => (
              <div key={item.title} className="bg-white p-8">
                <div className="text-[#0066D6]">
                  {index === 0 ? (
                    <Headphones className="h-7 w-7" />
                  ) : index === 1 ? (
                    <Phone className="h-7 w-7" />
                  ) : (
                    <Database className="h-7 w-7" />
                  )}
                </div>
                <h3 className="mt-5 font-heading text-lg font-700 uppercase tracking-[0.05em] text-[#123B63]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#123B63]/65">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Connectivity */}
      <section className="border-b border-[#EFF6FF] py-20">
        <div className="mx-auto max-w-[1400px] px-4">
          <SectionHeader
            label={settings.digitalLabel}
            title={settings.digitalTitle}
            intro={settings.digitalIntro}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {settings.digitalItems.map((item, index) => (
              <div
                key={item.title}
                className="flex gap-5 border border-[#123B63]/10 p-8"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#123B63] text-[#0066D6]">
                  {index === 0 ? (
                    <Wifi className="h-6 w-6" />
                  ) : (
                    <Mail className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading text-base font-700 uppercase tracking-[0.05em] text-[#123B63]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#123B63]/65">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-[#123B63] py-16">
        <div className="mx-auto max-w-[1400px] px-4">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Our Location
          </div>
          <h2 className="mt-2 font-heading text-2xl font-700 text-white">
            Block D, Mirpur-12, Dhaka
          </h2>
          <div className="mt-6 h-80 w-full overflow-hidden border border-white/10">
            <iframe
              title="MARS FLC Head Office Location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=90.363996%2C23.820263%2C90.377645%2C23.830110&layer=mapnik&marker=23.825104%2C90.370672"
              className="h-full w-full grayscale"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
