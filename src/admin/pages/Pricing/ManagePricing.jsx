import { useState } from "react";

/* ════════════════════════════════════════════
   INITIAL DATA
════════════════════════════════════════════ */
const initialPlans = [
  {
    id: 1,
    badge: "STARTER",
    name: "Single Template",
    subtitle: "Perfect for a one-time project launch.",
    monthlyPrice: "499",
    yearlyPrice: "399",
    period: "one-time",
    cta: "Buy Template",
    highlight: false,
    highlightLabel: "BEST VALUE",
    features: [
      { text: "1 Template File Download", included: true  },
      { text: "Full Source Code",          included: true  },
      { text: "Free Updates (3 Months)",   included: true  },
      { text: "Basic Support (7 Days)",    included: true  },
      { text: "Multiple Templates",        included: false },
      { text: "Priority Support",          included: false },
      { text: "Unlimited Access",          included: false },
    ],
  },
  {
    id: 2,
    badge: "MOST POPULAR",
    name: "Bundle Pack",
    subtitle: "Best value for serious creators.",
    monthlyPrice: "3,999",
    yearlyPrice: "3,299",
    period: "one-time",
    cta: "Get Bundle",
    highlight: true,
    highlightLabel: "BEST VALUE",
    features: [
      { text: "10 Premium Templates",  included: true  },
      { text: "Full Source Code",       included: true  },
      { text: "Instant Download",       included: true  },
      { text: "Free Updates (1 Year)",  included: true  },
      { text: "Priority Support",       included: true  },
      { text: "Commercial License",     included: true  },
      { text: "Unlimited Access",       included: false },
    ],
  },
  {
    id: 3,
    badge: "PRO",
    name: "Agency Plan",
    subtitle: "Unlimited access for teams & studios.",
    monthlyPrice: "999",
    yearlyPrice: "829",
    period: "/month",
    cta: "Start Plan",
    highlight: false,
    highlightLabel: "BEST VALUE",
    features: [
      { text: "Unlimited Templates",   included: true },
      { text: "Full Source Code",       included: true },
      { text: "New Templates Weekly",   included: true },
      { text: "Lifetime Updates",       included: true },
      { text: "Premium Support",        included: true },
      { text: "Commercial License",     included: true },
      { text: "Team Access (5 seats)",  included: true },
    ],
  },
];

const emptyPlan = {
  badge: "", name: "", subtitle: "",
  monthlyPrice: "", yearlyPrice: "",
  period: "one-time", cta: "",
  highlight: false, highlightLabel: "BEST VALUE",
  features: [{ text: "", included: true }],
};

/* ── Icons ── */
const IconPlus   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconEdit   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconDelete = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconClose  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconCheck  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconXMark  = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>;
const IconArrow  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconStar   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;

/* ── Shared class strings ── */
const inp = [
  "w-full min-h-[44px] px-3 py-2 rounded-xl outline-none transition-colors fontStyle9 box-border",
  "bg-[var(--admin-bg)]",
  "border border-[var(--admin-border)]",
  "text-[var(--admin-text)]",
  "placeholder:text-[var(--admin-muted)]",
  "focus:border-[var(--admin-accent)]",
].join(" ");

const lbl = "block fontStyle9 font-semibold uppercase tracking-wider text-[var(--admin-muted)] mb-1";

