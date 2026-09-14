import TemplateCard from "./TemplateCard";

export default function TemplateGrid({ loading, paginated, filteredLength, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-16 fontStyle9" style={{ color: "var(--admin-muted)" }}>
        Loading templates...
      </div>
    );
  }

  if (filteredLength === 0) {
    return (
      <div className="text-center py-16 fontStyle9" style={{ color: "var(--admin-muted)" }}>
        No templates found.
      </div>
    );
  }

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
      {paginated.map((item) => (
        <TemplateCard
          key={item._id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
