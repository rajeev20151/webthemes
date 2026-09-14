import { Link } from "react-router-dom";
import Avatar from "./Avatar";

export default function FeaturedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block relative rounded-2xl sm:rounded-3xl overflow-hidden
        border border-[var(--color6)]/15
        shadow-[0_2px_20px_rgba(0,0,0,0.06)]
        group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
        transition-all duration-500 bg-[var(--color5)]"
    >
      {/* Image */}
      <div className="relative aspect-[16/7] overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--color6)]/4">
            <svg className="w-16 h-16 text-[var(--color6)]/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 p-6 sm:p-8 md:p-10 w-full">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
            <span className="fontStyle10 font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-white/15 text-white backdrop-blur-sm border border-white/10">
              {post.category}
            </span>
            {post.tag && (
              <span className="fontStyle10 font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-[var(--color6)] text-[var(--color5)]">
                {post.tag}
              </span>
            )}
          </div>

          <h2 className="fontStyle4 sm:fontStyle3 font-bold text-white leading-tight mb-3 sm:mb-4 max-w-2xl
            group-hover:text-white/90 transition-colors duration-300">
            {post.title}
          </h2>

          <p className="fontStyle9 sm:fontStyle8 text-white/60 max-w-xl leading-relaxed mb-5 sm:mb-6 hidden sm:block">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <Avatar initials={post.author.avatar} />
              <div>
                <p className="fontStyle10 sm:fontStyle9 font-semibold text-white leading-none">{post.author.name}</p>
                <p className="fontStyle10 text-white/50 mt-0.5">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/40 fontStyle10">
              <span>{post.date}</span>
              <span>&middot;</span>
              <span>{post.readTime}</span>
            </div>
            <span className="ml-auto flex items-center gap-2 fontStyle9 sm:fontStyle9 font-semibold text-white
              bg-white/10 border border-white/15 backdrop-blur-sm px-4 py-2 rounded-xl
              group-hover:bg-white group-hover:text-[var(--color6)] transition-all duration-300">
              Read Article
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