/* ════════════════════════════════════════════
   PLAN MODAL
════════════════════════════════════════════ */
function PlanModal({ mode, data, onClose, onSave }) {
  const [form, setForm] = useState({
    ...data,
    features: data.features.map((f) => ({ ...f })),
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const setFeature = (i, k, v) => setForm((p) => { const f = p.features.map((x) => ({ ...x })); f[i][k] = v; return { ...p, features: f }; });
  const addFeature = () => setForm((p) => ({ ...p, features: [...p.features, { text: "", included: true }] }));
  const removeFeature = (i) => setForm((p) => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }));

  const handleSave = () => {
    if (!form.name || !form.badge || !form.monthlyPrice) return;
    onSave(form);
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col bg-[var(--admin-surface)] border border-[var(--admin-border)] z-[9999]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-[var(--admin-border)]">
          <p className="fontStyle7 font-bold m-0 text-[var(--admin-text)]">
            {mode === "add" ? "Add New Plan" : "Edit Plan"}
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-0 bg-[var(--admin-hover)] text-[var(--admin-muted)] hover:bg-[var(--admin-border)] transition-colors"
          >
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

          {/* Badge + Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Badge Label</label>
              <input className={inp} value={form.badge} onChange={(e) => set("badge", e.target.value)} placeholder="e.g. STARTER" />
            </div>
            <div>
              <label className={lbl}>Plan Name</label>
              <input className={inp} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Single Template" />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className={lbl}>Subtitle</label>
            <input className={inp} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. Perfect for a one-time project launch." />
          </div>

          {/* Monthly + Yearly Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Monthly Price (Rs.)</label>
              <input className={inp} value={form.monthlyPrice} onChange={(e) => set("monthlyPrice", e.target.value)} placeholder="e.g. 499" />
            </div>
            <div>
              <label className={lbl}>Yearly Price (Rs.)</label>
              <input className={inp} value={form.yearlyPrice} onChange={(e) => set("yearlyPrice", e.target.value)} placeholder="e.g. 399" />
            </div>
          </div>

          {/* Period + CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Price Period</label>
              <select className="admin-select" value={form.period} onChange={(e) => set("period", e.target.value)}>
                <option value="one-time">one-time</option>
                <option value="/month">/month</option>
                <option value="/year">/year</option>
              </select>
            </div>
            <div>
              <label className={lbl}>CTA Button Text</label>
              <input className={inp} value={form.cta} onChange={(e) => set("cta", e.target.value)} placeholder="e.g. Buy Template" />
            </div>
          </div>

          {/* Highlight Toggle */}
          <div className="flex items-center gap-3 py-1">
            <button
              onClick={() => set("highlight", !form.highlight)}
              className={`relative w-11 h-6 rounded-full border-0 cursor-pointer flex-shrink-0 transition-colors duration-200 ${form.highlight ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border)]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${form.highlight ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className="fontStyle9 font-semibold text-[var(--admin-text)]">
              Mark as "Best Value" (highlighted card)
            </span>
          </div>

          {form.highlight && (
            <div>
              <label className={lbl}>Highlight Label</label>
              <input className={inp} value={form.highlightLabel} onChange={(e) => set("highlightLabel", e.target.value)} placeholder="e.g. BEST VALUE" />
            </div>
          )}

          {/* Features */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`${lbl} mb-0`}>Features</label>
              <button
                onClick={addFeature}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg fontStyle9 font-bold cursor-pointer border-0 bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] hover:opacity-80 transition-opacity"
              >
                <IconPlus /> Add Feature
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <button
                    onClick={() => setFeature(i, "included", !f.included)}
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-0 cursor-pointer transition-colors ${
                      f.included
                        ? "bg-[var(--admin-success-soft)] text-[var(--admin-success)]"
                        : "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]"
                    }`}
                  >
                    {f.included ? <IconCheck /> : <IconXMark />}
                  </button>
                  <input
                    className={`${inp} flex-1`}
                    value={f.text}
                    onChange={(e) => setFeature(i, "text", e.target.value)}
                    placeholder="e.g. Full Source Code"
                  />
                  {form.features.length > 1 && (
                    <button
                      onClick={() => removeFeature(i)}
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] hover:opacity-80 transition-opacity"
                    >
                      <IconDelete />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 flex-shrink-0 border-t border-[var(--admin-border)]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border border-[var(--admin-border)] bg-transparent text-[var(--admin-subtext)] hover:bg-[var(--admin-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity bg-[var(--admin-accent)] [background:var(--admin-accent-grad)] shadow-[0_4px_14px_var(--admin-accent-soft)]"
          >
            {mode === "add" ? "Add Plan" : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   DELETE CONFIRM
════════════════════════════════════════════ */
function DeleteConfirm({ name, onClose, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl p-8 text-center shadow-2xl bg-[var(--admin-surface)] border border-[var(--admin-border)] z-[9999]">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--admin-danger-soft)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              className="text-[var(--admin-danger)]"
            />
          </svg>
        </div>
        <p className="fontStyle7 font-bold m-0 mb-2 text-[var(--admin-text)]">Delete Plan?</p>
        <p className="fontStyle9 m-0 mb-6 text-[var(--admin-muted)]">
          "<strong className="text-[var(--admin-subtext)]">{name}</strong>" permanently delete ho jayega.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border border-[var(--admin-border)] bg-transparent text-[var(--admin-subtext)] hover:bg-[var(--admin-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer bg-[var(--admin-danger)] hover:opacity-85 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   PRICING PREVIEW CARD
════════════════════════════════════════════ */
function PricingPreviewCard({ plan, billing, onEdit, onDelete }) {
  const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  return (
    <div className="relative flex flex-col">

      {plan.highlight && (
        <div className="flex justify-center -mb-px relative z-[2]">
          <span className="px-5 py-1.5 rounded-full fontStyle9 font-bold tracking-widest text-white [background:var(--admin-accent-grad)]">
            {plan.highlightLabel}
          </span>
        </div>
      )}

      <div className={`flex flex-col flex-1 rounded-2xl p-6 transition-all duration-200 bg-white/[0.04] ${
        plan.highlight
          ? "border border-[var(--admin-accent)] shadow-[0_0_40px_var(--admin-accent-soft)] mt-0"
          : "border border-[var(--admin-border)] shadow-none mt-6"
      }`}>

        {/* Badge */}
        <span className="self-start px-3 py-1 rounded-full fontStyle9 font-bold tracking-widest mb-4 border border-[var(--admin-border)] text-[var(--admin-text)]">
          {plan.badge}
        </span>

        {/* Name + Subtitle */}
        <p className="fontStyle7 font-bold m-0 mb-1 text-[var(--admin-text)]">{plan.name}</p>
        <p className="fontStyle9 m-0 mb-4 text-[var(--admin-muted)]">{plan.subtitle}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="fontStyle9 text-[var(--admin-muted)]">Rs.</span>
          <span className="font-bold text-4xl leading-none text-[var(--admin-text)]">{price}</span>
          <span className="fontStyle9 text-[var(--admin-muted)]">{plan.period}</span>
        </div>

        {/* Divider */}
        <div className="mb-4 border-t border-dashed border-white/10" />

        {/* Features */}
        <div className="flex flex-col gap-2 flex-1 mb-5">
          {plan.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center bg-[var(--admin-accent)]">
                {f.included
                  ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="var(--admin-surface)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="var(--admin-muted)" strokeWidth="2.5" strokeLinecap="round"/></svg>
                }
              </span>
              <span className={`fontStyle9 ${f.included ? "text-[var(--admin-text)]" : "text-[var(--admin-muted)] line-through"}`}>
                {f.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA preview */}
        <div className="w-full flex items-center justify-between px-4 py-3 rounded-xl fontStyle9 font-semibold mb-3 bg-[var(--admin-surface)] text-[var(--admin-text)]">
          <span>{plan.cta}</span>
          <IconArrow />
        </div>

        {/* Edit / Delete */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(plan)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border-0 transition-all duration-200 bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] hover:opacity-80"
          >
            <IconEdit /> Edit
          </button>
          <button
            onClick={() => onDelete(plan)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl fontStyle9 font-semibold cursor-pointer border-0 transition-all duration-200 bg-[var(--admin-danger-soft)] text-[var(--admin-danger)] hover:opacity-80"
          >
            <IconDelete /> Delete
          </button>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function ManagePricing() {
  const [plans, setPlans] = useState(initialPlans);
  const [billing, setBilling] = useState("monthly");
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (form) => {
    if (modal.mode === "add") {
      setPlans((prev) => [...prev, { ...form, id: Date.now() }]);
    } else {
      setPlans((prev) => prev.map((p) => (p.id === form.id ? form : p)));
    }
    setModal(null);
  };

  const handleDelete = () => {
    setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="p-4 sm:p-7">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="fontStyle7 font-bold m-0 text-[var(--admin-text)]">Manage Pricing</h1>
          <p className="fontStyle9 mt-1 m-0 text-[var(--admin-muted)]">{plans.length} plans · Live preview below</p>
        </div>
        <button
          onClick={() => setModal({ mode: "add", data: { ...emptyPlan, features: [{ text: "", included: true }] } })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl fontStyle9 font-bold text-white border-0 cursor-pointer hover:opacity-90 transition-opacity [background:var(--admin-accent-grad)] shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
        >
          <IconPlus /> Add Plan
        </button>
      </div>

      {/* Live Preview Panel */}
      <div className="rounded-2xl overflow-hidden border border-[var(--admin-border)] bg-[var(--admin-surface)]">

        {/* Panel bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--admin-border)]">
          <div className="flex items-center gap-2 text-[var(--admin-muted)]">
            <IconStar />
            <span className="fontStyle9 font-bold tracking-widest uppercase">Live Preview</span>
          </div>

          {/* Monthly / Yearly toggle */}
          <div className="flex items-center p-1 rounded-full border border-[var(--admin-border)] bg-[var(--admin-bg)]">
            {["monthly", "yearly"].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full fontStyle9 font-semibold cursor-pointer border-0 transition-all duration-200 capitalize ${
                  billing === b
                    ? "bg-[var(--admin-accent)] text-[#0f172a]"
                    : "bg-transparent text-[var(--admin-text)]"
                }`}
              >
                {b === "yearly" ? (
                  <>
                    Yearly
                    <span className={`px-1.5 py-0.5 rounded-full fontStyle9 font-bold ${
                      billing === "yearly"
                        ? "[background:var(--admin-accent-grad)] text-white"
                        : "bg-[var(--admin-hover)] text-[var(--admin-text)]"
                    }`}>
                      -17%
                    </span>
                  </>
                ) : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="p-4 sm:p-8">
          {plans.length === 0 ? (
            <p className="text-center py-16 fontStyle9 text-[var(--admin-muted)]">
              No plans yet. Click "Add Plan" to create one.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <PricingPreviewCard
                  key={plan.id}
                  plan={plan}
                  billing={billing}
                  onEdit={(p) => setModal({ mode: "edit", data: { ...p, features: p.features.map((f) => ({ ...f })) } })}
                  onDelete={(p) => setDeleteTarget(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <PlanModal
          mode={modal.mode}
          data={modal.data}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}