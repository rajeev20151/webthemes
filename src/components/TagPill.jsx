export default function TagPill({ label }) {
  return (
    <span className="fontStyle10 px-3 py-1.5 rounded-full border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color4)] hover:text-[var(--color6)] hover:border-[var(--color6)]/35 hover:shadow-sm transition-all duration-200 cursor-pointer inline-block">
      {label}
    </span>
  );
}
