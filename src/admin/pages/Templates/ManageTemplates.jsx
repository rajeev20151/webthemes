import { useState, useRef } from "react";

/* ── Sample Data ── */
const initialTemplates = [
  { id: 1, name: "Agency Pro",     subtitle: "Best for agencies & studios",  tag: "Business",  price: 29, originalPrice: 59, link: "https://example.com/agency-pro",    image: "https://placehold.co/400x260/6366f1/ffffff?text=Agency+Pro"    },
  { id: 2, name: "Portfolio X",    subtitle: "Minimal creative portfolio",   tag: "Portfolio", price: 19, originalPrice: 39, link: "https://example.com/portfolio-x",   image: "https://placehold.co/400x260/0ea5e9/ffffff?text=Portfolio+X"   },
  { id: 3, name: "SaaS Landing",   subtitle: "Convert more with clean UI",   tag: "SaaS",      price: 49, originalPrice: 79, link: "https://example.com/saas-landing",  image: "https://placehold.co/400x260/34d399/ffffff?text=SaaS+Landing"  },
  { id: 4, name: "E-Commerce Kit", subtitle: "Full shop ready to launch",    tag: "Store",     price: 59, originalPrice: 99, link: "https://example.com/ecommerce-kit", image: "https://placehold.co/400x260/f87171/ffffff?text=Ecommerce+Kit" },
  { id: 5, name: "Blog Minimal",   subtitle: "Clean reading experience",     tag: "Blog",      price: 15, originalPrice: 29, link: "https://example.com/blog-minimal",  image: "https://placehold.co/400x260/fbbf24/ffffff?text=Blog+Minimal"  },
  { id: 6, name: "Restaurant UI",  subtitle: "Beautiful food & menu design", tag: "Food",      price: 35, originalPrice: 65, link: "https://example.com/restaurant-ui", image: "https://placehold.co/400x260/a78bfa/ffffff?text=Restaurant+UI" },
];

const emptyForm = { name: "", subtitle: "", tag: "", price: "", originalPrice: "", image: "", link: "" };

/* ── Icons ── */
const IconPlus   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconDelete = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconClose  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconUpload = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconLink   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconVisit  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;

/* ── Shared input / label classes (Tailwind + CSS var colors) ── */
const inputCls = [
  "w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-200",
  "border border-[var(--admin-border)]",
  "bg-[var(--admin-bg)] text-[var(--admin-text)]",
  "placeholder:text-[var(--admin-muted)]",
  "focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)]",
  "fs9",
].join(" ");

const labelCls = "block fs10 font-semibold uppercase tracking-wider text-[var(--admin-muted)] mb-1.5";

