import { Link } from "react-router-dom";
import Avatar from "./Avatar";

// ─────────────────────────────────────────────
// FEATURED (HERO) CARD
// ─────────────────────────────────────────────

export default function FeaturedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block relative rounded-3xl overflow-hidden border-[2px] border-[var(--color6)]
        shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)]
        transition-all duration-400 bg-[var(--color5)]"
    >
      {/* Image */}
      <div className="relative aspect-[16/7] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 p-8 sm:p-10 w-full">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="fontStyle10 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--color6)] text-[var(--color5)] border border-white/20">
              {post.category}
            </span>
            <span className="fontStyle10 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[var(--color6)] text-[var(--color5)]">
              {post.tag}
            </span>
          </div>

          <h2 className="fontStyle3 font-bold text-white leading-tight mb-4 max-w-2xl">
            {post.title}
          </h2>

          <p className="fontStyle8 text-white/70 max-w-xl leading-relaxed mb-6 hidden sm:block">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <Avatar initials={post.author.avatar} />
              <div>
                <p className="fontStyle9 font-semibold text-white leading-none">{post.author.name}</p>
                <p className="fontStyle10 text-white/60 mt-0.5">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/50 fontStyle10">
              <span>{post.date}</span>
              <span>&middot;</span>
              <span>{post.readTime}</span>
            </div>
            <span className="ml-auto flex items-center gap-2 fontStyle9 font-semibold text-white
              bg-white/15 border border-white/20 backdrop-blur px-4 py-2 rounded-full
              group-hover:bg-white group-hover:text-[var(--color6)] transition-all duration-300">
              Read Article
              <i className="bx bx-right-arrow-alt text-base transition-transform duration-300 group-hover:translate-x-1"></i>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
