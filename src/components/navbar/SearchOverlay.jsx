import SuggestionList from "./SuggestionList";

// Full-screen desktop search modal (Cmd/Ctrl-K style overlay).
export default function SearchOverlay({
  open, onClose,
  query, onQueryChange, onClearQuery, suggestions,
  onSubmitSearch, onSelectSuggestion, searchInputRef,
}) {
  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-start pt-32 px-6 transition-all duration-300 bg-black/60 backdrop-blur-sm ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl relative">
        <form
          onSubmit={onSubmitSearch}
          className="flex items-center gap-4 bg-[var(--color5)] rounded-2xl px-6 py-4 shadow-2xl"
        >
          <i className="bx bx-search text-2xl text-[var(--color6)] opacity-50 shrink-0"></i>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search templates..."
            className="flex-1 bg-transparent outline-none fontStyle7 text-[var(--color6)] text-lg placeholder-opacity-40"
          />
          {query && (
            <button
              type="button"
              onClick={onClearQuery}
              className="text-[var(--color6)] opacity-50 hover:opacity-100 transition duration-200 bg-transparent"
            >
              <i className="bx bx-x text-2xl"></i>
            </button>
          )}
        </form>

        {/* Suggestions */}
        <SuggestionList
          suggestions={suggestions}
          query={query}
          onSelect={onSelectSuggestion}
        />

        <p className="text-center text-white opacity-40 text-sm mt-4 fontStyle9">
          Press <kbd className="px-2 py-0.5 rounded bg-white/20 text-white text-xs">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
