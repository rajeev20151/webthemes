import { useState, useEffect } from "react";
import {
  API_BASE,
  adminGetBlogsAPI,
  adminCreateBlogAPI,
  adminUpdateBlogAPI,
  adminDeleteBlogAPI,
} from "../../services/adminApi";

const CATEGORIES = ["All", "Design", "Development", "Templates", "Tips & Tricks", "Case Studies"];

const emptyForm = {
  title: "", slug: "", category: "Development", tag: "", excerpt: "",
  authorName: "Admin", authorRole: "", readTime: "5 min read",
  featured: false, status: "published", tags: "",
};

/* ── Icons ── */
const IconPlus    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconEdit    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconDelete  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconClose   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconUpload  = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconSearch  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconWarning = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const inputCls = [
  "w-full px-3 py-2.5 rounded-xl outline-none transition-all duration-200",
  "border border-[var(--admin-border)]",
  "bg-[var(--admin-bg)] text-[var(--admin-text)]",
  "placeholder:text-[var(--admin-muted)]",
  "focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)]",
  "fontStyle9",
].join(" ");
const labelCls = "block fontStyle9 font-semibold uppercase tracking-wider text-[var(--admin-muted)] mb-1.5";

const resolveUrl = (p) => {
  if (!p) return "";
  if (p.startsWith("http") || p.startsWith("blob:")) return p;
  return `${API_BASE.replace(/\/api\/?$/, "")}${p}`;
};

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

