import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";

export default function BlogCard({ post, index, TAG_COLORS }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      to={`/blog/${post.slug}`}
      className="group block cursor-pointer"
      style={{
        transition: `opacity 0.5s ${index * 0.08}s ease, transform 0.5s ${index * 0.08}s ease`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
      }}
    >
      <div className="rounded-2xl bg-[var(--color5)] overflow-hidden
        border border-[var(--color6)]/10
        shadow-[0_1px_3px_rgba(0,0,0,0.04)]
        group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        group-hover:border-[var(--color6)]/20
        transition-all duration-400 flex flex-col h-full">

        {/* Image */}
        <div className="relative mx-3 sm:mx-3.5 mt-3 sm:mt-3.5 rounded-xl overflow-hidden aspect-[16/10] bg-[var(--color11)]">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color6)]/4">
              <svg className="w-10 h-10 text-[var(--color6)]/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="fontStyle10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[var(--color5)]/90 backdrop-blur-sm text-[var(--color6)] shadow-sm">
              {post.category}
            </span>
          </div>

          {/* Tag badge */}
          {post.tag && (
            <div className="absolute top-3 right-3">
              <span
                className={`fontStyle10 font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur-sm shadow-sm
                  ${post.tag === "Popular" ? "text-white" : TAG_COLORS[post.tag] || "bg-[var(--color5)]/90 text-[var(--color6)]"}`}
                style={post.tag === "Popular" ? { background: "var(--color3)" } : {}}
              >
                {post.tag}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <h3 className="fontStyle8 sm:fontStyle7 font-bold text-[var(--color6)] leading-snug mb-2
            group-hover:text-[var(--color6)]/70 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="fontStyle10 sm:fontStyle9 text-[var(--color4)] leading-relaxed flex-1 mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-[var(--color6)]/8">
            <div className="flex items-center gap-2.5">
              <Avatar initials={post.author.avatar} size="w-7 h-7" />
              <div>
                <p className="fontStyle10 font-semibold text-[var(--color6)] leading-none">{post.author.name}</p>
                <p className="fontStyle10 text-[var(--color4)]/70 mt-0.5">{post.readTime}</p>
              </div>
            </div>
            <span className="fontStyle10 text-[var(--color4)]/60 shrink-0">{post.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
