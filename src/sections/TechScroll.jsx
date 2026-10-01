const TECH = [
  { icon: "fa-css3-alt",   label: "CSS",        color: "#2965f1" },
  { icon: "fa-html5",      label: "HTML",       color: "#e34f26" },
  { icon: "fa-square-js",  label: "JavaScript", color: "#f7df1e", fg: "#111827" },
  { icon: "fa-vuejs",      label: "Vue.js",     color: "#42b883" },
  { icon: "fa-react",      label: "React",      color: "#0ea5e9" },
  { icon: "fa-laravel",    label: "Laravel",    color: "#ff2d20" },
  { icon: "fa-node-js",    label: "Node.js",    color: "#3c873a" },
  { icon: "fa-php",        label: "PHP",        color: "#777bb3" },
  { icon: "fa-sass",       label: "Sass",       color: "#cc6699" },
  { icon: "fa-bootstrap",  label: "Bootstrap",  color: "#7952b3" },
];

function TechItem({ icon, label, color, fg = "#ffffff", hidden = false }) {
  return (
    <div
      aria-hidden={hidden}
      style={{ "--c": color, "--fg": fg }}
      className="scroll_item group flex-shrink-0 inline-flex items-center gap-2 sm:gap-3 pl-1.5 sm:pl-2 pr-4 sm:pr-6 py-1.5 sm:py-2 rounded-full
        bg-[var(--color5)] border-2 border-[var(--color6)]/10
        hover:border-[var(--c)] hover:-translate-y-1 hover:shadow-[0_10px_24px_-8px_var(--c)]
        transition-all duration-300 cursor-default"
    >
      {/* Icon circle */}
      <div
        style={{ background: `${color}1f`, color }}
        className="scroll_icon w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0
          group-hover:!bg-[var(--c)] group-hover:!text-[var(--fg)]
          transition-all duration-300"
      >
        <i className={`fa-brands ${icon} fontStyle6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}></i>
      </div>

      {/* Label */}
      <h4 className="scroll_text fontStyle7 text-[var(--color6)] font-semibold tracking-tight whitespace-nowrap">
        {label}
      </h4>
    </div>
  );
}

export default function TechScroll() {
  // 3 copies => seamless loop, kabhi khali jagah nahi dikhegi
  const row1 = [...TECH, ...TECH, ...TECH];
  const row2 = [...TECH].reverse();
  const row2Loop = [...row2, ...row2, ...row2];

  return (
    <section className="scroll_icon_section py-5 sm:py-8" aria-label="Technologies we use">
      <div className="scroll_track">
        {/* gap aur pr hamesha barabar rakhein, tabhi loop seamless rehta hai */}
        <div className="scroll_list flex gap-3 pr-3 sm:gap-4 sm:pr-4 pt-2 pb-3 sm:pb-4">
          {row1.map((t, i) => (
            <TechItem key={`${t.label}-${i}`} {...t} hidden={i >= TECH.length} />
          ))}
        </div>
      </div>
      <div className="scroll_track scroll_track2">
        <div className="scroll_list flex gap-3 pr-3 sm:gap-4 sm:pr-4 pt-2 pb-3 sm:pb-4">
          {row2Loop.map((t, i) => (
            <TechItem key={`${t.label}-${i}`} {...t} hidden={i >= TECH.length} />
          ))}
        </div>
      </div>
    </section>
  );
}