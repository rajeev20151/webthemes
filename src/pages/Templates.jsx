import { Link } from "react-router-dom";
import { useState } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";

const templates = [
  {
    id: 1,
    title: "Aupale Vodka",
    category: "E-Commerce",
    type: "Multi Page",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    code: "#DT-L35DBW",
    views: 43,
    tech: "WORDPRESS",
  },
  {
    id: 2,
    title: "Bloom Studio",
    category: "Portfolio",
    type: "One Page",
    tag: "FREE",
    image: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=800&h=600&fit=crop",
    code: "#DT-GI0DFU",
    views: 21,
    tech: "HTML/CSS",
  },
  {
    id: 3,
    title: "NovaTech Agency",
    category: "Agency",
    type: "Multi Page",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    code: "#DT-GITJQ2",
    views: 13,
    tech: "WORDPRESS",
  },
  {
    id: 4,
    title: "Lumina SaaS",
    category: "SaaS",
    type: "Landing Page",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    code: "#DT-GM9T8Y",
    views: 5,
    tech: "HTML/CSS",
  },
  {
    id: 5,
    title: "Verde Foods",
    category: "Restaurant",
    type: "One Page",
    tag: "FREE",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    code: "#DT-OPDM33",
    views: 13,
    tech: "WORDPRESS",
  },
  {
    id: 6,
    title: "Arcane Fashion",
    category: "Fashion",
    type: "Multi Page",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop",
    code: "#DT-J8FI7W",
    views: 0,
    tech: "WORDPRESS",
  },
];

const typeOptions = ["All Types", "Landing Page", "Multi Page", "One Page"];
const industryOptions = ["All Industries", "Agency", "Portfolio", "E-Commerce", "SaaS", "Restaurant", "Fashion"];
const sortOptions = ["Latest", "Oldest", "Most Popular"];

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

export default function Templates() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [sortBy, setSortBy] = useState("Latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pendingType, setPendingType] = useState("All Types");
  const [pendingIndustry, setPendingIndustry] = useState("All Industries");
  const [pendingSort, setPendingSort] = useState("Latest");

  const filteredTemplates = templates.filter((t) => {
    const q = search.toLowerCase();
    const matchesSearch = t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    const matchesIndustry = selectedIndustry === "All Industries" || t.category === selectedIndustry;
    const matchesType = selectedType === "All Types" || t.type === selectedType;
    return matchesSearch && matchesIndustry && matchesType;
  });

  function applyFilters() {
    setSelectedType(pendingType);
    setSelectedIndustry(pendingIndustry);
    setSortBy(pendingSort);
    setCurrentPage(1);
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
  }

  const totalPages = 88;
  const pageNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <section className="py-16 bg-[var(--color5)] min-h-screen">
      <div className="w-width">
        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Templates", path: "/templates" },
          ]}
        />

        <div className="flex gap-8 items-start mt-6">

          {/* -------- LEFT SIDEBAR FILTERS -------- */}
          <div className="w-72 flex-shrink-0 bg-[var(--color11)] border border-[var(--color6)]/10 rounded-2xl p-7 sticky top-6">

            {/* Filters Title */}
            <div className="flex items-center gap-3 mb-7">
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
                onChange={(e) => setSearch(e.target.value)}
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

            {/* Apply Filters Button */}
            <button
              onClick={applyFilters}
              className="w-full py-3 rounded-xl fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200 mb-3"
            >
              Apply Filters
            </button>

            {/* Clear All Button */}
            <button
              onClick={clearAll}
              className="w-full py-3 rounded-xl fontStyle9 font-semibold text-[var(--color4)] bg-[var(--color11)] border border-[var(--color6)]/15 hover:text-[var(--color6)] hover:border-[var(--color6)]/30 transition-all duration-200"
            >
              Clear All
            </button>
          </div>

          {/* -------- RIGHT CONTENT -------- */}
          <div className="flex-1 min-w-0">

            {/* Results Header */}
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <h2 className="fontStyle5 font-bold text-[var(--color6)]">Results</h2>
                <span className="fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-0.5 rounded-full">
                  {filteredTemplates.length}
                </span>
              </div>
              <span className="fontStyle9 text-[var(--color4)]">
                Page <strong className="text-[var(--color6)]">{currentPage}</strong> of{" "}
                <strong className="text-[var(--color6)]">{totalPages}</strong>
              </span>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="group
                    border-[2px] border-[var(--color6)] rounded-2xl
                    shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] transition-all duration-300
                    bg-[var(--color11)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--color6)]/35 hover:-translate-y-1 transition-all duration-300"
                    >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-[var(--color1)]" style={{ aspectRatio: "13/10" }}>
                      <img
                        src={template.image}
                        alt={template.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <Link
                          to="#"
                          className="w-11 h-11 bg-[var(--color5)] rounded-full flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 translate-y-3 group-hover:translate-y-0"
                        >
                          <i className="bx bx-link-external text-lg"></i>
                        </Link>
                        <Link
                          to="#"
                          className="w-11 h-11 bg-[var(--color5)] rounded-full flex items-center justify-center text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 translate-y-3 group-hover:translate-y-0 delay-75"
                        >
                          <i className="bx bx-heart text-lg"></i>
                        </Link>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <TechBadge tech={template.tech} />

                      <h3 className="fontStyle7 font-bold text-[var(--color6)] my-4">
                        <Link to="#" className="hover:text-[var(--color4)] transition-colors duration-200">
                          {template.title}
                        </Link>
                      </h3>

                      {/* Footer row */}
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
                <div className="col-span-3 text-center py-20 fontStyle8 text-[var(--color4)]">
                  No templates found for{" "}
                  <span className="font-semibold text-[var(--color6)]">"{search}"</span>
                </div>
              )}
            </div>

            {/* -------- Pagination -------- */}
            {filteredTemplates.length > 0 && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-1.5 flex-wrap justify-center">

                  {/* Prev */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 rounded-full border border-[var(--color6)]/15 bg-[var(--color11)] flex items-center justify-center transition-all duration-200
                      ${currentPage === 1
                        ? "text-[var(--color4)] opacity-40 cursor-not-allowed"
                        : "text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] cursor-pointer"
                      }`}
                  >
                    <i className="bx bx-chevron-left text-base"></i>
                  </button>

                  {/* Page Numbers */}
                  {pageNumbers.map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded-full fontStyle9 font-semibold flex items-center justify-center transition-all duration-200
                        ${currentPage === p
                          ? "bg-[var(--color6)] text-[var(--color5)]"
                          : "border border-[var(--color6)]/15 bg-[var(--color11)] text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)]"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  <span className="fontStyle9 text-[var(--color4)] px-1">...</span>

                  {[87, 88].map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 rounded-full fontStyle9 font-semibold flex items-center justify-center transition-all duration-200
                        ${currentPage === p
                          ? "bg-[var(--color6)] text-[var(--color5)]"
                          : "border border-[var(--color6)]/15 bg-[var(--color11)] text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)]"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 rounded-full border border-[var(--color6)]/15 bg-[var(--color11)] flex items-center justify-center transition-all duration-200
                      ${currentPage === totalPages
                        ? "text-[var(--color4)] opacity-40 cursor-not-allowed"
                        : "text-[var(--color4)] hover:border-[var(--color6)]/40 hover:text-[var(--color6)] cursor-pointer"
                      }`}
                  >
                    <i className="bx bx-chevron-right text-base"></i>
                  </button>
                </div>

                <span className="fontStyle9 text-[var(--color4)]">
                  Showing <strong className="text-[var(--color6)]">1–12</strong> of{" "}
                  <strong className="text-[var(--color6)]">1045</strong> themes
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}