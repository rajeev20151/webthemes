import { CARD_CLS, labelCls } from "./styles";

/* ── Inline field error ── */
export function ErrorMsg({ id, msg }) {
  if (!msg) return null;
  return (
    <p id={id} className="flex items-center gap-1 fontStyle10 text-red-500 mt-1.5">
      <i className="bx bx-error-circle text-xs"></i> {msg}
    </p>
  );
}

/* ── Field label with required marker ── */
export function FieldLabel({ htmlFor, children, required = true }) {
  return (
    <label htmlFor={htmlFor} className={labelCls}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

/* ── Error summary — lists every problem, click to jump to the field ── */
export function ErrorSummary({ errors, fields, title = "Please fix the following to continue" }) {
  const bad = fields.filter((f) => errors[f.key]);
  if (!bad.length) return null;
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-400/40 bg-red-500/10 p-3.5 mb-5"
    >
      <p className="fontStyle9 font-bold text-red-500 flex items-center gap-2">
        <i className="bx bx-error-circle text-base"></i>
        {title}
      </p>
      <ul className="mt-2.5 space-y-1.5">
        {bad.map((f) => (
          <li key={f.key}>
            <button
              type="button"
              onClick={() => f.focus()}
              className="text-left fontStyle10 text-red-500 hover:underline cursor-pointer bg-transparent border-0 p-0"
            >
              <span className="font-semibold">{f.label}:</span> {errors[f.key]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Titled step panel ── */
export function SectionCard({ num, icon, title, subtitle, children }) {
  return (
    <div className={`${CARD_CLS} p-5 sm:p-6`}>
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-[var(--color6)]/10">
        <span className="bg-color3 w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md">
          <i className={`bx ${icon} text-lg`}></i>
        </span>
        <div className="min-w-0 flex-1">
          <p className="fontStyle9 font-bold text-[var(--color6)] flex flex-wrap items-center gap-2">
            {title}
            <span className="fontStyle10 font-semibold text-[var(--color4)] bg-[var(--color6)]/5 px-2 py-0.5 rounded-full">
              Step {num}
            </span>
          </p>
          {subtitle && <p className="fontStyle10 text-[var(--color4)] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
