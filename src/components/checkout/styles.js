/* ── Shared Classes ── */
export const CARD_CLS = "rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)]";

export const BTN_PRIMARY =
  "bg-color3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl fontStyle9 font-bold text-white shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer";

export const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 hover:border-[var(--color6)]/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer";

export const labelCls =
  "block fontStyle10 font-semibold uppercase tracking-wider text-[var(--color4)] mb-1.5";

export function inputCls(err) {
  return `w-full px-3.5 py-2.5 rounded-xl border fontStyle9 outline-none placeholder-[var(--color4)] transition-all duration-200 bg-[var(--color5)] text-[var(--color6)] ${
    err
      ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-400/10"
      : "border-[var(--color6)]/15 focus:border-[var(--color6)]/40 focus:ring-4 focus:ring-[var(--color6)]/5"
  }`;
}
