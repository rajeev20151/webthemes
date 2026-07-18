import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTemplateReviewsAPI, createTemplateReviewAPI, deleteTemplateReviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ── Star Rating (keep your existing one or use this) ── */
function StarRating({ rating, size = "text-sm" }) {
  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bx ${star <= Math.floor(rating) ? "bxs-star" : star - 0.5 <= rating ? "bxs-star-half" : "bx-star"} text-yellow-400`}></i>
      ))}
    </div>
  );
}

/* ── Star Picker ── */
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} className="cursor-pointer bg-transparent border-none p-0 leading-none">
          <i className={`bx ${(hover || value) >= s ? "bxs-star" : "bx-star"} text-2xl text-yellow-400 transition-all duration-150`}></i>
        </button>
      ))}
    </div>
  );
}

/* ── Time Ago ── */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60)    return "Just now";
  if (seconds < 3600)   return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)  return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return new Date(date).toLocaleDateString();
}

/* ════════════════════════════════════════════
   ── Main ReviewsSection Component ──
   Props: templateId (from useParams)
════════════════════════════════════════════ */
export default function ReviewsSection({ templateId,onCountChange }) {
  const { token: contextToken, user } = useAuth();
  const token = contextToken || localStorage.getItem("token");
  const userName = user?.name || JSON.parse(localStorage.getItem("user") || "{}").name || "You";

  const [reviews, setReviews]   = useState([]);
  const [stats, setStats]       = useState({ total: 0, avgRating: 0 });
  const [loading, setLoading]   = useState(true);
  const [rating, setRating]     = useState(0);
  const [title, setTitle]       = useState("");
  const [comment, setComment]   = useState("");
  const [error, setError]       = useState("");
  const [sending, setSending]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  /* ── Fetch reviews ── */
  const fetchReviews = async () => {
    try {
      const res = await getTemplateReviewsAPI(templateId);
      if (res.success) {
        setReviews(res.reviews);
        setStats(res.stats);
        
        if (onCountChange) {
        onCountChange(res.stats.total);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (templateId) fetchReviews();
  }, [templateId]);

  /* ── Submit review ── */
  const submitReview = async () => {
    if (!rating)         return setError("Please select a star rating.");
    if (!title.trim())   return setError("Please add a review title.");
    if (!comment.trim()) return setError("Please write a comment.");

    setSending(true);
    setError("");
    try {
      const res = await createTemplateReviewAPI(templateId, {
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });
      if (res.success) {
        setReviews((prev) => [res.review, ...prev]);
        setStats((prev) => ({
          total: prev.total + 1,
          avgRating: parseFloat(
            ((prev.avgRating * prev.total + rating) / (prev.total + 1)).toFixed(2)
          ),
        }));
        setRating(0);
        setTitle("");
        setComment("");
        setShowForm(false);
      } else {
        setError(res.message || "Failed to submit review");
      }
    } catch (err) {
      setError("Network error — please try again");
    } finally {
      setSending(false);
    }
  };

  /* ── Delete review ── */
  const handleDelete = async (reviewId) => {
    try {
      const res = await deleteTemplateReviewAPI(reviewId);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        // Recalc stats
        setStats((prev) => {
          const newTotal = prev.total - 1;
          if (newTotal === 0) return { total: 0, avgRating: 0 };
          const deleted = reviews.find((r) => r._id === reviewId);
          const newAvg = ((prev.avgRating * prev.total - (deleted?.rating || 0)) / newTotal).toFixed(2);
          return { total: newTotal, avgRating: parseFloat(newAvg) };
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Check if current user already reviewed ── */
  const userAlreadyReviewed = reviews.some(
    (r) => r.userName === userName || r.userId === user?._id
  );

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="fontStyle9 text-[var(--color4)]">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="fontStyle6 font-bold text-[var(--color6)] mb-1">
            {stats.total} Customers Reviews
          </h3>
          <div className="flex items-center gap-2">
            <StarRating rating={stats.avgRating} size="text-lg" />
            <span className="fontStyle9 text-[var(--color4)]">
              {stats.avgRating.toFixed(2)} out of 5 stars
            </span>
          </div>
        </div>
        {token && !userAlreadyReviewed && (
          <button
            onClick={() => setShowForm((f) => !f)}
            className="px-5 py-2 rounded-lg fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/20 hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 cursor-pointer shrink-0"
          >
            {showForm ? "Cancel" : "Write a review"}
          </button>
        )}
      </div>

      {/* ── Not Logged In ── */}
      {!token && (
        <div className="px-4 py-3.5 rounded-xl bg-yellow-50/10 border border-yellow-500/20">
          <p className="fontStyle9 font-bold text-yellow-400 mb-0.5">
            You must be logged in to leave a review.
          </p>
          <p className="fontStyle10 text-[var(--color4)]">
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link> to share your experience.
          </p>
        </div>
      )}

      {/* ── Already Reviewed ── */}
      {token && userAlreadyReviewed && (
        <div className="px-4 py-3 rounded-xl border border-green-500/20 bg-green-500/5">
          <p className="fontStyle9 text-green-400 flex items-center gap-1.5">
            <i className="bx bx-check-circle text-base"></i>
            You have already reviewed this template.
          </p>
        </div>
      )}

      {/* ── Write a Review Form ── */}
      {token && showForm && !userAlreadyReviewed && (
        <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 space-y-4">
          <p className="fontStyle8 font-bold text-[var(--color6)]">Your Review</p>

          <div>
            <p className="fontStyle10 text-[var(--color4)] mb-1.5">Rating</p>
            <StarPicker value={rating} onChange={(v) => { setRating(v); setError(""); }} />
          </div>

          <div>
            <p className="fontStyle10 text-[var(--color4)] mb-1.5">Review Title</p>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(""); }}
              placeholder="Summarize your experience..."
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/40 transition-colors duration-200"
            />
          </div>

          <div>
            <p className="fontStyle10 text-[var(--color4)] mb-1.5">Comment</p>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => { setComment(e.target.value); setError(""); }}
              placeholder="Share your experience with this template..."
              className="w-full px-4 py-2.5 rounded-xl border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/40 transition-colors duration-200 resize-none"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1 fontStyle10 text-red-400">
              <i className="bx bx-error-circle text-sm"></i> {error}
            </p>
          )}

          <button
            onClick={submitReview}
            disabled={sending}
            className="px-6 py-2.5 rounded-xl fontStyle9 font-bold text-white border-none cursor-pointer hover:opacity-90 transition-opacity duration-200"
            style={{ background: "var(--color3)", opacity: sending ? 0.6 : 1 }}
          >
            {sending ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      <div className="h-px bg-[var(--color6)]/10" />

      {/* ── Reviews List ── */}
      {reviews.length === 0 ? (
        <div className="py-10 text-center">
          <i className="bx bx-star text-4xl text-[var(--color4)] mb-3 block"></i>
          <p className="fontStyle7 font-bold text-[var(--color6)] mb-1">No Reviews Yet</p>
          <p className="fontStyle9 text-[var(--color4)]">Be the first to review this template.</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--color6)]/10">
          {reviews.map((r) => (
            <div key={r._id} className="py-6 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="fontStyle8 font-bold text-[var(--color6)] mb-1">{r.title}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <StarRating rating={r.rating} size="text-sm" />
                    <span className="fontStyle10 text-[var(--color4)]">
                      by {r.userName} • {timeAgo(r.createdAt)}
                    </span>
                  </div>
                  <p className="fontStyle9 text-[var(--color8)] leading-relaxed whitespace-pre-line">{r.comment}</p>
                </div>

                {/* Delete button — own review or admin */}
                {token && (r.userName === userName || user?.role === "admin") && (
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="fontStyle10 text-[var(--color4)] hover:text-red-400 transition-colors duration-200 cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 shrink-0"
                  >
                    <i className="bx bx-trash text-sm"></i> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}