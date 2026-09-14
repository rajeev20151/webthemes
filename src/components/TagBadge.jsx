export default function TagBadge({ tag }) {
  return (
    <span
      className={`fontStyle10 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full leading-snug ${
        tag === "FREE"
          ? "bg-[rgba(34,197,94,0.12)] text-[#16a34a]"
          : "bg-color3 text-[var(--color5)]"
      }`}
    >
      {tag}
    </span>
  );
}
