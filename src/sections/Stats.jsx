const STATS = [
  { icon: "bx-layer",       value: "500+",  label: "Templates" },
  { icon: "bx-user-check",  value: "10K+",  label: "Happy Users" },
  { icon: "bx-category",    value: "50+",   label: "Categories" },
  { icon: "bx-support",     value: "24/7",  label: "Support" },
];

export default function Stats() {
  return (
    <section className="py-16 sm:py-20 overflow-hidden">
      <div className="w-width">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="group relative text-center p-6 sm:p-8 rounded-2xl
                border border-[var(--color6)]/8 bg-[var(--color5)]/60
                shadow-[0_4px_20px_rgba(0,0,0,0.04)]
                hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)]
                hover:-translate-y-1
                transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-color3
                group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <i className={`bx ${s.icon} text-white text-xl`}></i>
              </div>
              <p className="fontStyle4 font-bold text-[var(--color6)] leading-none mb-1.5">
                {s.value}
              </p>
              <p className="fontStyle9 text-[var(--color4)] font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
