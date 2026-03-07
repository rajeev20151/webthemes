import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import FeaturedCard from "../components/FeaturedCard";
import BlogCard from "../components/BlogCard";
import Sidebar from "../components/Sidebar";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CATEGORIES = [
  "All", "Design", "Development", "Templates", "Tips & Tricks", "Case Studies",
];

const TAG_COLORS = {
Featured: "bg-[var(--color6)] text-[var(--color5)]",
Popular:  "text-white",
New:      "bg-[var(--color6)]/10 text-[var(--color6)]",
};


const POSTS = [
  {
    id: 1,
    slug: "how-to-pick-the-perfect-website-template",
    category: "Design",
    tag: "Featured",
    title: "How to Pick the Perfect Website Template for Your Brand",
    excerpt: "Choosing the right template sets the foundation for your entire online presence. We break down exactly what to look for before hitting purchase.",
    author: { name: "Aryan Mehta",  avatar: "AM", role: "Design Lead"       },
    date: "Feb 14, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=600&fit=crop",
    featured: true,
  },
  {
    id: 2,
    slug: "top-10-ecommerce-templates-2026",
    category: "Templates",
    tag: "Popular",
    title: "Top 10 E-Commerce Templates to Launch Your Store in 2026",
    excerpt: "From minimalist fashion shops to bold product pages — these are the templates driving conversions right now.",
    author: { name: "Priya Sharma", avatar: "PS", role: "Product Designer"   },
    date: "Feb 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=900&h=600&fit=crop",
    featured: false,
  },
  {
    id: 3,
    slug: "speed-up-your-site-in-10-steps",
    category: "Development",
    tag: "New",
    title: "Speed Up Your Website in 10 Simple Steps",
    excerpt: "A slow website kills conversions. Here are 10 actionable techniques to dramatically improve your site's load speed — no back-end required.",
    author: { name: "Rahul Dev",    avatar: "RD", role: "Frontend Engineer"  },
    date: "Feb 06, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=600&fit=crop",
    featured: false,
  },
  {
    id: 4,
    slug: "typography-that-sells",
    category: "Design",
    tag: null,
    title: "Typography That Sells: Font Pairing Rules for Web Designers",
    excerpt: "Great typography is invisible — until it's not. Master the rules of font pairing and learn how type choices influence trust and readability.",
    author: { name: "Ananya Roy",   avatar: "AR", role: "UI Designer"        },
    date: "Jan 30, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=600&fit=crop",
    featured: false,
  },
  {
    id: 5,
    slug: "saas-landing-page-case-study",
    category: "Case Studies",
    tag: null,
    title: "Case Study: How a SaaS Landing Page Increased Sign-ups by 340%",
    excerpt: "A deep dive into how a single template redesign transformed a product's conversion rate — with real data and design decisions behind it.",
    author: { name: "Aryan Mehta",  avatar: "AM", role: "Design Lead"       },
    date: "Jan 22, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&h=600&fit=crop",
    featured: false,
  },
  {
    id: 6,
    slug: "dark-mode-design-tips",
    category: "Tips & Tricks",
    tag: null,
    title: "Dark Mode Done Right: 8 Design Tips Every Developer Should Know",
    excerpt: "Dark mode isn't just an aesthetic preference anymore — it's an expectation. Here's how to implement it without sacrificing readability or brand.",
    author: { name: "Priya Sharma", avatar: "PS", role: "Product Designer"   },
    date: "Jan 15, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=600&fit=crop",
    featured: false,
  },
];

