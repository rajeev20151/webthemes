import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import FeaturedCard from "../components/FeaturedCard";
import BlogCard from "../components/BlogCard";
import Sidebar from "../components/Sidebar";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { API_BASE } from "../services/api";
import { useGetBlogsQuery } from "../store/apiSlice";
import SEOHead from "../components/SEOHead";

const CATEGORIES = [
  "All", "Design", "Development", "Templates", "Tips & Tricks", "Case Studies",
];

const TAG_COLORS = {
  Featured: "bg-[var(--color6)] text-[var(--color5)]",
  Popular: "text-white",
  New: "bg-[var(--color6)]/10 text-[var(--color6)]",
};

const resolveUrl = (p) => {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${API_BASE.replace(/\/api\/?$/, "")}${p}`;
};

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const mapBlog = (b) => ({
  id: b._id,
  slug: b.slug,
  category: b.category,
  tag: b.tag || null,
  title: b.title,
  excerpt: b.excerpt,
  author: {
    name: b.authorName || "Admin",
    avatar: (b.authorName || "A").charAt(0).toUpperCase(),
    role: b.authorRole || "",
  },
  date: formatDate(b.createdAt),
  readTime: b.readTime || "5 min read",
  image: resolveUrl(b.image),
  featured: b.featured,
});

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  const { data: blogsData, isLoading: loading } = useGetBlogsQuery();

  const posts = useMemo(() => {
    if (blogsData?.success) return blogsData.blogs.map(mapBlog);
    return [];
  }, [blogsData]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const featured = posts.find((p) => p.featured);
  const nonFeatured = posts.filter((p) => !p.featured);

  const filtered = nonFeatured.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  const fadeUp = (delay = 0) => ({
    transition: `opacity .6s ${delay}s, transform .6s ${delay}s`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
  });

  return (
    <div className="bg-[var(--color5)]">
      <SEOHead
        title="Blog & Insights"
        description="Deep dives into design systems, frontend architecture, and the real-world strategies behind products that scale."
      />

      {/* ─── HEADER ─── */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-14 md:pt-24 md:pb-18 overflow-hidden relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.03,
          }}
        />
        <div className="w-width relative z-10 px-4 sm:px-6 md:px-0">
          <BreadCrumb_Nav
            items={[
              { label: "Home", path: "/" },
              { label: "Blog", path: "/blog" },
            ]}
          />
          <div className="max-w-2xl" style={fadeUp()}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color6)]/8 border border-[var(--color6)]/12 mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color6)] animate-pulse"></span>
              <span className="fontStyle10 font-semibold text-[var(--color6)] uppercase tracking-wider">Blog & Insights</span>
            </div>
            <h1 className="fontStyle3 sm:fontStyle1 md:fontStyle2 font-black text-[var(--color6)] leading-[1.1] mb-5 sm:mb-6">
              Ideas That Shape
              <br />
              <span className="sm:inline" style={{ WebkitTextStroke: "2px var(--color6)", color: "transparent" }}>
                Digital Products.
              </span>
            </h1>
            <p className="fontStyle9 sm:fontStyle8 text-[var(--color4)] leading-relaxed max-w-lg">
              Deep dives into design systems, frontend architecture, and the real-world strategies behind products that scale.
            </p>
          </div>
        </div>
      </section>

      {/* ─── FEATURED POST ─── */}
      {featured && (
        <section className="pb-14 sm:pb-18">
          <div className="w-width px-4 sm:px-6 md:px-0">
            <div style={fadeUp(0.1)}>
              <FeaturedCard post={featured} />
            </div>
          </div>
        </section>
      )}

      {/* ─── FILTER BAR ─── */}
      <section className="pb-8 sm:pb-10">
        <div className="w-width px-4 sm:px-6 md:px-0">
          <div className="pb-5 sm:pb-6 border-b border-[var(--color6)]/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-5">
            {/* Category tabs */}
            <div className="flex items-center gap-0.5 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative fontStyle10 sm:fontStyle9 font-semibold px-3.5 sm:px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200
                      ${active
                        ? "text-[var(--color5)] bg-[var(--color6)]"
                        : "text-[var(--color4)] hover:text-[var(--color6)] hover:bg-[var(--color6)]/5"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-auto">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-60 pl-10 pr-10 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-white
                  fontStyle9 text-[var(--color6)] placeholder-[var(--color4)]/60 outline-none
                  focus:border-[var(--color6)] focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── GRID + SIDEBAR ─── */}
      <section className="pb-20 sm:pb-28">
        <div className="w-width px-4 sm:px-6 md:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start">

            {/* Grid */}
            <div>
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <h2 className="fontStyle7 font-bold text-[var(--color6)]">
                  {activeCategory === "All" ? "All Articles" : activeCategory}
                </h2>
                <span className="fontStyle10 font-semibold text-[var(--color4)] bg-[var(--color6)]/6 px-2.5 py-1 rounded-full">
                  {filtered.length}
                </span>
              </div>

              {loading ? (
                <div className="py-20 sm:py-24 text-center">
                  <div className="w-8 h-8 border-2 border-[var(--color6)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="fontStyle9 text-[var(--color4)]">Loading articles...</p>
                </div>
              ) : filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
                  {filtered.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} TAG_COLORS={TAG_COLORS} />
                  ))}
                </div>
              ) : (
                <div className="py-20 sm:py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color6)]/5 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-7 h-7 text-[var(--color6)]/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="fontStyle8 text-[var(--color4)] mb-1">
                    No articles found
                    {search && (
                      <> for <span className="font-semibold text-[var(--color6)]">"{search}"</span></>
                    )}
                  </p>
                  <button
                    onClick={() => { setSearch(""); setActiveCategory("All"); }}
                    className="mt-3 fontStyle9 font-semibold text-[var(--color6)] hover:underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Load more */}
              {filtered.length > 0 && (
                <div className="mt-14 sm:mt-16 text-center">
                  <Link to="" className="group fontStyle8 sm:fontStyle7 inline-flex items-center gap-3 pl-7 sm:pl-8 pr-3 py-3 text-[var(--color5)]
                    bg-[var(--color6)] rounded-full shadow-[4px_4px_0px_var(--color6)] hover:shadow-[2px_2px_0px_var(--color6)]
                    transition-all duration-300 hover:translate-x-[2px] hover:translate-y-[2px]">
                    <span className="font-bold">Load More</span>
                    <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color5)]
                      transition-all duration-300 group-hover:rotate-90">
                      <svg className="w-5 h-5 text-[var(--color6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-8 order-first lg:order-last">
              <Sidebar posts={posts} CATEGORIES={CATEGORIES} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
