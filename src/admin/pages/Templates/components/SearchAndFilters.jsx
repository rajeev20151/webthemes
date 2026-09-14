import { IconSearch, IconFilter, inputCls, labelCls } from "./constants.jsx";

export default function SearchAndFilters({
  search, setSearch, showFilters, setShowFilters,
  filterCategory, setFilterCategory, filterTag, setFilterTag,
  categoryOptions, tagOptions, hasActiveFilters, clearFilters,
}) {
  return (
    <>
      <div className="flex items-center flex-wrap gap-3 mb-6">
        <div className="relative" style={{ maxWidth: 360, flex: "1 1 260px" }}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" style={{ color: "var(--admin-muted)" }}>
            <IconSearch />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tag or category..."
            className={`${inputCls} pl-9`}
          />
        </div>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl fontStyle9 font-semibold cursor-pointer border transition-colors duration-200"
          style={{
            borderColor: showFilters ? "var(--admin-accent)" : "var(--admin-border)",
            background: showFilters ? "var(--admin-accent-soft)" : "var(--admin-bg)",
            color: showFilters ? "var(--admin-accent)" : "var(--admin-subtext)",
          }}
        >
          <IconFilter /> Filters {(filterCategory || filterTag) ? "•" : ""}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="fontStyle9 font-semibold cursor-pointer border-0 bg-transparent"
            style={{ color: "var(--admin-danger)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex items-center flex-wrap gap-3 mb-6 p-4 rounded-xl" style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
          <div className="min-w-0 w-full sm:w-48">
            <label className={labelCls}>Category</label>
            <select
              className="admin-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="min-w-0 w-full sm:w-48">
            <label className={labelCls}>Tag</label>
            <select
              className="admin-select"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <option value="">All tags</option>
              {tagOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );
}
