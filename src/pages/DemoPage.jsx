import { Link, useSearchParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { getTemplatesAPI } from "../services/api";
import SEOHead from "../components/SEOHead";

const ALL_TYPES      = ["All Types", "Landing Page", "Multi Page", "One Page"];
const SORT_OPTIONS   = ["Latest", "Most Viewed", "A – Z"];

/* ════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
════════════════════════════════════════ */

function TechBadge({ tech }) {
  const isWP = tech === "WORDPRESS";
  return (
    <span
      className={`fontStyle10 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block leading-snug ${
        isWP
          ? "bg-[rgba(0,0,0,0.06)] text-[var(--color6)] border-[rgba(0,0,0,0.14)]"
          : "bg-[rgba(243,115,53,0.08)] text-[var(--color3)] border-[rgba(243,115,53,0.22)]"
      }`}
    >
      {tech}
    </span>
  );
}

function TagBadge({ tag }) {
  return (
    <span
      className={`fontStyle10 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full leading-snug ${
        tag === "FREE"
          ? "bg-[rgba(34,197,94,0.12)] text-[#16a34a]"
          : "bg-color3 text-[var(--color5)]"
      }`}
    >
      {tag}
    </span>
  );
}

function Pill({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 fontStyle9 font-semibold px-3.5 py-2 rounded-xl border transition-all duration-200 ${
        active
          ? "bg-[var(--color6)] text-[var(--color5)] border-transparent"
          : "bg-transparent border-[var(--color6)]/12 text-[var(--color4)] hover:border-[var(--color6)]/30 hover:text-[var(--color6)]"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`fontStyle10 px-1.5 py-0.5 rounded-full leading-none ${active ? "bg-[var(--color6)] text-[var(--color5)]" : "bg-[var(--color11)] text-[var(--color4)]"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
export default function DemoPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [demos,    setDemos]      = useState([]);
  const [category, setCategory]   = useState("All");
  const [tech,     setTech]       = useState("All");
  const [tag,      setTag]        = useState("All");
  const [type,     setType]       = useState("All Types");
  const [sort,     setSort]       = useState("Latest");
  const [search,   setSearch]     = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode]   = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const catScrollRef = useRef(null);

  /* ── Fetch demos (dynamic, like Templates.jsx) ── */
  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    const origin = API_BASE.replace(/\/api$/, "");
    getTemplatesAPI()
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.templates ?? [];
        setDemos(raw.map((t) => {
          const rawImage = Array.isArray(t.images) && t.images[0] ? t.images[0] : null;
          const image = rawImage
            ? rawImage.startsWith("http") ? rawImage : `${origin}${rawImage}`
            : null;
          const framework = Array.isArray(t.frameworks) && t.frameworks[0]
            ? t.frameworks[0].toUpperCase() : "HTML/CSS";
          return {
            id: t._id,
            title: t.name || "Untitled",
            category: t.category || t.subtitle || "General",
            type: t.tag || "Multi Page",
            tag: t.price === 0 ? "FREE" : "PRO",
            tech: framework.includes("WORDPRESS") ? "WORDPRESS" : "HTML/CSS",
            image,
            frameworks: Array.isArray(t.frameworks) && t.frameworks.length > 0
              ? t.frameworks.join(", ") : "",
            views: t.downloads ?? 0,
            price: t.price ?? 0,
            originalPrice: t.originalPrice ?? 0,
          };
        }));
      })
      .catch(() => setDemos([]));
  }, []);

  /* ── Sync: URL q param -> search state (e.g. navbar navigation, back/forward) ── */
  useEffect(() => {
    const qFromUrl = searchParams.get("q") || "";
    if (qFromUrl !== search) setSearch(qFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* ── Sync: search state -> URL q param ── */
  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (search.trim()) {
        params.set("q", search);
      } else {
        params.delete("q");
      }
      return params;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* ── Filter logic ── */
  let filtered = demos.filter((d) => {
    return (
      (category === "All"       || d.category === category) &&
      (tech     === "All"       || d.tech     === tech)     &&
      (tag      === "All"       || d.tag      === tag)      &&
      (type     === "All Types" || d.type     === type)     &&
      (d.title.toLowerCase().includes(search.toLowerCase()) ||
       d.category.toLowerCase().includes(search.toLowerCase()))
    );
  });

  /* ── Sort logic ── */
  if (sort === "Most Viewed") filtered = [...filtered].sort((a, b) => b.views - a.views);
  if (sort === "A – Z")       filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  const clearAll = () => {
    setCategory("All"); setTech("All"); setTag("All");
    setType("All Types"); setSort("Latest"); setSearch("");
  };
  const hasActiveFilters = category !== "All" || tech !== "All" || tag !== "All" || type !== "All Types" || search;

  /* ── Count helpers ── */
  const countFor = (field, val) => demos.filter(d => d[field] === val).length;

  /* ── Dynamic filter lists — derived straight from real demo data ── */
  const ALL_CATEGORIES = ["All", ...new Set(demos.map(d => d.category).filter(Boolean))];
  const ALL_TECH       = ["All", ...new Set(demos.map(d => d.tech).filter(Boolean))];
  const ALL_TAGS       = ["All", ...new Set(demos.map(d => d.tag).filter(Boolean))];

  return (

    <section className="py-12 sm:py-12 md:py-20 bg-[var(--color5)] min-h-screen">
      <SEOHead
      title={search ? `${search} - Demo Templates` : "Demo Showcase - Live Template Previews"}
      description={
      search
      ? `Browse live demo previews matching "${search}". Explore ${filtered.length} templates with real interactions and layouts.`
      : "Browse live previews of 1000+ free and premium HTML, React, Vue, and WordPress templates. See real interactions and layouts before you download."
      }
      url={`${import.meta.env.VITE_SITE_URL || window.location.origin}/demos`}
      noindex={!!search}
      />
      <div className="w-width">

        {/* Breadcrumb */}
        <BreadCrumb_Nav items={[{ label: "Home", path: "/" }, { label: "Demos", path: "/demos" }]} />

        {/* ══════════════════════════════════
            HERO HEADER
        ══════════════════════════════════ */}
        <div className="mt-6 sm:mt-8 mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

            {/* Left: title */}
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-0.5 rounded-full bg-[var(--color6)] opacity-40 inline-block"></span>
                <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">
                  Live Previews
                </span>
              </div>
              <h1 className="fontStyle3 font-bold text-[var(--color6)] leading-tight mb-3">
                Demo Showcase
              </h1>
              <p className="fontStyle8 text-[var(--color4)] leading-relaxed">
                Browse live previews of every template before you download. See real interactions, real layouts, real results.
              </p>
            </div>

            {/* Right: stat pills */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap lg:flex-nowrap">
              {[
                { icon: "bx-layer",     val: "1045+", lbl: "Templates"  },
                { icon: "bx-category",  val: "20+",   lbl: "Categories" },
                { icon: "bx-gift",      val: "100%",  lbl: "Free Access" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)]"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-color3">
                    <i className={`bx ${s.icon} text-white text-base`}></i>
                  </div>
                  <div>
                    <p className="fontStyle8 font-bold text-[var(--color6)] leading-none">{s.val}</p>
                    <p className="fontStyle10 text-[var(--color4)] mt-0.5">{s.lbl}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════
            FILTERS SECTION
        ══════════════════════════════════ */}
        <div className="mb-7 sm:mb-9 space-y-3">

          {/* Row 1 — Search + Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Search */}
            <div className="relative flex-1">
              <i className="bx bx-search absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color4)] text-base pointer-events-none"></i>
              <input
                type="text"
                placeholder="Search demos…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/35 transition-colors duration-200"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)]">
                  <i className="bx bx-x text-lg"></i>
                </button>
              )}
            </div>

            {/* Results badge */}
            <span className="flex-shrink-0 fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-2 rounded-xl min-w-[2.5rem] text-center">
              {filtered.length}
            </span>

            {/* Sort — hidden on very small, visible sm+ */}
            <div className="relative hidden sm:block flex-shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none cursor-pointer focus:border-[var(--color6)]/35 transition-colors duration-200"
              >
                {SORT_OPTIONS.map(o => <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>)}
              </select>
              <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
            </div>

            {/* Type filter — hidden small, visible md+ */}
            <div className="relative hidden md:block flex-shrink-0">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none cursor-pointer focus:border-[var(--color6)]/35 transition-colors duration-200"
              >
                {ALL_TYPES.map(o => <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>)}
              </select>
              <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
            </div>

            {/* Grid / List toggle */}
            <div className="flex-shrink-0 flex items-center gap-1 p-1 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)]">
              {[["grid", "bx-grid-alt"], ["list", "bx-list-ul"]].map(([m, icon]) => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    viewMode === m ? "bg-[var(--color6)] text-[var(--color5)]" : "text-[var(--color4)] hover:text-[var(--color6)]"
                  }`}
                >
                  <i className={`bx ${icon} text-base`}></i>
                </button>
              ))}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setFiltersOpen(p => !p)}
              className={`flex-shrink-0 sm:hidden w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                hasActiveFilters
                  ? "bg-[var(--color6)] text-[var(--color5)] border-transparent"
                  : "border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color4)]"
              }`}
            >
              <i className="bx bx-filter-alt text-base"></i>
            </button>
          </div>

          {/* Row 2 — Category horizontal scroll */}
          <div ref={catScrollRef} className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            {ALL_CATEGORIES.map(cat => (
              <Pill
                key={cat}
                label={cat}
                active={category === cat}
                onClick={() => setCategory(cat)}
                count={cat !== "All" ? countFor("category", cat) : undefined}
              />
            ))}
          </div>

          {/* Row 3 — Tech + Tag pills — desktop always visible, mobile collapsible */}
          <div className={`${filtersOpen ? "flex" : "hidden sm:flex"} items-center gap-2 flex-wrap`}>
            <div className="flex items-center gap-2 flex-wrap">
              {ALL_TECH.map(t => (
                <Pill
                  key={t}
                  label={t === "All" ? "All Tech" : t}
                  active={tech === t}
                  onClick={() => setTech(t)}
                  count={t !== "All" ? countFor("tech", t) : undefined}
                />
              ))}
            </div>

            <span className="w-px h-5 bg-[var(--color6)]/10 hidden sm:block"></span>

            <div className="flex items-center gap-2 flex-wrap">
              {ALL_TAGS.map(t => (
                <Pill
                  key={t}
                  label={t === "All" ? "Any Tag" : t}
                  active={tag === t}
                  onClick={() => setTag(t)}
                  count={t !== "All" ? countFor("tag", t) : undefined}
                />
              ))}
            </div>

            {/* Mobile: sort + type selects inside expanded panel */}
            <div className="flex items-center gap-2 sm:hidden w-full">
              <div className="relative flex-1">
                <select value={sort} onChange={(e) => setSort(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none">
                  {SORT_OPTIONS.map(o => <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>)}
                </select>
                <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
              </div>
              <div className="relative flex-1">
                <select value={type} onChange={(e) => setType(e.target.value)}
                  className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none">
                  {ALL_TYPES.map(o => <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>)}
                </select>
                <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 fontStyle9 text-[var(--color4)] hover:text-[var(--color6)] transition-colors duration-200 px-2 py-1"
              >
                <i className="bx bx-x-circle text-sm"></i>
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════
            RESULTS HEADER ROW
        ══════════════════════════════════ */}
        <div className="flex items-center justify-between mb-5">
          <p className="fontStyle9 text-[var(--color4)]">
            Showing <strong className="text-[var(--color6)]">{filtered.length}</strong> demo{filtered.length !== 1 ? "s" : ""}
            {category !== "All" && <> in <strong className="text-[var(--color6)]">{category}</strong></>}
          </p>
          {hasActiveFilters && (
            <button onClick={clearAll} className="fontStyle10 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex items-center gap-1">
              <i className="bx bx-refresh text-sm"></i> Reset
            </button>
          )}
        </div>

        {/* ══════════════════════════════════
            DEMO CONTENT
        ══════════════════════════════════ */}
        {filtered.length > 0 ? (
          <>
            {/* ── GRID VIEW ── */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {filtered.map((demo) => (
                  <div
                    key={demo.id}
                    className="group border-[2px] border-[var(--color6)] rounded-2xl overflow-hidden bg-[var(--color11)] cursor-pointer
                      shadow-[6px_6px_0px_var(--color6)] hover:shadow-[2px_2px_0px_var(--color6)]
                      hover:border-[var(--color6)]/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Image wrapper */}
                    <div className="relative overflow-hidden bg-[var(--color1)] aspect-[13/9]">
                      {demo.image && (
                        <img
                          src={demo.image}
                          alt={demo.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}

                      {/* Top badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <TagBadge tag={demo.tag} />
                        <span className="fontStyle10 font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                          <i className="bx bx-show text-xs"></i>
                          {demo.views}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 px-4">
                        <Link
                         to={`/template/${demo.id}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl fontStyle8 font-bold bg-white text-[#0f172a] hover:bg-white/90 transition-colors duration-150 translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          <i className="bx bx-play-circle text-lg"></i>
                          Live Preview
                        </Link>
                        <Link
                          to={`/template/${demo.id}`}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl fontStyle8 font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors duration-150 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
                        >
                          <i className="bx bx-info-circle text-base"></i>
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-3 sm:p-4">
                      {demo.frameworks && (
                        <span className="fontStyle10 d-block text-[var(--color5)] p-1 px-3 rounded-full bg-color3 text-xs sm:text-sm mb-2">{demo.frameworks}</span>
                      )}
                      <div className="flex items-start justify-between align-center gap-2 mb-2.5 mt-4">
                        <h3 className="fontStyle7 font-bold text-[var(--color6)] leading-snug">
                          <Link to={`/templates/${demo.id}`} className="hover:text-[var(--color4)] transition-colors duration-200">
                            {demo.title}
                          </Link>
                        </h3>
                        {/* {demo.tech && <TechBadge tech={demo.tech} />} */}
                        <div className="flex items-center gap-1.5 mb-2.5">
                          {demo.price > 0 ? (
                            <>
                              {demo.originalPrice > demo.price && (
                                <span className="fontStyle10 text-[var(--color4)] line-through">
                                  ${demo.originalPrice}
                                </span>
                              )}
                              <span className="fontStyle7 font-bold text-[var(--color6)]">
                                ${demo.price}
                              </span>
                            </>
                          ) : (
                            <span className="fontStyle7 font-bold text-[var(--color6)]">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--color6)]/8">
                        <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
                          <i className="bx bx-folder-open text-sm"></i>
                          {demo.category}
                        </span>
                        <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
                          <i className="bx bx-layer text-sm"></i>
                          {demo.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── LIST VIEW ── */}
            {viewMode === "list" && (
              <div className="space-y-2.5">
                {filtered.map((demo) => (
                  <div
                    key={demo.id}
                    className="group flex items-center gap-3 sm:gap-4 border border-[var(--color6)]/12 rounded-2xl bg-[var(--color11)] p-3 sm:p-4
                      hover:border-[var(--color6)]/30 hover:bg-[var(--color11)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.06)]
                      transition-all duration-200"
                  >
                    {/* Thumbnail */}
                    <Link to={`/templates/${demo.id}`} className="flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color1)] block w-[clamp(80px,18vw,130px)] aspect-[13/9]">
                      {demo.image && (
                        <img src={demo.image} alt={demo.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                    </Link>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <TagBadge tag={demo.tag} />
                        {demo.tech && <TechBadge tech={demo.frameworks} />}
                        <span className="flex items-center gap-1.5">
                          {demo.price > 0 ? (
                            <>
                              {demo.originalPrice > demo.price && (
                                <span className="fontStyle10 text-[var(--color4)] line-through">
                                  ${demo.originalPrice}
                                </span>
                              )}
                              <span className="fontStyle7 font-bold text-[var(--color6)]">
                                ${demo.price}
                              </span>
                            </>
                          ) : (
                            <span className="fontStyle7 font-bold text-[var(--color6)]">
                              Free
                            </span>
                          )}
                        </span>
                      </div>
                      <h3 className="fontStyle7 font-bold text-[var(--color6)] truncate mb-1">
                        <Link to={`/templates/${demo.id}`} className="hover:text-[var(--color4)] transition-colors duration-200">
                          {demo.title}
                        </Link>
                      </h3>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1">
                          <i className="bx bx-folder-open text-xs"></i>{demo.category}
                        </span>
                        <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1 hidden xs:flex">
                          <i className="bx bx-layer text-xs"></i>{demo.type}
                        </span>
                        <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1">
                          <i className="bx bx-show text-xs"></i>{demo.views} views
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Link
                        to={`/template/${demo.id}`}
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200"
                      >
                        <i className="bx bx-play-circle text-sm"></i>
                        Preview
                      </Link>
                      {/* Mobile: icon only */}
                      <Link
                        to={`/template/${demo.id}`}
                        className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200"
                      >
                        <i className="bx bx-play-circle text-base"></i>
                      </Link>
                      <Link
                        to={`/templates/${demo.id}`}
                        className="w-9 h-9 rounded-xl border border-[var(--color6)]/15 flex items-center justify-center text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] transition-all duration-200"
                      >
                        <i className="bx bx-link-external text-base"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ══════════════════════════════════
                BOTTOM CTA
            ══════════════════════════════════ */}
            <div className="mt-14 sm:mt-16 rounded-2xl overflow-hidden relative bg-color2">
              {/* Glow blobs */}
              <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20 pointer-events-none glow-gold" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-20 pointer-events-none glow-orange" />

              <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 flex flex-col md:flex-row md:items-center justify-between gap-7">
                <div className="max-w-md">
                  <span className="fontStyle10 font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-4 bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.65)]">
                    Start Building Today
                  </span>
                  <h2 className="fontStyle4 font-bold text-white mb-3 leading-tight">
                    Like what you see?
                  </h2>
                  <p className="fontStyle8 leading-relaxed text-[rgba(255,255,255,0.55)]">
                    Every template is free to download. No account required — pick your favourite and launch today.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
                  <Link
                    to="/templates"
                    className="fontStyle8 font-bold px-7 py-3.5 rounded-xl text-center text-[#0f172a] hover:opacity-90 transition-opacity duration-200 bg-color3"
                  >
                    Browse Templates
                  </Link>
                  <Link
                    to="/signup"
                    className="fontStyle8 font-semibold px-7 py-3.5 rounded-xl text-center text-white hover:bg-white/12 transition-colors duration-200 border border-[rgba(255,255,255,0.2)]"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ══════════════════════════════════
              EMPTY STATE
          ══════════════════════════════════ */
          <div className="py-20 sm:py-28 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-[var(--color11)] border-2 border-dashed border-[var(--color4)] opacity-60">
              <i className="bx bx-search-alt text-3xl text-[var(--color4)]"></i>
            </div>
            <h3 className="fontStyle5 font-bold text-[var(--color6)] mb-2">No demos found</h3>
            <p className="fontStyle8 text-[var(--color4)] mb-8 max-w-xs">
              Try adjusting your filters or searching with different keywords.
            </p>
            <button
              onClick={clearAll}
              className="fontStyle8 font-bold px-7 py-3 rounded-xl bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200 flex items-center gap-2"
            >
              <i className="bx bx-refresh text-base"></i>
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}