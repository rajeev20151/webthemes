import { useState, useRef, useEffect, useMemo } from "react";
import { COUNTRIES, flagOf } from "./countries";

/* ── Searchable country combobox ── */
export default function CountrySelect({ id, name, value, onChange, onBlur, invalid, describedBy, ref }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q);
  }, [query]);

  // focus the search box + close on Escape / outside click
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // only report blur when focus leaves the whole widget
  const handleBlur = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setOpen(false);
    setQuery("");
    onBlur?.();
  };

  const selected = COUNTRIES.find((c) => c.name === value);

  return (
    <div className="relative" ref={wrapRef} onBlur={handleBlur}>
      <button
        id={id}
        ref={ref}
        type="button"
        name={name}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={!!invalid}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border fontStyle9 text-left outline-none transition-all duration-200 cursor-pointer ${
          invalid
            ? "border-red-400 bg-[var(--color5)] text-[var(--color6)] focus:ring-4 focus:ring-red-400/10"
            : "border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] focus:border-[var(--color6)]/40 focus:ring-4 focus:ring-[var(--color6)]/5"
        }`}
      >
        {selected ? (
          <>
            <span className="text-base leading-none shrink-0">{flagOf(selected.code)}</span>
            <span className="flex-1 truncate">{selected.name}</span>
          </>
        ) : (
          <>
            <i className="bx bx-globe text-[var(--color4)] shrink-0"></i>
            <span className="flex-1 truncate text-[var(--color4)]">Select country...</span>
          </>
        )}
        <i
          className={`bx bx-chevron-down text-[var(--color4)] shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        ></i>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 rounded-xl border border-[var(--color6)]/10 bg-[var(--color5)] shadow-xl overflow-hidden">
          <div className="p-2 border-b border-[var(--color6)]/10">
            <div className="relative">
              <i className="bx bx-search absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--color4)] text-sm pointer-events-none"></i>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[var(--color6)]/10 bg-[var(--color11)] text-[var(--color6)] fontStyle10 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/30 transition-colors duration-200"
              />
            </div>
          </div>

          <ul role="listbox" className="max-h-60 overflow-y-auto py-1 no-scrollbar">
            {results.map((c) => {
              const isSel = c.name === value;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSel}
                    onClick={() => { onChange(c.name); setOpen(false); setQuery(""); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left fontStyle10 transition-colors duration-150 cursor-pointer ${
                      isSel
                        ? "bg-[var(--color6)] text-[var(--color5)] font-semibold"
                        : "text-[var(--color6)] hover:bg-[var(--color11)]"
                    }`}
                  >
                    <span className="text-sm leading-none shrink-0">{flagOf(c.code)}</span>
                    <span className="flex-1 truncate">{c.name}</span>
                    {isSel && <i className="bx bx-check shrink-0"></i>}
                  </button>
                </li>
              );
            })}
            {!results.length && (
              <li className="px-3 py-5 text-center fontStyle10 text-[var(--color4)]">
                No country matches "{query}"
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
