import { Link } from "react-router-dom";
import { CARD_CLS, BTN_PRIMARY } from "./styles";

/* ── Guard shown when the cart is empty ── */
export default function EmptyCart() {
  return (
    <section className="min-h-screen bg-[var(--color5)] flex items-center justify-center px-4 py-14">
      <div className={`w-full max-w-sm ${CARD_CLS} p-8 text-center`}>
        <div className="bg-color3 w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
          <i className="bx bx-cart text-3xl"></i>
        </div>
        <h2 className="fontStyle5 font-bold text-[var(--color6)] mb-1.5">Your cart is empty</h2>
        <p className="fontStyle9 text-[var(--color4)] mb-6">Add some templates before checking out.</p>
        <Link to="/templates" className={BTN_PRIMARY}>
          Browse Templates <i className="bx bx-chevron-right text-base"></i>
        </Link>
      </div>
    </section>
  );
}
