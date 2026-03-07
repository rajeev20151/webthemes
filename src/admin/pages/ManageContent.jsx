import { useState } from "react";

/* ════════════════════════════════════════
   INITIAL DATA
════════════════════════════════════════ */
const initialContent = [
  {
    _id: "1",
    section: "hero",
    title: "Build Your Website Easily",
    description: "Create modern websites with our templates",
    buttonText: "Get Started",
    buttonLink: "/signup",
  },
  {
    _id: "2",
    section: "about",
    title: "About Our Company",
    description: "We create professional web templates",
    buttonText: "Read More",
    buttonLink: "/about",
  },
];

const emptyForm = {
  section: "",
  title: "",
  description: "",
  buttonText: "",
  buttonLink: "",
};

/* ── Section color map ── */
const sectionColor = (section) => {
  const map = {
    hero:     "bg-indigo-500/10 text-indigo-500",
    about:    "bg-sky-500/10 text-sky-500",
    features: "bg-emerald-500/10 text-emerald-500",
    contact:  "bg-amber-500/10 text-amber-500",
    footer:   "bg-rose-500/10 text-rose-500",
  };
  return map[section?.toLowerCase()] || "bg-(--admin-accent-soft) text-(--admin-accent)";
};

/* ── Icons ── */
const IconPlus   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconDelete = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconClose  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconSearch = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconLink   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconJson   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 2v6h6M9 13h1c.5 0 1 .5 1 1v1c0 .5.5 1 1 1h0c.5 0 1-.5 1-1v-1c0-.5.5-1 1-1h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconCopy   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;

/* ── Shared input ── */
const inp = [
  "w-full px-3 py-2.5 rounded-xl outline-none transition-colors fs9 box-border",
  "bg-(--admin-bg) border border-(--admin-border)",
  "text-(--admin-text) placeholder:text-(--admin-muted)",
  "focus:border-(--admin-accent)",
].join(" ");

const lbl = "block fs10 font-semibold uppercase tracking-wider text-(--admin-muted) mb-1.5";

