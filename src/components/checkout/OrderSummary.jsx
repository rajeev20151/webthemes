import { CARD_CLS } from "./styles";
import { imgUrl } from "./imgUrl";

const TRUST = [
  { icon: "bx-check-shield", label: "Secure Checkout",  desc: "256-bit SSL" },
  { icon: "bx-download",     label: "Instant Download", desc: "Access immediately" },
];

/* ── RIGHT COLUMN · Order summary + trust badges ── */
export default function OrderSummary({ items, subtotal }) {
  return (
    <aside className="w-full flex flex-col gap-4 lg:sticky lg:top-28">

      <div className={`${CARD_CLS} overflow-hidden`}>
        <div className="bg-color3 px-5 py-4 relative overflow-hidden">
          <span className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10"></span>
          <span className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-[12px] border-white/10"></span>
          <div className="relative flex items-center justify-between gap-3">
            <div>
              <p className="fontStyle10 font-semibold uppercase tracking-widest text-white/70">
                Order Summary
              </p>
              <p className="fontStyle10 text-white/70 mt-0.5">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <p className="fontStyle5 font-bold text-white">${subtotal}</p>
          </div>
        </div>

        <div className="p-5">
          <div className="space-y-3 pb-4 border-b border-[var(--color6)]/10">
            {items.map((n, index) => (
              <div key={n.id || `cart-item-${index}`} className="flex items-center gap-3">
                <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--color5)] border border-[var(--color6)]/10">
                  {n.image ? (
                    <img
                      src={imgUrl(n.image)}
                      alt={n.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="bx bx-image text-sm text-[var(--color4)]"></i>
                    </div>
                  )}
                </div>
                <span className="flex-1 fontStyle10 text-[var(--color6)] truncate">{n.name}</span>
                <span className="fontStyle10 font-bold text-[var(--color6)] shrink-0">${n.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="fontStyle10 text-[var(--color4)]">Subtotal</span>
              <span className="fontStyle10 font-semibold text-[var(--color6)]">${subtotal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="fontStyle10 text-[var(--color4)]">Tax</span>
              <span className="fontStyle10 font-semibold text-green-500">Free</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-dashed border-[var(--color6)]/15">
              <span className="fontStyle8 font-bold text-[var(--color6)]">Total</span>
              <span className="fontStyle6 font-bold text-[var(--color6)]">${subtotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className={`${CARD_CLS} p-4 grid grid-cols-2 gap-3`}>
        {TRUST.map((b, i) => (
          <div key={i} className="flex items-center gap-2.5 min-w-0">
            <span className="w-9 h-9 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
              <i className={`bx ${b.icon} text-lg`}></i>
            </span>
            <div className="min-w-0">
              <p className="fontStyle10 font-semibold text-[var(--color6)] leading-tight truncate">{b.label}</p>
              <p className="fontStyle10 text-[var(--color4)] truncate">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

    </aside>
  );
}
