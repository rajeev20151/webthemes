import { useRef } from "react";
import Pill from "./Pill";

const ALL_TYPES = ["All Types", "Landing Page", "Multi Page", "One Page"];
const SORT_OPTIONS = ["Latest", "Most Viewed", "A – Z"];

export default function FilterBar({
  search, setSearch,
  sort, setSort,
  type, setType,
  category, setCategory,
  tech, setTech,
  tag, setTag,
  viewMode, setViewMode,
  filtersOpen, setFiltersOpen,
  hasActiveFilters, clearAll,
  ALL_CATEGORIES, ALL_TECH, ALL_TAGS,
  countFor, filtered
}) {
  const catScrollRef = useRef(null);

  return (
    <div className="mb-7 sm:mb-9 space-y-3">
      <div className="flex items-center gap-2 sm:gap-3">
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
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)]"
            >
              <i className="bx bx-x text-lg"></i>
            </button>
          )}
        </div>

        <span className="flex-shrink-0 fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-2 rounded-xl min-w-[2.5rem] text-center">
          {filtered.length}
        </span>

        <div className="relative hidden sm:block flex-shrink-0">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none cursor-pointer focus:border-[var(--color6)]/35 transition-colors duration-200"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>
            ))}
          </select>
          <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
        </div>

        <div className="relative hidden md:block flex-shrink-0">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none cursor-pointer focus:border-[var(--color6)]/35 transition-colors duration-200"
          >
            {ALL_TYPES.map((o) => (
              <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>
            ))}
          </select>
          <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1 p-1 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)]">
          {[
            ["grid", "bx-grid-alt"],
            ["list", "bx-list-ul"],
          ].map(([m, icon]) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                viewMode === m
                  ? "bg-[var(--color6)] text-[var(--color5)]"
                  : "text-[var(--color4)] hover:text-[var(--color6)]"
              }`}
            >
              <i className={`bx ${icon} text-base`}></i>
            </button>
          ))}
        </div>

        <button
          onClick={() => setFiltersOpen((p) => !p)}
          className={`flex-shrink-0 sm:hidden w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 ${
            hasActiveFilters
              ? "bg-[var(--color6)] text-[var(--color5)] border-transparent"
              : "border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color4)]"
          }`}
        >
          <i className="bx bx-filter-alt text-base"></i>
        </button>
      </div>

      <div
        ref={catScrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide"
      >
        {ALL_CATEGORIES.map((cat) => (
          <Pill
            key={cat}
            label={cat}
            active={category === cat}
            onClick={() => setCategory(cat)}
            count={cat !== "All" ? countFor("category", cat) : undefined}
          />
        ))}
      </div>

      <div className={`${filtersOpen ? "flex" : "hidden sm:flex"} items-center gap-2 flex-wrap`}>
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_TECH.map((t) => (
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
          {ALL_TAGS.map((t) => (
            <Pill
              key={t}
              label={t === "All" ? "Any Tag" : t}
              active={tag === t}
              onClick={() => setTag(t)}
              count={t !== "All" ? countFor("tag", t) : undefined}
            />
          ))}
        </div>

        <div className="flex items-center gap-2 sm:hidden w-full">
          <div className="relative flex-1">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>
              ))}
            </select>
            <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
          </div>
          <div className="relative flex-1">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-[var(--color6)]/12 bg-[var(--color11)] text-[var(--color6)] fontStyle9 outline-none appearance-none"
            >
              {ALL_TYPES.map((o) => (
                <option key={o} value={o} className="bg-[var(--color5)]">{o}</option>
              ))}
            </select>
            <i className="bx bx-chevron-down absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none text-sm"></i>
          </div>
        </div>

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
  );
}
