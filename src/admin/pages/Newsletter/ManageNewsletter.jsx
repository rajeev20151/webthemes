import { useEffect, useState } from "react";
import {
  adminGetNewsletterAPI,
  adminDeleteNewsletterAPI,
  adminSendNewsletterAPI,
} from "../../services/adminApi";

const IconMail = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconTrash = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconSend = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export default function ManageNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const loadSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminGetNewsletterAPI();
      if (res.success) {
        setSubscribers(res.data || []);
      } else {
        setError(res.message || "Failed to load subscribers");
      }
    } catch (err) {
      setError("Could not load subscribers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await adminDeleteNewsletterAPI(id);
      if (res.success) {
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      // no-op
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await adminSendNewsletterAPI(emailSubject.trim(), emailMessage.trim());
      if (res.success) {
        setSendResult({ type: "success", message: res.message });
        setEmailSubject("");
        setEmailMessage("");
        setTimeout(() => { setShowCompose(false); setSendResult(null); }, 2500);
      } else {
        setSendResult({ type: "error", message: res.message || "Failed to send" });
      }
    } catch (err) {
      setSendResult({ type: "error", message: "Something went wrong" });
    } finally {
      setSending(false);
    }
  };

  const filtered = subscribers.filter((s) => {
    const q = search.trim().toLowerCase();
    return !q || s.email.toLowerCase().includes(q);
  });

  const formatDate = (d) =>
    new Date(d).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fontStyle7 font-bold text-[var(--admin-text)] m-0">Newsletter Subscribers</h1>
          <p className="fontStyle9 text-[var(--admin-muted)] m-0 mt-1">
            Manage subscribers and send bulk emails.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-72 group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] transition-colors duration-200 group-focus-within:text-[var(--admin-accent)]">
              <IconSearch />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search email..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl fontStyle9 outline-none transition-all duration-200"
              style={{ background: "var(--admin-bg)", color: "var(--admin-text)", border: "1px solid var(--admin-border)" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--admin-accent)"; e.target.style.boxShadow = "0 0 0 3px var(--admin-accent-soft)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--admin-border)"; e.target.style.boxShadow = "none"; }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)] transition-all duration-200 cursor-pointer bg-transparent border-none">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl fontStyle9 font-bold text-white admin-grad-indigo cursor-pointer transition-opacity duration-200 hover:opacity-90"
          >
            <IconSend /> Compose
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="admin-card p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
            <IconMail />
          </span>
          <div>
            <p className="fontStyle8 font-bold text-[var(--admin-text)] m-0">{subscribers.length}</p>
            <p className="fontStyle10 text-[var(--admin-muted)] m-0">Total Subscribers</p>
          </div>
        </div>
        <div className="admin-card p-4 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500">
            <IconSend />
          </span>
          <div>
            <p className="fontStyle8 font-bold text-[var(--admin-text)] m-0">Active</p>
            <p className="fontStyle10 text-[var(--admin-muted)] m-0">All subscribers are active</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <svg className="w-8 h-8 animate-spin text-[var(--admin-accent)] mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="fontStyle9 text-[var(--admin-muted)] m-0">Loading subscribers...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="fontStyle9 text-[var(--admin-danger)] m-0">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[var(--admin-hover)] flex items-center justify-center mx-auto mb-3">
              <IconMail />
            </div>
            <p className="fontStyle9 text-[var(--admin-muted)] m-0">No subscribers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  {["#", "Email", "Date", ""].map((h) => (
                    <th key={h} className="fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] text-left px-5 py-3.5 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s._id}
                    className="transition-colors duration-150 hover:bg-[var(--admin-hover)]"
                    style={{ borderBottom: "1px solid var(--admin-border)" }}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="fontStyle9 text-[var(--admin-muted)]">{i + 1}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] flex items-center justify-center fontStyle9 font-bold text-xs flex-shrink-0">
                          {s.email.charAt(0).toUpperCase()}
                        </span>
                        <span className="fontStyle9 font-semibold text-[var(--admin-text)]">{s.email}</span>
                      </div>
                    </td>
                    <td className="fontStyle9 text-[var(--admin-muted)] px-5 py-4 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setConfirmDelete(s)}
                        disabled={deletingId === s._id}
                        className="p-2 rounded-lg cursor-pointer disabled:opacity-50 transition-all duration-200 hover:bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]"
                        aria-label="Delete"
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => { setShowCompose(false); setSendResult(null); }}>
          <div onClick={(e) => e.stopPropagation()} className="admin-card w-full max-w-lg p-6 relative z-[9999]">
            <h2 className="fontStyle7 font-bold text-[var(--admin-text)] m-0 mb-5">Send Email to All Subscribers</h2>

            {sendResult && (
              <div className={`mb-4 p-3 rounded-xl fontStyle9 ${sendResult.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
                {sendResult.message}
              </div>
            )}

            <div className="mb-4">
              <label className="block fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] mb-1.5">Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="e.g. New templates just dropped!"
                className="admin-input"
              />
            </div>

            <div className="mb-4">
              <label className="block fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] mb-1.5">Message</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Write your email content here..."
                rows={6}
                className="admin-input resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowCompose(false); setSendResult(null); }}
                className="flex-1 py-2.5 rounded-xl fontStyle9 font-semibold text-[var(--admin-text)] border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-hover)] transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                disabled={sending || !emailSubject.trim() || !emailMessage.trim()}
                className="flex-1 text-center fontStyle9 font-bold py-2.5 rounded-xl text-white cursor-pointer admin-grad-indigo transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : "Send to All"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div onClick={(e) => e.stopPropagation()} className="admin-card w-full max-w-sm p-6 relative z-[9999]">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--admin-danger-soft)] flex items-center justify-center mb-4 text-[var(--admin-danger)]">
                <IconAlert />
              </div>
              <h3 className="fontStyle7 font-bold text-[var(--admin-text)] m-0 mb-2">Remove Subscriber?</h3>
              <p className="fontStyle9 text-[var(--admin-muted)] m-0 mb-1">
                This will remove <strong className="text-[var(--admin-text)]">{confirmDelete.email}</strong> from your newsletter list.
              </p>
              <p className="fontStyle9 text-[var(--admin-muted)] m-0 mb-6">They will stop receiving future emails.</p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 py-2.5 rounded-xl fontStyle9 font-semibold text-[var(--admin-text)] border border-[var(--admin-border)] bg-[var(--admin-surface)] hover:bg-[var(--admin-hover)] transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete._id)}
                  disabled={deletingId === confirmDelete._id}
                  className="flex-1 py-2.5 rounded-xl fontStyle9 font-bold text-white bg-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/90 transition-all duration-200 cursor-pointer disabled:opacity-60"
                >
                  {deletingId === confirmDelete._id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
