import { Link } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const PLANS = [
  {
    id: "landing",
    badge: "Starter",
    name: "Landing Page",
    tagline: "Launch your brand with a stunning, conversion-focused page.",
    price: 59,
    note: "one-time",
    highlight: false,
    popularLabel: null,
    savingNote: "Ideal for startups, ads & campaigns",
    features: [
      { label: "6 Custom Landing Pages", included: true },
      { label: "Modern UI/UX Design", included: true },
      { label: "Mobile & Tablet Responsive", included: true },
      { label: "Contact Form Integration", included: true },
      { label: "Basic On-Page SEO", included: true },
      { label: "Performance Optimization", included: true },
      { label: "2 Revision Rounds", included: true },
      { label: "Multi-Page Website", included: false },
      { label: "CMS / Admin Dashboard", included: false },
      { label: "Database Integration", included: false },
    ],
    cta: "Get Started",
    ctaIcon: "bx-rocket",
  },

  {
    id: "business",
    badge: "Most Popular",
    name: "Business Website",
    tagline: "A complete professional website built to grow your business.",
    price: 179,
    note: "one-time",
    highlight: true,
    popularLabel: "BEST VALUE",
    savingNote: "50% advance · 50% on delivery",
    features: [
      { label: "Up to 18 Custom Pages", included: true },
      { label: "Premium UI/UX Design", included: true },
      { label: "Mobile-First Responsive Layout", included: true },
      { label: "Contact Form & WhatsApp CTA", included: true },
      { label: "Blog / CMS Integration", included: true },
      { label: "On-Page SEO Setup", included: true },
      { label: "Speed & Performance Optimization", included: true },
      { label: "Social Media Integration", included: true },
      { label: "5 Revision Rounds", included: true },
      { label: "Admin Dashboard / Custom Backend", included: false },
    ],
    cta: "Start Your Project",
    ctaIcon: "bx-rocket",
  },

  {
    id: "custom",
    badge: "Advanced",
    name: "Web App / Custom Platform",
    tagline: "Powerful custom solutions designed around your workflow.",
    price: 349,
    note: "onwards",
    highlight: false,
    popularLabel: null,
    savingNote: "Milestone-based payments · Custom project scope",
    features: [
      { label: "Custom Pages & Application Screens", included: true },
      { label: "Unique UI/UX Design", included: true },
      { label: "Admin Dashboard & Role Management", included: true },
      { label: "Database & API Integration", included: true },
      { label: "User Login & Authentication", included: true },
      { label: "Payment Gateway Integration", included: true },
      { label: "Custom Business Logic", included: true },
      { label: "Responsive Application Interface", included: true },
      { label: "Full Source Code Handover", included: true },
      { label: "3 Months Technical Support", included: true },
      { label: "Milestone-Based Delivery", included: true },
    ],
    cta: "Discuss Your Project",
    ctaIcon: "bx-chat",
  },
];

const TRUST_ITEMS = [
  { icon: "bx-shield-quarter", text: "100% custom build — no reused code" },
  { icon: "bx-code-alt",       text: "Full source code handover"          },
  { icon: "bx-support",        text: "Dedicated project support"          },
];

// ─────────────────────────────────────────────
// UTILITY
// ─────────────────────────────────────────────

const formatUSD = (n) => n.toLocaleString("en-US");

// ─────────────────────────────────────────────
// PLAN CARD
// ─────────────────────────────────────────────