/* ════════════════════════════════════════════
   MODAL
════════════════════════════════════════════ */
function BlogModal({ mode, data, onClose, onSave, saving }) {
  const [form, setForm]       = useState({
    ...data,
    tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(data.image ? resolveUrl(data.image) : "");
  const [error, setError]     = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const autoSlug = (title) => {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title?.trim()) return setError("Title is required");
    if (!form.excerpt?.trim()) return setError("Excerpt is required");

    try {
      const fd = new FormData();
      const ALLOW = ["title","slug","category","tag","excerpt","authorName","authorRole","readTime","featured","status","content"];
      Object.entries(form).forEach(([k, v]) => {
        if (!ALLOW.includes(k)) return;
        if (k === "tags") {
          const tagsStr = Array.isArray(v) ? v.join(", ") : (v || "");
          fd.append("tags", JSON.stringify(tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : []));
        } else if (k === "content") {
          fd.append("content", JSON.stringify(Array.isArray(v) ? v : []));
        } else {
          fd.append(k, String(v));
        }
      });
      if (imageFile) fd.append("image", imageFile);

      const res = await onSave(fd);
      if (!res?.success) setError(res?.message || "Something went wrong");
    } catch (err) {
      setError(err.message || "Save failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--admin-surface)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--admin-border)]">
          <h2 className="fontStyle7 font-bold text-[var(--admin-text)]">{mode === "add" ? "Add Blog Post" : "Edit Blog Post"}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--admin-hover)] transition text-[var(--admin-muted)]"><IconClose /></button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] fontStyle9">
              <IconWarning /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelCls}>Title *</label>
              <input
                className={inputCls}
                value={form.title}
                onChange={(e) => { set("title", e.target.value); if (mode === "add") set("slug", autoSlug(e.target.value)); }}
                placeholder="Blog post title"
              />
            </div>

            <div>
              <label className={labelCls}>Slug</label>
              <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-slug" />
            </div>

            <div>
              <label className={labelCls}>Category *</label>
              <select className="admin-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Tag</label>
              <input className={inputCls} value={form.tag} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. FREE, PRO" />
            </div>

            <div>
              <label className={labelCls}>Read Time</label>
              <input className={inputCls} value={form.readTime} onChange={(e) => set("readTime", e.target.value)} placeholder="5 min read" />
            </div>

            <div>
              <label className={labelCls}>Author Name</label>
              <input className={inputCls} value={form.authorName} onChange={(e) => set("authorName", e.target.value)} placeholder="Author name" />
            </div>

            <div>
              <label className={labelCls}>Author Role</label>
              <input className={inputCls} value={form.authorRole} onChange={(e) => set("authorRole", e.target.value)} placeholder="e.g. Frontend Developer" />
            </div>

            <div>
              <label className={labelCls}>Status</label>
              <select className="admin-select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className={labelCls}>Tags (comma separated)</label>
              <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="react, javascript, design" />
            </div>

            <div className="flex items-center gap-3 pt-5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                <div className="w-9 h-5 bg-[var(--admin-border)] rounded-full peer peer-checked:bg-[var(--admin-accent)] transition-all after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
              </label>
              <span className="fontStyle9 text-[var(--admin-subtext)]">Featured Post</span>
            </div>

            <div className="md:col-span-2">
              <label className={labelCls}>Excerpt *</label>
              <textarea className={inputCls + " min-h-[80px] resize-y"} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Short description of the blog post" rows={3} />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label className={labelCls}>Featured Image</label>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--admin-border)] rounded-xl cursor-pointer hover:border-[var(--admin-accent)] transition-all bg-[var(--admin-bg)]">
                {preview ? (
                  <img src={preview} alt="" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="text-center">
                    <div className="text-[var(--admin-muted)]"><IconUpload /></div>
                    <p className="fontStyle9 text-[var(--admin-muted)] mt-2">Click to upload image</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--admin-border)]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl fontStyle9 font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] transition">Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl fontStyle9 font-semibold text-white transition-all"
              style={{ background: "var(--admin-accent-grad)" }}
            >
              {saving ? "Saving..." : mode === "add" ? "Create Post" : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DELETE CONFIRM
════════════════════════════════════════════ */
function DeleteConfirm({ title, onConfirm, onCancel, saving }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-[var(--admin-surface)] rounded-2xl shadow-2xl w-full max-w-sm p-6 z-[9999]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--admin-danger-soft)] flex items-center justify-center text-[var(--admin-danger)]"><IconWarning /></div>
          <h3 className="fontStyle7 font-bold text-[var(--admin-text)]">Delete Blog</h3>
        </div>
        <p className="fontStyle9 text-[var(--admin-subtext)] mb-6">
          Are you sure you want to delete <strong>"{title}"</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-xl fontStyle9 font-semibold text-[var(--admin-muted)] hover:bg-[var(--admin-hover)] transition">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl fontStyle9 font-semibold text-white bg-[var(--admin-danger)] hover:opacity-90 transition"
          >
            {saving ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   BLOG CARD
════════════════════════════════════════════ */
function BlogCard({ blog, onEdit, onDelete }) {
  const isPublished = blog.status === "published";
  return (
    <div className="bg-[var(--admin-surface)] rounded-2xl border border-[var(--admin-border)] overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-[var(--admin-bg)]">
        {blog.image ? (
          <img src={resolveUrl(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--admin-muted)] fontStyle9">No Image</div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-lg fontStyle9 font-bold ${isPublished ? "bg-[var(--admin-success-soft)] text-[var(--admin-success)]" : "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]"}`}>
            {isPublished ? "Published" : "Draft"}
          </span>
          {blog.featured && (
            <span className="px-2.5 py-1 rounded-lg fontStyle9 font-bold bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">Featured</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-md fontStyle9 font-semibold bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">{blog.category}</span>
          {blog.tag && <span className="px-2 py-0.5 rounded-md fontStyle9 font-semibold bg-[var(--admin-hover)] text-[var(--admin-muted)]">{blog.tag}</span>}
        </div>
        <h3 className="fontStyle9 font-bold text-[var(--admin-text)] line-clamp-2 mb-2">{blog.title}</h3>
        <p className="fontStyle9 text-[var(--admin-muted)] line-clamp-2 mb-3">{blog.excerpt}</p>
        <div className="flex items-center justify-between text-[var(--admin-muted)]">
          <span className="fontStyle9">{blog.authorName}</span>
          <span className="fontStyle9">{formatDate(blog.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--admin-border)]">
          <a
            href={`/blog/${blog.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg fontStyle9 font-semibold text-[var(--admin-accent)] hover:bg-[var(--admin-accent-soft)] transition"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Visit
          </a>
          <button onClick={() => onEdit(blog)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg fontStyle9 font-semibold text-[var(--admin-subtext)] hover:bg-[var(--admin-hover)] transition">
            <IconEdit /> Edit
          </button>
          <button onClick={() => onDelete(blog)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg fontStyle9 font-semibold text-[var(--admin-danger)] hover:bg-[var(--admin-danger-soft)] transition ml-auto">
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
export default function ManageBlogs() {
  const [blogs, setBlogs]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [modal, setModal]         = useState(null); // null | { mode: "add"|"edit", data }
  const [saving, setSaving]       = useState(false);
  const [deleteTarget, setDelete] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    const res = await adminGetBlogsAPI();
    if (res.success) setBlogs(res.blogs);
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const filtered = blogs.filter((b) => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || b.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleSave = async (formData) => {
    setSaving(true);
    let res;
    if (modal.mode === "add") {
      res = await adminCreateBlogAPI(formData);
    } else {
      res = await adminUpdateBlogAPI(modal.data._id, formData);
    }
    setSaving(false);
    if (res.success) {
      setModal(null);
      fetchBlogs();
    }
    return res;
  };

  const handleDelete = async () => {
    setSaving(true);
    const res = await adminDeleteBlogAPI(deleteTarget._id);
    setSaving(false);
    if (res.success) {
      setDelete(null);
      fetchBlogs();
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="fontStyle7 font-bold text-[var(--admin-text)]">Blog Management</h1>
          <p className="fontStyle9 text-[var(--admin-muted)] mt-1">{blogs.length} total posts</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: emptyForm })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl fontStyle9 font-semibold text-white transition-all"
          style={{ background: "var(--admin-accent-grad)" }}
        >
          <IconPlus /> Add Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]"><IconSearch /></span>
          <input
            className={inputCls + " pl-10"}
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="admin-select w-full sm:w-48"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--admin-accent)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="fontStyle9 text-[var(--admin-muted)]">No blog posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((blog) => (
            <BlogCard key={blog._id} blog={blog} onEdit={(b) => setModal({ mode: "edit", data: b })} onDelete={setDelete} />
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && <BlogModal mode={modal.mode} data={modal.data} onClose={() => setModal(null)} onSave={handleSave} saving={saving} />}

      {/* Delete Confirm */}
      {deleteTarget && <DeleteConfirm title={deleteTarget.title} onConfirm={handleDelete} onCancel={() => setDelete(null)} saving={saving} />}
    </div>
  );
}
