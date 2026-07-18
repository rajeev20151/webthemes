import { Link } from "react-router-dom";
import { useState } from "react";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const PLANS = [
  {
    id: "single",
    badge: "Starter",
    name: "Single Template",
    tagline: "Perfect for a one-time project launch.",
    prices: { monthly: 499, yearly: 499 },
    note: { monthly: "one-time", yearly: "one-time" },
    highlight: false,
    popularLabel: null,
    features: [
      { label: "1 Template File Download", included: true  },
      { label: "Full Source Code",         included: true  },
      { label: "Free Updates (3 Months)",  included: true  },
      { label: "Basic Support (7 Days)",   included: true  },
      { label: "Multiple Templates",       included: false },
      { label: "Priority Support",         included: false },
      { label: "Unlimited Access",         included: false },
    ],
    cta: "Buy Template",
    ctaIcon: "bx-cart-add",
  },
  {
    id: "bundle",
    badge: "Most Popular",
    name: "Bundle Pack",
    tagline: "Best value for serious creators.",
    prices: { monthly: 3999, yearly: 3999 },
    note: { monthly: "one-time", yearly: "one-time" },
    highlight: false,
    popularLabel: "BEST VALUE",
    features: [
      { label: "10 Premium Templates",     included: true  },
      { label: "Full Source Code",         included: true  },
      { label: "Instant Download",         included: true  },
      { label: "Free Updates (1 Year)",    included: true  },
      { label: "Priority Support",         included: true  },
      { label: "Commercial License",       included: true  },
      { label: "Unlimited Access",         included: false },
    ],
    cta: "Get Bundle",
    ctaIcon: "bx-layer",
  },
  {
    id: "agency",
    badge: "Pro",
    name: "Agency Plan",
    tagline: "Unlimited access for teams & studios.",
    prices: { monthly: 999, yearly: 9999 },
    note: { monthly: "/month", yearly: "/year" },
    savingNote: "Save Rs.2,989 yearly",
    highlight: false,
    popularLabel: null,
    features: [
      { label: "Unlimited Templates",      included: true  },
      { label: "Full Source Code",         included: true  },
      { label: "New Templates Weekly",     included: true  },
      { label: "Lifetime Updates",         included: true  },
      { label: "Premium Support",          included: true  },
      { label: "Commercial License",       included: true  },
      { label: "Team Access (5 seats)",    included: true  },
    ],
    cta: "Start Plan",
    ctaIcon: "bx-rocket",
  },
];

const TRUST_ITEMS = [
  { icon: "bx-lock-alt", text: "Secure checkout via Razorpay" },
  { icon: "bx-download",  text: "Instant download"             },
  { icon: "bx-support",   text: "Dedicated support"            },
];

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────

const formatINR = (n) => n.toLocaleString("en-IN");

// ─────────────────────────────────────────────
// BILLING TOGGLE
// ─────────────────────────────────────────────

