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
  return (
    <div
      className="group relative p-8 border-[2px] border-[var(--color6)]/10 bg-[var(--color5)] rounded-2xl text-center
        shadow-[12px_12px_0px_var(--color6)]
        -translate-y-1.5
        hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        hover:translate-y-0
        transition-all duration-400 ease-out"
    >
      <div className="mb-6">
        <div
          className="relative w-16 h-16 bg-[var(--color6)] rounded-full flex items-center justify-center mx-auto
            scale-110 rotate-6
            group-hover:scale-100 group-hover:rotate-0 transition-all duration-400"
        >
          <i className={`bx ${icon} text-[var(--color5)] text-3xl relative z-10`}></i>
        </div>
      </div>
      <h3 className="fontStyle6 text-[var(--color6)] font-bold mb-4
        group-hover:text-[var(--color6)] transition-colors duration-300">
        {title}
      </h3>
      <p className="fontStyle8 text-[var(--color8)] leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* <div className="glow-gold absolute -top-40 -right-40 w-96 h-96 opacity-30 pointer-events-none"></div> */}
      {/* <div className="glow-orange absolute -bottom-40 -left-40 w-96 h-96 opacity-20 pointer-events-none"></div> */}

      <div className="w-width relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 md:mb-16">
          <span
            className="inline-block fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]
              border border-[var(--color6)]/18 px-4 py-1.5 rounded-full mb-4 sm:mb-5"
          >
            Why Choose Us
          </span>
          <h2 className="fontStyle4 text-[var(--color6)] font-bold leading-tight mb-4">
            Crafted with exclusive features
          </h2>
          <p className="fontStyle8 text-[var(--color4)] max-w-lg mx-auto px-2">
            Everything you need to build stunning websites — packed into one powerful template collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}