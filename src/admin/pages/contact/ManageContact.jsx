import { useEffect, useState } from "react";
import {
  adminGetContactsAPI,
  adminUpdateContactStatusAPI,
  adminDeleteContactAPI,
  adminReplyContactAPI,
} from "../../services/adminApi";

/* ── Icons ── */
const IconMail   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconTrash  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconAlert  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const statusBadgeClass = (status) => {
  if (status === "new") return "admin-badge-danger";
  if (status === "read") return "admin-badge-warning";
  return "admin-badge-success";
};

const STATUS_TABS = ["all", "new", "read", "replied"];

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [replySent, setReplySent] = useState(false);

  const loadContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminGetContactsAPI();
      if (res.success) {
        setContacts(res.data || []);
      } else {
        setError(res.message || "Failed to load contacts");
      }
    } catch (err) {
      setError("Could not load contacts. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleStatusChange = async (id, status) => {
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    if (selected?._id === id) setSelected((p) => ({ ...p, status }));
    try {
      await adminUpdateContactStatusAPI(id, status);
    } catch (err) {
      loadContacts();
    }
  };

  const handleOpen = (contact) => {
    setSelected(contact);
    setReplyText("");
    setReplySent(false);
    if (contact.status === "new") handleStatusChange(contact._id, "read");
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await adminDeleteContactAPI(id);
      if (res.success) {
        setContacts((prev) => prev.filter((c) => c._id !== id));
        if (selected?._id === id) setSelected(null);
      }
    } catch (err) {
      // no-op
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selected) return;
    setSending(true);
    try {
      const res = await adminReplyContactAPI(selected._id, replyText);
      if (res.success) {
        setContacts((prev) =>
          prev.map((c) =>
            c._id === selected._id
              ? { ...c, status: "replied", reply: replyText.trim(), repliedAt: new Date().toISOString() }
              : c
          )
        );
        setSelected((p) => ({ ...p, status: "replied", reply: replyText.trim(), repliedAt: new Date().toISOString() }));
        setReplyText("");
        setReplySent(true);
        setTimeout(() => setReplySent(false), 2500);
      }
    } catch (err) {
      // no-op
    } finally {
      setSending(false);
    }
  };

  const filtered = contacts.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.topic.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    read: contacts.filter((c) => c.status === "read").length,
    replied: contacts.filter((c) => c.status === "replied").length,
  };

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
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="fontStyle7 font-bold text-[var(--admin-text)] m-0">Contact Messages</h1>
          <p className="fontStyle9 text-[var(--admin-muted)] m-0 mt-1">
            Manage messages submitted through your contact form.
          </p>
        </div>

        <div className="relative w-full sm:w-80 group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] transition-colors duration-200 group-focus-within:text-[var(--admin-accent)]">
            <IconSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, topic..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl fontStyle9 outline-none transition-all duration-200"
            style={{
              background: "var(--admin-bg)",
              color: "var(--admin-text)",
              border: "1px solid var(--admin-border)",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--admin-accent)"; e.target.style.boxShadow = "0 0 0 3px var(--admin-accent-soft)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--admin-border)"; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-md text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-hover)] transition-all duration-200 cursor-pointer bg-transparent border-none"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="admin-card p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 text-left"
            style={{
              borderColor: statusFilter === s ? "var(--admin-accent)" : undefined,
              borderWidth: statusFilter === s ? "1.5px" : undefined,
            }}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
              s === "new" ? "bg-red-500" : s === "read" ? "bg-amber-500" : s === "replied" ? "bg-green-500" : "bg-[var(--admin-accent)]"
            }`} />
            <div>
              <p className="fontStyle8 font-bold text-[var(--admin-text)] m-0 capitalize">{s}</p>
              <p className="fontStyle10 text-[var(--admin-muted)] m-0">{counts[s]} message{counts[s] !== 1 ? "s" : ""}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <svg className="w-8 h-8 animate-spin text-[var(--admin-accent)] mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="fontStyle9 text-[var(--admin-muted)] m-0">Loading messages...</p>
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
            <p className="fontStyle9 text-[var(--admin-muted)] m-0">No messages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  {["Name", "Email", "Topic", "Message", "Date", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] text-left px-5 py-3.5 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => handleOpen(c)}
                    className="cursor-pointer transition-colors duration-150 hover:bg-[var(--admin-hover)]"
                    style={{ borderBottom: "1px solid var(--admin-border)" }}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] flex items-center justify-center fontStyle9 font-bold text-xs flex-shrink-0">
                          {(c.name || "U").charAt(0).toUpperCase()}
                        </span>
                        <span className="fontStyle9 font-semibold text-[var(--admin-text)]">{c.name}</span>
                      </div>
                    </td>
                    <td className="fontStyle9 text-[var(--admin-subtext)] px-5 py-4 whitespace-nowrap">{c.email}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="fontStyle9 font-medium text-[var(--admin-subtext)] bg-[var(--admin-hover)] px-2.5 py-1 rounded-lg">
                        {c.topic}
                      </span>
                    </td>
                    <td className="fontStyle9 text-[var(--admin-muted)] px-5 py-4 max-w-[200px] truncate">{c.message}</td>
                    <td className="fontStyle9 text-[var(--admin-muted)] px-5 py-4 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`fontStyle9 font-bold uppercase px-2.5 py-1 rounded-full ${statusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(c);
                        }}
                        disabled={deletingId === c._id}
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

      {/* ── Detail Modal ── */}
      {selected && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="admin-card w-full max-w-lg p-6 relative z-[9999]"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-[var(--admin-muted)] hover:text-[var(--admin-text)] p-1.5 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-[var(--admin-hover)]"
            >
              <IconX />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-xl flex items-center justify-center text-white admin-grad-indigo">
                <IconMail />
              </span>
              <div>
                <p className="fontStyle7 font-bold text-[var(--admin-text)] m-0">{selected.name}</p>
                <p className="fontStyle9 text-[var(--admin-muted)] m-0">{selected.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <span className="fontStyle9 text-[var(--admin-muted)]">Status:</span>
              {["new", "read", "replied"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(selected._id, s)}
                  className={`fontStyle9 font-bold uppercase px-2.5 py-1 rounded-full cursor-pointer transition-all duration-200 ${statusBadgeClass(s)}`}
                  style={{ opacity: selected.status === s ? 1 : 0.4 }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mb-4 p-3 rounded-xl bg-[var(--admin-hover)]">
              <p className="fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] m-0 mb-1">Topic</p>
              <p className="fontStyle9 text-[var(--admin-text)] m-0">{selected.topic}</p>
            </div>

            <div className="mb-4 p-3 rounded-xl bg-[var(--admin-hover)]">
              <p className="fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] m-0 mb-1">Message</p>
              <p className="fontStyle9 text-[var(--admin-subtext)] m-0 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>

            <p className="fontStyle9 text-[var(--admin-muted)] m-0">Received {formatDate(selected.createdAt)}</p>

            {selected.reply && (
              <div className="mt-4 p-3 rounded-xl border border-green-300/30 bg-green-50/50 dark:bg-green-900/10">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="fontStyle9 font-bold text-green-700 m-0">Your Reply</span>
                </div>
                <p className="fontStyle9 text-[var(--admin-subtext)] m-0 whitespace-pre-wrap leading-relaxed">{selected.reply}</p>
                {selected.repliedAt && <p className="fontStyle10 text-[var(--admin-muted)] m-0 mt-1.5">Sent {formatDate(selected.repliedAt)}</p>}
              </div>
            )}

            <div className="mt-4">
              <label className="block fontStyle9 font-bold uppercase tracking-widest text-[var(--admin-muted)] mb-1.5">Reply Message</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                rows={4}
                className="admin-input resize-none"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleReply}
                disabled={!replyText.trim() || sending}
                className="flex-1 text-center fontStyle9 font-bold py-2.5 rounded-xl text-white cursor-pointer admin-grad-indigo transition-opacity duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? "Sending..." : replySent ? "Sent!" : "Send Reply"}
              </button>
              <button
                onClick={() => {
                  setSelected(null);
                  setConfirmDelete(selected);
                }}
                className="fontStyle9 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-[var(--admin-danger)] border border-[var(--admin-danger)]/20 bg-[var(--admin-danger-soft)] hover:bg-[var(--admin-danger)] hover:text-white transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="admin-card w-full max-w-sm p-6 relative z-[9999]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-[var(--admin-danger-soft)] flex items-center justify-center mb-4 text-[var(--admin-danger)]">
                <IconAlert />
              </div>
              <h3 className="fontStyle7 font-bold text-[var(--admin-text)] m-0 mb-2">Delete Message?</h3>
              <p className="fontStyle9 text-[var(--admin-muted)] m-0 mb-1">
                This will permanently remove the message from <strong className="text-[var(--admin-text)]">{confirmDelete.name}</strong>.
              </p>
              <p className="fontStyle9 text-[var(--admin-muted)] m-0 mb-6">This action cannot be undone.</p>

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
                  {deletingId === confirmDelete._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
