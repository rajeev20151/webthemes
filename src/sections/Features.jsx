const FEATURES = [
  {
    icon: "bx-diamond",
    title: "Quality First",
    desc: "Every template is meticulously crafted, tested, and refined to meet the highest standards.",
  },
  {
    icon: "bx-shield-alt-2",
    title: "Customer Trust",
    desc: "We build long-term relationships based on transparency, reliability, and exceptional support.",
  },
  {
    icon: "bx-bulb",
    title: "Innovation",
    desc: "We constantly explore new technologies and design trends to keep our templates modern.",
  },
  {
    icon: "bx-dollar-circle",
    title: "Affordability",
    desc: "Premium quality shouldn't break the bank. We offer competitive pricing that provides real value.",
  },
  {
    icon: "bx-code-alt",
    title: "Clean Code",
    desc: "Well-structured, documented, and maintainable code that developers love to work with.",
  },
  {
    icon: "bx-heart",
    title: "Passion",
    desc: "We genuinely love what we do, and it shows in every template and interaction we have.",
  },
];

function FeatureCard({ icon, title, desc, index }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      className="group relative flex flex-col h-full p-6 sm:p-7 rounded-2xl overflow-hidden
        bg-[var(--color5)] border-2 border-[var(--color6)]
        shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
        transition-all duration-300
        hover:shadow-[2px_2px_0px_var(--color6)] hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-1.5 sm:hover:translate-y-1.5"
    >
      {/* Big outlined number */}
      <span
        className="absolute top-3 right-5 fontStyle3 font-bold leading-none select-none pointer-events-none
          text-[var(--color6)]/10 group-hover:text-[var(--color6)]/25 transition-colors duration-300"
      >
        {number}
      </span>

      {/* Icon tile */}
      <div
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-color3 flex items-center justify-center mb-6
          border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)]
          -rotate-6 group-hover:rotate-0 group-hover:scale-105
          transition-all duration-300"
      >
        <i className={`bx ${icon} text-white text-3xl`}></i>
      </div>

      {/* Text */}
      <h3 className="fontStyle6 text-[var(--color6)] font-bold mb-3">{title}</h3>
      <p className="fontStyle8 text-[var(--color8)] leading-relaxed mb-6">{desc}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t-2 border-dashed border-[var(--color6)]/15">
        <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">
          Feature {number}
        </span>
        <span
          className="w-8 h-8 rounded-full border-2 border-[var(--color6)] flex items-center justify-center
            text-[var(--color6)] group-hover:bg-[var(--color6)] group-hover:text-[var(--color5)]
            transition-all duration-300"
        >
          <i className="bx bx-right-arrow-alt text-lg transition-transform duration-300 group-hover:translate-x-0.5"></i>
        </span>
      </div>

      {/* Bottom accent bar */}
      <span className="absolute bottom-0 left-0 h-1.5 w-0 bg-color3 group-hover:w-full transition-all duration-500 ease-out"></span>
    </div>
  );
}

export default function Features() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="w-width relative z-10">
        {/* ── Heading ── */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 md:mb-16">
          <span
            className="inline-flex items-center gap-2 fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)]
              bg-[var(--color5)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)]
              px-4 py-1.5 rounded-full mb-5 sm:mb-6 -rotate-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ade80] border border-[var(--color6)] animate-pulse"></span>
            Why Choose Us
          </span>
          <h2 className="fontStyle4 text-[var(--color6)] font-bold leading-tight mb-4">
            Crafted with exclusive features
          </h2>
          <p className="fontStyle8 text-[var(--color4)] max-w-lg mx-auto px-2">
            Everything you need to build stunning websites — packed into one powerful template collection.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-9 lg:gap-10 pb-4">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={i % 3 === 1 ? "lg:mt-10" : ""}>
              <FeatureCard {...f} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}