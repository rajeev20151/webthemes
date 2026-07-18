import { useState, useEffect } from "react";
import { adminGetChatsAPI, adminDeleteChatAPI, adminDeleteTemplateChatAPI } from "../../services/adminApi";

/* ── Time Ago Helper ── */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Avatar Color by Name ── */
function avatarColor(name) {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500",
    "bg-amber-500", "bg-rose-500", "bg-cyan-500",
    "bg-pink-500", "bg-indigo-500",
  ];
  const idx = (name || "U").charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function ManageChats() {
  const [chats, setChats]       = useState([]);
  const [stats, setStats]       = useState({ total: 0, topLevel: 0, replies: 0, templatesWithChats: 0 });
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all"); // all | top-level | replies
  const [deleteId, setDeleteId] = useState(null);   // confirm delete modal

  /* ── Fetch ── */
  const fetchChats = async () => {
    try {
      const res = await adminGetChatsAPI();
      if (res.success) {
        setChats(res.chats);
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchChats(); }, []);

  /* ── Delete single message ── */
  const handleDelete = async (id) => {
    try {
      const res = await adminDeleteChatAPI(id);
      if (res.success) {
        // Remove from local state (message + its replies)
        setChats((prev) => prev.filter((c) => c._id !== id && c.parentId !== id));
        setDeleteId(null);
        // Refresh stats
        fetchChats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Filtered + Searched ── */
  const filtered = chats.filter((c) => {
    // Filter
    if (filter === "top-level" && c.parentId) return false;
    if (filter === "replies" && !c.parentId) return false;
    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const templateTitle = c.templateId?.name || "";
      return (
        c.userName?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q) ||
        templateTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  /* ── Stats Cards Config ── */
  const statCards = [
    { label: "Total Messages", value: stats.total,              icon: "bx-chat",         color: "text-blue-400",    border: "border-blue-500/20" },
    { label: "Top-Level",      value: stats.topLevel,           icon: "bx-message-dots",  color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Replies",        value: stats.replies,            icon: "bx-reply",         color: "text-amber-400",   border: "border-amber-500/20" },
    { label: "Templates",      value: stats.templatesWithChats, icon: "bx-layout",        color: "text-violet-400",  border: "border-violet-500/20" },
  ];

  const filterTabs = [
    { key: "all",       label: "All" },
    { key: "top-level", label: "Top-Level" },
    { key: "replies",   label: "Replies" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="fs8 admin-muted">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="fs5 font-bold admin-text">Manage Chats</h1>
          <p className="fs9 admin-muted mt-1">{stats.total} messages across {stats.templatesWithChats} templates</p>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`admin-card flex items-center gap-3.5 px-5 py-4 border ${card.border}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color} bg-current/10`}
                 style={{ background: "var(--admin-hover)" }}>
              <i className={`bx ${card.icon} text-xl ${card.color}`}></i>
            </div>
            <div>
              <p className={`fs5 font-bold ${card.color}`}>{card.value}</p>
              <p className="fs10 admin-muted">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filters ── */}
      <div className="admin-card px-5 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-lg admin-muted"></i>
            <input
              type="text"
              placeholder="Search name, message, or template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl fs9 outline-none transition-colors duration-200"
              style={{
                background: "var(--admin-bg)",
                color: "var(--admin-text)",
                border: "1px solid var(--admin-border)",
              }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full fs9 font-medium transition-all duration-200 cursor-pointer border ${
                  filter === tab.key
                    ? "text-white border-transparent"
                    : "admin-text border-[var(--admin-border)] hover:border-[var(--admin-accent)]"
                }`}
                style={filter === tab.key ? { background: "var(--admin-accent)" } : { background: "transparent" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                {["USER", "MESSAGE", "TEMPLATE", "TYPE", "DATE", "ACTIONS"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left fs10 font-semibold admin-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <i className="bx bx-chat text-4xl admin-muted block mb-2"></i>
                    <p className="fs8 font-semibold admin-text">No messages found</p>
                    <p className="fs9 admin-muted">
                      {search ? "Try a different search term." : "No discussion messages yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((chat) => {
                  const initials = (chat.userName || "U").slice(0, 2).toUpperCase();
                  const templateTitle = chat.templateId?.name || "";
                  
                  const isReply = !!chat.parentId;

                  return (
                    <tr
                      key={chat._id}
                      className="admin-hover transition-colors duration-150"
                      style={{ borderBottom: "1px solid var(--admin-border)" }}
                    >
                      {/* USER */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-[140px]">
                          <div className={`w-8 h-8 rounded-full ${avatarColor(chat.userName)} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white fs10 font-bold">{initials}</span>
                          </div>
                          <span className="fs9 font-semibold admin-text truncate max-w-[120px]">
                            {chat.userName}
                          </span>
                        </div>
                      </td>

                      {/* MESSAGE */}
                      <td className="px-5 py-3.5 max-w-[300px]">
                        <p className="fs9 admin-subtext truncate" title={chat.message}>
                          {chat.message}
                        </p>
                      </td>

                      {/* TEMPLATE */}
                      <td className="px-5 py-3.5 max-w-[200px]">
                        <p className="fs10 admin-subtext truncate" title={templateTitle}>
                          {templateTitle}
                        </p>
                      </td>

                      {/* TYPE */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full fs10 font-medium ${
                            isReply
                              ? "admin-badge-warning"
                              : "admin-badge-success"
                          }`}
                        >
                          <i className={`bx ${isReply ? "bx-reply" : "bx-message-dots"} text-xs`}></i>
                          {isReply ? "Reply" : "Message"}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-3.5">
                        <span className="fs9 admin-muted whitespace-nowrap">{timeAgo(chat.createdAt)}</span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setDeleteId(chat._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg fs10 font-medium cursor-pointer transition-all duration-200 border"
                          style={{
                            background: "var(--admin-danger-soft)",
                            color: "var(--admin-danger)",
                            borderColor: "transparent",
                          }}
                        >
                          <i className="bx bx-trash text-sm"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
            <p className="fs9 admin-muted">
              Showing <strong className="admin-text">{filtered.length}</strong> of <strong className="admin-text">{chats.length}</strong> messages
            </p>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="admin-card p-6 w-full max-w-sm mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--admin-danger-soft)" }}>
                <i className="bx bx-trash text-xl" style={{ color: "var(--admin-danger)" }}></i>
              </div>
              <div>
                <p className="fs7 font-bold admin-text">Delete Message?</p>
                <p className="fs9 admin-muted">This will also remove all replies.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl fs9 font-semibold admin-text cursor-pointer transition-all duration-200"
                style={{ background: "var(--admin-hover)", border: "1px solid var(--admin-border)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl fs9 font-bold text-white cursor-pointer hover:opacity-90 transition-opacity duration-200 border-none"
                style={{ background: "var(--admin-danger)" }}
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