import { useEffect, useState } from "react";
import {
  CalendarDays,
  Edit3,
  FileText,
  ImagePlus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { newsfeedAPI, uploadAPI } from "@/utils/api";
import AdminPagination, {
  useAdminPagination,
} from "@/components/admin/AdminPagination";

const getInitialForm = () => ({
  title: "",
  caption: "",
  image: "",
  imagePublicId: "",
  file: null,
});

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";
const getErrorMessage = (error, fallback) => {
  if (error?.response?.status === 404) {
    return "Newsfeed API is unavailable. Deploy the updated backend and verify VITE_API_URL points to it.";
  }

  return error?.response?.data?.message || error?.message || fallback;
};

export default function NewsfeedManager() {
  const [newsfeeds, setNewsfeeds] = useState([]);
  const [form, setForm] = useState(getInitialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { page, pageCount, setPage, pageItems } = useAdminPagination(newsfeeds);

  const loadNewsfeeds = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await newsfeedAPI.getAllAdmin();
      setNewsfeeds(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load newsfeeds."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewsfeeds();
  }, []);

  const update = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const chooseFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setForm((current) => ({ ...current, file }));
    setError("");
    setNotice("");
  };

  const startEdit = (newsfeed) => {
    setEditingId(newsfeed._id);
    setForm({
      title: newsfeed.title || "",
      caption: newsfeed.content || newsfeed.title || "",
      image: newsfeed.image || "",
      imagePublicId: newsfeed.imagePublicId || "",
      file: null,
    });
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(getInitialForm());
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      let image = form.image;
      let imagePublicId = form.imagePublicId;
      if (form.file) {
        const uploadData = new FormData();
        uploadData.append("image", form.file);
        uploadData.append("title", form.title.trim());
        uploadData.append("section", "other");
        const uploadResponse = await uploadAPI.uploadSingle(uploadData);
        image = uploadResponse?.data?.url || image;
        imagePublicId = uploadResponse?.data?.publicId || imagePublicId;
      }

      const payload = {
        title: form.title.trim(),
        caption: form.caption.trim(),
        image,
        imagePublicId,
      };

      if (editingId) {
        await newsfeedAPI.update(editingId, payload);
        setNotice("Newsfeed updated successfully.");
      } else {
        await newsfeedAPI.create(payload);
        setNotice("Newsfeed created successfully.");
      }
      setEditingId(null);
      setForm(getInitialForm());
      await loadNewsfeeds();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save newsfeed."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (newsfeed) => {
    if (!window.confirm(`Delete ${newsfeed.title || "this newsfeed"}?`)) return;
    setDeletingId(newsfeed._id);
    setError("");
    setNotice("");
    try {
      await newsfeedAPI.delete(newsfeed._id);
      setNewsfeeds((current) =>
        current.filter((item) => item._id !== newsfeed._id),
      );
      if (editingId === newsfeed._id) reset();
      setNotice("Newsfeed deleted successfully.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete newsfeed."));
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
              Newsfeed
            </h1>
            <p className="mt-2 text-sm text-[#123B63]/65">
              Publish updates and announcements for the public newsfeed.
            </p>
          </div>
          <button type="button" onClick={reset} className="btn-crimson">
            <Plus className="h-4 w-4" /> New Newsfeed
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#0066D6]" aria-hidden="true" />
              <h2 className="font-heading text-xl font-700">
                {editingId ? "Edit Newsfeed" : "Create Newsfeed"}
              </h2>
            </div>
            {editingId && (
              <button
                type="button"
                onClick={reset}
                className="text-[#123B63]/60 hover:text-[#0066D6]"
                aria-label="Cancel editing"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <label className="text-sm font-600 md:col-span-2">
              Title
              <input
                required
                value={form.title}
                onChange={update("title")}
                className={`${inputClass} mt-2`}
                placeholder="Write a title for this update"
              />
            </label>
            <label className="text-sm font-600 md:col-span-2">
              Caption
              <input
                required
                value={form.caption}
                onChange={update("caption")}
                className={`${inputClass} mt-2`}
                placeholder="Write a caption for this update"
              />
            </label>
            <div>
              <label className="text-sm font-600" htmlFor="newsfeed-image">
                Image (optional)
              </label>
              <input
                id="newsfeed-image"
                type="file"
                accept="image/*"
                onChange={chooseFile}
                className="mt-2 block w-full text-sm text-[#123B63]/70 file:mr-3 file:border-0 file:bg-[#123B63] file:px-3 file:py-2 file:text-white"
              />
              {form.file && (
                <p className="mt-2 text-xs text-[#0066D6]">{form.file.name}</p>
              )}
            </div>
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-crimson disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Newsfeed"
                    : "Publish Newsfeed"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={reset}
                  className="btn-outline-obsidian"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-8 border border-[#123B63]/10 bg-white">
          <div className="border-b border-[#123B63]/10 px-6 py-5">
            <h2 className="font-heading text-xl font-700">
              Published Newsfeeds
            </h2>
          </div>
          {loading ? (
            <p className="p-8 text-sm text-[#123B63]/60">
              Loading newsfeeds...
            </p>
          ) : newsfeeds.length === 0 ? (
            <p className="p-8 text-sm text-[#123B63]/60">No newsfeeds found.</p>
          ) : (
            <div className="divide-y divide-[#123B63]/10">
              {pageItems.map((newsfeed) => (
                <article
                  key={newsfeed._id}
                  className="grid gap-5 p-6 md:grid-cols-[160px_1fr_auto] md:items-start"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#EFF6FF]">
                    {newsfeed.image ? (
                      <img
                        src={newsfeed.image}
                        alt={newsfeed.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#123B63]/35">
                        <ImagePlus className="h-7 w-7" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0066D6]">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {newsfeed.date
                          ? new Date(newsfeed.date).toLocaleDateString()
                          : "Date unavailable"}
                      </span>
                      <span className="text-[#123B63]/50">
                        By{" "}
                        {newsfeed.author ||
                          "MARS FINANCIAL AND LEGAL CONSULTANCY LIMITED"}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-xl font-700 text-[#123B63]">
                      {newsfeed.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#123B63]/65">
                      {newsfeed.content}
                    </p>
                  </div>
                  <div className="flex gap-2 md:flex-col">
                    <button
                      type="button"
                      onClick={() => startEdit(newsfeed)}
                      className="inline-flex items-center gap-2 border border-[#123B63]/15 px-3 py-2 text-xs font-600 text-[#123B63] hover:border-[#0066D6] hover:text-[#0066D6]"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" /> Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === newsfeed._id}
                      onClick={() => handleDelete(newsfeed)}
                      className="inline-flex items-center gap-2 border border-red-200 px-3 py-2 text-xs font-600 text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      {deletingId === newsfeed._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
          {pageCount > 1 && (
            <AdminPagination
              page={page}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          )}
        </section>
      </div>
    </div>
  );
}