/* ════════════════════════════════════════════
   MODAL
════════════════════════════════════════════ */
function TemplateModal({ mode, data, onClose, onSave }) {
  const [form, setForm]       = useState({ ...data });
  const [preview, setPreview] = useState(data.image || "");
  const fileRef               = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setForm((f) => ({ ...f, image: url }));
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.tag || !form.price) return;
    onSave({ ...form, price: Number(form.price), originalPrice: Number(form.originalPrice) });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--admin-border)" }}
        >
          <p className="fs7 font-semibold m-0" style={{ color: "var(--admin-text)" }}>
            {mode === "add" ? "Add New Template" : "Edit Template"}
          </p>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 cursor-pointer border-0"
            style={{ background: "var(--admin-hover)", color: "var(--admin-muted)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-border)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--admin-hover)"}
          >
            <IconClose />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

          {/* Image Upload */}
          <div
            onClick={() => fileRef.current.click()}
            className="relative h-44 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-200"
            style={{
              border: "2px dashed var(--admin-border)",
              background: "var(--admin-bg)",
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--admin-accent)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--admin-border)"}
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center" style={{ color: "var(--admin-muted)" }}>
                <div className="flex justify-center mb-2"><IconUpload /></div>
                <p className="fs10 m-0">Click to upload image</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {/* Template Name */}
          <div>
            <label className={labelCls}>Template Name</label>
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Agency Pro" />
          </div>

          {/* Subtitle */}
          <div>
            <label className={labelCls}>Subtitle</label>
            <input className={inputCls} value={form.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. Best for agencies & studios" />
          </div>

          {/* Tag */}
          <div>
            <label className={labelCls}>Tag / Category</label>
            <input className={inputCls} value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. Business" />
          </div>

          {/* Price + Original Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Sale Price ($)</label>
              <input className={inputCls} type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 29" />
            </div>
            <div>
              <label className={labelCls}>Original Price ($)</label>
              <input className={inputCls} type="number" value={form.originalPrice || ""} onChange={(e) => set("originalPrice", e.target.value)} placeholder="e.g. 59" />
            </div>
          </div>

          {/* Live Link */}
          <div>
            <label className={labelCls}>Live Link (URL)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" style={{ color: "var(--admin-muted)" }}>
                <IconLink />
              </span>
              <input className={`${inputCls} pl-9`} value={form.link || ""} onChange={(e) => set("link", e.target.value)} placeholder="https://example.com/template" />
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--admin-border)" }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl fs9 font-semibold cursor-pointer transition-colors duration-200 border"
            style={{ borderColor: "var(--admin-border)", background: "transparent", color: "var(--admin-subtext)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white cursor-pointer border-0 transition-opacity duration-200"
            style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {mode === "add" ? "Add Template" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DELETE CONFIRM
════════════════════════════════════════════ */
function DeleteConfirm({ name, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl"
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
        <p className="fs7 font-bold m-0 mb-2" style={{ color: "var(--admin-text)" }}>Delete Template?</p>
        <p className="fs9 m-0 mb-6" style={{ color: "var(--admin-muted)" }}>
          "<strong style={{ color: "var(--admin-subtext)" }}>{name}</strong>" permanently delete ho jayega. Yeh undo nahi hoga.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl fs9 font-semibold cursor-pointer transition-colors duration-200 border"
            style={{ borderColor: "var(--admin-border)", background: "transparent", color: "var(--admin-subtext)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white cursor-pointer border-0"
            style={{ background: "var(--admin-danger)" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   TEMPLATE CARD
════════════════════════════════════════════ */
function TemplateCard({ item, onEdit, onDelete }) {
  return (
    <div
      className="admin-card overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{ cursor: "default" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 30px var(--admin-shadow)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}
    >
      {/* ── Image ── */}
      <div className="relative h-44 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover block" />
        {/* Tag Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full fs10 font-bold"
          style={{
            background: "var(--admin-accent-grad)",
            color: "var(--admin-white)",
            backdropFilter: "blur(6px)",
          }}
        >
          {item.tag}
        </span>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4 flex flex-col gap-2">

        {/* Name + Subtitle */}
        <div>
          <p className="fs9 font-bold m-0" style={{ color: "var(--admin-text)" }}>{item.name}</p>
          {item.subtitle && (
            <p className="fs10 m-0 mt-0.5" style={{ color: "var(--admin-muted)" }}>{item.subtitle}</p>
          )}
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className="fs8 font-extrabold" style={{ color: "var(--admin-accent)" }}>
            ${item.price}
          </span>
          {item.originalPrice && item.originalPrice > item.price && (
            <>
              <span className="fs10 line-through" style={{ color: "var(--admin-muted)" }}>
                ${item.originalPrice}
              </span>
              <span
                className="fs10 font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "var(--admin-success-soft)", color: "var(--admin-success)" }}
              >
                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-2 mt-1">

          {/* Edit */}
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold cursor-pointer border transition-all duration-200"
            style={{ borderColor: "var(--admin-border)", background: "var(--admin-bg)", color: "var(--admin-subtext)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-accent)"; e.currentTarget.style.color = "var(--admin-accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; e.currentTarget.style.color = "var(--admin-subtext)"; }}
          >
            <IconEdit /> Edit
          </button>

          {/* Visit */}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold transition-all duration-200 no-underline"
              style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.18)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--admin-accent-soft)"}
            >
              <IconVisit /> Visit
            </a>
          )}

          {/* Delete */}
          <button
            onClick={() => onDelete(item)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold cursor-pointer border-0 transition-all duration-200"
            style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(248,113,113,0.2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--admin-danger-soft)"}
          >
            <IconDelete /> Delete
          </button>

        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function ManageTemplates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tag.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (form) => {
    if (modal.mode === "add") {
      setTemplates((prev) => [...prev, { ...form, id: Date.now() }]);
    } else {
      setTemplates((prev) => prev.map((t) => (t.id === form.id ? form : t)));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setTemplates((prev) => prev.filter((t) => t.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-7">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="fs6 font-bold m-0" style={{ color: "var(--admin-text)" }}>
            Manage Templates
          </h1>
          <p className="fs10 mt-1 m-0" style={{ color: "var(--admin-muted)" }}>
            {templates.length} templates total
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: { ...emptyForm } })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl fs9 font-bold text-white border-0 cursor-pointer transition-opacity duration-200"
          style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          <IconPlus /> Add Template
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6" style={{ maxWidth: 360 }}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" style={{ color: "var(--admin-muted)" }}>
          <IconSearch />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or tag..."
          className={`${inputCls} pl-9`}
        />
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 fs9" style={{ color: "var(--admin-muted)" }}>
          No templates found.
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {filtered.map((item) => (
            <TemplateCard
              key={item.id}
              item={item}
              onEdit={(t) => setModal({ mode: "edit", data: { ...t } })}
              onDelete={(t) => setDeleteTarget(t)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {modal && (
        <TemplateModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}