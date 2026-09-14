import { IconPlus } from "./constants.jsx";

export default function PageHeader({ total, filtered, hasActiveFilters, onAdd }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="fontStyle7 font-bold m-0" style={{ color: "var(--admin-text)" }}>
          Manage Templates
        </h1>
        <p className="fontStyle9 mt-1 m-0" style={{ color: "var(--admin-muted)" }}>
          {total} templates total{hasActiveFilters ? ` · ${filtered} matching` : ""}
        </p>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer transition-opacity duration-200"
        style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        <IconPlus /> Add Template
      </button>
    </div>
  );
}
