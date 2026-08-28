import React, { useEffect, useState } from "react";
import {
  Eye,
  Download,
  LoaderCircle,
  Mail,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import { applicationAPI } from "@/utils/api";

const STATUSES = ["pending", "reviewed", "accepted", "rejected"];
const inputClass =
  "border border-[#123B63]/15 bg-white px-3 py-2.5 text-sm text-[#123B63] focus:border-[#0066D6] focus:outline-none focus:ring-2 focus:ring-[#0066D6]/20";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const formatDate = (date) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
};

const statusClass = {
  pending: "bg-amber-50 text-amber-700",
  reviewed: "bg-sky-50 text-sky-700",
  accepted: "bg-[#00A651]/10 text-[#00A651]",
  rejected: "bg-[#0066D6]/10 text-[#0066D6]",
};

export default function ApplicationManager() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await applicationAPI.getAll();
      setApplications(response?.data || []);
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Unable to load applications."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (application, event) => {
    const status = event.target.value;
    setUpdatingId(application._id);
    setError("");
    setNotice("");

    try {
      const response = await applicationAPI.updateStatus(application._id, {
        status,
      });
      const updatedApplication = response?.data || { ...application, status };
      setApplications((current) =>
        current.map((currentApplication) =>
          currentApplication._id === application._id
            ? updatedApplication
            : currentApplication,
        ),
      );
      setSelectedApplication((current) =>
        current?._id === application._id ? updatedApplication : current,
      );
      setNotice("Application status updated successfully.");
    } catch (statusError) {
      setError(
        getErrorMessage(statusError, "Unable to update application status."),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (application) => {
    if (!window.confirm(`Delete the application from ${application.name}?`))
      return;

    setDeletingId(application._id);
    setError("");
    setNotice("");

    try {
      await applicationAPI.delete(application._id);
      setApplications((current) =>
        current.filter(
          (currentApplication) => currentApplication._id !== application._id,
        ),
      );
      setSelectedApplication(null);
      setNotice("Application deleted successfully.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete application."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadCv = async (application) => {
    try {
      const file = await applicationAPI.downloadCv(application._id);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${application.name || "applicant"}-cv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(
        getErrorMessage(
          downloadError,
          "Unable to download CV. Use Open CV instead.",
        ),
      );
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
            Application Manager
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Review candidates, track application status, and access submitted
            CVs.
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

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between border-b border-[#123B63]/10 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
                Inbox
              </p>
              <h2 className="mt-2 font-heading text-2xl font-700">
                Job Applications
              </h2>
            </div>
            <span className="text-sm text-[#123B63]/55">
              {applications.length} total
            </span>
          </div>
          <div className="overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />{" "}
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No job applications found.
              </div>
            ) : (
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Applicant</th>
                    <th className="px-5 py-4">Position</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Applied</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr
                      key={application._id}
                      className="border-b border-[#123B63]/10 last:border-0"
                    >
                      <td className="px-5 py-4 font-600">{application.name}</td>
                      <td className="px-5 py-4">{application.position}</td>
                      <td className="px-5 py-4">
                        <div>{application.email}</div>
                        <div className="mt-1 text-xs text-[#123B63]/55">
                          {application.phone || "No phone"}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={application.status || "pending"}
                          onChange={(event) =>
                            handleStatusChange(application, event)
                          }
                          disabled={updatingId === application._id}
                          className={`${inputClass} py-1.5 text-xs font-600 capitalize ${statusClass[application.status] || ""}`}
                          aria-label={`Status for ${application.name}`}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-[#123B63]/65">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedApplication(application)}
                            className="border border-[#123B63]/15 p-2 hover:border-[#0066D6] hover:text-[#0066D6]"
                            aria-label={`View ${application.name}`}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {application.cv && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDownloadCv(application)}
                                className="border border-[#123B63]/15 p-2 hover:border-[#0066D6] hover:text-[#0066D6]"
                                aria-label={`Download CV for ${application.name}`}
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(application)}
                            disabled={deletingId === application._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6] disabled:opacity-50"
                            aria-label={`Delete application from ${application.name}`}
                          >
                            {deletingId === application._id ? (
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

      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#123B63]/60 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="application-details-title"
        >
          <div className="max-h-full w-full max-w-2xl overflow-y-auto border border-[#123B63]/10 bg-white p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#123B63]/10 pb-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
                  Application Details
                </p>
                <h2
                  id="application-details-title"
                  className="mt-2 font-heading text-2xl font-700"
                >
                  {selectedApplication.name}
                </h2>
                <p className="mt-1 text-sm text-[#123B63]/60">
                  {selectedApplication.position}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="border border-[#123B63]/15 p-2 hover:border-[#0066D6] hover:text-[#0066D6]"
                aria-label="Close application details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#123B63]/45">
                  Email
                </p>
                <a
                  href={`mailto:${selectedApplication.email}`}
                  className="mt-1 flex items-center gap-2 text-sm text-[#0066D6]"
                >
                  <Mail className="h-4 w-4" />
                  {selectedApplication.email}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#123B63]/45">
                  Phone
                </p>
                <a
                  href={`tel:${selectedApplication.phone}`}
                  className="mt-1 flex items-center gap-2 text-sm text-[#0066D6]"
                >
                  <Phone className="h-4 w-4" />
                  {selectedApplication.phone || "Not provided"}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#123B63]/45">
                  Applied
                </p>
                <p className="mt-1 text-sm">
                  {formatDate(selectedApplication.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#123B63]/45">
                  Status
                </p>
                <p
                  className={`mt-1 inline-flex px-2 py-1 text-xs font-600 capitalize ${statusClass[selectedApplication.status] || "bg-[#EFF6FF]"}`}
                >
                  {selectedApplication.status || "pending"}
                </p>
              </div>
            </div>
            <div className="mt-6 border-t border-[#123B63]/10 pt-5">
              <p className="text-xs uppercase tracking-wider text-[#123B63]/45">
                Cover Letter
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[#123B63]/75">
                {selectedApplication.coverLetter || "No cover letter provided."}
              </p>
            </div>
            {selectedApplication.cv && (
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#download-cv"
                  onClick={(event) => {
                    event.preventDefault();
                    handleDownloadCv(selectedApplication);
                  }}
                  className="btn-crimson inline-flex"
                >
                  <Download className="h-4 w-4" /> Download CV
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