// ─────────────────────────────────────────────
// MAIN BLOG PAGE
// ─────────────────────────────────────────────

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const featured    = POSTS.find((p) => p.featured);
  const nonFeatured = POSTS.filter((p) => !p.featured);

  const filtered = nonFeatured.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchQ = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className="bg-[var(--color5)]">

      {/* ─────────────── HEADER ─────────────── */}
      <section className="pt-20 pb-14 overflow-hidden relative">
        {/* Dot grid bg */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color6) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.04,
          }}
        />

        <div className="w-width relative z-10">
        {/* -----  Breadcrumb-Navigation ----- */}
        <BreadCrumb_Nav
        items={[
        { label: "Home", path: "/" },
        { label: "Blog", path: "/Blog" },
        ]}/>
            
          <div
            className="max-w-2xl"
            style={{
              transition: "opacity .6s, transform .6s",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
            }}
          >
        
            <h1 className="fontStyle2 font-black text-[var(--color6)] leading-tight mb-5">
              Insights for Builders <br />
              <span style={{ WebkitTextStroke: "2px var(--color6)", color: "transparent" }}>
                & Designers.
              </span>
            </h1>
            <p className="fontStyle8 text-[var(--color4)] leading-relaxed max-w-lg">
              Templates, design theory, development tips, and real case studies — everything you need to build better on the web.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────── FEATURED POST ─────────────── */}
      {featured && (
        <section className="pb-16">
          <div className="w-width">
            <div
              style={{
                transition: "opacity .6s .1s, transform .6s .1s",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <FeaturedCard post={featured} />
            </div>
          </div>
        </section>
      )}

      {/* ─────────────── FILTER BAR ─────────────── */}
      <section className="pb-10">
        <div className="w-width">
          <div className="flex flex-wrap items-center justify-between gap-5 pb-6 border-b border-[var(--color6)]/12">

            {/* Category tabs */}
            <div className="flex items-center gap-1 flex-wrap">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative fontStyle9 font-semibold px-4 py-2 transition-all duration-200
                      ${active ? "text-[var(--color6)]" : "text-[var(--color4)] hover:text-[var(--color6)]"}`}
                  >
                    {cat}
                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color6)] rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative">
              <i className="bx bx-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color4)] text-lg"></i>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-10 py-2.5 rounded-xl border border-[var(--color6)]/18 bg-[var(--color5)]
                  fontStyle9 text-[var(--color6)] placeholder-[var(--color4)] outline-none
                  focus:border-[var(--color6)] transition-colors duration-200 w-56"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)]"
                >
                  <i className="bx bx-x text-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── GRID + SIDEBAR ─────────────── */}
      <section className="pb-24">
        <div className="w-width">
 
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-start">

            {/* Grid */}
            <div>
              {/* Result count */}
              <div className="flex items-center gap-3 mb-8">
                <h2 className="fontStyle7 font-bold text-[var(--color6)]">
                  {activeCategory === "All" ? "All Articles" : activeCategory}
                </h2>
                <span className="fontStyle10 text-[var(--color4)] bg-[var(--color6)]/8 px-2.5 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {filtered.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} TAG_COLORS={TAG_COLORS} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <i className="bx bx-search-alt text-5xl text-[var(--color6)]/20 mb-4 block"></i>
                  <p className="fontStyle8 text-[var(--color4)]">
                    No articles found for{" "}
                    <span className="font-semibold text-[var(--color6)]">"{search}"</span>
                  </p>
                  <button
                    onClick={() => { setSearch(""); setActiveCategory("All"); }}
                    className="mt-4 fontStyle9 text-[var(--color4)] underline underline-offset-2 hover:text-[var(--color6)]"
                  >
                    Clear filters
                  </button>
                </div>
              )}

              {/* Load more */}
              {filtered.length > 0 && (
                <div className="mt-14 text-center">
                <Link to="" className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 text-[var(--color5)]
                bg-[var(--color6)] rounded-full  shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <span className="font-bold">Load More Articles</span>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)]
                transition-all duration-300 group-hover:rotate-90">
                <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
                </span>
                </Link>
                </div>
              )}
            </div>

            {/* Sidebar (sticky) */}
            <div className="lg:sticky lg:top-8">
              <Sidebar posts={POSTS} CATEGORIES={CATEGORIES} />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}