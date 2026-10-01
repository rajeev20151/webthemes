import { Link } from "react-router-dom";
import SEOHead from "../SEOHead";
import { CARD_CLS, BTN_PRIMARY, BTN_GHOST } from "./styles";

/* ── Step 3 · Order confirmed ── */
export default function OrderSuccess({ email, items, subtotal }) {
  return (
    <section className="min-h-screen bg-[var(--color5)] flex items-center justify-center px-4 py-14">
      <SEOHead
        title="Order Confirmed"
        description="Your order has been confirmed successfully."
        noindex={true}
      />
      <div className={`w-full max-w-md ${CARD_CLS} overflow-hidden`}>
        <div className="bg-color3 relative overflow-hidden px-5 pt-9 pb-8 text-center">
          <span className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10"></span>
          <span className="absolute -bottom-14 -right-8 w-36 h-36 rounded-full border-[14px] border-white/10"></span>
          <div className="relative w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-4">
            <i className="bx bx-check text-4xl text-white"></i>
          </div>
          <h2 className="relative fontStyle5 font-bold text-white">Order Confirmed</h2>
          <p className="relative fontStyle10 text-white/75 mt-1.5">
            Thank you for your purchase. Your downloads are ready.
          </p>
        </div>

        <div className="p-5 sm:p-6">
          <p className="fontStyle10 text-[var(--color4)] text-center mb-5">
            A confirmation has been sent to{" "}
            <span className="text-[var(--color6)] font-semibold break-all">{email}</span>
          </p>

          <div className="rounded-xl border border-[var(--color6)]/10 bg-[var(--color5)] p-4 mb-5">
            <p className="fontStyle10 font-semibold uppercase tracking-widest text-[var(--color4)] mb-3 flex items-center gap-1.5">
              <i className="bx bx-receipt text-sm"></i>
              Order Details
            </p>
            <div className="divide-y divide-[var(--color6)]/10">
              {items.map((n, index) => (
                <div key={n.id || `order-item-${index}`} className="flex items-center justify-between gap-3 py-2 first:pt-0">
                  <span className="fontStyle10 text-[var(--color6)] truncate">{n.name}</span>
                  <span className="fontStyle10 font-bold text-[var(--color6)] shrink-0">${n.price}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 mt-1 border-t border-dashed border-[var(--color6)]/15 flex items-center justify-between">
              <span className="fontStyle9 font-bold text-[var(--color6)]">Total Paid</span>
              <span className="fontStyle5 font-bold text-[var(--color6)]">${subtotal}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link to="/" className={`${BTN_PRIMARY} flex-1`}>
              <i className="bx bx-download text-base"></i> Download Templates
            </Link>
            <Link to="/templates" className={`${BTN_GHOST} flex-1`}>
              Browse More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
