import React, { useEffect, useState } from "react";
import {
  Building2,
  ImagePlus,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { partnerCompanyAPI } from "@/utils/api";

const EMPTY_FORM = { name: "", image: null };
const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function PartnerCompanyManager() {
  const [partnerCompanies, setPartnerCompanies] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadPartnerCompanies = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await partnerCompanyAPI.getAll();
      setPartnerCompanies(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load partner companies."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartnerCompanies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.image) {
      setError("Please choose a company image.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("image", form.image);
      await partnerCompanyAPI.create(formData);
      setForm(EMPTY_FORM);
      setNotice("Partner company added successfully.");
      await loadPartnerCompanies();
    } catch (saveError) {
      setError(getErrorMessage(saveError, "Unable to add partner company."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partnerCompany) => {
    if (!window.confirm(`Delete ${partnerCompany.name}?`)) return;

    setDeletingId(partnerCompany._id);
    setError("");
    setNotice("");

    try {
      await partnerCompanyAPI.delete(partnerCompany._id);
      setPartnerCompanies((current) =>
        current.filter((item) => item._id !== partnerCompany._id),
      );
      setNotice("Partner company deleted successfully.");
    } catch (deleteError) {
      setError(
        getErrorMessage(deleteError, "Unable to delete partner company."),
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
            Partner Companies
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Add the companies shown in the public partner network ticker.
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
              Add Partner Company
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="partner-company-name"
                className="mb-2 block text-sm font-600"
              >
                Company Name
              </label>
              <input
                id="partner-company-name"
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                className={inputClass}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="partner-company-image"
                className="mb-2 block text-sm font-600"
              >
                Company Image
              </label>
              <label
                htmlFor="partner-company-image"
                className="btn-outline-obsidian inline-flex cursor-pointer"
              >
                <Upload className="h-4 w-4" aria-hidden="true" />
                {form.image ? form.image.name : "Choose Image"}
                <input
                  id="partner-company-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image: event.target.files?.[0] || null,
                    }))
                  }
                  className="sr-only"
                  required={!form.image}
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-crimson disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
              )}
              {saving ? "Uploading..." : "Add Partner Company"}
            </button>
          </form>
        </section>

        <section className="mt-8">
          <div className="border-b border-[#123B63]/10 pb-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Library
            </p>
            <h2 className="mt-2 font-heading text-2xl font-700">
              Managed Partner Companies
            </h2>
          </div>
          <div className="mt-5 overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />{" "}
                Loading partner companies...
              </div>
            ) : partnerCompanies.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No partner companies found.
              </div>
            ) : (
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Image</th>
                    <th className="px-5 py-4">Company Name</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partnerCompanies.map((partnerCompany) => (
                    <tr
                      key={partnerCompany._id}
                      className="border-b border-[#123B63]/10 last:border-0"
                    >
                      <td className="px-5 py-3">
                        <img
                          src={partnerCompany.image}
                          alt=""
                          className="h-12 w-24 object-contain"
                        />
                      </td>
                      <td className="px-5 py-4 font-600">
                        {partnerCompany.name}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDelete(partnerCompany)}
                            disabled={deletingId === partnerCompany._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6] disabled:opacity-50"
                            aria-label={`Delete ${partnerCompany.name}`}
                          >
                            {deletingId === partnerCompany._id ? (
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
