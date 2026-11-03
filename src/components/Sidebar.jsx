import { Link } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({
  posts,
  categories,
  activeCategory,
  onCategorySelect,
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) { setSent(true); setEmail(""); }
  };

  const popular = posts.filter((p) => !p.featured).slice(0, 4);

  return (
    <aside className="flex flex-col gap-6 sm:gap-8">

      {/* Popular posts */}
      <div className="p-5 sm:p-7 rounded-2xl border border-[var(--color6)]/15 bg-[var(--color5)] shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
        <h3 className="fontStyle8 sm:fontStyle7 font-bold text-[var(--color6)] mb-4 sm:mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-[var(--color4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Popular Posts
        </h3>
        <div className="flex flex-col gap-4 sm:gap-5">
          {popular.map((post, i) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex items-start gap-3 sm:gap-4 rounded-xl -mx-2 px-2 py-1.5 transition-colors hover:bg-[var(--color11)]/50"
            >
              <span className="fontStyle4 font-black text-[var(--color6)]/10 leading-none w-7 sm:w-8 flex-shrink-0 select-none"
                style={{ fontSize: "2rem", lineHeight: 1 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <span className="fontStyle10 font-bold uppercase tracking-wider text-[var(--color4)] mb-1 block">
                  {post.category || "General"}
                </span>
                <p className="fontStyle10 sm:fontStyle9 font-semibold text-[var(--color6)] leading-snug
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
      <div className="p-5 sm:p-7 rounded-2xl border border-[var(--color6)]/15 bg-[var(--color5)] shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
        <h3 className="fontStyle8 sm:fontStyle7 font-bold text-[var(--color6)] mb-4 sm:mb-5">Browse Topics</h3>
        <div className="flex flex-wrap gap-2">
          {categories.filter((category) => category !== "All").map((category) => {
            const active = activeCategory.toLowerCase() === category.toLowerCase();
            const postCount = posts.filter(
              (post) =>
                !post.featured &&
                typeof post.category === "string" &&
                post.category.trim().toLowerCase() === category.toLowerCase()
            ).length;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={active}
                onClick={() => onCategorySelect(category)}
                className={`inline-flex items-center gap-2 fontStyle10 font-semibold px-3.5 py-2 rounded-full border transition-all duration-200
                  ${active
                    ? "bg-[var(--color6)] text-[var(--color5)] border-[var(--color6)] shadow-[2px_2px_0px_var(--color4)]"
                    : "border-[var(--color6)]/20 text-[var(--color4)] hover:border-[var(--color6)] hover:text-[var(--color6)] hover:bg-[var(--color11)]/50"
                  }`}
              >
                {category}
                <span className={`text-[0.7rem] ${active ? "text-[var(--color5)]/70" : "text-[var(--color4)]/70"}`}>
                  {postCount}
                </span>
              </button>
            );
          })}
          {categories.length <= 1 && (
            <p className="fontStyle10 text-[var(--color4)]">Topics will appear when articles are published.</p>
          )}
        </div>
      </div>

    </aside>
  );
}
