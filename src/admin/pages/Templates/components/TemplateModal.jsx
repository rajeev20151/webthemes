import { useState, useRef } from "react";
import { IconClose, IconUpload, IconZip, IconWarning, inputCls, labelCls, imgUrl, formatBytes, MAX_IMAGE_SIZE_MB, MAX_ZIP_SIZE_MB } from "./constants.jsx";

export default function TemplateModal({ mode, data, onClose, onSave, saving }) {
  const [form, setForm]             = useState({ ...data });
  const [imagePreviews, setPreviews] = useState(
    (data.images || []).map((p) => imgUrl(p))
  );
  const [existingUrls, setExistingUrls] = useState(data.images || []);
  const [imageFiles, setImageFiles]  = useState([]);       // new.File objects
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
    setExistingUrls([]);
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

  const moveImage = (from, to) => {
    setPreviews((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    setImageFiles((prev) => {
      if (!prev.length) return prev;
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
    setExistingUrls((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
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
    onSave(finalForm, imageFiles, zipFile, existingUrls);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative z-[9999] flex flex-col max-h-[95vh] sm:max-h-[90vh]"
        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--admin-border)" }}
        >
          <p className="fontStyle7 font-semibold m-0" style={{ color: "var(--admin-text)" }}>
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
        <div className="px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-4 flex-1 overflow-y-auto min-h-0">

          {/* ── Error banner ── */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl fontStyle9 font-semibold"
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
                <div className="flex gap-3 justify-center flex-wrap">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={src} alt={`preview-${i}`} className="h-28 rounded-lg object-cover" />
                      {/* Index badge */}
                      <span
                        className="absolute top-1 left-1 w-6 h-6 flex items-center justify-center rounded-full fontStyle9 font-bold text-white"
                        style={{ background: "var(--admin-accent)", fontSize: "11px" }}
                      >
                        {i + 1}
                      </span>
                      {/* Reorder buttons */}
                      <div className="absolute bottom-1 right-1 hidden group-hover:flex gap-1">
                        {i > 0 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveImage(i, i - 1); }}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-white cursor-pointer border-0"
                            style={{ background: "rgba(0,0,0,0.6)", fontSize: "12px" }}
                          >
                            &#9664;
                          </button>
                        )}
                        {i < imagePreviews.length - 1 && (
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveImage(i, i + 1); }}
                            className="w-6 h-6 flex items-center justify-center rounded-full text-white cursor-pointer border-0"
                            style={{ background: "rgba(0,0,0,0.6)", fontSize: "12px" }}
                          >
                            &#9654;
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2" style={{ color: "var(--admin-muted)" }}>
                  <IconUpload />
                  <p className="fontStyle9 m-0">Click to upload images (max 3)</p>
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
              <span className="fontStyle9" style={{ color: zipName ? "var(--admin-text)" : "var(--admin-muted)" }}>
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
              <span className="fontStyle9 font-semibold" style={{ color: "var(--admin-text)" }}>
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
            <span className="fontStyle9 font-bold uppercase tracking-widest" style={{ color: "var(--admin-accent)" }}>
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
              <input type="date" className={inputCls} value={form.updateDate || ""} onChange={(e) => set("updateDate", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Release Date</label>
              <input type="date" className={inputCls} value={form.releaseDate || ""} onChange={(e) => set("releaseDate", e.target.value)} />
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
            className="px-5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer transition-colors duration-200 border"
            style={{ borderColor: "var(--admin-border)", background: "transparent", color: "var(--admin-subtext)" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-hover)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 rounded-xl fontStyle9 font-bold text-white cursor-pointer border-0 transition-opacity duration-200"
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
