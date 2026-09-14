import { IconChevLeft, IconChevRight } from "./constants.jsx";

export default function PaginationControls({ currentPage, totalPages, setCurrentPage }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
      acc.push(p);
      return acc;
    }, []);

  return (
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

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="fontStyle9 px-1" style={{ color: "var(--admin-muted)" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className="flex items-center justify-center w-9 h-9 rounded-xl fontStyle9 font-semibold cursor-pointer border-0 transition-colors duration-200"
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
  );
}