function PlanCard({ plan }) {
  const hl = plan.highlight;

  return (
    <div className={`relative h-full ${hl ? "lg:-translate-y-4" : ""}`}>
      {/* Gradient offset shadow for the highlighted plan */}
      {hl && (
        <span
          aria-hidden="true"
          className="absolute inset-0 translate-x-2 translate-y-2 rounded-[18px] bg-color3 sm:translate-x-3 sm:translate-y-3"
        />
      )}

      <article
        className={`group relative z-10 flex h-full flex-col rounded-[18px] border-2 border-[var(--color6)] transition-all duration-300
          ${hl
            ? "bg-[var(--color6)] hover:-translate-y-1"
            : "bg-[var(--color5)] shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)] hover:shadow-[2px_2px_0px_var(--color6)] hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-1.5 sm:hover:translate-y-1.5"
          }`}
      >
        {/* Ribbon */}
        {plan.popularLabel && (
          <div className="absolute -top-[15px] left-1/2 z-20 -translate-x-1/2">
            <span className="whitespace-nowrap fontStyle10 font-bold uppercase tracking-widest text-white bg-color3 border-2 border-[var(--color6)] rounded-full px-5 py-1.5 shadow-[3px_3px_0px_var(--color6)]">
              {plan.popularLabel}
            </span>
          </div>
        )}

        <div className="flex flex-col flex-1 p-6 sm:p-7">

          {/* Badge */}
          <span
            className={`self-start fontStyle10 font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 mb-4 sm:mb-5 transition-transform duration-300
              ${hl
                ? "border-[var(--color5)] bg-color3 text-white rotate-2"
                : "border-[var(--color6)] bg-[var(--color5)] text-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] -rotate-2 group-hover:rotate-0"
              }`}>
            {plan.badge}
          </span>

          {/* Title + tagline */}
          <h3 className={`fontStyle5 font-bold mb-1.5 ${hl ? "text-[var(--color5)]" : "text-[var(--color6)]"}`}>
            {plan.name}
          </h3>
          <p className={`fontStyle9 mb-5 sm:mb-6 ${hl ? "text-[var(--color5)]/65" : "text-[var(--color4)]"}`}>
            {plan.tagline}
          </p>

          {/* Price */}
          <div
            className={`mb-5 sm:mb-6 rounded-xl border-2 border-dashed p-4 transition-colors duration-300
              ${hl
                ? "border-[var(--color5)]/40 bg-[var(--color5)]/10"
                : "border-[var(--color6)]/25 bg-[var(--color11)]"
              }`}>
            <div className="flex items-end gap-1.5 flex-wrap">
              <span className={`fontStyle6 font-semibold self-start mt-1.5 ${hl ? "text-[var(--color5)]/70" : "text-[var(--color4)]"}`}>
                $
              </span>
              <span
                className={`font-extrabold leading-none tracking-tight ${hl ? "text-[var(--color5)]" : "text-[var(--color6)]"}`}
                style={{ font: "2.5rem/1 'Google Sans', sans-serif" }}
              >
                {formatUSD(plan.price)}
              </span>
              <span className={`fontStyle9 mb-0.5 ${hl ? "text-[var(--color5)]/70" : "text-[var(--color4)]"}`}>
                {plan.note}
              </span>
            </div>

            {plan.savingNote &&
              (hl ? (
                <span className="inline-block fontStyle10 font-bold text-white bg-color3 border border-white/25 rounded-full px-3 py-1 mt-3">
                  {plan.savingNote}
                </span>
              ) : (
                <p className="flex items-center gap-1.5 fontStyle10 mt-3 font-semibold text-[var(--color4)]">
                  <i className="bx bx-info-circle text-base"></i>
                  {plan.savingNote}
                </p>
              ))}
          </div>

          {/* Features */}
          <ul className="flex flex-col gap-2.5 sm:gap-3 flex-1 mb-6 sm:mb-7" role="list">
            {plan.features.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span
                  className={`w-[26px] h-[26px] flex-shrink-0 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                    ${f.included
                      ? hl
                        ? "bg-color3 border-[var(--color5)] text-white shadow-[2px_2px_0px_var(--color5)]"
                        : "bg-[var(--color5)] border-[var(--color6)] text-[var(--color6)] shadow-[2px_2px_0px_var(--color6)]"
                      : hl
                        ? "border-dashed border-[var(--color5)]/40 text-[var(--color5)]/50"
                        : "border-dashed border-[var(--color6)]/30 text-[var(--color4)]"
                    }`}>
                  <i className={`bx ${f.included ? "bx-check" : "bx-x"} text-sm`}></i>
                </span>
                <span
                  className={`fontStyle9 ${
                    f.included
                      ? hl ? "text-[var(--color5)] font-medium" : "text-[var(--color6)]"
                      : hl ? "line-through text-[var(--color5)]/45" : "line-through text-[var(--color4)]"
                  }`}>
                  {f.label}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            to="/contact"
            aria-label={`${plan.cta} — ${plan.name}`}
            className={`group/btn fontStyle8 font-semibold w-full flex items-center justify-center gap-2.5
              px-6 py-3.5 rounded-xl border-2 transition-all duration-300 bg-color3 text-white
              ${hl
                ? "border-[var(--color5)] shadow-[4px_4px_0px_var(--color5)]"
                : "border-[var(--color6)] shadow-[4px_4px_0px_var(--color6)]"
              }
              hover:-translate-x-0.5 hover:-translate-y-0.5
              ${hl
                ? "hover:shadow-[7px_7px_0px_var(--color5)]"
                : "hover:shadow-[7px_7px_0px_var(--color6)]"
              }
              active:translate-x-1 active:translate-y-1
              ${hl
                ? "active:shadow-[1px_1px_0px_var(--color5)]"
                : "active:shadow-[1px_1px_0px_var(--color6)]"
              }`}>
            <i className={`bx ${plan.ctaIcon} text-lg`}></i>
            {plan.cta}
            <i className="bx bx-right-arrow-alt text-lg ml-auto transition-transform duration-300 group-hover/btn:translate-x-1"></i>
          </Link>
        </div>

        {/* Bottom accent bar */}
        <span
          className={`absolute bottom-0 left-0 h-1.5 w-0 rounded-b-[16px] group-hover:w-full transition-all duration-500 ease-out
            ${hl ? "bg-[var(--color5)]" : "bg-color3"}`}
        />
      </article>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRICING SECTION EXPORT
// ─────────────────────────────────────────────

export default function Pricing() {
  return (
    <section className="relative py-14 sm:py-20 overflow-hidden" aria-labelledby="pricing-heading">
      {/* Decorative glows */}
      <span aria-hidden="true" className="absolute -top-6 -left-16 w-64 h-64 rounded-full glow-orange opacity-20 pointer-events-none" />
      <span aria-hidden="true" className="absolute -bottom-10 -right-16 w-64 h-64 rounded-full glow-gold opacity-20 pointer-events-none" />

      <div className="w-width relative z-10">
        <BreadCrumb_Nav
          items={[
            { label: "Home", path: "/" },
            { label: "Pricing", path: "/pricing" },
          ]}
        />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 fontStyle10 font-bold uppercase tracking-widest text-[var(--color6)]
            bg-[var(--color5)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)]
            px-4 py-1.5 rounded-full mb-4 sm:mb-5 -rotate-2">
            <span className="w-2 h-2 rounded-full bg-color3 animate-pulse"></span>
            Custom Development Pricing
          </span>
          <h2
            id="pricing-heading"
            className="fontStyle4 text-[var(--color6)] font-bold leading-tight mb-3 sm:mb-4"
          >
            Get Your Website Built Right
          </h2>
          <p className="fontStyle8 text-[var(--color4)] max-w-lg mx-auto mb-8 sm:mb-20 px-2">
            Pricing depends on what you need — a landing page, a business site, or a
            full custom template/app. Pick a starting point, we'll finalize the quote
            after discussing your requirement.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-7 lg:gap-8 items-stretch pt-2">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2.5 bg-[var(--color5)] border-2 border-[var(--color6)]
                shadow-[3px_3px_0px_var(--color6)] rounded-full px-4 py-2
                transition-all duration-300 hover:shadow-[1px_1px_0px_var(--color6)] hover:translate-x-0.5 hover:translate-y-0.5"
            >
              <span className="w-8 h-8 flex-shrink-0 rounded-full bg-color3 border border-[var(--color6)] flex items-center justify-center text-white">
                <i className={`bx ${item.icon} text-base`}></i>
              </span>
              <span className="fontStyle10 font-semibold text-[var(--color6)]">{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
