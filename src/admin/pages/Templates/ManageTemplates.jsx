import { useState, useEffect } from "react";
import { adminGetTemplatesAPI, adminCreateTemplateAPI, adminUpdateTemplateAPI, adminDeleteTemplateAPI } from "../../services/adminApi";
import { PageHeader, SearchAndFilters, PaginationControls, TemplateGrid, TemplateModal, DeleteConfirm } from "./components/index.jsx";

const emptyForm = {
  name: "", subtitle: "", tag: "", price: "", originalPrice: "", description: "",
  version: "", updateDate: "", releaseDate: "", category: "",
  frameworks: "", compatible: "", tags: "", keyFeatures: "", inTheBox: "", libraries: "",
  scheduledAt: "",
};

const ITEMS_PER_PAGE = 9;

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
  const handleSave = async (form, imageFiles, zipFile, existingUrls) => {
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

      // Reordered existing images (no new uploads)
      console.log("🔍 handleSave - imageFiles:", imageFiles?.length, "existingUrls:", existingUrls);
      if ((!imageFiles || !imageFiles.length) && existingUrls && existingUrls.length) {
        console.log("📦 Sending existingImages:", JSON.stringify(existingUrls));
        fd.append("existingImages", JSON.stringify(existingUrls));
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

      <PageHeader
        total={templates.length}
        filtered={filtered.length}
        hasActiveFilters={hasActiveFilters}
        onAdd={() => setModal({ mode: "add", data: { ...emptyForm } })}
      />

      <SearchAndFilters
        search={search} setSearch={setSearch}
        showFilters={showFilters} setShowFilters={setShowFilters}
        filterCategory={filterCategory} setFilterCategory={setFilterCategory}
        filterTag={filterTag} setFilterTag={setFilterTag}
        categoryOptions={categoryOptions} tagOptions={tagOptions}
        hasActiveFilters={hasActiveFilters} clearFilters={clearFilters}
      />

      <TemplateGrid
        loading={loading}
        paginated={paginated}
        filteredLength={filtered.length}
        onEdit={openEdit}
        onDelete={(t) => setDeleteTarget(t)}
      />

      {filtered.length > 0 && !loading && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

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
