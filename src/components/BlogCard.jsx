import { Link } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Avatar from "./Avatar";

// ─────────────────────────────────────────────
// REGULAR BLOG CARD
// ─────────────────────────────────────────────

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
        transition: `opacity 0.6s ${index * 0.08}s ease, transform 0.6s ${index * 0.08}s ease`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="border-[2px] border-[var(--color6)] rounded-2xl bg-[var(--color5)] overflow-hidden
        shadow-[6px_6px_0px_var(--color6)] hover:shadow-[2px_2px_0px_var(--color6)]
        transition-all duration-300 flex flex-col h-full">

        {/* Browser chrome dots */}
        <div className="flex items-center gap-1.5 px-5 pt-4 pb-0">
          {["bg-red-300", "bg-yellow-300", "bg-green-300"].map((c, i) => (
            <span key={i} className={`w-2.5 h-2.5 rounded-full ${c}`}></span>
          ))}
        </div>

        {/* Image */}
        <div className="relative mx-4 mt-3 rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
          />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--color5)] backdrop-blur text-[var(--color6)]">
              {post.category}
            </span>
          </div>

          {/* Tag badge */}
          {post.tag && (
            <div className="absolute top-3 right-3">
              <span
                className={`fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full
                  ${post.tag === "Popular" ? "text-white" : TAG_COLORS[post.tag]}`}
                style={post.tag === "Popular" ? { background: "var(--color3)" } : {}}
              >
                {post.tag}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="fontStyle7 font-bold text-[var(--color6)] leading-snug mb-3
            group-hover:text-[var(--color4)] transition-colors duration-300">
            {post.title}
          </h3>
          <p className="fontStyle9 text-[var(--color4)] leading-relaxed flex-1 mb-5">
            {post.excerpt}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--color6)]/10">
            <div className="flex items-center gap-2.5">
              <Avatar initials={post.author.avatar} size="w-7 h-7" />
              <div>
                <p className="fontStyle10 font-semibold text-[var(--color6)] leading-none">{post.author.name}</p>
                <p className="fontStyle10 text-[var(--color4)] mt-0.5">{post.readTime}</p>
              </div>
            </div>
            <span className="fontStyle10 text-[var(--color4)]">{post.date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}