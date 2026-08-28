import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Edit3,
  FileText,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { contentAPI } from "@/utils/api";

const PAGES = ["home", "about", "cpv", "debt-collection", "careers", "contact"];

const EMPTY_FORM = {
  page: "home",
  section: "",
  title: "",
  subtitle: "",
  content: "",
  order: 0,
  isActive: true,
};

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function ContentManager() {
  const [searchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [filterPage, setFilterPage] = useState(
    searchParams.get("page") || "all",
  );
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadContent = async () => {
    setLoading(true);
    setError("");

    try {
      const pages = filterPage === "all" ? PAGES : [filterPage];
      const responses = await Promise.all(
        pages.map((page) => contentAPI.getByPage(page)),
      );
      const records = responses.flatMap((response) => response?.data || []);
      setContent(
        records.sort(
          (first, second) =>
            (first.page || "").localeCompare(second.page || "") ||
            (first.order || 0) - (second.order || 0),
        ),
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load content."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [filterPage]);

  const update = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      page: filterPage === "all" ? "home" : filterPage,
    });
    setError("");
    setNotice("");
  };

  const startEdit = (record) => {
    setEditingId(record._id);
    setForm({
      page: record.page || "home",
      section: record.section || "",
      title: record.title || "",
      subtitle: record.subtitle || "",
      content: record.content || "",
      order: record.order ?? 0,
      isActive: record.isActive ?? true,
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = { ...form, order: Number(form.order) || 0 };

    try {
      if (editingId) {
        await contentAPI.update(editingId, payload);
        setNotice("Content updated successfully.");
      } else {
        await contentAPI.create(payload);
        setNotice("Content created successfully.");
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadContent();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save content."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    if (
      !window.confirm(`Delete the ${record.section} content on ${record.page}?`)
    )
      return;

    setDeletingId(record._id);
    setError("");
    setNotice("");

    try {
      await contentAPI.delete(record._id);
      if (editingId === record._id) cancelEdit();
      setNotice("Content deleted successfully.");
      await loadContent();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete content."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-[#123B63]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Admin Manager
            </p>
            <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
              Content Manager
            </h1>
            <p className="mt-2 text-sm text-[#123B63]/65">
              Create, edit and organize page content.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="btn-crimson self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New Content
          </button>
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
            <FileText className="h-5 w-5 text-[#0066D6]" aria-hidden="true" />
            <h2 className="font-heading text-xl font-700">
              {editingId ? "Edit Content" : "Create Content"}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="content-page"
                className="mb-2 block text-sm font-600"
              >
                Page
              </label>
              <select
                id="content-page"
                value={form.page}
                onChange={update("page")}
                className={inputClass}
                required
              >
                {PAGES.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="content-section"
                className="mb-2 block text-sm font-600"
              >
                Section
              </label>
              <input
                id="content-section"
                value={form.section}
                onChange={update("section")}
                className={inputClass}
                placeholder="hero"
                required
              />
            </div>
            <div>
              <label
                htmlFor="content-title"
                className="mb-2 block text-sm font-600"
              >
                Title
              </label>
              <input
                id="content-title"
                value={form.title}
                onChange={update("title")}
                className={inputClass}
                placeholder="Section title"
              />
            </div>
            <div>
              <label
                htmlFor="content-subtitle"
                className="mb-2 block text-sm font-600"
              >
                Subtitle
              </label>
              <input
                id="content-subtitle"
                value={form.subtitle}
                onChange={update("subtitle")}
                className={inputClass}
                placeholder="Supporting subtitle"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="content-body"
                className="mb-2 block text-sm font-600"
              >
                Content
              </label>
              <textarea
                id="content-body"
                value={form.content}
                onChange={update("content")}
                className={inputClass}
                rows={6}
                placeholder="Write the section content..."
              />
            </div>
            <div>
              <label
                htmlFor="content-order"
                className="mb-2 block text-sm font-600"
              >
                Display Order
              </label>
              <input
                id="content-order"
                type="number"
                min="0"
                value={form.order}
                onChange={update("order")}
                className={inputClass}
              />
            </div>
            <label
              htmlFor="content-active"
              className="flex items-center gap-3 self-end pb-2 text-sm font-600"
            >
              <input
                id="content-active"
                type="checkbox"
                checked={form.isActive}
                onChange={update("isActive")}
                className="h-4 w-4 accent-[#0066D6]"
              />{" "}
              Active content
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden="true" />{" "}
                {saving ? "Saving..." : "Save Content"}
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
                Library
              </p>
              <h2 className="mt-2 font-heading text-2xl font-700">
                All Content
              </h2>
            </div>
            <div className="flex gap-3">
              <select
                aria-label="Filter content by page"
                value={filterPage}
                onChange={(event) => setFilterPage(event.target.value)}
                className={`${inputClass} min-w-44`}
              >
                <option value="all">All pages</option>
                {PAGES.map((page) => (
                  <option key={page} value={page}>
                    {page}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={loadContent}
                className="border border-[#123B63]/15 bg-white px-3 text-[#123B63] hover:border-[#0066D6]"
                aria-label="Refresh content"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                Loading content...
              </div>
            ) : content.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No content found for this filter.
              </div>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Page</th>
                    <th className="px-5 py-4">Section</th>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map((record) => (
                    <tr
                      key={record._id}
                      className="border-b border-[#123B63]/10 last:border-0"
                    >
                      <td className="px-5 py-4 font-mono text-xs">
                        {record.page}
                      </td>
                      <td className="px-5 py-4 font-600">{record.section}</td>
                      <td className="max-w-xs truncate px-5 py-4">
                        {record.title || "Untitled"}
                      </td>
                      <td className="px-5 py-4">{record.order ?? 0}</td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            record.isActive
                              ? "text-[#00A651]"
                              : "text-[#123B63]/45"
                          }
                        >
                          {record.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(record)}
                            className="border border-[#123B63]/15 p-2 text-[#123B63] hover:border-[#0066D6] hover:text-[#0066D6]"
                            aria-label={`Edit ${record.section}`}
                          >
                            <Edit3 className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(record)}
                            disabled={deletingId === record._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6] hover:border-[#0066D6] disabled:opacity-50"
                            aria-label={`Delete ${record.section}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
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
