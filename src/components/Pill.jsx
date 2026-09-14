export default function Pill({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 fontStyle9 font-semibold px-3.5 py-2 rounded-xl border transition-all duration-200 ${
        active
          ? "bg-[var(--color6)] text-[var(--color5)] border-transparent"
          : "bg-transparent border-[var(--color6)]/12 text-[var(--color4)] hover:border-[var(--color6)]/30 hover:text-[var(--color6)]"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`fontStyle10 px-1.5 py-0.5 rounded-full leading-none ${
            active
              ? "bg-[var(--color6)] text-[var(--color5)]"
              : "bg-[var(--color11)] text-[var(--color4)]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