/* ════════════════════════════════════════
   CONTENT MODAL  (Add / Edit)
════════════════════════════════════════ */
function ContentModal({ mode, data, onClose, onSave }) {
  const [form, setForm] = useState({ ...data });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.section.trim() || !form.title.trim()) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-(--admin-surface) border border-(--admin-border)">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--admin-border)">
          <p className="fs7 font-bold m-0 text-(--admin-text)">
            {mode === "add" ? "Add New Section" : "Edit Section"}
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-0 bg-(--admin-hover) text-(--admin-muted) hover:opacity-70 transition-opacity"
          >
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">

          {/* Section Key */}
          <div>
            <label className={lbl}>Section Key</label>
            <input
              className={inp}
              value={form.section}
              onChange={(e) => set("section", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="e.g. hero, about, features"
            />
            <p className="fs10 text-(--admin-muted) mt-1 m-0">Lowercase only, no spaces (use dash)</p>
          </div>

          {/* Title */}
          <div>
            <label className={lbl}>Title</label>
            <input
              className={inp}
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Build Your Website Easily"
            />
          </div>

          {/* Description */}
          <div>
            <label className={lbl}>Description</label>
            <textarea
              className={`${inp} resize-none`}
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="e.g. Create modern websites with our templates"
            />
          </div>

          {/* Button Text + Link */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Button Text</label>
              <input
                className={inp}
                value={form.buttonText}
                onChange={(e) => set("buttonText", e.target.value)}
                placeholder="e.g. Get Started"
              />
            </div>
            <div>
              <label className={lbl}>Button Link</label>
              <input
                className={inp}
                value={form.buttonLink}
                onChange={(e) => set("buttonLink", e.target.value)}
                placeholder="e.g. /signup"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-(--admin-border)">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl fs9 font-semibold cursor-pointer border border-(--admin-border) bg-transparent text-(--admin-subtext) hover:bg-(--admin-hover) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
          >
            {mode === "add" ? "Add Section" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   JSON PREVIEW MODAL
════════════════════════════════════════ */
function JsonModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(item, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-(--admin-surface) border border-(--admin-border)">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--admin-border)">
          <div className="flex items-center gap-2">
            <span className="text-(--admin-accent)"><IconJson /></span>
            <p className="fs7 font-bold m-0 text-(--admin-text)">JSON Preview</p>
            <span className={`px-2.5 py-0.5 rounded-full fs10 font-bold ${sectionColor(item.section)}`}>
              {item.section}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-0 bg-(--admin-hover) text-(--admin-muted) hover:opacity-70 transition-opacity"
          >
            <IconClose />
          </button>
        </div>

        {/* Code block */}
        <div className="px-6 py-5">
          <div className="relative rounded-xl overflow-hidden" style={{ background: "#0d1117" }}>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg fs10 font-semibold border-0 cursor-pointer transition-all"
              style={{
                background: copied ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.08)",
                color: copied ? "#34d399" : "rgba(255,255,255,0.5)",
              }}
            >
              <IconCopy /> {copied ? "Copied!" : "Copy"}
            </button>
            <pre
              className="p-5 fs10 overflow-x-auto m-0"
              style={{ color: "#e2e8f0", fontFamily: "'Fira Code', monospace", lineHeight: 1.7 }}
            >
              {json}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   DELETE CONFIRM
════════════════════════════════════════ */
function DeleteConfirm({ section, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl bg-(--admin-surface) border border-(--admin-border)">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-(--admin-danger-soft)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
              stroke="var(--admin-danger)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="fs7 font-bold m-0 mb-2 text-(--admin-text)">Delete Section?</p>
        <p className="fs9 m-0 mb-6 text-(--admin-muted)">
          "<strong className="text-(--admin-subtext)">{section}</strong>" section permanently delete ho jayega.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl fs9 font-semibold cursor-pointer border border-(--admin-border) bg-transparent text-(--admin-subtext) hover:bg-(--admin-hover) transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white border-0 cursor-pointer bg-(--admin-danger) hover:opacity-85 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   CONTENT CARD
════════════════════════════════════════ */
function ContentCard({ item, onEdit, onDelete, onViewJson }) {
  return (
    <div className="admin-card p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-200">

      {/* Top row — section badge + actions */}
      <div className="flex items-center justify-between gap-2">
        <span className={`px-3 py-1 rounded-full fs10 font-bold tracking-wider uppercase ${sectionColor(item.section)}`}>
          {item.section}
        </span>
        <span className="fs10 text-(--admin-muted)">ID: {item._id}</span>
      </div>

      {/* Title */}
      <div>
        <p className="fs7 font-bold m-0 text-(--admin-text) leading-snug">{item.title}</p>
        <p className="fs9 mt-1.5 m-0 text-(--admin-muted) leading-relaxed">{item.description}</p>
      </div>

      {/* Button info */}
      {(item.buttonText || item.buttonLink) && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-(--admin-border) bg-(--admin-bg)"
        >
          <span className="text-(--admin-accent) flex-shrink-0"><IconLink /></span>
          <span className="fs10 font-semibold text-(--admin-subtext)">{item.buttonText}</span>
          {item.buttonLink && (
            <>
              <span className="text-(--admin-muted) fs10">→</span>
              <span className="fs10 text-(--admin-muted)">{item.buttonLink}</span>
            </>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-(--admin-border)" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold cursor-pointer border-0 bg-(--admin-accent-soft) text-(--admin-accent) hover:opacity-75 transition-opacity"
        >
          <IconEdit /> Edit
        </button>
        <button
          onClick={() => onViewJson(item)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold cursor-pointer border-0 bg-(--admin-hover) text-(--admin-subtext) hover:opacity-75 transition-opacity border border-(--admin-border)"
        >
          <IconJson /> JSON
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold cursor-pointer border-0 bg-(--admin-danger-soft) text-(--admin-danger) hover:opacity-75 transition-opacity"
        >
          <IconDelete /> Delete
        </button>
      </div>

    </div>
  );
}

/* ════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════ */
export default function ManageContent() {
  const [items, setItems]               = useState(initialContent);
  const [search, setSearch]             = useState("");
  const [modal, setModal]               = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [jsonTarget, setJsonTarget]     = useState(null);

  /* ── Filter ── */
  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.section.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  });

  /* ── Save ── */
  const handleSave = (form) => {
    if (modal.mode === "add") {
      setItems((prev) => [...prev, { ...form, _id: String(Date.now()) }]);
    } else {
      setItems((prev) => prev.map((i) => (i._id === form._id ? { ...form } : i)));
    }
    setModal(null);
  };

  /* ── Delete ── */
  const handleDelete = () => {
    setItems((prev) => prev.filter((i) => i._id !== deleteTarget._id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-7">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="fs6 font-bold m-0 text-(--admin-text)">Manage Content</h1>
          <p className="fs10 mt-1 m-0 text-(--admin-muted)">
            {items.length} sections · website content manage karo
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: { ...emptyForm } })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl fs9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.25)" }}
        >
          <IconPlus /> Add Section
        </button>
      </div>

      {/* ── Search bar ── */}
      <div className="relative mb-6" style={{ maxWidth: 360 }}>
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--admin-muted) pointer-events-none flex items-center">
          <IconSearch />
        </span>
        <input
          className={`${inp} pl-9`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search section, title, description..."
        />
      </div>

      {/* ── Cards Grid ── */}
      {filtered.length === 0 ? (
        <div className="admin-card p-16 text-center">
          <p className="fs9 text-(--admin-muted) m-0">No sections found.</p>
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
          {filtered.map((item) => (
            <ContentCard
              key={item._id}
              item={item}
              onEdit={(i) => setModal({ mode: "edit", data: { ...i } })}
              onDelete={(i) => setDeleteTarget(i)}
              onViewJson={(i) => setJsonTarget(i)}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {modal && (
        <ContentModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          section={deleteTarget.section}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
      {jsonTarget && (
        <JsonModal
          item={jsonTarget}
          onClose={() => setJsonTarget(null)}
        />
      )}

    </div>
  );
}