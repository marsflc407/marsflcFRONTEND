import React, { useEffect, useState } from "react";
import {
  Building2,
  Edit3,
  ImagePlus,
  LoaderCircle,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { sisterConcernAPI, uploadAPI } from "@/utils/api";

const EMPTY_FORM = {
  name: "",
  description: "",
  logo: "",
  website: "",
  order: 0,
  isActive: true,
};

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function SisterConcernManager() {
  const [sisterConcerns, setSisterConcerns] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSisterConcerns = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await sisterConcernAPI.getAll();
      const records = response?.data || [];
      setSisterConcerns(
        records.sort(
          (first, second) => (first.order || 0) - (second.order || 0),
        ),
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load sister concerns."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSisterConcerns();
  }, []);

  const update = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const startEdit = (sisterConcern) => {
    setEditingId(sisterConcern._id);
    setForm({
      name: sisterConcern.name || "",
      description: sisterConcern.description || "",
      logo: sisterConcern.logo || "",
      website: sisterConcern.website || "",
      order: sisterConcern.order ?? 0,
      isActive: sisterConcern.isActive ?? true,
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setNotice("");
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file for the logo.");
      event.target.value = "";
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("section", "sister-concern");
      formData.append("title", form.name || "Sister concern logo");
      formData.append("alt", form.name || "Sister concern logo");
      const response = await uploadAPI.uploadSingle(formData);
      setForm((current) => ({ ...current, logo: response?.data?.url || "" }));
      setNotice("Logo uploaded successfully.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Unable to upload logo."));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      website: form.website.trim(),
      order: Number(form.order) || 0,
    };

    try {
      if (editingId) {
        await sisterConcernAPI.update(editingId, payload);
        setNotice("Sister concern updated successfully.");
      } else {
        await sisterConcernAPI.create(payload);
        setNotice("Sister concern created successfully.");
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadSisterConcerns();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save sister concern."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sisterConcern) => {
    if (!window.confirm(`Delete ${sisterConcern.name}?`)) return;

    setDeletingId(sisterConcern._id);
    setError("");
    setNotice("");

    try {
      await sisterConcernAPI.delete(sisterConcern._id);
      if (editingId === sisterConcern._id) cancelEdit();
      setNotice("Sister concern deleted successfully.");
      await loadSisterConcerns();
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError, "Unable to delete sister concern."),
      );
    } finally {
      setDeletingId(null);
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
            Sister Concern Manager
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Manage the enterprises displayed in the sister concerns section.
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

        <section className="mt-8 border border-[#123B63]/10 bg-white p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-[#0066D6]" aria-hidden="true" />
            <h2 className="font-heading text-xl font-700">
              {editingId ? "Edit Sister Concern" : "Create Sister Concern"}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="sister-concern-name"
                className="mb-2 block text-sm font-600"
              >
                Name
              </label>
              <input
                id="sister-concern-name"
                value={form.name}
                onChange={update("name")}
                className={inputClass}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="sister-concern-website"
                className="mb-2 block text-sm font-600"
              >
                Website
              </label>
              <input
                id="sister-concern-website"
                type="url"
                value={form.website}
                onChange={update("website")}
                className={inputClass}
                placeholder="https://example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="sister-concern-description"
                className="mb-2 block text-sm font-600"
              >
                Description
              </label>
              <textarea
                id="sister-concern-description"
                value={form.description}
                onChange={update("description")}
                className={inputClass}
                rows={4}
                placeholder="Describe the sister concern..."
              />
            </div>
            <div>
              <label
                htmlFor="sister-concern-order"
                className="mb-2 block text-sm font-600"
              >
                Display Order
              </label>
              <input
                id="sister-concern-order"
                type="number"
                min="0"
                value={form.order}
                onChange={update("order")}
                className={inputClass}
              />
            </div>
            <label
              htmlFor="sister-concern-active"
              className="flex items-center gap-3 self-end pb-2 text-sm font-600"
            >
              <input
                id="sister-concern-active"
                type="checkbox"
                checked={form.isActive}
                onChange={update("isActive")}
                className="h-4 w-4 accent-[#0066D6]"
              />
              Active sister concern
            </label>
            <div className="md:col-span-2">
              <label
                htmlFor="sister-concern-logo"
                className="mb-2 block text-sm font-600"
              >
                Logo Upload
              </label>
              <div className="flex flex-wrap items-center gap-5">
                {form.logo ? (
                  <img
                    src={form.logo}
                    alt="Logo preview"
                    className="h-20 w-32 object-contain border border-[#123B63]/10 p-2"
                  />
                ) : (
                  <div className="flex h-20 w-32 items-center justify-center border border-dashed border-[#123B63]/20 text-[#123B63]/35">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                )}
                <label
                  htmlFor="sister-concern-logo"
                  className="btn-outline-obsidian cursor-pointer"
                >
                  {uploading ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? "Uploading..." : "Choose Logo"}
                  <input
                    id="sister-concern-logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden="true" />{" "}
                {saving ? "Saving..." : "Save Sister Concern"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-outline-obsidian"
                >
                  <X className="h-4 w-4" aria-hidden="true" /> Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-8">
          <div className="border-b border-[#123B63]/10 pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Library
            </p>
            <h2 className="mt-2 font-heading text-2xl font-700">
              All Sister Concerns
            </h2>
          </div>
          <div className="mt-5 overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />{" "}
                Loading sister concerns...
              </div>
            ) : sisterConcerns.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No sister concerns found.
              </div>
            ) : (
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Logo</th>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Website</th>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sisterConcerns.map((sisterConcern) => (
                    <tr
                      key={sisterConcern._id}
                      className="border-b border-[#123B63]/10 last:border-0"
                    >
                      <td className="px-5 py-3">
                        {sisterConcern.logo ? (
                          <img
                            src={sisterConcern.logo}
                            alt=""
                            className="h-10 w-16 object-contain"
                          />
                        ) : (
                          <span className="text-[#123B63]/35">No logo</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-600">
                        {sisterConcern.name}
                      </td>
                      <td className="max-w-56 truncate px-5 py-4 text-[#123B63]/65">
                        {sisterConcern.website || "-"}
                      </td>
                      <td className="px-5 py-4">{sisterConcern.order ?? 0}</td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            sisterConcern.isActive
                              ? "text-[#00A651]"
                              : "text-[#123B63]/45"
                          }
                        >
                          {sisterConcern.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(sisterConcern)}
                            className="border border-[#123B63]/15 p-2 hover:border-[#0066D6] hover:text-[#0066D6]"
                            aria-label={`Edit ${sisterConcern.name}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(sisterConcern)}
                            disabled={deletingId === sisterConcern._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6] disabled:opacity-50"
                            aria-label={`Delete ${sisterConcern.name}`}
                          >
                            {deletingId === sisterConcern._id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
