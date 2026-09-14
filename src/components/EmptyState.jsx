export default function EmptyState({ clearAll }) {
  return (
    <div className="py-20 sm:py-28 flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center bg-[var(--color11)] border-2 border-dashed border-[var(--color4)] opacity-60">
        <i className="bx bx-search-alt text-3xl text-[var(--color4)]"></i>
      </div>
      <h3 className="fontStyle5 font-bold text-[var(--color6)] mb-2">
        No demos found
      </h3>
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
  );
}
