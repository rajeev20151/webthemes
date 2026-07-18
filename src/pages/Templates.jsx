import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { getTemplateReviewsAPI, getTemplateChatsAPI, createTemplateChatAPI, deleteTemplateChatAPI, getTemplateAPI, getTemplatesAPI, API_BASE } from "../services/api";

const typeOptions = ["All Types", "Landing Page", "Multi Page", "One Page"];
const industryOptions = ["All Industries", "Agency", "Portfolio", "E-Commerce", "SaaS", "Restaurant", "Fashion"];
const sortOptions = ["Latest", "Oldest", "Most Popular"];
const ITEMS_PER_PAGE = 12;

/* ── Tech Badge ── */
function TechBadge({ tech }) {
  const isWP = tech === "WORDPRESS";
  return (
    <span
      className="fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full border inline-block"
      style={
        isWP
          ? { background: "rgba(var(--color6-rgb,0,0,0),0.08)", color: "var(--color6)", borderColor: "rgba(var(--color6-rgb,0,0,0),0.18)" }
          : { background: "rgba(253,200,48,0.1)", color: "#f37335", borderColor: "rgba(243,115,53,0.25)" }
      }
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
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--color6)]/15 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none cursor-pointer appearance-none focus:border-[var(--color6)]/40 transition-colors duration-200"
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
  const origin = API_BASE.replace(/\/api$/, "");

  const rawImage = Array.isArray(t.images) && t.images.length > 0 ? t.images[0] : null;
  const image = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${origin}${rawImage}`
    : "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop";

  const framework =
    Array.isArray(t.frameworks) && t.frameworks.length > 0
      ? t.frameworks[0].toUpperCase()
      : "";
  const tech = framework.includes("WORDPRESS") ? "WORDPRESS" : "";

  return {
    id: t._id,
    title: t.name || "Untitled",
    category: t.category || t.subtitle || "General",
    type: t.tag || "Multi Page",
    tag: t.price === 0 ? "FREE" : "PRO",
    image,
    code: `#DT-${t._id?.slice(-6).toUpperCase()}`,
    views: t.downloads ?? 0,
    tech,
    frameworks: Array.isArray(t.frameworks) ? t.frameworks : [],
    price: t.price ?? 0,
    originalPrice: t.originalPrice ?? 0,
  };
}

