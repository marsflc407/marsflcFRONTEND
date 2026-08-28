import { useEffect, useState } from "react";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { debtCollectionSettingsAPI } from "@/utils/api";

const DEFAULT_SETTINGS = {
  heroLabel: "Debt Collection",
  heroTitle: "Sovereign Authority in Recovery",
  heroIntro:
    "Debt collection and recovery support for banking and non-banking financial institutions, delivered with professional and responsible service.",
  heroImages: [
    "https://media.base44.com/images/public/6a722bde599ffd853c421721/64fac9e0d_generated_603e1514.png",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1800&q=85",
  ],
  servicesLabel: "Core Collection Services",
  servicesTitle: "Three Tiers of Recovery",
  servicesIntro:
    "Structured recovery modules covering the full lifecycle of delinquency.",
  services: [
    {
      icon: "Coins",
      title: "Standard Debt Collection",
      description:
        "Early-stage amicable recovery designed to preserve the client-borrower relationship.",
      isActive: true,
    },
    {
      icon: "MapPin",
      title: "Field Visit & Skip Tracing",
      description:
        "Locating and engaging delinquent borrowers through disciplined field intelligence.",
      isActive: true,
    },
    {
      icon: "FileWarning",
      title: "Long Overdue & NPL Recovery",
      description:
        "Resolution of non-performing loans through structured, persistent engagement.",
      isActive: true,
    },
  ],
  specializedLabel: "Specialized Support",
  specializedTitle: "Beyond Amicable Recovery",
  specializedIntro:
    "MARS FLC also provides legal and financial support relevant to recovery requirements.",
  specialized: [
    {
      icon: "Car",
      title: "Asset Repossession Support",
      description:
        "A dedicated auto repossession team for secured-loan recovery, operating within legal boundaries.",
      isActive: true,
    },
    {
      icon: "Scale",
      title: "Legal Collection Support",
      description:
        "Documentation preparation and coordination with legal counsel for escalated matters.",
      isActive: true,
    },
  ],
  advantagesLabel: "Competitive Advantages",
  advantagesTitle: "Focused recovery support",
  advantagesIntro: "",
  advantages: [
    {
      icon: "ShieldCheck",
      title: "Ethical & Law-Compliant Recovery",
      description:
        "Every action governed by regulatory and ethical boundaries.",
      isActive: true,
    },
    {
      icon: "Eye",
      title: "Professional Oversight",
      description: "A team of watchdogs ensuring conduct at every level.",
      isActive: true,
    },
    {
      icon: "Users2",
      title: "Dedicated Recovery Team",
      description: "Specialised squads aligned to portfolio and geography.",
      isActive: true,
    },
    {
      icon: "Cpu",
      title: "Technology-Driven MIS",
      description: "Daily reports and 30-minute feedback on every action.",
      isActive: true,
    },
  ],
  infrastructureLabel: "Infrastructure",
  infrastructureTitle: "A Recovery Machine, Always Running",
  infrastructure: [
    {
      icon: "PhoneCall",
      title: "24/7 High-Capacity Call Center",
      description: "Continuous outreach with full recording facilities.",
      isActive: true,
    },
    {
      icon: "Users2",
      title: "Rapid Movement Team",
      description: "Squads on standby for emergency field deployment.",
      isActive: true,
    },
    {
      icon: "Bike",
      title: "Dedicated Vehicle Fleet",
      description: "Bikes and cars enabling nationwide reach.",
      isActive: true,
    },
  ],
  buttonLabel: "Engage MARS FLC for Recovery",
  buttonUrl: "/contact",
};

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function DebtCollectionManager() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    debtCollectionSettingsAPI
      .get()
      .then((response) => {
        if (response?.data)
          setSettings({ ...DEFAULT_SETTINGS, ...response.data });
      })
      .catch((loadError) =>
        setError(
          getErrorMessage(
            loadError,
            "Unable to load Debt Collection settings.",
          ),
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
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setSettings((current) => ({
      ...current,
      [collection]: current[collection].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
    setError("");
    setNotice("");
  };

  const addItem = (collection) =>
    setSettings((current) => ({
      ...current,
      [collection]: [
        ...current[collection],
        { icon: "", title: "", description: "", isActive: true },
      ],
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
      await debtCollectionSettingsAPI.update(settings);
      setNotice("Debt Collection page saved successfully.");
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Unable to save Debt Collection settings."),
      );
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
        <header className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Page Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Debt Collection
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Control all public page copy, images, cards and calls to action.
          </p>
        </header>
        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-6 border-l-2 px-4 py-3 text-sm ${error ? "border-[#0066D6] bg-[#0066D6]/10 text-[#0066D6]" : "border-[#00A651] bg-[#00A651]/10 text-[#00A651]"}`}
          >
            {error || notice}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <EditorSection title="Hero">
            <Field
              label="Label"
              value={settings.heroLabel}
              onChange={update("heroLabel")}
            />
            <Field
              label="Title"
              value={settings.heroTitle}
              onChange={update("heroTitle")}
            />
            <Field
              label="Introduction"
              value={settings.heroIntro}
              onChange={update("heroIntro")}
              multiline
            />
            <ListField
              label="Hero image URLs"
              value={settings.heroImages}
              onChange={(value) =>
                setSettings((current) => ({ ...current, heroImages: value }))
              }
            />
          </EditorSection>
          <CollectionSection
            title="Core Collection Services"
            labelField="servicesLabel"
            titleField="servicesTitle"
            introField="servicesIntro"
            settings={settings}
            update={update}
            collection="services"
            items={settings.services}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />
          <CollectionSection
            title="Specialized Support"
            labelField="specializedLabel"
            titleField="specializedTitle"
            introField="specializedIntro"
            settings={settings}
            update={update}
            collection="specialized"
            items={settings.specialized}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />
          <CollectionSection
            title="Competitive Advantages"
            labelField="advantagesLabel"
            titleField="advantagesTitle"
            introField="advantagesIntro"
            settings={settings}
            update={update}
            collection="advantages"
            items={settings.advantages}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />
          <CollectionSection
            title="Infrastructure"
            labelField="infrastructureLabel"
            titleField="infrastructureTitle"
            introField={null}
            settings={settings}
            update={update}
            collection="infrastructure"
            items={settings.infrastructure}
            updateItem={updateItem}
            addItem={addItem}
            removeItem={removeItem}
          />
          <EditorSection title="Call to action">
            <Field
              label="Button label"
              value={settings.buttonLabel}
              onChange={update("buttonLabel")}
            />
            <Field
              label="Button URL or route"
              value={settings.buttonUrl}
              onChange={update("buttonUrl")}
            />
          </EditorSection>
          <button
            type="submit"
            disabled={saving}
            className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />{" "}
            {saving ? "Saving..." : "Save Debt Collection Page"}
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
function ListField({ label, value, onChange }) {
  return (
    <label className="md:col-span-2">
      <span className="mb-2 block text-sm font-600">{label}</span>
      <textarea
        rows={4}
        value={(value || []).join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          )
        }
        className={inputClass}
      />
    </label>
  );
}
function CollectionSection({
  title,
  labelField,
  titleField,
  introField,
  settings,
  update,
  collection,
  items,
  updateItem,
  addItem,
  removeItem,
}) {
  return (
    <EditorSection title={title}>
      <Field
        label="Section label"
        value={settings[labelField]}
        onChange={update(labelField)}
      />
      <Field
        label="Section heading"
        value={settings[titleField]}
        onChange={update(titleField)}
      />
      {introField && (
        <Field
          label="Section introduction"
          value={settings[introField]}
          onChange={update(introField)}
          multiline
        />
      )}
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
                  onClick={() => removeItem(collection, index)}
                  className="text-[#123B63]/50 hover:text-[#0066D6]"
                  aria-label={`Delete item ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <Field
                label="Icon name"
                value={item.icon}
                onChange={updateItem(collection, index, "icon")}
              />
              <Field
                label="Title"
                value={item.title}
                onChange={updateItem(collection, index, "title")}
              />
              <Field
                label="Description"
                value={item.description}
                onChange={updateItem(collection, index, "description")}
                multiline
              />
              <label className="mt-4 flex items-center gap-3 text-sm font-600">
                <input
                  type="checkbox"
                  checked={item.isActive !== false}
                  onChange={updateItem(collection, index, "isActive")}
                  className="h-4 w-4 accent-[#0066D6]"
                />{" "}
                Active item
              </label>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addItem(collection)}
          className="mt-5 inline-flex items-center gap-2 text-sm font-600 text-[#0066D6] hover:text-[#123B63]"
        >
          <Plus className="h-4 w-4" /> Add item
        </button>
      </div>
    </EditorSection>
  );
}
