import { Link } from "react-router-dom";

// Desktop "Templates" nav item + its hover dropdown panel (3 columns).
export default function DesktopMegaMenu({ tabs, activeTab, onTabChange, onEnsureTemplates }) {
  const activeTabData = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <li className="relative group" onMouseEnter={onEnsureTemplates}>
      <Link
        to="/templates"
        className="hover:opacity-70 transition duration-300 flex items-center gap-1.5"
      >
        <i className="bx bx-layout text-base"></i>
        Templates
        <i className="bx bx-chevron-down text-base transition-transform duration-300 group-hover:rotate-180"></i>
      </Link>

      {/* Dropdown panel */}
      {tabs.length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block z-[9999]">
          <div className="relative shadow-2xl rounded-2xl border border-[var(--color11)] w-[860px] bg-[var(--color5)]">

            {/* arrow */}
            <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color5)] border-l border-t border-[var(--color11)] rotate-45 z-10"></div>

            <div className="flex min-h-[340px]">

              {/* LEFT — tab list */}
              <div className="flex flex-col py-4 px-3 gap-1 border-r border-[var(--color11)] w-[210px] bg-[var(--color5)] rounded-l-2xl overflow-y-auto max-h-[400px]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onMouseEnter={() => onTabChange(tab.id)}
                    className={`w-full text-left flex items-center justify-between gap-2 px-3 py-3 rounded-xl transition-all duration-200 fontStyle8 cursor-pointer border-0 outline-none
                      ${activeTab === tab.id
                        ? "bg-[rgba(99,102,241,0.08)] text-[var(--color4)] font-semibold"
                        : "bg-transparent text-[var(--color6)] hover:bg-[var(--color11)] hover:bg-opacity-40"
                      }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <i className={`bx ${tab.icon} text-base shrink-0`}></i>
                      <span className="truncate">{tab.label}</span>
                    </span>
                    <i className="bx bx-chevron-right text-sm opacity-50 shrink-0"></i>
                  </button>
                ))}

                <div className="mt-auto pt-3 border-t border-[var(--color11)]">
                  <Link
                    to="/templates"
                    className="flex items-center gap-2 px-3 py-2.5 fontStyle9 text-[var(--color4)] font-semibold hover:opacity-70 transition duration-200"
                  >
                    <i className="bx bx-grid-alt text-sm"></i>
                    All Templates
                  </Link>
                </div>
              </div>

              {/* MIDDLE — links for active tab */}
              <div className="flex-1 py-6 px-6">
                <p className="fontStyle9 font-bold text-[var(--color4)] uppercase tracking-widest mb-4 opacity-60">
                  {activeTabData?.label}
                </p>
                <ul className="space-y-1">
                  {activeTabData?.links.map((item) => (
                    <li key={item.id ?? item.to}>
                      <Link
                        to={item.to}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color11)] hover:bg-opacity-40 transition duration-200 group/item"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-[rgba(99,102,241,0.1)]">
                          <i className="bx bx-link-external text-xs text-[var(--color4)]"></i>
                        </span>
                        <div>
                          <p className="fontStyle8 font-semibold text-[var(--color6)] group-hover/item:text-[var(--color4)] transition duration-200">
                            {item.label}
                          </p>
                          <p className="fontStyle9 text-[var(--color6)] opacity-50 text-xs mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* RIGHT — featured card */}
              <div className="py-6 px-5 flex flex-col justify-between w-[240px] border-l border-[var(--color11)] rounded-r-2xl">
                <div>
                  <p className="fontStyle9 font-bold text-[var(--color4)] uppercase tracking-widest mb-4 opacity-60">
                    Featured
                  </p>

                  <div
                    className="rounded-xl overflow-hidden mb-4 h-[148px] relative"
                    style={{ background: activeTabData?.featured.bg }}
                  >
                    <div className="absolute -top-5 -right-5 w-[100px] h-[100px] rounded-full bg-white/[0.08]" />
                    <div className="absolute -bottom-[30px] -left-5 w-[130px] h-[130px] rounded-full bg-white/[0.06]" />
                    <span className="absolute top-3 left-3 fontStyle9 font-bold text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      {activeTabData?.featured.tag}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 rounded-lg p-2 bg-white/[0.15] backdrop-blur-md">
                      <div className="flex gap-1 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                        <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                      </div>
                      <div className="h-1 rounded-sm bg-white/40 mb-[3px]" />
                      <div className="h-1 rounded-sm bg-white/25 w-[70%]" />
                    </div>
                  </div>

                  <p className="fontStyle8 font-bold text-[var(--color6)] mb-1">
                    {activeTabData?.featured.title}
                  </p>
                  <p className="fontStyle9 text-[var(--color6)] opacity-50 text-xs leading-relaxed">
                    {activeTabData?.featured.desc}
                  </p>
                </div>

                <Link
                  to={activeTabData?.featured.to}
                  className="fontStyle9 font-semibold text-[var(--color4)] hover:opacity-70 transition duration-200 mt-4 inline-flex items-center gap-1"
                >
                  {activeTabData?.featured.cta}
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}
    </li>
  );
}
