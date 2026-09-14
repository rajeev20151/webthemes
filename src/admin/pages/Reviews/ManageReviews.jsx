import { useState, useEffect } from "react";
import { adminGetReviewsAPI, adminDeleteReviewAPI } from "../../services/adminApi";

/* ── Time Ago Helper ── */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Avatar Color ── */
function avatarColor(name) {
  const colors = [
    "bg-blue-500", "bg-emerald-500", "bg-violet-500",
    "bg-amber-500", "bg-rose-500", "bg-cyan-500",
    "bg-pink-500", "bg-indigo-500",
  ];
  return colors[(name || "U").charCodeAt(0) % colors.length];
}

/* ── Star Display ── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-yellow-400" : "text-yellow-400/30"}`} fill={s <= rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
      ))}
    </div>
  );
}

export default function ManageReviews() {
  const [reviews, setReviews]   = useState([]);
  const [stats, setStats]       = useState({ total: 0, avgRating: 0, templatesWithReviews: 0, distribution: {} });
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all"); // all | 5 | 4 | 3 | 2 | 1
  const [deleteId, setDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  /* ── Fetch ── */
  const fetchReviews = async () => {
    try {
      const res = await adminGetReviewsAPI();
      if (res.success) {
        setReviews(res.reviews);
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  /* ── Delete ── */
  const handleDelete = async (id) => {
    try {
      const res = await adminDeleteReviewAPI(id);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        setDeleteId(null);
        fetchReviews(); // refresh stats
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Filtered + Searched ── */
  const filtered = reviews.filter((r) => {
    if (filter !== "all" && r.rating !== parseInt(filter)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const templateTitle = r.templateId?.name || "";
      return (
        r.userName?.toLowerCase().includes(q) ||
        r.title?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        templateTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  /* ── Stats Cards ── */
  const statCards = [
    { label: "Total Reviews",  value: stats.total,                color: "text-yellow-400", border: "border-yellow-500/20", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
    { label: "Avg Rating",     value: stats.avgRating?.toFixed(1) || "0", color: "text-emerald-400", border: "border-emerald-500/20", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg> },
    { label: "5-Star",         value: stats.distribution?.[5] || 0, color: "text-green-400",  border: "border-green-500/20", icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
    { label: "Templates",      value: stats.templatesWithReviews,  color: "text-violet-400", border: "border-violet-500/20", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg> },
  ];

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "5",   label: "5★" },
    { key: "4",   label: "4★" },
    { key: "3",   label: "3★" },
    { key: "2",   label: "2★" },
    { key: "1",   label: "1★" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="fontStyle9 admin-muted">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="fontStyle7 font-bold admin-text">Manage Reviews</h1>
          <p className="fontStyle9 admin-muted mt-1">
            {stats.total} reviews · {stats.avgRating?.toFixed(2)} avg rating · {stats.templatesWithReviews} templates
          </p>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`admin-card flex items-center gap-3.5 px-5 py-4 border ${card.border}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}
                 style={{ background: "var(--admin-hover)" }}>
              {card.icon}
            </div>
            <div>
              <p className={`fontStyle7 font-bold ${card.color}`}>{card.value}</p>
              <p className="fontStyle9 admin-muted">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Rating Distribution Bar ── */}
      {stats.total > 0 && (
        <div className="admin-card px-5 py-4">
          <p className="fontStyle9 font-semibold admin-text mb-3">Rating Distribution</p>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution?.[star] || 0;
              const pct = stats.total > 0 ? ((count / stats.total) * 100).toFixed(0) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="fontStyle9 admin-muted w-6 text-right">{star}★</span>
                  <div className="flex-1 h-2 rounded-full" style={{ background: "var(--admin-hover)" }}>
                    <div
                      className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="fontStyle9 admin-muted w-12 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Search + Filters ── */}
      <div className="admin-card px-5 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--admin-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              placeholder="Search user, title, comment, template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl fontStyle9 outline-none transition-colors duration-200"
              style={{
                background: "var(--admin-bg)",
                color: "var(--admin-text)",
                border: "1px solid var(--admin-border)",
              }}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-full fontStyle9 font-medium transition-all duration-200 cursor-pointer border ${
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
                {["USER", "REVIEW", "TEMPLATE", "RATING", "DATE", "ACTIONS"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left fontStyle9 font-semibold admin-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <svg className="w-10 h-10 text-[var(--admin-muted)] block mb-2 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
                    <p className="fontStyle9 font-semibold admin-text">No reviews found</p>
                    <p className="fontStyle9 admin-muted">
                      {search ? "Try a different search term." : "No reviews submitted yet."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((review) => {
                  const initials = (review.userName || "U").slice(0, 2).toUpperCase();
                  const templateTitle = review.templateId?.name || "Unknown Template";
                  const isExpanded = expandedId === review._id;

                  return (
                    <tr
                      key={review._id}
                      className="admin-hover transition-colors duration-150"
                      style={{ borderBottom: "1px solid var(--admin-border)" }}
                    >
                      {/* USER */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3 min-w-[130px]">
                          <div className={`w-8 h-8 rounded-full ${avatarColor(review.userName)} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white fontStyle9 font-bold">{initials}</span>
                          </div>
                          <span className="fontStyle9 font-semibold admin-text truncate max-w-[110px]">
                            {review.userName}
                          </span>
                        </div>
                      </td>

                      {/* REVIEW (title + truncated comment) */}
                      <td className="px-5 py-3.5 max-w-[280px]">
                        <p className="fontStyle9 font-semibold admin-text truncate">{review.title}</p>
                        <p
                          className={`fontStyle9 admin-subtext mt-0.5 ${isExpanded ? "whitespace-pre-line" : "truncate"}`}
                          title={review.comment}
                        >
                          {review.comment}
                        </p>
                        {review.comment.length > 80 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : review._id)}
                            className="fontStyle9 text-blue-400 hover:text-blue-300 mt-0.5 bg-transparent border-none p-0 cursor-pointer"
                          >
                            {isExpanded ? "Show less" : "Show more"}
                          </button>
                        )}
                      </td>

                      {/* TEMPLATE */}
                      <td className="px-5 py-3.5 max-w-[180px]">
                        <p className="fontStyle9 admin-subtext truncate" title={templateTitle}>
                          {templateTitle}
                        </p>
                      </td>

                      {/* RATING */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Stars rating={review.rating} />
                          <span className="fontStyle9 font-semibold admin-text">{review.rating}</span>
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-3.5">
                        <span className="fontStyle9 admin-muted whitespace-nowrap">{timeAgo(review.createdAt)}</span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setDeleteId(review._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg fontStyle9 font-medium cursor-pointer transition-all duration-200 border"
                          style={{
                            background: "var(--admin-danger-soft)",
                            color: "var(--admin-danger)",
                            borderColor: "transparent",
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
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
            <p className="fontStyle9 admin-muted">
              Showing <strong className="admin-text">{filtered.length}</strong> of <strong className="admin-text">{reviews.length}</strong> reviews
            </p>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="admin-card p-6 w-full max-w-sm mx-4 space-y-4 relative z-[9999]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--admin-danger-soft)" }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--admin-danger)" }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </div>
              <div>
                <p className="fontStyle7 font-bold admin-text">Delete Review?</p>
                <p className="fontStyle9 admin-muted">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl fontStyle9 font-semibold admin-text cursor-pointer transition-all duration-200"
                style={{ background: "var(--admin-hover)", border: "1px solid var(--admin-border)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl fontStyle9 font-bold text-white cursor-pointer hover:opacity-90 transition-opacity duration-200 border-none"
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