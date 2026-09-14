import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { useGetTemplatesQuery, API_URL } from "../store/apiSlice";

const CATEGORIES = [
  "All Industries", "Agency", "Portfolio", "E-Commerce", "SaaS", "Restaurant", "Fashion",
];
const TYPES = ["All Types", "Landing Page", "Multi Page", "One Page"];
const SORT_OPTIONS = ["Latest", "Oldest", "Most Popular"];
const ITEMS_PER_PAGE = 12;

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="border-2 border-[var(--color6)]/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-[var(--color6)]/5" style={{ aspectRatio: "13/10" }} />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-[var(--color6)]/5 rounded-full w-16" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-[var(--color6)]/5 rounded-full w-32" />
          <div className="h-4 bg-[var(--color6)]/5 rounded-full w-10" />
        </div>
        <div className="flex justify-between pt-3 border-t border-[var(--color6)]/5">
          <div className="h-3 bg-[var(--color6)]/5 rounded-full w-20" />
          <div className="h-3 bg-[var(--color6)]/5 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton Grid ── */
function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ── Tech Badge ── */
function TechBadge({ tech }) {
  const isWP = tech === "WORDPRESS";
  return (
    <span
      className={`fontStyle10 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block ${
        isWP
          ? "bg-[rgba(0,0,0,0.06)] text-[var(--color6)] border-[rgba(0,0,0,0.14)]"
          : "bg-[rgba(243,115,53,0.08)] text-[var(--color3)] border-[rgba(243,115,53,0.22)]"
      }`}
    >
      {tech}
    </span>
  );
}

/* ── Select Field ── */
function SelectField({ label, options, selected, onSelect }) {
  return (
    <div className="mb-5">
      <label className="fontStyle10 font-semibold uppercase tracking-widest text-[var(--color4)] block mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none cursor-pointer appearance-none focus:border-[var(--color6)]/35 transition-colors duration-200"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[var(--color5)] text-[var(--color6)]">
              {opt}
            </option>
          ))}
        </select>
        <i className="bx bx-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-base"></i>
      </div>
    </div>
  );
}

/* ── Map API template → UI shape ── */
function mapTemplate(t) {
  const origin = API_URL.replace(/\/api$/, "");
  const rawImage = Array.isArray(t.images) && t.images.length > 0 ? t.images[0] : null;
  const image = rawImage
    ? rawImage.startsWith("http") ? rawImage : `${origin}${rawImage}`
    : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop";

  const framework = Array.isArray(t.frameworks) && t.frameworks.length > 0
    ? t.frameworks[0].toUpperCase() : "";
  const tech = framework.includes("WORDPRESS") ? "WORDPRESS" : "";

  return {
    id: t._id,
    slug: t.slug,
    title: t.name || "Untitled",
    category: t.category || t.subtitle || "General",
    type: t.tag || "Multi Page",
    tag: t.price === 0 ? "FREE" : "PRO",
    image,
    code: `#DT-${t._id?.slice(-6).toUpperCase()}`,
    views: t.views ?? t.downloads ?? 0,
    tech,
    frameworks: Array.isArray(t.frameworks) ? t.frameworks : [],
    price: t.price ?? 0,
    originalPrice: t.originalPrice ?? 0,
  };
}

/* ── Page Numbers ── */
function getPageNumbers(current, total) {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let last;
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }
  for (const i of range) {
    if (last) {
      if (i - last === 2) rangeWithDots.push(last + 1);
      else if (i - last > 2) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    last = i;
  }
  return rangeWithDots;
}

/* ══════════════════════════════════════
   ── Main Templates Page ──
   ══════════════════════════════════════ */
