import { Link } from "react-router-dom";

export default function ThemeMetaCard({ theme }) {
  const metaItems = [
    { label: "Version", value: theme.version, icon: "bx-hash", color: "text-violet-500" },
    { label: "Updated", value: theme.updateDate, icon: "bx-refresh", color: "text-blue-500" },
    { label: "Released", value: theme.releaseDate, icon: "bx-calendar", color: "text-emerald-500" },
  ];

  return (
    <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="px-5 pt-4 pb-3 border-b border-[var(--color6)]/10">
        <h3 className="fontStyle8 font-bold text-[var(--color6)] flex items-center gap-2">
          <i className="bx bx-info-circle text-[var(--color3)] text-lg"></i>
          Template Info
        </h3>
      </div>

      <div className="p-5 space-y-0">
        {metaItems.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2.5 border-b border-[var(--color6)]/[0.06] last:border-0">
            <span className="fontStyle10 text-[var(--color4)] flex items-center gap-2">
              <i className={`bx ${item.icon} ${item.color} text-sm`}></i>
              {item.label}
            </span>
            <span className="fontStyle10 font-semibold text-[var(--color6)]">{item.value || "—"}</span>
          </div>
        ))}

        <div className="flex items-center justify-between py-2.5 border-b border-[var(--color6)]/[0.06]">
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-2">
            <i className="bx bx-category text-rose-500 text-sm"></i>
            Category
          </span>
          <Link to="#" className="fontStyle10 font-semibold text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200">{theme.category}</Link>
        </div>

        <div className="py-2.5 border-b border-[var(--color6)]/[0.06]">
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-2 mb-2">
            <i className="bx bx-code-alt text-amber-500 text-sm"></i>
            Built With
          </span>
          <div className="flex flex-wrap gap-1.5 pl-5">
            {(theme.frameworks || []).map((f) => {
              const lower = f.toLowerCase();
              const color = lower.includes("react") ? "bg-cyan-50 text-cyan-600 border-cyan-200"
                : lower.includes("tailwind") ? "bg-sky-50 text-sky-600 border-sky-200"
                : lower.includes("bootstrap") ? "bg-violet-50 text-violet-600 border-violet-200"
                : lower.includes("jquery") ? "bg-blue-50 text-blue-600 border-blue-200"
                : "bg-gray-50 text-gray-600 border-gray-200";
              return (
                <span key={f} className={`inline-flex items-center px-2.5 py-1 rounded-lg fontStyle10 font-medium border ${color}`}>
                  {f}
                </span>
              );
            })}
          </div>
        </div>

        <div className="pt-2.5">
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-2 mb-2">
            <i className="bx bx-check-shield text-emerald-500 text-sm"></i>
            Compatible With
          </span>
          <div className="flex flex-wrap gap-1.5 pl-5">
            {(theme.compatible || []).map((c) => {
              const lower = c.toLowerCase();
              const icon = lower.includes("chrome") ? "bxl-chrome"
                : lower.includes("firefox") ? "bxl-firefox"
                : lower.includes("safari") ? "bxl-safari"
                : lower.includes("edge") ? "bxl-edge"
                : lower === "desktop" ? "bx-desktop"
                : lower === "tablet" ? "bx-tab"
                : lower === "mobile" ? "bx-mobile-alt"
                : "bx-check-circle";
              const color = lower.includes("chrome") ? "bg-blue-50 text-blue-600 border-blue-200"
                : lower.includes("firefox") ? "bg-orange-50 text-orange-500 border-orange-200"
                : lower.includes("safari") ? "bg-sky-50 text-sky-500 border-sky-200"
                : lower.includes("edge") ? "bg-teal-50 text-teal-600 border-teal-200"
                : lower === "desktop" ? "bg-violet-50 text-violet-600 border-violet-200"
                : lower === "tablet" ? "bg-pink-50 text-pink-500 border-pink-200"
                : lower === "mobile" ? "bg-amber-50 text-amber-500 border-amber-200"
                : "bg-gray-50 text-gray-500 border-gray-200";
              return (
                <span key={c} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg fontStyle10 font-medium border ${color}`}>
                  <i className={`bx ${icon} text-xs`}></i>{c}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
