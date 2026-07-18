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

  return (
    <div
      className={`rounded-2xl border border-[var(--color6)]/12 overflow-hidden bg-[var(--color5)]
        transition-shadow duration-300 ${open ? "shadow-[4px_4px_0px_var(--color6)]" : ""}`}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 px-7 py-5 text-left
          hover:bg-[var(--color6)]/3 transition-colors duration-200
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color6)] focus-visible:ring-inset">
        <div className="flex items-center gap-4">
          <span className="fontStyle10 font-bold text-[var(--color4)] w-6 flex-shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="fontStyle7 font-semibold text-[var(--color6)]">{q}</span>
        </div>
        <i className={`bx bx-chevron-down text-xl text-[var(--color4)] flex-shrink-0
            transition-transform duration-300 ${open ? "rotate-180" : ""}`}></i>
      </button>

      {/* Animated body */}
      <div
        style={{
          height,
          overflow: "hidden",
          transition: "height 0.32s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div ref={bodyRef} className="px-7 pb-6 pt-1">
          <div className="pl-10">
            <p className="fontStyle8 text-[var(--color4)] leading-relaxed">{a}</p>
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
      className="py-20"
      style={{ background: "var(--color11)" }}
      aria-labelledby="faq-heading"
    >
      <div className="w-width">

        {/* Header */}
        <header className="text-center mb-14">
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
        <div className="max-w-3xl mx-auto flex flex-col gap-4" role="list">
          {FAQS.map((item, i) => (
            <FaqRow key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}