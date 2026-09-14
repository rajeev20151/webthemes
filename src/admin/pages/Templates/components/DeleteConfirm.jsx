import { IconClose } from "./constants.jsx";

export default function DeleteConfirm({ name, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl relative z-[9999]"
        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--admin-danger-soft)" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="var(--admin-danger)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="fontStyle7 font-bold m-0 mb-2" style={{ color: "var(--admin-text)" }}>Delete Template?</p>
        <p className="fontStyle9 m-0 mb-6" style={{ color: "var(--admin-muted)" }}>
          "<strong style={{ color: "var(--admin-subtext)" }}>{name}</strong>" permanently delete ho jayega. Yeh undo nahi hoga.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer transition-colors duration-200 border"
            style={{ borderColor: "var(--admin-border)", background: "transparent", color: "var(--admin-subtext)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl fontStyle9 font-bold text-white cursor-pointer border-0"
            style={{ background: "var(--admin-danger)" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
