import { useState, useRef, useEffect } from "react";
import {
  API_BASE,
  adminGetTemplatesAPI,
  adminCreateTemplateAPI,
  adminUpdateTemplateAPI,
  adminDeleteTemplateAPI,
} from "../../services/adminApi";


const emptyForm = {
  name: "", subtitle: "", tag: "", price: "", originalPrice: "", description: "",
  version: "", updateDate: "", releaseDate: "", category: "",
  frameworks: "", compatible: "", tags: "", keyFeatures: "", inTheBox: "", libraries: "",
  scheduledAt: "",
};

const ITEMS_PER_PAGE = 9;

/* ── Upload limits ── */
const MAX_IMAGE_SIZE_MB = 5;   // per image
const MAX_ZIP_SIZE_MB   = 100; // per zip

/* ── Icons ── */
const IconPlus     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconEdit     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconDelete   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconClose    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconUpload   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSearch   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconVisit    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconZip      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconWarning  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconDownload = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconStar     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const IconClock    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconFilter   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconChevLeft  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconChevRight = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/* ── Shared classes ── */
const inputCls = [
  "w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-200",
  "border border-[var(--admin-border)]",
  "bg-[var(--admin-bg)] text-[var(--admin-text)]",
  "placeholder:text-[var(--admin-muted)]",
  "focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)]",
  "fs9",
].join(" ");

const labelCls = "block fs10 font-semibold uppercase tracking-wider text-[var(--admin-muted)] mb-1.5";

/* ── Helper: resolve any relative path (image / zip / preview) to a full URL ── */
const resolveUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};
const imgUrl = resolveUrl;

/* ── Helper: format bytes to a readable size ── */
const formatBytes = (bytes) => {
  if (!bytes) return "0 MB";
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ── Helper: format a date as "Uploaded on 26 Jun 2026" ── */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ── Helper: format a date + time as "26 Jun 2026, 6:30 PM" ── */
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
};

/* ── Helper: is this template still waiting for its scheduled time? ── */
const isScheduled = (scheduledAt) => scheduledAt && new Date(scheduledAt) > new Date();

