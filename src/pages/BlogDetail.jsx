import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";

// ─────────────────────────────────────────────
// MOCK DATA — replace with API/CMS later
// ─────────────────────────────────────────────

const POST = {
  slug:      "how-to-pick-the-perfect-website-template",
  category:  "Design",
  tag:       "Featured",
  title:     "How to Pick the Perfect Website Template for Your Brand",
  excerpt:   "Choosing the right template sets the foundation for your entire online presence. We break down exactly what to look for before hitting purchase.",
  date:      "Feb 14, 2026",
  readTime:  "6 min read",
  image:     "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&h=700&fit=crop",
  author: {
    name:    "Aryan Mehta",
    avatar:  "AM",
    role:    "Design Lead",
    bio:     "Aryan is a design lead with 8+ years of experience building products for startups and Fortune 500 companies. He writes about design systems, typography, and UX strategy.",
    twitter: "@aryanmehta",
  },
  content: [
    {
      type: "paragraph",
      text: "Your website template is the first thing a visitor sees — and first impressions are formed in under 50 milliseconds. That's not a lot of time to make your case. Choosing the wrong template can cost you conversions, credibility, and customers before you even get a chance to speak.",
    },
    {
      type: "heading",
      text: "1. Define Your Brand Personality First",
    },
    {
      type: "paragraph",
      text: "Before you open a single template marketplace, spend 20 minutes writing down three words that describe your brand. Are you bold and disruptive? Clean and corporate? Warm and approachable? Your template must visually communicate those same words — or your message will feel disjointed before a visitor reads a single sentence.",
    },
    {
      type: "callout",
      icon: "bx-bulb",
      text: "Pro tip: Show your top 3 shortlisted templates to 5 people and ask them to describe the brand without any context. If their words match your brand personality list, you're on the right track.",
    },
    {
      type: "heading",
      text: "2. Prioritise Layout Over Aesthetics",
    },
    {
      type: "paragraph",
      text: "It's tempting to choose the most beautiful template you find. But beauty fades when the layout doesn't serve your content. Ask yourself: where will your call-to-action live? How does the navigation flow? Does the template guide users naturally toward conversion? A well-structured template with average visuals will always outperform a visually stunning template with poor UX.",
    },
    {
      type: "image",
      src:  "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=900&h=500&fit=crop",
      caption: "Layout hierarchy guides users toward your most important actions.",
    },
    {
      type: "heading",
      text: "3. Check Mobile Performance — Not Just Mobile Design",
    },
    {
      type: "paragraph",
      text: "Every modern template claims to be 'fully responsive.' But responsive design and mobile performance are not the same thing. Open the template demo on your phone and actually interact with it. Does it load in under 3 seconds? Is the tap target size large enough? Does the navigation collapse gracefully? These are the questions that separate genuinely mobile-ready templates from those that merely look good on a desktop screenshot.",
    },
    {
      type: "list",
      items: [
        "Load time under 3 seconds on mobile data",
        "Touch targets at least 44×44px",
        "No horizontal overflow or broken layouts",
        "Readable font size without zooming (minimum 16px body)",
        "Forms and CTAs accessible via thumb reach",
      ],
    },
    {
      type: "heading",
      text: "4. Evaluate Customisation Depth",
    },
    {
      type: "paragraph",
      text: "A template is a starting point, not a final product. The best templates give you full access to the source code and use clean, modular CSS that's easy to override. Avoid templates that rely heavily on inline styles or deeply nested selectors — these become nightmares to customise. Look for templates with well-commented code and a clear file structure.",
    },
    {
      type: "callout",
      icon: "bx-code-alt",
      text: "All templates in our library include full source code with clean, commented structure — making customisation straightforward regardless of your skill level.",
    },
    {
      type: "heading",
      text: "5. Think Long-Term, Not Just Launch Day",
    },
    {
      type: "paragraph",
      text: "Your website will evolve. You'll add blog posts, new product pages, team members, and sections you haven't thought of yet. Choose a template that has enough page variety baked in, or is flexible enough to accommodate growth. A template that looks perfect at launch but becomes restrictive in 6 months is a liability, not an asset.",
    },
    {
      type: "paragraph",
      text: "The perfect template isn't necessarily the most expensive or the most complex. It's the one that aligns with your brand, serves your users, and gives you room to grow. Take your time, test on real devices, and choose with intention.",
    },
  ],
  tags: ["Design", "Templates", "Branding", "UX", "Web Design"],
};

