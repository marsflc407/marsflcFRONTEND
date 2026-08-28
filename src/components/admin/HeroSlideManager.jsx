import React, { useEffect, useState } from "react";
import {
  Edit3,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { heroSlideAPI } from "@/utils/api";

const EMPTY_FORM = {
  eyebrow: "Mars Financial & Legal Consultancy",
  title: "",
  description: "",
  image: null,
  order: 0,
  isActive: true,
};
const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function HeroSlideManager() {
  const [slides, setSlides] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadSlides = async () => {
    setLoading(true);
    try {
      const response = await heroSlideAPI.getAll();
      setSlides(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load hero slides."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const update = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const startEdit = (slide) => {
    setEditingId(slide._id);
    setForm({
      eyebrow: slide.eyebrow || "",
      title: slide.title || "",
      description: slide.description || "",
      image: null,
      currentImage: slide.image,
      order: slide.order ?? 0,
      isActive: slide.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingId && !form.image) {
      setError("Choose an image for the hero slide.");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const data = new FormData();
      data.append("eyebrow", form.eyebrow.trim());
      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("order", String(Number(form.order) || 0));
      data.append("isActive", String(form.isActive));
      if (form.image) data.append("image", form.image);
      if (editingId) await heroSlideAPI.update(editingId, data);
      else await heroSlideAPI.create(data);
      setNotice(
        editingId
          ? "Hero slide updated successfully."
          : "Hero slide added successfully.",
      );
      cancelEdit();
      await loadSlides();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save hero slide."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slide) => {
    if (!window.confirm(`Delete ${slide.title}?`)) return;
    setDeletingId(slide._id);
    setError("");
    setNotice("");
    try {
      await heroSlideAPI.delete(slide._id);
      setSlides((current) => current.filter((item) => item._id !== slide._id));
      if (editingId === slide._id) cancelEdit();
      setNotice("Hero slide deleted successfully.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete hero slide."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Home Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Hero Slides
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Add, edit, reorder and remove the Home page hero slides.
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
            <ImagePlus className="h-5 w-5 text-[#0066D6]" aria-hidden="true" />
            <h2 className="font-heading text-xl font-700">
              {editingId ? "Edit Hero Slide" : "Add Hero Slide"}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="hero-eyebrow"
                className="mb-2 block text-sm font-600"
              >
                Eyebrow
              </label>
              <input
                id="hero-eyebrow"
                value={form.eyebrow}
                onChange={update("eyebrow")}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="hero-title"
                className="mb-2 block text-sm font-600"
              >
                Title
              </label>
              <input
                id="hero-title"
                value={form.title}
                onChange={update("title")}
                className={inputClass}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="hero-description"
                className="mb-2 block text-sm font-600"
              >
                Description
              </label>
              <textarea
                id="hero-description"
                value={form.description}
                onChange={update("description")}
                className={inputClass}
                rows={4}
                required
              />
            </div>
            <div>
              <label
                htmlFor="hero-image"
                className="mb-2 block text-sm font-600"
              >
                Hero Image
              </label>
              <label
                htmlFor="hero-image"
                className="btn-outline-obsidian inline-flex cursor-pointer"
              >
                <UploadIcon />
                <span className="max-w-56 truncate">
                  {form.image?.name ||
                    (editingId ? "Replace image (optional)" : "Choose image")}
                </span>
                <input
                  id="hero-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image: event.target.files?.[0] || null,
                    }))
                  }
                  className="sr-only"
                />
              </label>
              {form.currentImage && (
                <img
                  src={form.currentImage}
                  alt="Current hero"
                  className="mt-3 h-20 w-36 object-cover"
                />
              )}
            </div>
            <div>
              <label
                htmlFor="hero-order"
                className="mb-2 block text-sm font-600"
              >
                Display Order
              </label>
              <input
                id="hero-order"
                type="number"
                min="0"
                value={form.order}
                onChange={update("order")}
                className={inputClass}
              />
            </div>
            <label
              htmlFor="hero-active"
              className="flex items-center gap-3 text-sm font-600"
            >
              <input
                id="hero-active"
                type="checkbox"
                checked={form.isActive}
                onChange={update("isActive")}
                className="h-4 w-4 accent-[#0066D6]"
              />{" "}
              Active slide
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-crimson disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Add Hero Slide"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="btn-outline-obsidian"
                >
                  <X className="h-4 w-4" /> Cancel
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
              Current Hero Slides
            </h2>
          </div>
          <div className="mt-5 overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center">
                <LoaderCircle className="mx-auto h-5 w-5 animate-spin" />
              </div>
            ) : slides.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No managed slides. The default Home hero is active.
              </div>
            ) : (
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slides.map((slide) => (
                    <tr
                      key={slide._id}
                      className="border-b border-[#123B63]/10 last:border-0"
                    >
                      <td className="px-5 py-3">
                        <img
                          src={slide.image}
                          alt=""
                          className="h-12 w-24 object-cover"
                        />
                      </td>
                      <td className="px-5 py-4 font-600">{slide.title}</td>
                      <td className="px-5 py-4">{slide.order}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(slide)}
                            className="border border-[#123B63]/15 p-2"
                            aria-label={`Edit ${slide.title}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(slide)}
                            disabled={deletingId === slide._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6]"
                            aria-label={`Delete ${slide.title}`}
                          >
                            {deletingId === slide._id ? (
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

function UploadIcon() {
  return <Plus className="h-4 w-4" aria-hidden="true" />;
}
