export default function TechBadge({ tech }) {
  const isWP = tech === "WORDPRESS";
  return (
    <span
      className={`fontStyle10 font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border inline-block leading-snug ${
        isWP
          ? "bg-[rgba(0,0,0,0.06)] text-[var(--color6)] border-[rgba(0,0,0,0.14)]"
          : "bg-[rgba(243,115,53,0.08)] text-[var(--color3)] border-[rgba(243,115,53,0.22)]"
      }`}
    >
      {tech}
    </span>
  );
}
