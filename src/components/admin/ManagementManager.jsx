import { useEffect, useState } from "react";
import { ImagePlus, LoaderCircle, Save } from "lucide-react";
import { contentAPI, uploadAPI } from "@/utils/api";

const MANAGEMENT_ROLES = [
  "Managing Director",
  "Head of Operations",
  "Team Leadership",
];

const EMPTY_ENTRIES = MANAGEMENT_ROLES.map((title, index) => ({
  title,
  description: "",
  image: "",
  order: index,
  isActive: true,
  recordId: null,
  imageFile: null,
}));

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function ManagementManager() {
  const [entries, setEntries] = useState(EMPTY_ENTRIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await contentAPI.getAdminByPage("management");
      const records = (response?.data || []).filter(
        (record) => record.section === "team-member",
      );
      setEntries(
        EMPTY_ENTRIES.map((entry) => {
          const record = records.find(
            (item) => (item.title || "").trim() === entry.title,
          );
          return record
            ? {
                ...entry,
                description: record.content || "",
                image: record.image || "",
                order: record.order ?? entry.order,
                isActive: record.isActive !== false,
                recordId: record._id,
              }
            : entry;
        }),
      );
    } catch (loadError) {
      setError(
        getErrorMessage(loadError, "Unable to load management entries."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const updateEntry = (index, field, value) => {
    setEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      ),
    );
    setError("");
    setNotice("");
  };

  const chooseImage = (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    updateEntry(index, "imageFile", file);
  };

  const saveEntry = async (entry) => {
    let image = entry.image;
    if (entry.imageFile) {
      const formData = new FormData();
      formData.append("image", entry.imageFile);
      formData.append("section", "management");
      formData.append("category", "other");
      formData.append("title", entry.title);
      formData.append("alt", `${entry.title} profile`);
      const response = await uploadAPI.uploadSingle(formData);
      image = response?.data?.url || image;
    }

    const payload = {
      page: "management",
      section: "team-member",
      title: entry.title,
      content: entry.description.trim(),
      image,
      order: entry.order,
      isActive: entry.isActive,
    };

    if (entry.recordId) {
      await contentAPI.update(entry.recordId, payload);
    } else {
      await contentAPI.create(payload);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await Promise.all(entries.map(saveEntry));
      setNotice("Management team entries saved successfully.");
      await loadEntries();
    } catch (saveError) {
      setError(
        getErrorMessage(saveError, "Unable to save management entries."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Admin Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[#123B63]/65">
            Edit the three Management Team profiles shown on the public page.
          </p>
        </div>

        {(error || notice) && (
          <p
            role={error ? "alert" : "status"}
            className={`mt-6 border-l-2 px-4 py-3 text-sm ${error ? "border-[#C62828] bg-[#C62828]/10 text-[#C62828]" : "border-[#00A651] bg-[#00A651]/10 text-[#00A651]"}`}
          >
            {error || notice}
          </p>
        )}

        {loading ? (
          <div className="mt-8 flex items-center gap-2 text-sm text-[#123B63]/60">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Loading management
            entries...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {entries.map((entry, index) => (
              <section
                key={entry.title}
                className="border border-[#123B63]/10 bg-white p-6 md:p-8"
              >
                <div className="flex items-center justify-between gap-4 border-b border-[#123B63]/10 pb-5">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#0066D6]">
                      Profile {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-2 font-heading text-xl font-700 text-[#123B63]">
                      {entry.title}
                    </h2>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-[#123B63]/50">
                    Editable entry
                  </span>
                </div>
                <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
                  <div>
                    <div className="aspect-square overflow-hidden bg-[#EFF6FF]">
                      {entry.image ? (
                        <img
                          src={entry.image}
                          alt={`${entry.title} profile`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center text-sm text-[#123B63]/50">
                          <ImagePlus className="h-8 w-8 text-[#0066D6]" />
                          <span className="mt-3">No profile image</span>
                        </div>
                      )}
                    </div>
                    <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#123B63]/20 px-3 py-3 text-sm font-600 text-[#123B63]/70 hover:border-[#0066D6] hover:text-[#0066D6]">
                      <ImagePlus className="h-4 w-4" />
                      {entry.imageFile
                        ? entry.imageFile.name
                        : "Upload / change image"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => chooseImage(index, event)}
                      />
                    </label>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label
                        className="mb-2 block text-sm font-600"
                        htmlFor={`management-title-${index}`}
                      >
                        Title
                      </label>
                      <input
                        id={`management-title-${index}`}
                        value={entry.title}
                        readOnly
                        className={`${inputClass} bg-[#EFF6FF]`}
                      />
                    </div>
                    <div>
                      <label
                        className="mb-2 block text-sm font-600"
                        htmlFor={`management-description-${index}`}
                      >
                        Description
                      </label>
                      <textarea
                        id={`management-description-${index}`}
                        rows={5}
                        value={entry.description}
                        onChange={(event) =>
                          updateEntry(index, "description", event.target.value)
                        }
                        className={inputClass}
                        placeholder={`Describe the responsibilities of the ${entry.title}.`}
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}
            <button type="submit" disabled={saving} className="btn-crimson">
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Management Team"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
