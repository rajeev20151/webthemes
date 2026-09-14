const TECH = [
  { icon: "fa-css3-alt",   label: "CSS" },
  { icon: "fa-html5",      label: "HTML" },
  { icon: "fa-square-js",  label: "JavaScript" },
  { icon: "fa-vuejs",      label: "Vue.js" },
  { icon: "fa-react",      label: "React" },
  { icon: "fa-laravel",    label: "Laravel" },
  { icon: "fa-node-js",    label: "Node.js" },
  { icon: "fa-php",        label: "PHP" },
  { icon: "fa-sass",       label: "Sass" },
  { icon: "fa-bootstrap",  label: "Bootstrap" },
];

function TechItem({ icon, label }) {
  return (
    <div
      className="scroll_item inline-flex items-center gap-4 bg-[var(--color5)]/80 backdrop-blur-sm p-2 rounded-full w-45
        border border-[var(--color6)]/10 shadow-[0_4px_16px_rgba(0,0,0,0.04)]
        hover:border-[var(--color6)]/25 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]
        hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="scroll_icon w-12 h-12 rounded-full flex items-center justify-center bg-color3
        group-hover:scale-110 transition-transform duration-300">
        <i className={`fa-brands ${icon} text-white fontStyle6`}></i>
      </div>
      <h4 className="scroll_text fontStyle7 text-[var(--color6)] font-semibold tracking-tight">{label}</h4>
    </div>
  );
}

export default function TechScroll() {
  return (
    <section className="scroll_icon_section py-8 sm:py-10">
      <div className="scroll_track">
        <div className="scroll_list flex gap-4">
          {TECH.map((t) => (
            <TechItem key={t.label} {...t} />
          ))}
        </div>
      </div>
      <div className="scroll_track scroll_track2 mt-4">
        <div className="scroll_list flex gap-4">
          {[...TECH].reverse().map((t) => (
            <TechItem key={t.label} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}