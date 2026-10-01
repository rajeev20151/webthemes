export default function TagBadge({ tag }) {
  if (!tag) return null;

  const isFree = String(tag).toUpperCase() === "FREE";

  return (
    <span className="inline-flex items-center gap-1.5 fontStyle10 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] -rotate-3 transition-all duration-300 group-hover:rotate-0 group-hover:shadow-[1px_1px_0px_var(--color6)]">
      <span
        className={`w-2 h-2 rounded-full border border-[var(--color6)] ${
          isFree ? "bg-[#4ade80]" : "bg-[#fde047]"
        }`}
      ></span>
      {tag}
    </span>
  );
}