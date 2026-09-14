import { IconEdit, IconDelete, IconVisit, IconClock, IconDownload, IconStar, imgUrl, formatDate, formatDateTime, isScheduled } from "./constants.jsx";

export default function TemplateCard({ item, onEdit, onDelete }) {
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
          <div className="w-full h-full flex items-center justify-center fontStyle9" style={{ color: "var(--admin-muted)" }}>
            No Image
          </div>
        )}
        {/* Tag Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full fontStyle9 font-bold"
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
          <p className="fontStyle9 font-bold m-0" style={{ color: "var(--admin-text)" }}>{item.name}</p>
          {item.subtitle && (
            <p className="fontStyle9 m-0 mt-0.5" style={{ color: "var(--admin-muted)" }}>{item.subtitle}</p>
          )}
        </div>

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className="fontStyle9 font-extrabold" style={{ color: "var(--admin-accent)" }}>
            ${item.price}
          </span>
          {item.originalPrice > item.price && (
            <>
              <span className="fontStyle9 line-through" style={{ color: "var(--admin-muted)" }}>
                ${item.originalPrice}
              </span>
              <span
                className="fontStyle9 font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "var(--admin-success-soft)", color: "var(--admin-success)" }}
              >
                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Stats Row: views + downloads + rating */}
        <div className="flex items-center gap-3 fontStyle9" style={{ color: "var(--admin-muted)" }}>
          <span className="flex items-center gap-1">
            <IconVisit /> {item.views || 0}
          </span>
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
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border transition-all duration-200"
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
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fontStyle9 font-semibold transition-all duration-200 no-underline"
              style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,102,241,0.18)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--admin-accent-soft)"}
            >
              <IconVisit /> Visit
            </a>
          )}
          {previewLink && scheduled && (
            <span
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fontStyle9 font-semibold"
              style={{ background: "var(--admin-hover)", color: "var(--admin-muted)" }}
            >
              <IconClock /> Not live yet
            </span>
          )}

          <button
            onClick={() => onDelete(item)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border-0 transition-all duration-200"
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
