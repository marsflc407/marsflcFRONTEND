import React, { useEffect, useState } from "react";
import {
  Edit3,
  ImagePlus,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  BriefcaseBusiness,
} from "lucide-react";
import { serviceAPI, uploadAPI } from "@/utils/api";

const TYPES = [
  { value: "cpv", label: "CPV" },
  { value: "debt-collection", label: "Debt Collection" },
];

const EMPTY_FORM = {
  type: "cpv",
  title: "",
  description: "",
  icon: "",
  features: [""],
  image: "",
  order: 0,
  isActive: true,
};

const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function ServiceManager() {
  const [services, setServices] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadServices = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        filterType === "all"
          ? await serviceAPI.getAll()
          : await serviceAPI.getByType(filterType);
      const records = response?.data || [];
      setServices(
        records.sort(
          (first, second) => (first.order || 0) - (second.order || 0),
        ),
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load services."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [filterType]);

  const update = (field) => (event) => {
    const value =
      field === "isActive" ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setNotice("");
  };

  const updateFeature = (index) => (event) => {
    setForm((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index ? event.target.value : feature,
      ),
    }));
  };

  const addFeature = () =>
    setForm((current) => ({ ...current, features: [...current.features, ""] }));

  const removeFeature = (index) =>
    setForm((current) => ({
      ...current,
      features:
        current.features.length === 1
          ? [""]
          : current.features.filter(
              (_, featureIndex) => featureIndex !== index,
            ),
    }));

  const startCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, type: filterType === "all" ? "cpv" : filterType });
    setError("");
    setNotice("");
  };

  const startEdit = (service) => {
    setEditingId(service._id);
    setForm({
      type: service.type || "cpv",
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      features: service.features?.length ? service.features : [""],
      image: service.image || "",
      order: service.order ?? 0,
      isActive: service.isActive ?? true,
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

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("section", "services");
      formData.append("title", form.title || "Service image");
      formData.append("alt", form.title || "Service image");
      const response = await uploadAPI.uploadSingle(formData);
      setForm((current) => ({ ...current, image: response?.data?.url || "" }));
      setNotice("Image uploaded successfully.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Unable to upload image."));
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
      order: Number(form.order) || 0,
      features: form.features.map((feature) => feature.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await serviceAPI.update(editingId, payload);
        setNotice("Service updated successfully.");
      } else {
        await serviceAPI.create(payload);
        setNotice("Service created successfully.");
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      await loadServices();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to save service."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (service) => {
    if (!window.confirm(`Delete ${service.title}?`)) return;

    setDeletingId(service._id);
    setError("");
    setNotice("");

    try {
      await serviceAPI.delete(service._id);
      if (editingId === service._id) cancelEdit();
      setNotice("Service deleted successfully.");
      await loadServices();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete service."));
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
              Service Manager
            </h1>
            <p className="mt-2 text-sm text-[#123B63]/65">
              Manage service descriptions, features and media.
            </p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="btn-crimson self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New Service
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
            <BriefcaseBusiness
              className="h-5 w-5 text-[#0066D6]"
              aria-hidden="true"
            />
            <h2 className="font-heading text-xl font-700">
              {editingId ? "Edit Service" : "Create Service"}
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="service-type"
                className="mb-2 block text-sm font-600"
              >
                Type
              </label>
              <select
                id="service-type"
                value={form.type}
                onChange={update("type")}
                className={inputClass}
                required
              >
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="service-title"
                className="mb-2 block text-sm font-600"
              >
                Title
              </label>
              <input
                id="service-title"
                value={form.title}
                onChange={update("title")}
                className={inputClass}
                placeholder="Service title"
                required
              />
            </div>
            <div>
              <label
                htmlFor="service-icon"
                className="mb-2 block text-sm font-600"
              >
                Icon
              </label>
              <input
                id="service-icon"
                value={form.icon}
                onChange={update("icon")}
                className={inputClass}
                placeholder="ShieldCheck"
              />
            </div>
            <div>
              <label
                htmlFor="service-order"
                className="mb-2 block text-sm font-600"
              >
                Display Order
              </label>
              <input
                id="service-order"
                type="number"
                min="0"
                value={form.order}
                onChange={update("order")}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="service-description"
                className="mb-2 block text-sm font-600"
              >
                Description
              </label>
              <textarea
                id="service-description"
                value={form.description}
                onChange={update("description")}
                className={inputClass}
                rows={4}
                placeholder="Describe the service..."
                required
              />
            </div>
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-600">Features</label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-xs font-600 uppercase tracking-[0.08em] text-[#0066D6]"
                >
                  + Add feature
                </button>
              </div>
              <div className="space-y-3">
                {form.features.map((feature, index) => (
                  <div key={`feature-${index}`} className="flex gap-2">
                    <input
                      value={feature}
                      onChange={updateFeature(index)}
                      className={inputClass}
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="border border-[#123B63]/15 px-3 text-[#0066D6] hover:border-[#0066D6]"
                      aria-label={`Remove feature ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="service-image"
                className="mb-2 block text-sm font-600"
              >
                Image Upload
              </label>
              <input
                id="service-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className={`${inputClass} file:mr-4 file:border-0 file:bg-[#123B63] file:px-4 file:py-2 file:text-white`}
              />
              {uploading && (
                <p className="mt-2 text-sm text-[#0066D6]">
                  Uploading image...
                </p>
              )}
              {form.image && (
                <img
                  src={form.image}
                  alt="Service preview"
                  className="mt-4 h-28 w-48 object-cover"
                />
              )}
            </div>
            <label
              htmlFor="service-active"
              className="flex items-center gap-3 self-end pb-2 text-sm font-600"
            >
              <input
                id="service-active"
                type="checkbox"
                checked={form.isActive}
                onChange={update("isActive")}
                className="h-4 w-4 accent-[#0066D6]"
              />{" "}
              Active service
            </label>
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden="true" />{" "}
                {saving ? "Saving..." : "Save Service"}
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
                All Services
              </h2>
            </div>
            <div className="flex gap-3">
              <select
                aria-label="Filter services by type"
                value={filterType}
                onChange={(event) => setFilterType(event.target.value)}
                className={`${inputClass} min-w-44`}
              >
                <option value="all">All types</option>
                {TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={loadServices}
                className="border border-[#123B63]/15 bg-white px-3 hover:border-[#0066D6]"
                aria-label="Refresh services"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-5 overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                Loading services...
              </div>
            ) : services.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No services found for this filter.
              </div>
            ) : (
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Type</th>
                    <th className="px-5 py-4">Title</th>
                    <th className="px-5 py-4">Features</th>
                    <th className="px-5 py-4">Order</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service._id}
                      className="border-b border-[#123B63]/10 last:border-0"
                    >
                      <td className="px-5 py-4 font-mono text-xs uppercase">
                        {service.type}
                      </td>
                      <td className="px-5 py-4 font-600">{service.title}</td>
                      <td className="px-5 py-4">
                        {service.features?.length || 0}
                      </td>
                      <td className="px-5 py-4">{service.order ?? 0}</td>
                      <td className="px-5 py-4">
                        <span
                          className={
                            service.isActive
                              ? "text-[#00A651]"
                              : "text-[#123B63]/45"
                          }
                        >
                          {service.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(service)}
                            className="border border-[#123B63]/15 p-2 hover:border-[#0066D6] hover:text-[#0066D6]"
                            aria-label={`Edit ${service.title}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(service)}
                            disabled={deletingId === service._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6] disabled:opacity-50"
                            aria-label={`Delete ${service.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
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