/* ── Build a compact page list with ellipses ── */
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
      if (i - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (i - last > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
}

export default function Templates() {
  const [searchParams] = useSearchParams();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pre-fill search from ?q= URL param
  const [search, setSearch] = useState(() => searchParams.get("q") || "");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingType, setPendingType] = useState("All Types");
  const [pendingIndustry, setPendingIndustry] = useState("All Industries");
  const [pendingSort, setPendingSort] = useState("Latest");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync search state when URL param changes (e.g. new search from navbar)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    getTemplatesAPI()
      .then((data) => {
        const raw = Array.isArray(data) ? data : data.templates ?? [];
        setTemplates(raw.map(mapTemplate));
      })
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    const matchesIndustry = selectedIndustry === "All Industries" || t.category === selectedIndustry;
    const matchesType = selectedType === "All Types" || t.type === selectedType;
    return matchesSearch && matchesIndustry && matchesType;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE));

  // Keep currentPage valid whenever the filtered result set shrinks/grows
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTemplates = filteredTemplates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  function applyFilters() {
    setSelectedType(pendingType);
    setSelectedIndustry(pendingIndustry);
    setSortBy(pendingSort);
    setCurrentPage(1);
    setSidebarOpen(false);
  }

  function clearAll() {
    setPendingType("All Types");
    setPendingIndustry("All Industries");
    setPendingSort("Latest");
    setSelectedType("All Types");
    setSelectedIndustry("All Industries");
    setSortBy("Latest");
    setSearch("");
    setCurrentPage(1);
    setSidebarOpen(false);
  }

  return (
    <section className="py-12 sm:py-14 md:py-20 bg-[var(--color5)] min-h-screen">
      <SEOHead
        title="Templates - Browse Free & Premium Themes"
        description="Browse and download free and premium responsive templates. Filter by category, framework, and type. HTML, React, WordPress templates available."
      />
      <div className="w-width">
        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Templates", path: "/templates" },
          ]}
        />

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center justify-between mt-4 mb-2 lg:hidden">
          <h2 className="fontStyle5 font-bold text-[var(--color6)]">Templates</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color6)]/20 bg-[var(--color11)] text-[var(--color6)] fontStyle9 font-semibold"
          >
            <i className="bx bx-filter-alt text-base"></i>
            Filters
          </button>
        </div>

        <div className="flex gap-6 lg:gap-8 items-start mt-4 sm:mt-6">

          {/* -------- LEFT SIDEBAR FILTERS -------- */}
          <>
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/60 z-[998] lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <div
              className={`
                fixed top-0 right-0 h-screen z-[999] overflow-y-auto
                w-[280px] bg-[var(--color5)] border-l border-[var(--color6)]/15 p-6
                transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "translate-x-full"}
                lg:translate-x-0 lg:h-auto lg:overflow-visible lg:right-auto
                lg:flex-shrink-0 lg:w-72 lg:bg-[var(--color11)] lg:rounded-2xl lg:border lg:border-[var(--color6)]/10 lg:p-7 lg:sticky lg:top-6
              `}
            >
              {/* Mobile close button */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)]">Filters</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full border border-[var(--color6)]/20 flex items-center justify-center text-[var(--color4)] hover:text-[var(--color6)]"
                >
                  <i className="bx bx-x text-xl"></i>
                </button>
              </div>

              {/* Filters Title - Desktop only */}
              <div className="hidden lg:flex items-center gap-3 mb-7">
                <span className="w-7 h-0.5 bg-[var(--color6)] inline-block rounded-full opacity-70"></span>
                <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)]">
                  Filters
                </span>
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="fontStyle10 font-semibold uppercase tracking-widest text-[var(--color4)] block mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Theme title..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-[var(--color6)]/15 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/40 transition-colors duration-200"
                />
              </div>

              <SelectField
                label="Category"
                options={industryOptions}
                selected={pendingIndustry}
                onSelect={setPendingIndustry}
              />
              <SelectField
                label="Theme Type"
                options={typeOptions}
                selected={pendingType}
                onSelect={setPendingType}
              />
              <SelectField
                label="Sort By"
                options={sortOptions}
                selected={pendingSort}
                onSelect={setPendingSort}
              />

              <button
                onClick={applyFilters}
                className="w-full py-3 rounded-xl fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200 mb-3"
              >
                Apply Filters
              </button>
              <button
                onClick={clearAll}
                className="w-full py-3 rounded-xl fontStyle9 font-semibold text-[var(--color4)] bg-[var(--color11)] border border-[var(--color6)]/15 hover:text-[var(--color6)] hover:border-[var(--color6)]/30 transition-all duration-200"
              >
                Clear All
              </button>
            </div>
          </>

          {/* -------- RIGHT CONTENT -------- */}
          <div className="flex-1 min-w-0">

            {/* Results Header */}
            <div className="flex items-center justify-between mb-5 sm:mb-7">
              <div className="flex items-center gap-2 sm:gap-3">
                <h2 className="fontStyle5 font-bold text-[var(--color6)] hidden lg:block">Results</h2>
                <span className="fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-0.5 rounded-full">
                  {filteredTemplates.length}
                </span>
              </div>
              <span className="fontStyle9 text-[var(--color4)] text-sm sm:text-base">
                Page <strong className="text-[var(--color6)]">{currentPage}</strong> of{" "}
                <strong className="text-[var(--color6)]">{totalPages}</strong>
              </span>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="text-center py-16 fontStyle8 text-[var(--color4)]">
                Loading templates…
              </div>
            )}

            {/* Template Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-12">
                {paginatedTemplates.length > 0 ? (
                  paginatedTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group border-[2px] border-[var(--color6)] rounded-2xl
                      shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
                      hover:shadow-[3px_3px_0px_var(--color6)]
                      bg-[var(--color11)] overflow-hidden cursor-pointer
                      hover:border-[var(--color6)]/35 hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Image */}
                    <div
                    className="relative overflow-hidden bg-[var(--color1)]"style={{ aspectRatio: "13/10" }}>
                    <img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Tech Badge */}
                    <div className="absolute top-3 left-3 z-20">
                    <TechBadge tech={template.tag} />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link
                    to={`/template/${template.id}`}
                    className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--color5)] rounded-full flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 translate-y-3 group-hover:translate-y-0"
                    >
                    <i className="bx bx-link-external text-lg"></i>
                    </Link>

                    <Link
                    to={`/template/${template.id}`}
                    className="w-10 h-10 sm:w-11 sm:h-11 bg-[var(--color5)] rounded-full flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 translate-y-3 group-hover:translate-y-0 delay-75"
                    >
                    <i className="bx bx-heart text-lg"></i>
                    </Link>
                    </div>
                    </div>

                      {/* Card Body */}
                      <div className="p-3 sm:p-4">
                      <span className="fontStyle10 d-block text-[var(--color5)] p-1 px-3 rounded-full bg-color3 text-xs sm:text-sm mr-2">{template.frameworks}</span>       
                      <div className="flex items-center justify-between gap-2 mt-3">
                      <h3 className="fontStyle8 font-bold text-[var(--color6)] mb-3 sm:mb-4">
                      <Link to={`/template/${template.id}`} className="hover:text-[var(--color4)] transition-colors duration-200">
                      {template.title}
                      </Link>
                      </h3>
                      <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
                      {template.price > 0 ? (
                      <>
                      {template.originalPrice > template.price && (
                      <span className="fontStyle10 text-[var(--color4)] line-through">
                      ${template.originalPrice}
                      </span>
                      )}
                      <span className="fontStyle7 font-bold text-[var(--color6)]">
                      ${template.price}
                      </span>
                      </>
                      ) : (
                      <span className="fontStyle7 font-bold text-[var(--color6)]">
                      Free
                      </span>
                      )}
                      </div>
                      </div>
                       
                        <div className="flex items-center justify-between pt-3 border-t border-[var(--color6)]/10">
                          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
                            <i className="bx bx-folder text-sm"></i>
                            {template.category}
                          </span>
                          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
                            <i className="bx bx-show text-sm"></i>
                            {template.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 sm:py-28 flex flex-col items-center text-center">
                    <div
                      className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
                      style={{ background: "var(--color11)", border: "2px dashed var(--color4)", opacity: 0.6 }}
                    >
                      <i className="bx bx-search-alt text-3xl text-[var(--color4)]"></i>
                    </div>
                    <h3 className="fontStyle5 font-bold text-[var(--color6)] mb-2">No templates found</h3>
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
            )}

            {/* -------- Pagination -------- */}
            {!loading && filteredTemplates.length > 0 && (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">

                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--color6)]/15 bg-[var(--color11)] flex items-center justify-center transition-all duration-200
                      ${currentPage === 1
                        ? "text-[var(--color4)] opacity-40 cursor-not-allowed"
                        : "text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] cursor-pointer"
                      }`}
                  >
                    <i className="bx bx-chevron-left text-base"></i>
                  </button>

                  {pageNumbers.map((p, idx) =>
                    p === "..." ? (
                      <span key={`dots-${idx}`} className="fontStyle9 text-[var(--color4)] px-0.5 sm:px-1">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full fontStyle9 font-semibold flex items-center justify-center transition-all duration-200 text-sm
                          ${currentPage === p
                            ? "bg-[var(--color6)] text-[var(--color5)]"
                            : "border border-[var(--color6)]/15 bg-[var(--color11)] text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)]"
                          }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[var(--color6)]/15 bg-[var(--color11)] flex items-center justify-center transition-all duration-200
                      ${currentPage === totalPages
                        ? "text-[var(--color4)] opacity-40 cursor-not-allowed"
                        : "text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] cursor-pointer"
                      }`}
                  >
                    <i className="bx bx-chevron-right text-base"></i>
                  </button>
                </div>

                <span className="fontStyle9 text-[var(--color4)] text-sm sm:text-base">
                  Showing{" "}
                  <strong className="text-[var(--color6)]">
                    {filteredTemplates.length === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredTemplates.length)}
                  </strong>{" "}
                  of <strong className="text-[var(--color6)]">{filteredTemplates.length}</strong> themes
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}