const RELATED = [
  {
    id: 2,
    slug:     "top-10-ecommerce-templates-2026",
    category: "Templates",
    title:    "Top 10 E-Commerce Templates to Launch Your Store in 2026",
    date:     "Feb 10, 2026",
    readTime: "8 min read",
    image:    "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=600&h=400&fit=crop",
    author:   { name: "Priya Sharma", avatar: "PS" },
  },
  {
    id: 3,
    slug:     "speed-up-your-site-in-10-steps",
    category: "Development",
    title:    "Speed Up Your Website in 10 Simple Steps",
    date:     "Feb 06, 2026",
    readTime: "5 min read",
    image:    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    author:   { name: "Rahul Dev", avatar: "RD" },
  },
  {
    id: 4,
    slug:     "typography-that-sells",
    category: "Design",
    title:    "Typography That Sells: Font Pairing Rules for Web Designers",
    date:     "Jan 30, 2026",
    readTime: "7 min read",
    image:    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    author:   { name: "Ananya Roy", avatar: "AR" },
  },
];

// ─────────────────────────────────────────────
// READ PROGRESS BAR
// ─────────────────────────────────────────────

function ReadProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el  = document.documentElement;
      const top = el.scrollTop  || document.body.scrollTop;
      const h   = el.scrollHeight - el.clientHeight;
      setProgress(h > 0 ? (top / h) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-[var(--color6)]/8">
      <div
        className="h-full bg-[var(--color6)] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// TABLE OF CONTENTS
// ─────────────────────────────────────────────

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
    <div className="p-6 rounded-2xl border border-[var(--color6)]/12 bg-[var(--color5)]">
      <h4 className="fontStyle9 font-bold text-[var(--color6)] uppercase tracking-widest mb-4 flex items-center gap-2">
        <i className="bx bx-list-ul text-base text-[var(--color4)]"></i>
        In This Article
      </h4>
      <nav>
        <ul className="flex flex-col gap-1">
          {headings.map((h, i) => (
            <li key={i}>
              <button
                onClick={() => {
                  document.querySelectorAll(".post-heading")[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`w-full text-left fontStyle10 px-3 py-2 rounded-lg border-l-2 transition-all duration-200
                  ${active === i
                    ? "border-l-[var(--color6)] bg-[var(--color6)]/6 text-[var(--color6)] font-semibold"
                    : "border-l-transparent text-[var(--color4)] hover:text-[var(--color6)] hover:border-l-[var(--color6)]/40"
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

// ─────────────────────────────────────────────
// CONTENT RENDERER
// ─────────────────────────────────────────────

function ContentBlock({ block }) {
  switch (block.type) {

    case "heading":
      return (
        <h2 className="post-heading fontStyle5 font-bold text-[var(--color6)] mt-10 mb-4 leading-snug scroll-mt-24">
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="fontStyle8 text-[var(--color8)] leading-[1.9] mb-5">
          {block.text}
        </p>
      );

    case "callout":
      return (
        <div className="my-8 flex gap-4 p-6 rounded-2xl border-[2px] border-[var(--color6)] bg-[var(--color6)]/4 shadow-[4px_4px_0px_var(--color6)]">
          <div className="w-10 h-10 rounded-xl bg-[var(--color6)] flex items-center justify-center flex-shrink-0">
            <i className={`bx ${block.icon} text-xl text-[var(--color5)]`}></i>
          </div>
          <p className="fontStyle8 text-[var(--color6)] leading-relaxed font-medium">{block.text}</p>
        </div>
      );

    case "image":
      return (
        <figure className="my-10">
          <div className="rounded-2xl overflow-hidden border-[2px] border-[var(--color6)] shadow-[6px_6px_0px_var(--color6)]">
            <img src={block.src} alt={block.caption} className="w-full object-cover" />
          </div>
          {block.caption && (
            <figcaption className="fontStyle10 text-[var(--color4)] text-center mt-3 italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "list":
      return (
        <ul className="my-6 flex flex-col gap-2.5" role="list">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[var(--color6)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="bx bx-check text-sm text-[var(--color5)]"></i>
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

// ─────────────────────────────────────────────
// SHARE BUTTONS
// ─────────────────────────────────────────────

function ShareBar({ title }) {
  const url   = typeof window !== "undefined" ? window.location.href : "";
  const links = [
    { icon: "bxl-twitter",   label: "Twitter",   href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`  },
    { icon: "bxl-linkedin",  label: "LinkedIn",  href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`                      },
    { icon: "bxl-facebook",  label: "Facebook",  href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`                             },
  ];

  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Share on ${l.label}`}
          className="w-9 h-9 rounded-full border border-[var(--color6)]/18 flex items-center justify-center
            text-[var(--color4)] hover:border-[var(--color6)] hover:text-[var(--color6)]
            hover:shadow-[2px_2px_0px_var(--color6)] transition-all duration-200"
        >
          <i className={`bx ${l.icon} text-base`}></i>
        </a>
      ))}
      <button
        onClick={copy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color6)]/18
          fontStyle10 font-semibold text-[var(--color4)] hover:border-[var(--color6)] hover:text-[var(--color6)]
          transition-all duration-200"
      >
        <i className={`bx ${copied ? "bx-check" : "bx-link"} text-base`}></i>
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// RELATED CARD
// ─────────────────────────────────────────────

function RelatedCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block border-[2px] border-[var(--color6)]/18 rounded-2xl overflow-hidden bg-[var(--color5)]
        hover:border-[var(--color6)] hover:shadow-[5px_5px_0px_var(--color6)] transition-all duration-300"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--color5)] backdrop-blur text-[var(--color6)]">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h4 className="fontStyle7 font-bold text-[var(--color6)] leading-snug mb-3 group-hover:text-[var(--color4)] transition-colors duration-300">
          {post.title}
        </h4>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[var(--color6)] text-[var(--color5)] fontStyle10 font-bold flex items-center justify-center">
              {post.author.avatar}
            </span>
            <span className="fontStyle10 text-[var(--color4)]">{post.author.name}</span>
          </div>
          <span className="fontStyle10 text-[var(--color4)]">{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────
// MAIN BLOG DETAIL PAGE
// ─────────────────────────────────────────────

export default function BlogDetail() {
  const { slug } = useParams();
  const [mounted, setMounted] = useState(false);
  const post = POST; // replace: fetch by slug from API

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [slug]);

  const fadeUp = (delay = 0) => ({
    transition: `opacity .6s ${delay}s, transform .6s ${delay}s`,
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
  });

  return (
    <>
      <ReadProgress />

      <div className="bg-[var(--color5)]">

        {/* ─── HERO ─── */}
        <section className="pt-16 pb-0 overflow-hidden">
          <div className="w-width">

            {/* Breadcrumb */}
            <BreadCrumb_Nav
            items={[
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
            { label: "Blog_Details", path: "/blogdetails" },
            ]}/>

            {/* Title */}
            <h1
              style={fadeUp(0.1)}
              className="fontStyle3 font-black text-[var(--color6)] leading-tight mb-6 max-w-3xl"
            >
              {post.title}
            </h1>

            {/* Excerpt */}
            <p style={fadeUp(0.15)} className="fontStyle8 text-[var(--color4)] max-w-2xl leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div style={fadeUp(0.2)} className="flex flex-wrap items-center gap-6 pb-10 border-b border-[var(--color6)]/10">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color6)] text-[var(--color5)] fontStyle9 font-bold flex items-center justify-center">
                  {post.author.avatar}
                </div>
                <div>
                  <p className="fontStyle9 font-semibold text-[var(--color6)] leading-none">{post.author.name}</p>
                  <p className="fontStyle10 text-[var(--color4)] mt-0.5">{post.author.role}</p>
                </div>
              </div>

              <div className="w-px h-8 bg-[var(--color6)]/12 hidden sm:block"></div>

              <div className="flex items-center gap-1.5 fontStyle9 text-[var(--color4)]">
                <i className="bx bx-calendar text-base"></i>
                {post.date}
              </div>

              <div className="flex items-center gap-1.5 fontStyle9 text-[var(--color4)]">
                <i className="bx bx-time-five text-base"></i>
                {post.readTime}
              </div>

              <div className="ml-auto">
                <ShareBar title={post.title} />
              </div>
            </div>
          </div>
        </section>

        {/* ─── HERO IMAGE ─── */}
        <section style={fadeUp(0.22)} className="py-10">
          <div className="w-width">
            <div className="rounded-3xl overflow-hidden border-[2px] border-[var(--color6)] shadow-[10px_10px_0px_var(--color6)]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: 520 }}
              />
            </div>
          </div>
        </section>

        {/* ─── BODY + SIDEBAR ─── */}
        <section className="pb-24">
          <div className="w-width">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-14 items-start">

              {/* Article body */}
              <article style={fadeUp(0.28)}>
                {post.content.map((block, i) => (
                  <ContentBlock key={i} block={block} />
                ))}

                {/* Tags */}
                <div className="mt-12 pt-8 border-t border-[var(--color6)]/10 flex flex-wrap items-center gap-3">
                  <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">Tags:</span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="fontStyle10 font-semibold px-3 py-1.5 rounded-full border border-[var(--color6)]/18
                        text-[var(--color4)] hover:border-[var(--color6)] hover:text-[var(--color6)] cursor-pointer
                        hover:shadow-[2px_2px_0px_var(--color6)] transition-all duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Share bottom */}
                <div className="mt-8 pt-8 border-t border-[var(--color6)]/10">
                  <ShareBar title={post.title} />
                </div>

                {/* Author card */}
                <div className="mt-10 p-7 rounded-2xl border-[2px] border-[var(--color6)] shadow-[6px_6px_0px_var(--color6)] flex gap-6 flex-wrap sm:flex-nowrap items-start">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--color6)] text-[var(--color5)] fontStyle5 font-black flex items-center justify-center flex-shrink-0">
                    {post.author.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)] mb-1">Written by</p>
                    <h4 className="fontStyle6 font-bold text-[var(--color6)] mb-1">{post.author.name}</h4>
                    <p className="fontStyle10 text-[var(--color4)] mb-3">{post.author.role} &nbsp;&middot;&nbsp; {post.author.twitter}</p>
                    <p className="fontStyle9 text-[var(--color4)] leading-relaxed">{post.author.bio}</p>
                  </div>
                </div>
              </article>

              {/* Sticky sidebar */}
              <div className="lg:sticky lg:top-8 flex flex-col gap-6">

                {/* TOC */}
                <TableOfContents content={post.content} />

                {/* Back to blog */}
                <Link
                  to="/blog"
                  className="group flex items-center gap-2 fontStyle9 font-semibold text-[var(--color4)]
                    hover:text-[var(--color6)] transition-colors duration-200"
                >
                  <i className="bx bx-arrow-back text-lg transition-transform duration-300 group-hover:-translate-x-1"></i>
                  Back to all articles
                </Link>

              </div>
            </div>
          </div>
        </section>

        {/* ─── RELATED POSTS ─── */}
        <section className="py-20 border-t border-[var(--color6)]/10">
          <div className="w-width">
            <div className="flex items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3">
                <h2 className="fontStyle5 font-bold text-[var(--color6)]">Related Articles</h2>
                <span className="fontStyle10 text-[var(--color4)] bg-[var(--color6)]/8 px-2.5 py-0.5 rounded-full">
                  {RELATED.length}
                </span>
              </div>
              <Link
                to="/blog"
                className="group flex items-center gap-1.5 fontStyle9 font-semibold text-[var(--color4)] hover:text-[var(--color6)] transition-colors"
              >
                View all
                <i className="bx bx-right-arrow-alt text-base transition-transform duration-300 group-hover:translate-x-1"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
              {RELATED.map((p) => (
                <RelatedCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
}