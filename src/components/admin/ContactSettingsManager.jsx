import React, { useEffect, useState } from "react";
import { LoaderCircle, Save } from "lucide-react";
import { contactSettingsAPI } from "@/utils/api";

const DEFAULT_SETTINGS = {
  heroLabel: "Contact Us",
  heroTitle: "Engage MARS FLC",
  heroIntro: "",
  informationTitle: "Direct Lines",
  informationLabel: "Contact Information",
  addressLabel: "Address",
  address: "",
  phoneLabel: "Hotline",
  phone: "",
  emailLabel: "General Enquiries",
  email: "",
  callCenterTitle: "24/7 High-Capacity Call Center",
  callCenterDescription: "",
  infrastructureLabel: "Call Center Infrastructure",
  infrastructureTitle: "Always Within Reach",
  infrastructureIntro: "",
  infrastructureItems: [
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ],
  digitalLabel: "Digital Connectivity",
  digitalTitle: "Information That Moves With the Work",
  digitalIntro: "",
  digitalItems: [
    { title: "", description: "" },
    { title: "", description: "" },
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
  submittedMessage: "",
};

const TEXT_FIELDS = [
  ["heroLabel", "Hero Label"],
  ["heroTitle", "Hero Title"],
  ["heroIntro", "Hero Introduction", true],
  ["informationTitle", "Contact Information Heading"],
  ["informationLabel", "Contact Information Label"],
  ["addressLabel", "Address Label"],
  ["address", "Address", true],
  ["phoneLabel", "Phone Label"],
  ["phone", "Phone Number"],
  ["emailLabel", "Email Label"],
  ["email", "Email Address"],
  ["callCenterTitle", "Call Center Title"],
  ["callCenterDescription", "Call Center Description", true],
  ["infrastructureLabel", "Infrastructure Label"],
  ["infrastructureTitle", "Infrastructure Title"],
  ["infrastructureIntro", "Infrastructure Introduction", true],
  ["digitalLabel", "Digital Label"],
  ["digitalTitle", "Digital Title"],
  ["digitalIntro", "Digital Introduction", true],
  ["formLabel", "Form Label"],
  ["formTitle", "Form Title"],
  ["nameLabel", "Name Field Label"],
  ["contactLabel", "Contact Field Label"],
  ["messageLabel", "Message Field Label"],
  ["submitLabel", "Submit Button Label"],
  ["sendingLabel", "Sending Button Label"],
  ["anotherMessageLabel", "Another Message Button Label"],
  ["submittedTitle", "Success Message Title"],
  ["submittedMessage", "Success Message", true],
];

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function ContactSettingsManager() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    contactSettingsAPI
      .get()
      .then((response) => {
        if (response?.data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.data,
            infrastructureItems: response.data.infrastructureItems?.length
              ? response.data.infrastructureItems
              : DEFAULT_SETTINGS.infrastructureItems,
            digitalItems: response.data.digitalItems?.length
              ? response.data.digitalItems
              : DEFAULT_SETTINGS.digitalItems,
          });
        }
      })
      .catch((loadError) =>
        setError(
          getErrorMessage(loadError, "Unable to load Contact settings."),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const update = (field) => (event) => {
    setSettings((current) => ({ ...current, [field]: event.target.value }));
    setError("");
    setNotice("");
  };

  const updateItem = (collection, index, field) => (event) => {
    setSettings((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: event.target.value } : item,
      ),
    }));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await contactSettingsAPI.update(settings);
      setNotice("Contact page settings saved successfully.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save Contact settings."));
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFF6FF]">
        <LoaderCircle className="h-6 w-6 animate-spin text-[#0066D6]" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Page Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Contact Page
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Control the text, contact channels, form messages and information
            cards visible at /contact.
          </p>
        </div>
        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-6 border-l-2 px-4 py-3 text-sm ${error ? "border-[#0066D6] bg-[#0066D6]/10 text-[#0066D6]" : "border-[#00A651] bg-[#00A651]/10 text-[#00A651]"}`}
          >
            {error || notice}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <section className="border border-[#123B63]/10 bg-white p-6 md:p-8">
            <h2 className="font-heading text-xl font-700">
              Page and Contact Details
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {TEXT_FIELDS.slice(0, 10).map(([field, label, multiline]) => (
                <Field
                  key={field}
                  field={field}
                  label={label}
                  value={settings[field]}
                  multiline={multiline}
                  onChange={update(field)}
                />
              ))}
            </div>
          </section>
          <section className="border border-[#123B63]/10 bg-white p-6 md:p-8">
            <h2 className="font-heading text-xl font-700">
              Call Center and Infrastructure
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {TEXT_FIELDS.slice(10, 15).map(([field, label, multiline]) => (
                <Field
                  key={field}
                  field={field}
                  label={label}
                  value={settings[field]}
                  multiline={multiline}
                  onChange={update(field)}
                />
              ))}
            </div>
            <ItemFields
              collection="infrastructureItems"
              items={settings.infrastructureItems}
              label="Infrastructure Cards"
              onChange={updateItem}
            />
          </section>
          <section className="border border-[#123B63]/10 bg-white p-6 md:p-8">
            <h2 className="font-heading text-xl font-700">
              Digital Connectivity and Form
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {TEXT_FIELDS.slice(15).map(([field, label, multiline]) => (
                <Field
                  key={field}
                  field={field}
                  label={label}
                  value={settings[field]}
                  multiline={multiline}
                  onChange={update(field)}
                />
              ))}
            </div>
            <ItemFields
              collection="digitalItems"
              items={settings.digitalItems}
              label="Digital Connectivity Cards"
              onChange={updateItem}
            />
          </section>
          <button
            type="submit"
            disabled={saving}
            className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Contact Page"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ field, label, value, multiline, onChange }) {
  const id = `contact-${field}`;
  return (
    <div className={multiline ? "md:col-span-2" : ""}>
      <label htmlFor={id} className="mb-2 block text-sm font-600">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value || ""}
          onChange={onChange}
          className={inputClass}
          rows={3}
        />
      ) : (
        <input
          id={id}
          value={value || ""}
          onChange={onChange}
          className={inputClass}
        />
      )}
    </div>
  );
}

function ItemFields({ collection, items, label, onChange }) {
  return (
    <div className="mt-8 md:col-span-2">
      <h3 className="border-b border-[#123B63]/10 pb-3 font-heading text-lg font-700">
        {label}
      </h3>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {items.map((item, index) => (
          <div
            key={`${collection}-${index}`}
            className="border border-[#123B63]/10 p-4"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.15em] text-[#0066D6]">
              Card {index + 1}
            </p>
            <label
              htmlFor={`${collection}-${index}-title`}
              className="mb-2 block text-sm font-600"
            >
              Title
            </label>
            <input
              id={`${collection}-${index}-title`}
              value={item.title || ""}
              onChange={onChange(collection, index, "title")}
              className={inputClass}
            />
            <label
              htmlFor={`${collection}-${index}-description`}
              className="mb-2 mt-4 block text-sm font-600"
            >
              Description
            </label>
            <textarea
              id={`${collection}-${index}-description`}
              value={item.description || ""}
              onChange={onChange(collection, index, "description")}
              className={inputClass}
              rows={4}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
