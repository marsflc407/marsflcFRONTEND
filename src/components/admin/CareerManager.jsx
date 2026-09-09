import React, { useEffect, useState } from "react";
import { BriefcaseBusiness, Edit3, Plus, Trash2, X } from "lucide-react";
import { careerAPI } from "@/utils/api";
import AdminPagination, {
  useAdminPagination,
} from "@/components/admin/AdminPagination";

const EMPTY_FORM = {
  position: "",
  department: "",
  description: "",
  requirements: "",
  location: "",
  vacancy: 1,
  applicationDeadline: "",
  isActive: true,
};

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";
const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function CareerManager() {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { page, pageCount, setPage, pageItems } = useAdminPagination(careers);

  const loadCareers = async () => {
    setLoading(true);
    try {
      const response = await careerAPI.getAllAdmin();
      setCareers(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load job posts."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCareers();
  }, []);

  const update = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const startEdit = (career) => {
    setEditingId(career._id);
    setForm({
      position: career.position || "",
      department: career.department || "",
      description: career.description || "",
      requirements: (career.requirements || []).join("\n"),
      location: career.location || "",
      vacancy: career.vacancy || 1,
      applicationDeadline: career.applicationDeadline
        ? career.applicationDeadline.slice(0, 10)
        : "",
      isActive: career.isActive ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      ...form,
      requirements: form.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const deadline = new Date(form.applicationDeadline);
    if (Number.isNaN(deadline.getTime()) || deadline <= new Date()) {
      setError("Application deadline must be a future date.");
      setSaving(false);
      return;
    }

    try {
      if (editingId) {
        await careerAPI.update(editingId, payload);
        setNotice("Job post updated successfully.");
      } else {
        await careerAPI.create(payload);
        setNotice("Job post created successfully.");
      }
      reset();
      await loadCareers();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save job post."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (career) => {
    if (!window.confirm(`Delete ${career.position}?`)) return;
    try {
      await careerAPI.delete(career._id);
      setNotice("Job post deleted successfully.");
      if (editingId === career._id) reset();
      await loadCareers();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete job post."));
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
              We Are Hiring
            </h1>
            <p className="mt-2 text-sm text-[#123B63]/65">
              Create and manage the job posts shown on the Careers page.
            </p>
          </div>
          <button type="button" onClick={reset} className="btn-crimson">
            <Plus className="h-4 w-4" /> New Job Post
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
              <BriefcaseBusiness className="h-5 w-5 text-[#0066D6]" />
              <h2 className="font-heading text-xl font-700">
                {editingId ? "Edit Job Post" : "Create Job Post"}
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
            <label className="text-sm font-600">
              Position
              <input
                required
                value={form.position}
                onChange={update("position")}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="text-sm font-600">
              Department
              <input
                value={form.department}
                onChange={update("department")}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="text-sm font-600">
              Location
              <input
                value={form.location}
                onChange={update("location")}
                className={`${inputClass} mt-2`}
                placeholder="Dhaka / Field-based"
              />
            </label>
            <label className="flex items-center gap-3 pt-7 text-sm font-600">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={update("isActive")}
              />{" "}
              Publish this job post
            </label>
            <label className="text-sm font-600">
              Vacancies
              <input
                type="number"
                min="1"
                required
                value={form.vacancy}
                onChange={update("vacancy")}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="text-sm font-600">
              Application Deadline
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={form.applicationDeadline}
                onChange={update("applicationDeadline")}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="text-sm font-600 md:col-span-2">
              Description
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={update("description")}
                className={`${inputClass} mt-2`}
              />
            </label>
            <label className="text-sm font-600 md:col-span-2">
              Requirements{" "}
              <span className="font-normal text-[#123B63]/55">
                (one per line)
              </span>
              <textarea
                rows={5}
                value={form.requirements}
                onChange={update("requirements")}
                className={`${inputClass} mt-2`}
              />
            </label>
            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-crimson disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Job Post"
                    : "Create Job Post"}
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
              Published Job Posts
            </h2>
          </div>
          {loading ? (
            <p className="p-8 text-sm text-[#123B63]/60">
              Loading job posts...
            </p>
          ) : careers.length === 0 ? (
            <p className="p-8 text-sm text-[#123B63]/60">No job posts found.</p>
          ) : (
            <div className="divide-y divide-[#123B63]/10">
              {pageItems.map((career) => (
                <div
                  key={career._id}
                  className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading text-lg font-700">
                        {career.position}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs ${career.isActive ? "bg-[#00A651]/10 text-[#00A651]" : "bg-[#123B63]/10 text-[#123B63]/55"}`}
                      >
                        {career.isActive ? "Published" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#123B63]/55">
                      {[career.department, career.location]
                        .filter(Boolean)
                        .join(" / ") || "No department or location"}
                    </p>
                    <p className="mt-3 max-w-3xl text-sm text-[#123B63]/70">
                      {career.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(career)}
                      className="border border-[#123B63]/15 p-2 hover:border-[#0066D6] hover:text-[#0066D6]"
                      aria-label={`Edit ${career.position}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(career)}
                      className="border border-[#123B63]/15 p-2 text-[#0066D6] hover:border-[#0066D6]"
                      aria-label={`Delete ${career.position}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <AdminPagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </section>
      </div>
    </div>
  );
}
