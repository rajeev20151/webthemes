import { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const FAQS = [
  {
    q: "Can I use a template for multiple projects?",
    a: "Single Template licenses cover one project only. For multiple projects, the Bundle Pack or Agency Plan offers far better value and full commercial rights.",
  },
  {
    q: "Is the source code included with every plan?",
    a: "Yes. All plans ship with complete, well-structured source code — HTML, CSS, and JS — ready for you to customise without restrictions.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, all major Credit / Debit Cards, Net Banking, and popular wallets through our secure Razorpay-powered checkout.",
  },
  {
    q: "Can I upgrade my plan at any time?",
    a: "Absolutely. Upgrade from Single to Bundle, or from Bundle to Agency at any time. We will credit your previous purchase towards the new plan.",
  },
  {
    q: "What is your refund policy?",
    a: "Single Template purchases are eligible for a full refund within 7 days. Bundle and Agency plans carry a 3-day refund window, provided no more than 2 templates have been downloaded.",
  },
  {
    q: "Are updates included?",
    a: "Yes — for the duration specified in each plan. Agency plan members receive lifetime updates on every current and future template in the library.",
  },
];

// ─────────────────────────────────────────────
// FAQ ROW
// ─────────────────────────────────────────────

function FaqRow({ q, a, index }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(open ? bodyRef.current.scrollHeight : 0);
    }
  }, [open]);

  // Window resize par khule hue answer ki height update ho
  useEffect(() => {
    if (!open) return;
    const onResize = () => {
      if (bodyRef.current) setHeight(bodyRef.current.scrollHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open]);

  return (
    <div
      role="listitem"
      className={`rounded-2xl border-2 border-[var(--color6)] overflow-hidden bg-[var(--color5)]
        transition-all duration-300
        ${
          open
            ? "shadow-[2px_2px_0px_var(--color6)] translate-x-[3px] translate-y-[3px]"
            : "shadow-[5px_5px_0px_var(--color6)] sm:shadow-[6px_6px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] hover:translate-x-[2px] hover:translate-y-[2px]"
        }`}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="group w-full flex items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-5 text-left
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color6)] focus-visible:ring-inset cursor-pointer"
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Number tile */}
          <span
            className={`fontStyle10 font-bold w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-[var(--color6)] flex items-center justify-center flex-shrink-0
              transition-all duration-300 -rotate-6 group-hover:rotate-0
              ${
                open
                  ? "bg-color3 text-white rotate-0"
                  : "bg-[var(--color11)] text-[var(--color6)]"
              }`}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="fontStyle7 font-bold text-[var(--color6)]">{q}</span>
        </div>

        {/* Chevron button */}
        <span
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-[var(--color6)] flex items-center justify-center flex-shrink-0
            transition-all duration-300
            ${
              open
                ? "bg-[var(--color6)] text-[var(--color5)] rotate-180"
                : "bg-[var(--color5)] text-[var(--color6)]"
            }`}
        >
          <i className="bx bx-chevron-down text-xl"></i>
        </span>
      </button>

      {/* Animated body */}
      <div
        style={{
          height,
          overflow: "hidden",
          transition: "height 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div ref={bodyRef} className="px-4 sm:px-6 pb-5 sm:pb-6">
          <div className="pt-4 border-t-2 border-dashed border-[var(--color6)]/15">
            <div className="flex gap-3 sm:gap-4">
              <span className="w-1 rounded-full bg-color3 flex-shrink-0"></span>
              <p className="fontStyle8 text-[var(--color4)] leading-relaxed">{a}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// FAQ SECTION
// ─────────────────────────────────────────────

export default function FAQ() {
  return (
    <section
      className="py-16 sm:py-20"
      style={{ background: "var(--color11)" }}
      aria-labelledby="faq-heading"
    >
      <div className="w-width">

        {/* Header */}
        <header className="text-center mb-12 sm:mb-14">
          <span className="inline-flex items-center gap-2 fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)] bg-[var(--color5)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] px-4 py-1.5 rounded-full mb-5 -rotate-2">
            <span className="w-2 h-2 rounded-full bg-[#fde047] border border-[var(--color6)] animate-pulse"></span>
            FAQ
          </span>
          <h2
            id="faq-heading"
            className="fontStyle4 text-[var(--color6)] font-bold leading-tight mb-4"
          >
            Frequently Asked Questions
          </h2>
          <p className="fontStyle8 text-[var(--color4)] max-w-md mx-auto">
            Everything you need to know before purchasing.
          </p>
        </header>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto flex flex-col gap-5 sm:gap-6 pb-2" role="list">
          {FAQS.map((item, i) => (
            <FaqRow key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}