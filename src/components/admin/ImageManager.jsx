import React, { useEffect, useRef, useState } from "react";
import {
  FileImage,
  ImagePlus,
  LoaderCircle,
  Trash2,
  Upload,
} from "lucide-react";
import { uploadAPI } from "@/utils/api";
import AdminPagination, {
  useAdminPagination,
} from "@/components/admin/AdminPagination";

const SECTIONS = [
  { value: "hero", label: "Hero" },
  { value: "team", label: "Team" },
  { value: "company-overview", label: "Company Overview" },
  { value: "services", label: "Services" },
  { value: "sister-concern", label: "Sister Concern" },
  { value: "other", label: "Other" },
];

const EMPTY_FORM = { section: "other", title: "", alt: "", file: null };
const inputClass =
  "w-full border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export default function ImageManager() {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const { page, pageCount, setPage, pageItems } = useAdminPagination(images);
  const [replacingId, setReplacingId] = useState(null);

  const loadImages = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await uploadAPI.getAll();
      setImages(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load images."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
    setNotice("");
  };

  const chooseFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setForm((current) => ({ ...current, file }));
    setError("");
    setNotice("");
  };

  const handleFileChange = (event) => {
    chooseFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.file) {
      setError("Choose an image before uploading.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");

    try {
      const formData = new FormData();
      formData.append("image", form.file);
      formData.append("section", form.section);
      formData.append("title", form.title.trim());
      formData.append("alt", form.alt.trim());
      await uploadAPI.uploadSingle(formData);
      setForm(EMPTY_FORM);
      setNotice("Image uploaded successfully.");
      await loadImages();
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, "Unable to upload image."));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm(`Delete ${image.title || "this image"}?`)) return;

    setDeletingId(image._id);
    setError("");
    setNotice("");

    try {
      await uploadAPI.delete(image._id);
      setImages((current) =>
        current.filter((currentImage) => currentImage._id !== image._id),
      );
      setNotice("Image deleted successfully.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete image."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleReplace = async (image, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setReplacingId(image._id);
    setError("");
    setNotice("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", image.title || "");
      formData.append("alt", image.alt || "");
      formData.append("section", image.section || "other");
      await uploadAPI.replace(image._id, formData);
      setNotice("Image replaced successfully.");
      await loadImages();
    } catch (replaceError) {
      setError(getErrorMessage(replaceError, "Unable to replace image."));
    } finally {
      setReplacingId(null);
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
            Image Manager
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Upload and organize the image library used across the site.
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
            <h2 className="font-heading text-xl font-700">Upload Image</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="image-section"
                className="mb-2 block text-sm font-600"
              >
                Section
              </label>
              <select
                id="image-section"
                value={form.section}
                onChange={update("section")}
                className={inputClass}
              >
                {SECTIONS.map((section) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="image-title"
                className="mb-2 block text-sm font-600"
              >
                Title
              </label>
              <input
                id="image-title"
                value={form.title}
                onChange={update("title")}
                className={inputClass}
                placeholder="Image title"
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="image-alt"
                className="mb-2 block text-sm font-600"
              >
                Alt text
              </label>
              <input
                id="image-alt"
                value={form.alt}
                onChange={update("alt")}
                className={inputClass}
                placeholder="Describe the image"
              />
            </div>
            <div className="md:col-span-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex min-h-36 w-full flex-col items-center justify-center border-2 border-dashed px-5 text-center transition-colors ${dragging ? "border-[#0066D6] bg-[#0066D6]/5" : "border-[#123B63]/20 hover:border-[#0066D6]"}`}
              >
                <Upload className="h-7 w-7 text-[#0066D6]" aria-hidden="true" />
                <span className="mt-3 text-sm font-600">
                  {form.file
                    ? form.file.name
                    : "Choose an image or drop it here"}
                </span>
                <span className="mt-1 text-xs text-[#123B63]/55">
                  PNG, JPG, WEBP or GIF
                </span>
              </button>
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="btn-crimson md:col-span-2 md:w-fit"
            >
              {uploading ? (
                <LoaderCircle
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Upload className="h-4 w-4" aria-hidden="true" />
              )}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between border-b border-[#123B63]/10 pb-4">
            <h2 className="font-heading text-xl font-700">Uploaded Images</h2>
            <span className="text-sm text-[#123B63]/55">
              {images.length} total
            </span>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 py-10 text-sm text-[#123B63]/60">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading
              images...
            </div>
          ) : images.length === 0 ? (
            <div className="border border-dashed border-[#123B63]/20 bg-white px-6 py-12 text-center text-sm text-[#123B63]/60">
              No images uploaded yet.
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((image) => (
                <article
                  key={image._id}
                  className="overflow-hidden border border-[#123B63]/10 bg-white"
                >
                  <div className="aspect-[4/3] bg-[#EFF6FF]">
                    <img
                      src={image.url}
                      alt={image.alt || image.title || "Uploaded image"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-700">
                          {image.title || "Untitled image"}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-[#0066D6]">
                          {image.section || "other"}
                        </p>
                      </div>
                      <FileImage
                        className="h-4 w-4 shrink-0 text-[#123B63]/35"
                        aria-hidden="true"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(image)}
                      disabled={deletingId === image._id}
                      className="mt-4 inline-flex items-center gap-2 text-sm text-[#0066D6] hover:text-[#123B63] disabled:opacity-50"
                    >
                      {deletingId === image._id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {deletingId === image._id ? "Deleting..." : "Delete"}
                    </button>
                    <label className="mt-4 ml-4 inline-flex cursor-pointer items-center gap-2 text-sm text-[#0066D6] hover:text-[#123B63]">
                      <Upload className="h-4 w-4" />
                      {replacingId === image._id ? "Replacing..." : "Replace"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={replacingId === image._id}
                        onChange={(event) => {
                          handleReplace(image, event.target.files?.[0]);
                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </article>
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
