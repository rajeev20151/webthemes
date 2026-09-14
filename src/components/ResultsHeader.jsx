export default function ResultsHeader({ filtered, category, hasActiveFilters, clearAll }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <p className="fontStyle9 text-[var(--color4)]">
        Showing <strong className="text-[var(--color6)]">{filtered.length}</strong>{" "}
        demo{filtered.length !== 1 ? "s" : ""}
        {category !== "All" && (
          <> in <strong className="text-[var(--color6)]">{category}</strong></>
        )}
      </p>
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="fontStyle10 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex items-center gap-1"
        >
          <i className="bx bx-refresh text-sm"></i> Reset
        </button>
      )}
    </div>
  );
}
