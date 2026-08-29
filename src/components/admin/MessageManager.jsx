import React, { useEffect, useState } from "react";
import { LoaderCircle, Mail, Trash2 } from "lucide-react";
import { contactAPI } from "@/utils/api";
import AdminPagination, {
  useAdminPagination,
} from "@/components/admin/AdminPagination";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const formatDate = (date) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

export default function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const sortedMessages = [...messages].sort((first, second) => {
    if (first.read !== second.read)
      return Number(first.read) - Number(second.read);
    return new Date(second.createdAt) - new Date(first.createdAt);
  });
  const { page, pageCount, setPage, pageItems } =
    useAdminPagination(sortedMessages);

  useEffect(() => {
    contactAPI
      .getMessages()
      .then((response) => setMessages(response?.data || []))
      .catch((loadError) =>
        setError(getErrorMessage(loadError, "Unable to load messages.")),
      )
      .finally(() => setLoading(false));
  }, []);

  const handleReadStatus = async (message) => {
    setUpdatingId(message._id);
    setError("");
    setNotice("");

    try {
      const response = await contactAPI.updateReadStatus(
        message._id,
        !message.read,
      );
      const updatedMessage = response?.data || {
        ...message,
        read: !message.read,
      };
      setMessages((current) =>
        current.map((item) =>
          item._id === message._id ? updatedMessage : item,
        ),
      );
      setNotice(
        updatedMessage.read
          ? "Message marked as read."
          : "Message marked as unread.",
      );
    } catch (updateError) {
      setError(
        getErrorMessage(updateError, "Unable to update message status."),
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (message) => {
    if (!window.confirm(`Delete the message from ${message.name}?`)) return;

    setDeletingId(message._id);
    setError("");
    setNotice("");
    try {
      await contactAPI.deleteMessage(message._id);
      setMessages((current) =>
        current.filter((item) => item._id !== message._id),
      );
      setNotice("Message deleted successfully.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Unable to delete message."));
    } finally {
      setDeletingId(null);
    }
  };

  const replyTo = (message) => {
    const subject = encodeURIComponent(
      `Re: Contact message from ${message.name}`,
    );
    const body = encodeURIComponent(
      `Hello ${message.name},\n\n\n\nRegards,\nMARS FLC`,
    );
    window.open(
      `mailto:${message.email}?subject=${subject}&body=${body}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="min-h-screen bg-[#EFF6FF] px-5 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-[#123B63]/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
            Admin Manager
          </p>
          <h1 className="mt-2 font-heading text-3xl font-700 text-[#123B63]">
            Messages
          </h1>
          <p className="mt-2 text-sm text-[#123B63]/65">
            Review contact messages and reply directly through email.
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
                Contact Messages
              </h2>
            </div>
            <span className="text-sm text-[#123B63]/55">
              {messages.length} total
            </span>
          </div>
          <div className="overflow-x-auto border border-[#123B63]/10 bg-white">
            {loading ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#123B63]/60">
                No contact messages found.
              </div>
            ) : (
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="border-b border-[#123B63]/10 bg-[#EFF6FF] text-xs uppercase tracking-[0.12em] text-[#123B63]/60">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Phone Number</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Message</th>
                    <th className="px-5 py-4">Received</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((message) => (
                    <tr
                      key={message._id}
                      className={`border-b border-[#123B63]/10 last:border-0 ${message.read ? "" : "bg-[#0066D6]/[0.04]"}`}
                    >
                      <td className="px-5 py-4 align-top font-600">
                        {message.name}
                      </td>
                      <td className="px-5 py-4 align-top">
                        {message.phone || "-"}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <a
                          href={`mailto:${message.email}`}
                          className="text-[#0066D6] hover:underline"
                        >
                          {message.email}
                        </a>
                      </td>
                      <td className="max-w-sm whitespace-pre-wrap px-5 py-4 align-top text-[#123B63]/75">
                        {message.message}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 align-top text-[#123B63]/60">
                        {formatDate(message.createdAt)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => replyTo(message)}
                            className="inline-flex items-center gap-2 border border-[#0066D6] px-3 py-2 text-xs font-600 text-[#0066D6] hover:bg-[#0066D6] hover:text-white"
                          >
                            <Mail className="h-4 w-4" aria-hidden="true" />{" "}
                            Reply
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReadStatus(message)}
                            disabled={updatingId === message._id}
                            className="border border-[#123B63]/15 px-3 py-2 text-xs font-600 hover:border-[#0066D6] hover:text-[#0066D6] disabled:opacity-50"
                            aria-label={
                              message.read
                                ? `Mark ${message.name} as unread`
                                : `Mark ${message.name} as read`
                            }
                            title={
                              message.read ? "Mark as unread" : "Mark as read"
                            }
                          >
                            {updatingId === message._id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : message.read ? (
                              "Mark as unread"
                            ) : (
                              "Mark as read"
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(message)}
                            disabled={deletingId === message._id}
                            className="border border-[#123B63]/15 p-2 text-[#0066D6] disabled:opacity-50"
                            aria-label={`Delete message from ${message.name}`}
                            title="Delete message"
                          >
                            {deletingId === message._id ? (
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
