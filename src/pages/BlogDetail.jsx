import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { API_BASE } from "../services/api";
import { useGetBlogBySlugQuery } from "../store/apiSlice";
import SEOHead from "../components/SEOHead";

const resolveUrl = (p) => {
  if (!p) return "";
  if (p.startsWith("http") || p.startsWith("blob:")) return p;
  return `${API_BASE.replace(/\/api\/?$/, "")}${p}`;
};

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

/* ── Read Progress Bar ── */
function ReadProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const h = el.scrollHeight - el.clientHeight;
      setProgress(h > 0 ? (top / h) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[4px] bg-[var(--color6)]/10">
      <div
        className="h-full bg-color3 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ── Table of Contents ── */
function TableOfContents({ content }) {
  const headings = content.filter((b) => b.type === "heading");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handler = () => {
      const els = document.querySelectorAll(".post-heading");
      let current = 0;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top < 140) current = i;
      });
      setActive(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!headings.length) return null;

  return (
    <div className="p-5 sm:p-6 rounded-2xl border-2 border-[var(--color6)] bg-[var(--color5)] shadow-[5px_5px_0px_var(--color6)] sm:shadow-[6px_6px_0px_var(--color6)]">
      <h4 className="fontStyle10 font-bold text-[var(--color6)] uppercase tracking-widest mb-4 pb-4 border-b-2 border-dashed border-[var(--color6)]/15 flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-color3 border-2 border-[var(--color6)] flex items-center justify-center -rotate-6">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
          </svg>
        </span>
        In This Article
      </h4>
      <nav>
        <ul className="flex flex-col gap-1.5">
          {headings.map((h, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  document.querySelectorAll(".post-heading")[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-full text-left fontStyle10 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${active === i
                    ? "bg-[var(--color6)] text-[var(--color5)] border-[var(--color6)] font-bold shadow-[3px_3px_0px_var(--color4)]"
                    : "border-transparent text-[var(--color4)] hover:text-[var(--color6)] hover:border-[var(--color6)]/30"
                  }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/* ── Content Block Renderer ── */
function ContentBlock({ block }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="post-heading fontStyle5 font-bold text-[var(--color6)] mt-10 sm:mt-12 mb-4 leading-snug scroll-mt-24 flex items-center gap-3">
          <span className="w-2 h-7 rounded-full bg-color3 flex-shrink-0"></span>
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p className="fontStyle8 text-[var(--color8)] leading-[1.85] sm:leading-[1.9] mb-5 sm:mb-6">
          {block.text}
        </p>
      );
    case "callout":
      return (
        <div className="my-8 sm:my-10 flex gap-3 sm:gap-4 p-5 sm:p-6 rounded-2xl bg-[var(--color11)] border-2 border-[var(--color6)] shadow-[5px_5px_0px_var(--color6)]">
          <div className="w-10 h-10 rounded-xl bg-color3 border-2 border-[var(--color6)] flex items-center justify-center flex-shrink-0 -rotate-6">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="fontStyle8 text-[var(--color6)] leading-relaxed font-medium">{block.text}</p>
        </div>
      );
    case "image":
      return (
        <figure className="my-9 sm:my-11">
          <div className="rounded-2xl overflow-hidden border-2 border-[var(--color6)] shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]">
            <img src={block.src} alt={block.caption || ""} className="w-full object-cover" />
          </div>
          {block.caption && (
            <figcaption className="fontStyle10 text-[var(--color4)] text-center mt-5 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case "list":
      return (
        <ul className="my-5 sm:my-6 flex flex-col gap-3" role="list">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-color3 border-2 border-[var(--color6)] flex items-center justify-center flex-shrink-0 mt-0.5 -rotate-6">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="fontStyle8 text-[var(--color8)] leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

/* ── Share Buttons ── */
function ShareBar({ title }) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const SocialIcon = ({ d, className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24"><path d={d} /></svg>
  );

  const iconBtn =
    "w-9 h-9 rounded-full border-2 border-[var(--color6)] bg-[var(--color5)] flex items-center justify-center text-[var(--color6)] shadow-[2px_2px_0px_var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] hover:shadow-[0px_0px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200";

  return (
    <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
      <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">Share</span>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={iconBtn}>
        <SocialIcon d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={iconBtn}>
        <SocialIcon d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
      </a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" className={iconBtn}>
        <SocialIcon d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </a>
      <button
        onClick={copy}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-[var(--color6)] bg-[var(--color5)] text-[var(--color6)]
          fontStyle10 font-bold shadow-[2px_2px_0px_var(--color6)] cursor-pointer
          hover:shadow-[0px_0px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
      >
        {copied ? (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

/* ── Related Card ── */
function RelatedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[var(--color5)]
        border-2 border-[var(--color6)]
        shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
        transition-all duration-300
        hover:shadow-[2px_2px_0px_var(--color6)] hover:translate-x-1 hover:translate-y-1"
    >
      <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-[var(--color6)] bg-[var(--color11)]">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white text-[#111827] border-2 border-[#111827] shadow-[3px_3px_0px_#111827] -rotate-3 transition-all duration-300 group-hover:rotate-0 group-hover:shadow-[1px_1px_0px_#111827]">
            {post.category}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <h4 className="fontStyle7 font-bold text-[var(--color6)] leading-snug mb-4 flex-1 group-hover:text-[var(--color4)] transition-colors duration-300">
          {post.title}
        </h4>
        <div className="flex items-center justify-between gap-2 pt-4 border-t-2 border-dashed border-[var(--color6)]/15">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-[var(--color6)] text-[var(--color5)] fontStyle10 font-bold flex items-center justify-center flex-shrink-0">
              {post.author.avatar}
            </span>
            <span className="fontStyle10 font-bold text-[var(--color6)] truncate">{post.author.name}</span>
          </div>
          <span className="fontStyle10 text-[var(--color4)] shrink-0">{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

/* ── MAIN BLOG DETAIL ── */
export default function BlogDetail() {
  const { slug } = useParams();
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [showToc, setShowToc] = useState(false);

  const { data: blogData, isLoading: loading } = useGetBlogBySlugQuery(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (blogData?.success && blogData.blog) {
      const b = blogData.blog;
      setPost({
        slug: b.slug,
        category: b.category,
        tag: b.tag,
        title: b.title,
        excerpt: b.excerpt,
        date: formatDate(b.createdAt),
        readTime: b.readTime,
        image: resolveUrl(b.image),
        author: {
          name: b.authorName || "Admin",
          avatar: (b.authorName || "A").charAt(0).toUpperCase(),
          role: b.authorRole || "",
          bio: "",
        },
        content: Array.isArray(b.content) ? b.content : [],
        tags: Array.isArray(b.tags) ? b.tags : [],
      });
      setRelated(
        (blogData.related || []).map((r) => ({
          id: r._id,
          slug: r.slug,
          category: r.category,
          title: r.title,
          readTime: r.readTime,
          image: resolveUrl(r.image),
          author: { name: r.authorName || "Admin", avatar: (r.authorName || "A").charAt(0).toUpperCase() },
        }))
      );
      const t = setTimeout(() => setMounted(true), 60);
      return () => clearTimeout(t);
    }
  }, [blogData]);

  const fadeUp = (delay = 0) => ({
    transition: `opacity .6s ${delay}s, transform .6s ${delay}s`,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
  });

  return (
    <>
      <ReadProgress />
      <SEOHead
        title={post?.title || "Blog Detail"}
        description={post?.excerpt || "Read this article on {site} blog."}
        image={post?.image}
        type="article"
      />
      <div className="bg-[var(--color5)]">
        {loading ? (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-10 h-10 border-[3px] border-[var(--color6)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="fontStyle9 text-[var(--color4)]">Loading article...</p>
            </div>
          </div>
        ) : !post ? (
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center flex flex-col items-center">
              <div className="w-20 h-20 rounded-3xl bg-[var(--color11)] border-2 border-dashed border-[var(--color4)] flex items-center justify-center mb-6 opacity-70">
                <svg className="w-8 h-8 text-[var(--color4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="fontStyle5 font-bold text-[var(--color6)] mb-2">Article Not Found</h2>
              <p className="fontStyle9 text-[var(--color4)] mb-6">The article you're looking for doesn't exist or has been removed.</p>
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 fontStyle9 font-bold px-6 py-2.5 rounded-full bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] hover:shadow-[1px_1px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        ) : (
        <>
        {/* ─── HERO SECTION ─── */}
        <section className="pt-12 sm:pt-14 md:pt-20 overflow-hidden">
          <div className="w-width">
            <BreadCrumb_Nav
              items={[
                { label: "Home", path: "/" },
                { label: "Blog", path: "/blog" },
                { label: post.title, path: `/blog/${post.slug}` },
              ]}
            />

            {/* Category + Tag */}
            <div style={fadeUp(0.05)} className="flex flex-wrap items-center gap-3 mb-5 sm:mb-6 p-1">
              <span className="inline-flex items-center gap-2 fontStyle10 font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] -rotate-2">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] border border-[var(--color6)] animate-pulse"></span>
                {post.category}
              </span>
              {post.tag && (
                <span className="inline-flex items-center fontStyle10 font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-color3 text-white border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] rotate-2">
                  {post.tag}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={fadeUp(0.1)} className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] break-words mb-5 sm:mb-6 ">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p style={fadeUp(0.15)} className="fontStyle8 text-[var(--color4)] leading-relaxed mb-6 sm:mb-8">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div style={fadeUp(0.2)} className="flex flex-wrap items-center gap-3 sm:gap-5 pb-8 sm:pb-10 border-b-2 border-dashed border-[var(--color6)]/15">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[var(--color6)] text-[var(--color5)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color4)] fontStyle8 font-bold flex items-center justify-center">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="fontStyle9 font-bold text-[var(--color6)] leading-none">{post.author.name}</p>
                  {post.author.role && (
                    <p className="fontStyle10 text-[var(--color4)] mt-1">{post.author.role}</p>
                  )}
                </div>
              </div>

              <div className="w-px h-8 bg-[var(--color6)]/15 hidden sm:block"></div>

              <div className="flex items-center gap-1.5 fontStyle9 text-[var(--color4)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {post.date}
              </div>

              <div className="flex items-center gap-1.5 fontStyle9 text-[var(--color4)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {post.readTime}
              </div>

              <div className="ml-auto hidden sm:block">
                <ShareBar title={post.title} />
              </div>
            </div>

            {/* Mobile share */}
            <div className="mt-5 sm:hidden pb-2">
              <ShareBar title={post.title} />
            </div>
          </div>
        </section>

        {/* ─── HERO IMAGE ─── */}
        {post.image && (
          <section style={fadeUp(0.22)} className="py-8 sm:py-10">
            <div className="w-width">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-[var(--color6)] shadow-[6px_6px_0px_var(--color6)] sm:shadow-[10px_10px_0px_var(--color6)]">
                <img src={post.image} alt={post.title} className="w-full object-cover" style={{ maxHeight: 520 }} />
              </div>
            </div>
          </section>
        )}

        {/* ─── BODY + SIDEBAR ─── */}
        <section className="pb-16 sm:pb-24">
          <div className="w-width">
            {/* Mobile TOC toggle */}
            {post.content.some((b) => b.type === "heading") && (
              <button
                onClick={() => setShowToc(!showToc)}
                className="lg:hidden w-full mb-6 p-4 rounded-2xl border-2 border-[var(--color6)] bg-[var(--color5)] flex items-center justify-between shadow-[4px_4px_0px_var(--color6)] cursor-pointer"
              >
                <span className="fontStyle9 font-bold text-[var(--color6)] flex items-center gap-2">
                  <svg className="w-4 h-4 text-[var(--color6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                  Table of Contents
                </span>
                <svg className={`w-5 h-5 text-[var(--color6)] transition-transform duration-200 ${showToc ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
            {showToc && (
              <div className="lg:hidden mb-8">
                <TableOfContents content={post.content} />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-10 lg:gap-14 items-start">

              {/* Article body */}
              <article style={fadeUp(0.28)}>
                {post.content.length > 0 ? (
                  post.content.map((block, i) => (
                    <ContentBlock key={i} block={block} />
                  ))
                ) : (
                  <div className="py-10 text-center">
                    <p className="fontStyle9 text-[var(--color4)]">This article is coming soon.</p>
                  </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t-2 border-dashed border-[var(--color6)]/15 flex flex-wrap items-center gap-3">
                    <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">Tags:</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 fontStyle10 font-bold px-3 py-1 rounded-full border-2 border-[var(--color6)] bg-[var(--color5)] text-[var(--color6)]
                          shadow-[2px_2px_0px_var(--color6)] cursor-pointer
                          hover:shadow-[0px_0px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                      >
                        <span className="text-[var(--color4)]">#</span>{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share bottom */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-dashed border-[var(--color6)]/15">
                  <ShareBar title={post.title} />
                </div>

                {/* Author card */}
                <div className="mt-10 sm:mt-12 p-5 sm:p-8 rounded-2xl bg-[var(--color5)] border-2 border-[var(--color6)] shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)] flex gap-5 sm:gap-6 flex-wrap sm:flex-nowrap items-start">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-color3 text-white border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] -rotate-6 fontStyle5 font-black flex items-center justify-center flex-shrink-0">
                    {post.author.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)] mb-1.5">Written by</p>
                    <h4 className="fontStyle6 font-bold text-[var(--color6)] mb-1">{post.author.name}</h4>
                    {post.author.role && (
                      <p className="fontStyle10 text-[var(--color4)] mb-3">{post.author.role}</p>
                    )}
                    {post.author.bio && (
                      <p className="fontStyle9 text-[var(--color4)] leading-relaxed">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </article>

              {/* Sticky sidebar */}
              <div className="lg:sticky lg:top-36 flex flex-col gap-6 sm:gap-7 pb-2">
                <TableOfContents content={post.content} />
                <Link
                  to="/blog"
                  className="group inline-flex items-center justify-center gap-2 fontStyle9 font-bold px-5 py-2.5 rounded-full
                    bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)]
                    hover:shadow-[1px_1px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to all articles
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RELATED POSTS ─── */}
        {related.length > 0 && (
          <section className="py-16 sm:py-20 border-t-2 border-dashed border-[var(--color6)]/15 bg-[var(--color11)]">
            <div className="w-width">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-10 sm:mb-12">
                <div className="flex items-center gap-3">
                  <h2 className="fontStyle5 font-bold text-[var(--color6)]">Related Articles</h2>
                  <span className="fontStyle10 font-bold text-[var(--color6)] bg-[var(--color5)] border-2 border-[var(--color6)] shadow-[2px_2px_0px_var(--color6)] px-3 py-0.5 rounded-full">
                    {related.length}
                  </span>
                </div>
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-1.5 fontStyle9 font-bold px-4 py-2 rounded-full bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] hover:shadow-[1px_1px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-300"
                >
                  View all
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 pb-2">
                {related.map((p) => (
                  <RelatedCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}
        </>
        )}
      </div>
    </>
  );
}