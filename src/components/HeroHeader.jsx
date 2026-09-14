export default function HeroHeader({ search }) {
  return (
    <div className="mt-6 sm:mt-8 mb-8 sm:mb-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-0.5 rounded-full bg-[var(--color6)] opacity-40 inline-block"></span>
            <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">
              Live Previews
            </span>
          </div>
          <h1 className="fontStyle3 font-bold text-[var(--color6)] leading-tight mb-3">
            Demo Showcase
          </h1>
          <p className="fontStyle8 text-[var(--color4)] leading-relaxed">
            Browse live previews of every template before you download. See
            real interactions, real layouts, real results.
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 flex-wrap lg:flex-nowrap">
          {[
            { icon: "bx-layer", val: "1045+", lbl: "Templates" },
            { icon: "bx-category", val: "20+", lbl: "Categories" },
            { icon: "bx-gift", val: "100%", lbl: "Free Access" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)]"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-color3">
                <i className={`bx ${s.icon} text-white text-base`}></i>
              </div>
              <div>
                <p className="fontStyle8 font-bold text-[var(--color6)] leading-none">
                  {s.val}
                </p>
                <p className="fontStyle10 text-[var(--color4)] mt-0.5">
                  {s.lbl}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
