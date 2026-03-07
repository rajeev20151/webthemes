import { Link } from "react-router-dom";
import { useState } from "react";

// ─────────────────────────────────────────────
// SIDEBAR — NEWSLETTER + POPULAR
// ─────────────────────────────────────────────

export default function Sidebar({ posts, CATEGORIES }) {

    
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  const popular = posts.filter((p) => !p.featured).slice(0, 4);

  return (
    <aside className="flex flex-col gap-8">

      {/* Popular posts */}
      <div className="p-7 rounded-2xl border border-[var(--color6)]/15 bg-[var(--color5)]">
        <h3 className="fontStyle7 font-bold text-[var(--color6)] mb-6 flex items-center gap-2">
          <i className="bx bx-trending-up text-xl text-[var(--color4)]"></i>
          Popular Posts
        </h3>
        <div className="flex flex-col gap-5">
          {popular.map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex items-start gap-4"
            >
              <span className="fontStyle4 font-black text-[var(--color6)]/8 leading-none w-8 flex-shrink-0 select-none"
                style={{ fontSize: "2.2rem", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="fontStyle10 font-bold uppercase tracking-wider text-[var(--color4)] mb-1 block">
                  {post.category}
                </span>
                <p className="fontStyle9 font-semibold text-[var(--color6)] leading-snug
                  group-hover:text-[var(--color4)] transition-colors duration-300 line-clamp-2">
                  {post.title}
                </p>
                <span className="fontStyle10 text-[var(--color4)] mt-1 block">{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Topics */}
      <div className="p-7 rounded-2xl border border-[var(--color6)]/15 bg-[var(--color5)]">
        <h3 className="fontStyle7 font-bold text-[var(--color6)] mb-5">Browse Topics</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <button
              key={cat}
              className="fontStyle10 font-semibold px-3 py-1.5 rounded-full border border-[var(--color6)]/18
                text-[var(--color4)] hover:border-[var(--color6)] hover:text-[var(--color6)]
                hover:shadow-[2px_2px_0px_var(--color6)] transition-all duration-200"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

    </aside>
  );
}
