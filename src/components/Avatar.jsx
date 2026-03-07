
// ─────────────────────────────────────────────
// AVATAR CHIP
// ─────────────────────────────────────────────
 export default function Avatar({ initials, size = "w-8 h-8", text = "fontStyle10" }) {
  return (
    <span className={`${size} rounded-full bg-[var(--color6)] text-[var(--color5)] ${text} font-bold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </span>
  );
}