/* ════════════════════════════════════════════
   MODAL
════════════════════════════════════════════ */
function TemplateModal({ mode, data, onClose, onSave, saving }) {
  const [form, setForm]             = useState({ ...data });
  const [imagePreviews, setPreviews] = useState(
    (data.images || []).map((p) => imgUrl(p))
  );
  const [imageFiles, setImageFiles]  = useState([]);       // new File objects
  const [zipFile, setZipFile]        = useState(null);      // new zip File
  const [zipName, setZipName]        = useState(data.zipFile ? data.zipFile.split("/").pop() : "");
  const [zipSizeLabel, setZipSizeLabel] = useState("");
  const [error, setError]            = useState("");
  const [scheduleOn, setScheduleOn]  = useState(!!data.scheduledAt);
  const imgRef = useRef();
  const zipRef = useRef();

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    if (!files.length) return;

    const oversized = files.find((f) => f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setError(`"${oversized.name}" ${formatBytes(oversized.size)} ki hai. Har image max ${MAX_IMAGE_SIZE_MB}MB tak honi chahiye.`);
      e.target.value = "";
      return;
    }

    setError("");
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    setImageFiles(files);
  };

  const handleZip = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_ZIP_SIZE_MB * 1024 * 1024) {
      setError(`Zip file ${formatBytes(file.size)} ki hai. Max ${MAX_ZIP_SIZE_MB}MB allowed hai.`);
      e.target.value = "";
      return;
    }

    setError("");
    setZipFile(file);
    setZipName(file.name);
    setZipSizeLabel(formatBytes(file.size));
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = () => {
    if (!form.name || !form.tag) {
      setError("Name, Tag aur Price bharna zaroori hai.");
      return;
    }
    if (scheduleOn && !form.scheduledAt) {
      setError("Schedule ke liye date & time select karo, ya schedule toggle off kar do.");
      return;
    }
    if (error) return;
    const finalForm = scheduleOn ? form : { ...form, scheduledAt: "" };
    onSave(finalForm, imageFiles, zipFile);
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
        {/* Header */}
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

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">

          {/* ── Error banner ── */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl fs10 font-semibold"
              style={{ background: "var(--admin-danger-soft)", color: "var(--admin-danger)" }}
            >
              <IconWarning /> {error}
            </div>
          )}

          {/* ── Images Upload (up to 3) ── */}
          <div>
            <label className={labelCls}>Images (up to 3)</label>
            <div
              onClick={() => imgRef.current.click()}
              className="relative rounded-xl p-6 cursor-pointer overflow-hidden transition-all duration-200"
              style={{ border: "2px dashed var(--admin-border)", background: "var(--admin-bg)", minHeight: "120px" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--admin-accent)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--admin-border)"}
            >
              {imagePreviews.length > 0 ? (
                <div className="flex gap-2 justify-center flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt={`preview-${i}`} className="h-28 rounded-lg object-cover" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2" style={{ color: "var(--admin-muted)" }}>
                  <IconUpload />
                  <p className="fs10 m-0">Click to upload images (max 3)</p>
                </div>
              )}
            </div>
            <p className="fs11 m-0 mt-1.5" style={{ color: "var(--admin-muted)" }}>
              Max {MAX_IMAGE_SIZE_MB}MB per image
            </p>
            <input ref={imgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
          </div>

          {/* ── Zip File Upload ── */}
          <div>
            <label className={labelCls}>Zip File</label>
            <div
              onClick={() => zipRef.current.click()}
              className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{ border: "2px dashed var(--admin-border)", background: "var(--admin-bg)" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--admin-accent)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--admin-border)"}
            >
              <span style={{ color: "var(--admin-muted)" }}><IconZip /></span>
              <span className="fs10" style={{ color: zipName ? "var(--admin-text)" : "var(--admin-muted)" }}>
                {zipName || "Click to upload .zip file"}
              </span>
              {zipSizeLabel && (
                <span className="fs11 ml-auto" style={{ color: "var(--admin-muted)" }}>{zipSizeLabel}</span>
              )}
            </div>
            <p className="fs11 m-0 mt-1.5" style={{ color: "var(--admin-muted)" }}>
              Max {MAX_ZIP_SIZE_MB}MB
            </p>
            <input ref={zipRef} type="file" accept=".zip" className="hidden" onChange={handleZip} />
          </div>

          {/* ── Schedule Upload ── */}
          <div
            className="rounded-xl px-4 py-3"
            style={{ border: "1px solid var(--admin-border)", background: "var(--admin-bg)" }}
          >
            <label className="flex items-center justify-between cursor-pointer">
              <span className="fs9 font-semibold" style={{ color: "var(--admin-text)" }}>
                Schedule Upload
              </span>
              <input
                type="checkbox"
                checked={scheduleOn}
                onChange={(e) => {
                  setScheduleOn(e.target.checked);
                  if (!e.target.checked) set("scheduledAt", "");
                }}
                className="w-4 h-4 cursor-pointer"
              />
            </label>
            <p className="fs11 m-0 mt-1" style={{ color: "var(--admin-muted)" }}>
              On karke time set karo — website par tabhi live hoga jab wo time aayega. Off rehne par turant live hoga.
            </p>
            {scheduleOn && (
              <input
                type="datetime-local"
                className={`${inputCls} mt-2`}
                value={form.scheduledAt || ""}
                onChange={(e) => set("scheduledAt", e.target.value)}
              />
            )}
          </div>

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

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <div className="relative">
              <textarea className={`${inputCls} `} value={form.description || ""} onChange={(e) => set("description", e.target.value)} placeholder="Template Description" />
            </div>
          </div>

          {/* ════ Theme Details Section ════ */}
          <div className="flex items-center gap-2 pt-2">
            <span className="fs10 font-bold uppercase tracking-widest" style={{ color: "var(--admin-accent)" }}>
              Theme Details
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--admin-border)" }} />
          </div>

          {/* Version + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Version</label>
              <input className={inputCls} value={form.version || ""} onChange={(e) => set("version", e.target.value)} placeholder="e.g. v1.0.0" />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input className={inputCls} value={form.category || ""} onChange={(e) => set("category", e.target.value)} placeholder="e.g. Landing & Website" />
            </div>
          </div>

          {/* Update Date + Release Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Update Date</label>
              <input className={inputCls} value={form.updateDate || ""} onChange={(e) => set("updateDate", e.target.value)} placeholder="e.g. 4 days ago" />
            </div>
            <div>
              <label className={labelCls}>Release Date</label>
              <input className={inputCls} value={form.releaseDate || ""} onChange={(e) => set("releaseDate", e.target.value)} placeholder="e.g. 6 days ago" />
            </div>
          </div>

          {/* Frameworks */}
          <div>
            <label className={labelCls}>
              Frameworks{" "}
              <span className="normal-case font-normal" style={{ color: "var(--admin-muted)" }}>(comma separated)</span>
            </label>
            <input className={inputCls} value={form.frameworks || ""} onChange={(e) => set("frameworks", e.target.value)} placeholder="e.g. React JS, Tailwind CSS, Next.js" />
          </div>

          {/* Compatible With */}
          <div>
            <label className={labelCls}>
              Compatible With{" "}
              <span className="normal-case font-normal" style={{ color: "var(--admin-muted)" }}>(comma separated)</span>
            </label>
            <input className={inputCls} value={form.compatible || ""} onChange={(e) => set("compatible", e.target.value)} placeholder="e.g. Chrome, Firefox, Mobile" />
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>
              Tags{" "}
              <span className="normal-case font-normal" style={{ color: "var(--admin-muted)" }}>(comma separated)</span>
            </label>
            <input className={inputCls} value={form.tags || ""} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. Responsive, Clean, One page" />
          </div>

          {/* Key Features */}
          <div>
            <label className={labelCls}>
              Key Features{" "}
              <span className="normal-case font-normal" style={{ color: "var(--admin-muted)" }}>(comma separated)</span>
            </label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.keyFeatures || ""}
              onChange={(e) => set("keyFeatures", e.target.value)}
              placeholder="e.g. Sticky Navigation, Responsive, SEO Optimized"
            />
          </div>

          {/* In The Box */}
          <div>
            <label className={labelCls}>
              In The Box{" "}
              <span className="normal-case font-normal" style={{ color: "var(--admin-muted)" }}>(comma separated)</span>
            </label>
            <input className={inputCls} value={form.inTheBox || ""} onChange={(e) => set("inTheBox", e.target.value)} placeholder="e.g. 1 Pre-Built Pages, All Demo Images" />
          </div>

          {/* Library & Plugins */}
          <div>
            <label className={labelCls}>
              Library &amp; Plugins{" "}
              <span className="normal-case font-normal" style={{ color: "var(--admin-muted)" }}>(comma separated)</span>
            </label>
            <input className={inputCls} value={form.libraries || ""} onChange={(e) => set("libraries", e.target.value)} placeholder="e.g. Tailwind CSS, React, Next.js" />
          </div>

        </div>

        {/* Footer */}
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
            disabled={saving}
            className="px-6 py-2 rounded-xl fs9 font-bold text-white cursor-pointer border-0 transition-opacity duration-200"
            style={{ background: "var(--admin-accent-grad)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)", opacity: saving ? 0.6 : 1 }}
            onMouseEnter={(e) => { if (!saving) e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { if (!saving) e.currentTarget.style.opacity = "1"; }}
          >
            {saving ? "Saving..." : mode === "add" ? "Add Template" : "Save Changes"}
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
  const thumb = item.images?.length ? imgUrl(item.images[0]) : "";
  const previewLink = item.previewUrl ? imgUrl(item.previewUrl) : "";
  const uploadedOn = formatDate(item.createdAt);
  const scheduled = isScheduled(item.scheduledAt);

  return (
    <div
      className="admin-card overflow-hidden transition-all duration-200 hover:-translate-y-1"
      style={{ cursor: "default" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 30px var(--admin-shadow)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = ""}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden" style={{ background: "var(--admin-hover)" }}>
        {thumb ? (
          <img src={thumb} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center fs10" style={{ color: "var(--admin-muted)" }}>
            No Image
          </div>
        )}
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

        {/* Uploaded date badge */}
        {uploadedOn && (
          <span
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full fs11 font-semibold"
            style={{ background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(6px)" }}
          >
            <IconClock /> {uploadedOn}
          </span>
        )}

        {/* Scheduled badge */}
        {scheduled && (
          <span
            className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full fs11 font-bold"
            style={{ background: "var(--admin-danger)", color: "#fff" }}
          >
            <IconClock /> Scheduled: {formatDateTime(item.scheduledAt)}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col gap-2">
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
          {item.originalPrice > item.price && (
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

        {/* Stats Row: downloads + rating */}
        <div className="flex items-center gap-3 fs10" style={{ color: "var(--admin-muted)" }}>
          <span className="flex items-center gap-1">
            <IconDownload /> {item.downloads || 0}
          </span>
          <span className="flex items-center gap-1">
            <IconStar /> {item.rating ? Number(item.rating).toFixed(1) : "0.0"} ({item.reviews || 0})
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold cursor-pointer border transition-all duration-200"
            style={{ borderColor: "var(--admin-border)", background: "var(--admin-bg)", color: "var(--admin-subtext)" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--admin-accent)"; e.currentTarget.style.color = "var(--admin-accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--admin-border)"; e.currentTarget.style.color = "var(--admin-subtext)"; }}
          >
            <IconEdit /> Edit
          </button>

          {previewLink && !scheduled && (
            <a
              href={previewLink}
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
          {previewLink && scheduled && (
            <span
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fs10 font-semibold"
              style={{ background: "var(--admin-hover)", color: "var(--admin-muted)" }}
            >
              <IconClock /> Not live yet
            </span>
          )}

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
  const [templates, setTemplates]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [modal, setModal]             = useState(null);
  const [saving, setSaving]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTag, setFilterTag]     = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Fetch templates on mount ── */
  const fetchTemplates = async () => {
    try {
      const res = await adminGetTemplatesAPI();
      if (res.success) setTemplates(res.templates);
    } catch (err) {
      console.error("Failed to fetch templates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  /* ── Unique values for filter dropdowns ── */
  const categoryOptions = [...new Set(templates.map((t) => t.category).filter(Boolean))];
  const tagOptions       = [...new Set(templates.map((t) => t.tag).filter(Boolean))];

  /* ── Search + Filter: matches name/tag/category, then narrows by dropdowns ── */
  const filtered = templates.filter((t) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.name?.toLowerCase().includes(q) ||
      t.tag?.toLowerCase().includes(q) ||
      t.category?.toLowerCase().includes(q);
    const matchesCategory = !filterCategory || t.category === filterCategory;
    const matchesTag       = !filterTag || t.tag === filterTag;
    return matchesSearch && matchesCategory && matchesTag;
  });

  const hasActiveFilters = !!(search || filterCategory || filterTag);

  const clearFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterTag("");
  };

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 whenever the result set changes
  useEffect(() => { setCurrentPage(1); }, [search, filterCategory, filterTag]);

  /* ── Build FormData & call API ── */
  const handleSave = async (form, imageFiles, zipFile) => {
    setSaving(true);
    try {
      const fd = new FormData();

      // Text fields
      const textFields = [
        "name", "subtitle", "tag", "price", "originalPrice", "description",
        "version", "updateDate", "releaseDate", "category",
        "frameworks", "compatible", "tags", "keyFeatures", "inTheBox", "libraries",
      ];
      textFields.forEach((key) => {
        if (form[key] !== undefined && form[key] !== "") fd.append(key, form[key]);
      });

    // / price/originalPrice hamesha bhejo (0 bhi valid hai)
    fd.set("price", form.price === "" || form.price === undefined ? 0 : form.price);
    fd.set("originalPrice", form.originalPrice === "" || form.originalPrice === undefined ? 0 : form.originalPrice);

      // Scheduled publish time — ISO string, or empty to publish immediately
      fd.append("scheduledAt", form.scheduledAt ? new Date(form.scheduledAt).toISOString() : "");

      // Image files (new uploads)
      if (imageFiles && imageFiles.length) {
        imageFiles.forEach((f) => fd.append("images", f));
      }

      // Zip file (new upload)
      if (zipFile) fd.append("zip", zipFile);

      let res;
      if (modal.mode === "add") {
        res = await adminCreateTemplateAPI(fd);
      } else {
        res = await adminUpdateTemplateAPI(form._id, fd);
      }

      if (res.success) {
        await fetchTemplates();   // re-fetch to stay in sync
        setModal(null);
      } else {
        alert(res.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Request failed");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      const res = await adminDeleteTemplateAPI(deleteTarget._id);
      if (res.success) {
        setTemplates((prev) => prev.filter((t) => t._id !== deleteTarget._id));
      }
    } catch (err) {
      console.error(err);
    }
    setDeleteTarget(null);
  };

  /* ── Prepare form data for edit modal ── */
  const openEdit = (t) => {
    // datetime-local input needs "YYYY-MM-DDTHH:mm" format, not a full ISO string
    const scheduledAtLocal = t.scheduledAt
      ? new Date(t.scheduledAt).toISOString().slice(0, 16)
      : "";
    setModal({
      mode: "edit",
      data: {
        ...t,
        // Convert arrays back to comma strings for the form inputs
        frameworks:  (t.frameworks  || []).join(", "),
        compatible:  (t.compatible  || []).join(", "),
        tags:        (t.tags        || []).join(", "),
        keyFeatures: (t.keyFeatures || []).join(", "),
        inTheBox:    (t.inTheBox    || []).join(", "),
        libraries:   (t.libraries   || []).join(", "),
        scheduledAt: scheduledAtLocal,
      },
    });
  };

  return (
    <div className="p-7">

      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="fs6 font-bold m-0" style={{ color: "var(--admin-text)" }}>
            Manage Templates
          </h1>
          <p className="fs10 mt-1 m-0" style={{ color: "var(--admin-muted)" }}>
            {templates.length} templates total{hasActiveFilters ? ` · ${filtered.length} matching` : ""}
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

      {/* Search + Filter bar */}
      <div className="flex items-center flex-wrap gap-3 mb-6">
        <div className="relative" style={{ maxWidth: 360, flex: "1 1 260px" }}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center" style={{ color: "var(--admin-muted)" }}>
            <IconSearch />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, tag or category..."
            className={`${inputCls} pl-9`}
          />
        </div>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl fs9 font-semibold cursor-pointer border transition-colors duration-200"
          style={{
            borderColor: showFilters ? "var(--admin-accent)" : "var(--admin-border)",
            background: showFilters ? "var(--admin-accent-soft)" : "var(--admin-bg)",
            color: showFilters ? "var(--admin-accent)" : "var(--admin-subtext)",
          }}
        >
          <IconFilter /> Filters {(filterCategory || filterTag) ? "•" : ""}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="fs10 font-semibold cursor-pointer border-0 bg-transparent"
            style={{ color: "var(--admin-danger)" }}
          >
            Clear all
          </button>
        )}
      </div>

      {showFilters && (
        <div className="flex items-center flex-wrap gap-3 mb-6 p-4 rounded-xl" style={{ background: "var(--admin-bg)", border: "1px solid var(--admin-border)" }}>
          <div style={{ minWidth: 200 }}>
            <label className={labelCls}>Category</label>
            <select
              className={inputCls}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: 200 }}>
            <label className={labelCls}>Tag</label>
            <select
              className={inputCls}
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <option value="">All tags</option>
              {tagOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 fs9" style={{ color: "var(--admin-muted)" }}>
          Loading templates...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 fs9" style={{ color: "var(--admin-muted)" }}>
          No templates found.
        </div>
      ) : (
        <>
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {paginated.map((item) => (
              <TemplateCard
                key={item._id}
                item={item}
                onEdit={openEdit}
                onDelete={(t) => setDeleteTarget(t)}
              />
            ))}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer border transition-colors duration-200"
                style={{
                  borderColor: "var(--admin-border)",
                  background: "var(--admin-bg)",
                  color: "var(--admin-subtext)",
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                <IconChevLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="fs10 px-1" style={{ color: "var(--admin-muted)" }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className="flex items-center justify-center w-9 h-9 rounded-xl fs9 font-semibold cursor-pointer border-0 transition-colors duration-200"
                      style={{
                        background: p === currentPage ? "var(--admin-accent-grad)" : "var(--admin-bg)",
                        color: p === currentPage ? "#fff" : "var(--admin-subtext)",
                        border: p === currentPage ? "none" : "1px solid var(--admin-border)",
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer border transition-colors duration-200"
                style={{
                  borderColor: "var(--admin-border)",
                  background: "var(--admin-bg)",
                  color: "var(--admin-subtext)",
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                <IconChevRight />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {modal && (
        <TemplateModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
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