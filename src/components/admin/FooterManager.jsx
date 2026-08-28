import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { footerSettingsAPI } from "@/utils/api";

const DEFAULT_SETTINGS = {
  brandName: "Mars Financial & Legal Consultancy",
  description:
    "MARS FLC partners with banking and non-banking financial institutions to provide debt collection and recovery, Contact Point Verification, administrative support, and legal and financial support services.",
  quickLinks: [
    { label: "Home", to: "/" },
    { label: "Contact Point Verification", to: "/cpv" },
    { label: "Debt Collection", to: "/debt-collection" },
    { label: "About Us", to: "/company-overview" },
    { label: "Contact", to: "/contact" },
  ],
  officeTitle: "Head Office",
  address:
    "Suite-C, Level-7, Mirpur Tower, 4 Darus Salam Road, Mirpur-1, Dhaka-1216, Bangladesh",
  phone: "01774071130",
  phoneHref: "tel:+8801774071130",
  email: "marsflc407@gmail.com",
  hoursTitle: "Operational Hours",
  hours: [
    { title: "Call Center", value: "24 / 7 / 365" },
    { title: "Field Operations", value: "Sun-Fri - 8AM-8PM" },
    { title: "Reporting TAT", value: "30-Minute Feedback" },
  ],
  socialLinks: [],
  website: "marsflc.info",
  websiteHref: "https://marsflc.info",
  copyrightText:
    "Mars Financial & Legal Consultancy (MARS FLC). All rights reserved.",
};

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function FooterManager() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    footerSettingsAPI
      .get()
      .then((response) => {
        if (response?.data) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...response.data,
            quickLinks: response.data.quickLinks?.length
              ? response.data.quickLinks
              : DEFAULT_SETTINGS.quickLinks,
            hours: response.data.hours?.length
              ? response.data.hours
              : DEFAULT_SETTINGS.hours,
            socialLinks: response.data.socialLinks || [],
          });
        }
      })
      .catch((loadError) =>
        setError(getErrorMessage(loadError, "Unable to load Footer settings.")),
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

  const addItem = (collection, item) =>
    setSettings((current) => ({
      ...current,
      [collection]: [...current[collection], item],
    }));

  const removeItem = (collection, index) =>
    setSettings((current) => ({
      ...current,
      [collection]: current[collection].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await footerSettingsAPI.update(settings);
      setNotice("Footer settings saved successfully.");
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save Footer settings."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EFF6FF]">
        <LoaderCircle className="h-6 w-6 animate-spin text-[#0066D6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Site Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Footer
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Manage every visible footer label, link, contact detail and social
            profile.
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
          <EditorSection title="Brand and legal text">
            <Field
              label="Brand name"
              value={settings.brandName}
              onChange={update("brandName")}
            />
            <Field
              label="Footer description"
              value={settings.description}
              onChange={update("description")}
              multiline
            />
            <Field
              label="Copyright text"
              value={settings.copyrightText}
              onChange={update("copyrightText")}
            />
          </EditorSection>
          <EditorSection title="Quick links">
            <ItemEditor
              collection="quickLinks"
              items={settings.quickLinks}
              fields={[
                ["label", "Label"],
                ["to", "URL or route"],
              ]}
              onChange={updateItem}
              onAdd={() => addItem("quickLinks", { label: "", to: "" })}
              onRemove={removeItem}
            />
          </EditorSection>
          <EditorSection title="Office contact details">
            <Field
              label="Section title"
              value={settings.officeTitle}
              onChange={update("officeTitle")}
            />
            <Field
              label="Address"
              value={settings.address}
              onChange={update("address")}
              multiline
            />
            <Field
              label="Phone"
              value={settings.phone}
              onChange={update("phone")}
            />
            <Field
              label="Phone link"
              value={settings.phoneHref}
              onChange={update("phoneHref")}
            />
            <Field
              label="Email"
              value={settings.email}
              onChange={update("email")}
            />
          </EditorSection>
          <EditorSection title="Operational hours">
            <Field
              label="Section title"
              value={settings.hoursTitle}
              onChange={update("hoursTitle")}
            />
            <ItemEditor
              collection="hours"
              items={settings.hours}
              fields={[
                ["title", "Title"],
                ["value", "Details"],
              ]}
              onChange={updateItem}
              onAdd={() => addItem("hours", { title: "", value: "" })}
              onRemove={removeItem}
            />
          </EditorSection>
          <EditorSection title="Social media links">
            <ItemEditor
              collection="socialLinks"
              items={settings.socialLinks}
              fields={[
                ["platform", "Platform"],
                ["url", "Profile URL"],
              ]}
              onChange={updateItem}
              onAdd={() => addItem("socialLinks", { platform: "", url: "" })}
              onRemove={removeItem}
            />
          </EditorSection>
          <EditorSection title="Website link">
            <Field
              label="Website label"
              value={settings.website}
              onChange={update("website")}
            />
            <Field
              label="Website URL"
              value={settings.websiteHref}
              onChange={update("websiteHref")}
            />
          </EditorSection>
          <button
            type="submit"
            disabled={saving}
            className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Footer"}
          </button>
        </form>
      </div>
    </div>
  );
}

function EditorSection({ title, children }) {
  return (
    <section className="grid gap-5 border border-[#123B63]/10 bg-white p-6 md:grid-cols-2 md:p-8">
      <h2 className="font-heading text-xl font-700 md:col-span-2">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, value, onChange, multiline }) {
  return (
    <label className={multiline ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-sm font-600">{label}</span>
      {multiline ? (
        <textarea
          rows={4}
          value={value || ""}
          onChange={onChange}
          className={inputClass}
        />
      ) : (
        <input value={value || ""} onChange={onChange} className={inputClass} />
      )}
    </label>
  );
}

function ItemEditor({ collection, items, fields, onChange, onAdd, onRemove }) {
  return (
    <div className="md:col-span-2">
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item, index) => (
          <div
            key={`${collection}-${index}`}
            className="border border-[#123B63]/10 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#0066D6]">
                Item {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemove(collection, index)}
                className="text-[#123B63]/50 hover:text-[#0066D6]"
                aria-label={`Remove item ${index + 1}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {fields.map(([field, label]) => (
              <label key={field} className="mb-4 block last:mb-0">
                <span className="mb-2 block text-sm font-600">{label}</span>
                <input
                  value={item[field] || ""}
                  onChange={onChange(collection, index, field)}
                  className={inputClass}
                />
              </label>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 text-sm font-600 text-[#0066D6] hover:text-[#123B63]"
      >
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );
}
