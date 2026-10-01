// ── Suggestions dropdown (shared by desktop + mobile) ─────────────────────────
export default function SuggestionList({ suggestions, query, onSelect }) {
  if (!suggestions.length) return null;

  // Bold-highlight the matched portion
  const highlight = (text) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
      <>
        {text.slice(0, idx)}
        <strong className="text-[var(--color6)]">{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--color5)] border border-[var(--color6)]/15 rounded-2xl shadow-2xl overflow-hidden z-[9999999]">
      <div className="max-h-[340px] overflow-y-auto overscroll-contain scrollbar-thin">
        {suggestions.map((t) => (
          <button
            key={t.id}
            onMouseDown={(e) => { e.preventDefault(); onSelect(t); }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color11)] transition-colors duration-150 text-left border-0 bg-transparent cursor-pointer border-b border-[var(--color6)]/5 last:border-b-0"
          >
            {t.image && (
              <img src={t.image} alt="" className="w-14 h-10 object-cover rounded-lg shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="fontStyle9 text-[var(--color6)] truncate">
                {highlight(t.title)}
              </p>
              <p className="fontStyle10 text-[var(--color4)] truncate opacity-60">
              {t.category}
              {t.frameworks && t.frameworks.length > 0 && (
              <span className="opacity-70">
              {" • "}
              {t.frameworks.map((f, i) => (
              <span key={f}>
              {i > 0 && ", "}
              {highlight(f)}
              </span>
              ))}
              </span>
              )}
              </p>
            </div>
            <span className={`fontStyle10 font-bold px-2.5 py-0.5 rounded-full shrink-0 ${t.tag === "FREE" ? "text-green-500 bg-green-500/10" : "text-orange-400 bg-orange-400/10"}`}>
              {t.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
