import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";

export default function BlogCard({ post, index }) {
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
      <div
        className="flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color5)]
          border-2 border-[var(--color6)]
          shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
          transition-all duration-300
          group-hover:shadow-[2px_2px_0px_var(--color6)] group-hover:translate-x-1 group-hover:translate-y-1 sm:group-hover:translate-x-1.5 sm:group-hover:translate-y-1.5"
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-[16/10] bg-[var(--color11)] border-b-2 border-[var(--color6)]">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--color6)]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          )}

          {/* Category badge (fixed colors: image ke upar hai) */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#111827] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] -rotate-3 transition-all duration-300 group-hover:rotate-0 group-hover:shadow-[1px_1px_0px_#111827]">
              {post.category}
            </span>
          </div>

          {/* Tag badge */}
          {post.tag && (
            <div className="absolute top-3 right-3">
              <span
                className={`inline-flex items-center fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full border-2 border-[#111827] shadow-[3px_3px_0px_#111827] rotate-3 transition-all duration-300 group-hover:rotate-0 group-hover:shadow-[1px_1px_0px_#111827]
                  ${
                    post.tag === "Popular"
                      ? "bg-color3 text-white"
                      : post.tag === "Featured"
                      ? "bg-[#fde047] text-[#111827]"
                      : "bg-[#4ade80] text-[#111827]"
                  }`}
              >
                {post.tag}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <h3 className="fontStyle7 font-bold text-[var(--color6)] leading-snug mb-2 line-clamp-2 min-h-[2.6em] group-hover:text-[var(--color4)] transition-colors duration-300">
            {post.title}
          </h3>
          <p className="fontStyle9 text-[var(--color4)] leading-relaxed flex-1 mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t-2 border-dashed border-[var(--color6)]/15">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar initials={post.author.avatar} size="w-8 h-8" />
              <div className="min-w-0">
                <p className="fontStyle10 font-bold text-[var(--color6)] leading-none truncate">{post.author.name}</p>
                <p className="fontStyle10 text-[var(--color4)] mt-1">{post.readTime}</p>
              </div>
            </div>
            <span className="fontStyle10 font-semibold text-[var(--color6)] shrink-0 flex items-center gap-1">
              <i className="bx bx-calendar text-sm"></i>
              {post.date}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}