export default function Templates() {
  const [searchParams] = useSearchParams();

  // Server-side filters
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All Industries");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Build query params
  const queryParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(selectedCategory !== "All Industries" && { category: selectedCategory }),
    ...(selectedType !== "All Types" && { tag: selectedType }),
    ...(sortBy === "Oldest" && { sort: "oldest" }),
    ...(sortBy === "Most Popular" && { sort: "popular" }),
  };

  const { data: responseData, isLoading: loading } = useGetTemplatesQuery(queryParams);
  const rawTemplates = responseData?.templates ?? [];
  const pagination = responseData?.pagination ?? { page: 1, totalPages: 1, total: 0 };
  const templates = rawTemplates.map(mapTemplate);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    setCurrentPage(1);
  }, [searchParams]);

  const pageNumbers = getPageNumbers(pagination.page, pagination.totalPages);

  function clearAll() {
    setSearch("");
    setSelectedCategory("All Industries");
    setSelectedType("All Types");
    setSortBy("Latest");
    setCurrentPage(1);
  }

  const hasActiveFilters = selectedType !== "All Types" || selectedCategory !== "All Industries" || search;

  return (
    <section className="py-12 sm:py-14 md:py-20 bg-[var(--color5)] min-h-screen">
      <SEOHead
        title="Templates - Browse Free & Premium Themes"
        description="Browse and download free and premium responsive templates. Filter by category, framework, and type."
      />
      <div className="w-width">
        <BreadCrumb_Nav items={[{ label: "Home", path: "/" }, { label: "Templates", path: "/templates" }]} />

        {/* ── Hero Header ── */}
        <div className="mt-6 sm:mt-8 mb-8 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-0.5 rounded-full bg-[var(--color6)] opacity-40 inline-block"></span>
                <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">Browse & Download</span>
              </div>
              <h1 className="fontStyle3 font-bold text-[var(--color6)] leading-tight mb-3">Templates</h1>
              <p className="fontStyle8 text-[var(--color4)] leading-relaxed">
                Find the perfect template for your next project. Filter by category, type, or search by name.
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap lg:flex-nowrap">
              {[
                { icon: "bx-layer", val: `${pagination.total}+`, lbl: "Templates" },
                { icon: "bx-category", val: "20+", lbl: "Categories" },
                { icon: "bx-gift", val: "100%", lbl: "Free Access" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)]">
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

        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <div className="flex items-center gap-3">
            <h2 className="fontStyle5 font-bold text-[var(--color6)]">Results</h2>
            <span className="fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-0.5 rounded-full">
              {pagination.total}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border fontStyle9 font-semibold transition-all duration-200 ${
              hasActiveFilters ? "bg-[var(--color6)] text-[var(--color5)] border-transparent" : "border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)]"
            }`}
          >
            <i className="bx bx-filter-alt text-base"></i> Filters
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8 mt-2 sm:mt-4">
          {/* ── LEFT SIDEBAR ── */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-[998] lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`
            fixed top-0 right-0 h-screen z-[999] overflow-y-auto w-[280px] bg-[var(--color5)] border-l border-[var(--color6)]/15 p-6 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
            lg:translate-x-0 lg:h-auto lg:overflow-y-auto lg:max-h-[calc(73vh)] lg:right-auto lg:flex-shrink-0 lg:w-72 lg:bg-[var(--color11)] lg:rounded-2xl lg:border lg:border-[var(--color6)]/10 lg:p-7 lg:sticky lg:top-6
          `}>
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)]">Filters</span>
              <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-full border border-[var(--color6)]/20 flex items-center justify-center text-[var(--color4)] hover:text-[var(--color6)]">
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-3 mb-7">
              <span className="w-7 h-0.5 bg-[var(--color6)] inline-block rounded-full opacity-70"></span>
              <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)]">Filters</span>
            </div>

            <div className="mb-5">
              <label className="fontStyle10 font-semibold uppercase tracking-widest text-[var(--color4)] block mb-2">Search</label>
              <div className="relative">
                <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color4)] text-base pointer-events-none"></i>
                <input
                  type="text"
                  placeholder="Theme title..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/35 transition-colors duration-200"
                />
              </div>
            </div>

            <SelectField label="Category" options={CATEGORIES} selected={selectedCategory} onSelect={(v) => { setSelectedCategory(v); setCurrentPage(1); }} />
            <SelectField label="Theme Type" options={TYPES} selected={selectedType} onSelect={(v) => { setSelectedType(v); setCurrentPage(1); }} />
            <SelectField label="Sort By" options={SORT_OPTIONS} selected={sortBy} onSelect={(v) => { setSortBy(v); setCurrentPage(1); }} />

            <button onClick={clearAll} className="w-full py-3 rounded-xl fontStyle9 font-semibold text-[var(--color5)] bg-[var(--color6)] border border-[var(--color6)]/15 hover:text-[var(--color5)] hover:border-[var(--color6)]/30 transition-all duration-200">
              Clear All
            </button>
          </div>

          {/* ── RIGHT CONTENT ── */}
          <div className="flex-1 min-w-0 self-start">
            <div className="hidden lg:flex items-center justify-between mb-5 sm:mb-7">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="fontStyle5 font-bold text-[var(--color6)]">Results</h2>
                <span className="fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-0.5 rounded-full">{pagination.total}</span>
              </div>
              <span className="fontStyle9 text-[var(--color4)]">
                Page <strong className="text-[var(--color6)]">{pagination.page}</strong> of <strong className="text-[var(--color6)]">{pagination.totalPages}</strong>
              </span>
            </div>

            {/* Loading Skeleton */}
            {loading && <SkeletonGrid count={ITEMS_PER_PAGE} />}

            {/* Template Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-12">
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <div
                      key={template.id}
                      className="group border-[2px] border-[var(--color6)] rounded-2xl shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] bg-[var(--color11)] overflow-hidden cursor-pointer hover:border-[var(--color6)]/35 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div
                      className="relative overflow-hidden bg-[var(--color1)] "
                      style={{ aspectRatio: "13/10" }}
                      >
                      <img
                      src={template.image}
                      alt={template.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute top-3 left-3 z-20">
                      <TechBadge tech={template.tag} />
                      </div>

                      <div className="absolute top-3 right-3 z-20">
                      <span className="fontStyle10 font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
                      <i className="bx bx-show text-xs"></i>
                      {template.views}
                      </span>
                      </div>

                      <div className="absolute inset-0 z-10 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <Link
                      to={`/template/${template.slug}`}
                      className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--color5)] rounded-full flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 translate-y-3 group-hover:translate-y-0"
                      >
                      <i className="bx bx-link-external text-lg"></i>
                      </Link>

                      <Link
                      to={`/template/${template.slug}`}
                      className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--color5)] rounded-full flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 translate-y-3 group-hover:translate-y-0 delay-75"
                      >
                      <i className="bx bx-heart text-lg"></i>
                      </Link>
                      </div>
                      </div>

                      <div className="p-3 sm:p-4">
                        {template.frameworks.length > 0 && (
                          <span className="fontStyle10 text-[var(--color5)] p-1 px-3 rounded-full bg-color3 text-xs sm:text-sm inline-block mb-2">
                            {template.frameworks.join(", ")}
                          </span>
                        )}
                        <div className="flex items-center justify-between gap-2 mt-2">
                          <h3 className="fontStyle8 font-bold text-[var(--color6)] truncate">
                            <Link to={`/template/${template.slug}`} className="hover:text-[var(--color4)] transition-colors duration-200">{template.title}</Link>
                          </h3>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {template.price > 0 ? (
                              <>
                                {template.originalPrice > template.price && (
                                  <span className="fontStyle10 text-[var(--color4)] line-through">${template.originalPrice}</span>
                                )}
                                <span className="fontStyle7 font-bold text-[var(--color6)]">${template.price}</span>
                              </>
                            ) : (
                              <span className="fontStyle7 font-bold text-[var(--color6)]">Free</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-[var(--color6)]/10">
                          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
                            <i className="bx bx-folder text-sm"></i>{template.category}
                          </span>
                          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
                            <i className="bx bx-code text-sm"></i>{template.code}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 sm:py-28 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-[var(--color11)] border-2 border-dashed border-[var(--color4)] opacity-60">
                      <i className="bx bx-search-alt text-3xl text-[var(--color4)]"></i>
                    </div>
                    <h3 className="fontStyle5 font-bold text-[var(--color6)] mb-2">No templates found</h3>
                    <p className="fontStyle8 text-[var(--color4)] mb-8 max-w-xs">Try adjusting your filters or searching with different keywords.</p>
                    <button onClick={clearAll} className="fontStyle8 font-bold px-7 py-3 rounded-xl bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200 flex items-center gap-2">
                      <i className="bx bx-refresh text-base"></i> Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Pagination ── */}
            {!loading && pagination.total > 0 && (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--color6)]/15 bg-[var(--color11)] flex items-center justify-center transition-all duration-200 ${currentPage === 1 ? "text-[var(--color4)] opacity-40 cursor-not-allowed" : "text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] cursor-pointer"}`}
                  >
                    <i className="bx bx-chevron-left text-base"></i>
                  </button>

                  {pageNumbers.map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="fontStyle9 text-[var(--color4)] px-0.5 sm:px-1">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full fontStyle9 font-semibold flex items-center justify-center transition-all duration-200 text-sm ${currentPage === p ? "bg-[var(--color6)] text-[var(--color5)]" : "border border-[var(--color6)]/15 bg-[var(--color11)] text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)]"}`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={currentPage === pagination.totalPages}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--color6)]/15 bg-[var(--color11)] flex items-center justify-center transition-all duration-200 ${currentPage === pagination.totalPages ? "text-[var(--color4)] opacity-40 cursor-not-allowed" : "text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] cursor-pointer"}`}
                  >
                    <i className="bx bx-chevron-right text-base"></i>
                  </button>
                </div>

                <span className="fontStyle9 text-[var(--color4)]">
                  Showing <strong className="text-[var(--color6)]">{(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)}</strong> of <strong className="text-[var(--color6)]">{pagination.total}</strong> templates
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