function BillingToggle({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Billing cycle"
      className="inline-flex items-center gap-1 p-1 mb-10 rounded-full border border-[var(--color6)]/12 bg-[var(--color6)]/4">
      {["monthly", "yearly"].map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full fontStyle9 font-semibold capitalize
              select-none transition-all duration-250
              ${active
                ? "bg-[var(--color6)] text-[var(--color5)] shadow-sm"
                : "text-[var(--color4)] hover:text-[var(--color6)]"
              }`}
          >
            {opt}
            {opt === "yearly" && (
              <span
                className={`fontStyle10 font-bold px-2 py-0.5 rounded-full transition-all duration-250
                  ${active ? "bg-[var(--color5)] text-[var(--color6)]" : "bg-[var(--color6)] text-[var(--color5)]"}`}
              >
                -17%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// PLAN CARD
// ─────────────────────────────────────────────

function PlanCard({ plan, billing }) {
  const price    = plan.prices[billing];
  const note     = plan.note[billing];
  const isAgency = plan.id === "agency";

  return (
    <article
      className={`relative flex flex-col rounded-2xl border-[2px] transition-all duration-300
        ${plan.highlight
          ? "border-[var(--color6)] bg-[var(--color6)] shadow-[8px_8px_0px_var(--color4)]"
          : "border-[var(--color6)]/18 bg-[var(--color5)] hover:border-[var(--color6)] hover:shadow-[6px_6px_0px_var(--color6)]"
        }`}
    >
      {/* Ribbon */}
      {plan.popularLabel && (
        <div className="absolute -top-[17px] left-1/2 -translate-x-1/2 z-10">
          <span
            className="fontStyle10 font-bold uppercase tracking-widest px-5 py-1.5 rounded-full"
            style={{ background: "var(--color3)", color: "var(--color5)" }}>
            {plan.popularLabel}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 sm:p-8">

        {/* Badge */}
        <span
          className={`self-start fontStyle10 font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 sm:mb-5
            ${plan.highlight
              ? "border-white/25 text-white/60"
              : "border-[var(--color6)]/18 text-[var(--color4)]"
            }`}>
          {plan.badge}
        </span>

        {/* Title + tagline */}
        <h3 className={`fontStyle5 font-bold mb-1.5 ${plan.highlight ? "text-white" : "text-[var(--color6)]"}`}>
          {plan.name}
        </h3>
        <p className={`fontStyle9 mb-5 sm:mb-7 ${plan.highlight ? "text-white/55" : "text-[var(--color4)]"}`}>
          {plan.tagline}
        </p>

        {/* Price */}
        <div className="mb-5 sm:mb-7 pb-5 sm:pb-7 border-b border-dashed border-[var(--color6)]/12">
          <div className="flex items-end gap-1.5">
            <span className={`fontStyle6 font-semibold self-start mt-1.5 ${plan.highlight ? "text-white/55" : "text-[var(--color4)]"}`}>
              Rs.
            </span>
            <span
              className={`font-extrabold leading-none tracking-tight ${plan.highlight ? "text-white" : "text-[var(--color6)]"}`}
              style={{ font: "2.4rem/1 'Google Sans', sans-serif" }}
            >
              {formatINR(price)}
            </span>
            <span className={`fontStyle9 mb-0.5 ${plan.highlight ? "text-white/55" : "text-[var(--color4)]"}`}>
              {note}
            </span>
          </div>

          {isAgency && billing === "yearly" && (
            <p className={`fontStyle10 mt-2 font-semibold ${plan.highlight ? "text-white/50" : "text-[var(--color4)]"}`}>
              approx. Rs.833/month &nbsp;&middot;&nbsp; {plan.savingNote}
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-2.5 sm:gap-3 flex-1 mb-6 sm:mb-8" role="list">
          {plan.features.map((f) => (
            <li key={f.label} className="flex items-center gap-3">
              <span
                className={`w-[22px] h-[22px] flex-shrink-0 rounded-full flex items-center justify-center
                  ${f.included
                    ? plan.highlight ? "bg-white/18 text-white" : "bg-[var(--color6)]/8 text-[var(--color6)]"
                    : "bg-[var(--color4)]/10 text-[var(--color4)]"
                  }`}>
                <i className={`bx ${f.included ? "bx-check" : "bx-x"} text-sm`}></i>
              </span>
              <span
                className={`fontStyle9 ${
                  f.included
                    ? plan.highlight ? "text-white" : "text-[var(--color6)]"
                    : "line-through text-[var(--color4)]"
                }`}>
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          to="#"
          aria-label={`${plan.cta} — ${plan.name}`}
          className={`group/btn fontStyle8 font-semibold w-full flex items-center justify-center gap-2.5
            px-6 py-3 sm:py-3.5 rounded-xl border-[2px] transition-all duration-300
            ${plan.highlight
              ? "bg-white text-[var(--color6)] border-white hover:bg-transparent hover:text-white"
              : "bg-[var(--color6)] text-[var(--color5)] border-[var(--color6)] hover:bg-transparent hover:text-[var(--color6)]"
            }`}>
          <i className={`bx ${plan.ctaIcon} text-lg`}></i>
          {plan.cta}
          <i className="bx bx-right-arrow-alt text-lg ml-auto transition-transform duration-300 group-hover/btn:translate-x-1"></i>
        </Link>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────
// PRICING SECTION EXPORT
// ─────────────────────────────────────────────

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <section className="py-12 sm:py-20 md:py-20 overflow-hidden" aria-labelledby="pricing-heading">
      <div className="w-width">
        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Pricing", path: "/pricing" },
          ]}
        />

        {/* Header */}
        <div className="text-center">
          <span className="inline-block fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)] border border-[var(--color6)]/18 px-4 py-1.5 rounded-full mb-4 sm:mb-5">
            Pricing Plans
          </span>
          <h2
            id="pricing-heading"
            className="fontStyle4 text-[var(--color6)] font-bold leading-tight mb-3 sm:mb-4"
          >
            Simple, Transparent Pricing
          </h2>
          <p className="fontStyle8 text-[var(--color4)] max-w-lg mx-auto mb-6 sm:mb-8 px-2">
            Choose the plan that fits your workflow — no hidden charges, no surprises.
            Upgrade or downgrade at any time.
          </p>
          <BillingToggle value={billing} onChange={setBilling} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 gap-y-3">
          {TRUST_ITEMS.map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-[var(--color4)]">
              <i className={`bx ${item.icon} text-base`}></i>
              <span className="fontStyle10 text-sm sm:text-base">{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}