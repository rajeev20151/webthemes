import { useEffect, useState } from "react";
import {
  adminGetContactsAPI,
  adminUpdateContactStatusAPI,
  adminDeleteContactAPI,
} from "../../services/adminApi"; 

/* ── Icons ── */
const IconMail   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 8l10 7 10-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconTrash  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/><path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IconX      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;

const statusBadgeClass = (status) => {
  if (status === "new") return "admin-badge-danger";
  if (status === "read") return "admin-badge-warning";
  return "admin-badge-success"; // replied
};

const STATUS_TABS = ["all", "new", "read", "replied"];

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null); // contact being viewed in modal
  const [deletingId, setDeletingId] = useState(null);

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
    // optimistic update
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    if (selected?._id === id) setSelected((p) => ({ ...p, status }));
    try {
      await adminUpdateContactStatusAPI(id, status);
    } catch (err) {
      loadContacts(); // revert on failure by re-fetching
    }
  };

  const handleOpen = (contact) => {
    setSelected(contact);
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
      // no-op — could add a toast here
    } finally {
      setDeletingId(null);
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
    <div className="admin-layout p-6 sm:p-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="fs5 font-bold admin-text m-0">Contact Messages</h1>
          <p className="fs9 admin-muted m-0 mt-1">
            Manage messages submitted through your contact form.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 admin-muted">
            <IconSearch />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, message..."
            className="fs9 w-full pl-9 pr-3 py-2.5 rounded-xl outline-none admin-card admin-text"
            style={{ border: "1px solid var(--admin-border)" }}
          />
        </div>
      </div>

      {/* ── Status tabs ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="fs9 font-semibold px-4 py-2 rounded-xl capitalize transition-all duration-150 cursor-pointer"
            style={{
              background: statusFilter === s ? "var(--admin-accent)" : "var(--admin-surface)",
              color: statusFilter === s ? "#fff" : "var(--admin-subtext)",
              border: `1px solid ${statusFilter === s ? "var(--admin-accent)" : "var(--admin-border)"}`,
            }}
          >
            {s} <span className="opacity-70">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* ── Table Card ── */}
      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center fs9 admin-muted">Loading messages...</div>
        ) : error ? (
          <div className="p-10 text-center fs9" style={{ color: "var(--admin-danger)" }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center fs9 admin-muted">No messages found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="admin-border" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  {["Name", "Email", "Topic", "Message", "Date", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="fs10 font-bold uppercase tracking-widest admin-muted text-left px-5 py-3.5 whitespace-nowrap"
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
                    className="admin-hover cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid var(--admin-border)" }}
                  >
                    <td className="fs9 font-semibold admin-text px-5 py-4 whitespace-nowrap">{c.name}</td>
                    <td className="fs9 admin-subtext px-5 py-4 whitespace-nowrap">{c.email}</td>
                    <td className="fs9 admin-subtext px-5 py-4 whitespace-nowrap">{c.topic}</td>
                    <td className="fs9 admin-muted px-5 py-4 max-w-xs truncate">{c.message}</td>
                    <td className="fs10 admin-muted px-5 py-4 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`fs10 font-bold uppercase px-2.5 py-1 rounded-full ${statusBadgeClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(c._id);
                        }}
                        disabled={deletingId === c._id}
                        className="admin-hover p-2 rounded-lg cursor-pointer disabled:opacity-50"
                        style={{ color: "var(--admin-danger)" }}
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="admin-card w-full max-w-lg p-6 relative"
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 admin-muted admin-hover p-1.5 rounded-lg cursor-pointer"
            >
              <IconX />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ background: "var(--admin-accent-grad)" }}
              >
                <IconMail />
              </span>
              <div>
                <p className="fs7 font-bold admin-text m-0">{selected.name}</p>
                <p className="fs10 admin-muted m-0">{selected.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="fs10 admin-muted">Status:</span>
              {["new", "read", "replied"].map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(selected._id, s)}
                  className={`fs10 font-bold uppercase px-2.5 py-1 rounded-full cursor-pointer transition-opacity ${statusBadgeClass(s)}`}
                  style={{ opacity: selected.status === s ? 1 : 0.4 }}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mb-3">
              <p className="fs10 font-bold uppercase tracking-widest admin-muted m-0 mb-1">Topic</p>
              <p className="fs9 admin-text m-0">{selected.topic}</p>
            </div>

            <div className="mb-4">
              <p className="fs10 font-bold uppercase tracking-widest admin-muted m-0 mb-1">Message</p>
              <p className="fs9 admin-subtext m-0 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>

            <p className="fs10 admin-muted m-0">Received {formatDate(selected.createdAt)}</p>

            <div className="flex gap-3 mt-5">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 text-center fs9 font-bold py-2.5 rounded-xl text-white cursor-pointer"
                style={{ background: "var(--admin-accent-grad)" }}
              >
                Reply by Email
              </a>
              <button
                onClick={() => handleDelete(selected._id)}
                className="fs9 font-bold py-2.5 px-4 rounded-xl cursor-pointer admin-hover"
                style={{ color: "var(--admin-danger)", border: "1px solid var(--admin-border)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}