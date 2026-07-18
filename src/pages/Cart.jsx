import { useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { useCart } from "../context/CartContext";
import { API_BASE } from "../services/api";

/* ── image URL helper ── */
const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};

export default function Cart() {
  const { cart, removeFromCart } = useCart();
  const items = cart;
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal  = items.reduce((s, i) => s + Number(i.price || 0), 0);
  const discount  = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total     = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "save10") setCouponApplied(true);
  };

  if (items.length === 0) return (
    <section className="min-h-screen bg-[var(--color5)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-[var(--color11)] border border-[var(--color6)]/10 flex items-center justify-center mx-auto mb-5">
          <i className="bx bx-cart text-4xl text-[var(--color4)]"></i>
        </div>
        <h2 className="fontStyle5 font-bold text-[var(--color6)] mb-2">Your cart is empty</h2>
        <p className="fontStyle9 text-[var(--color4)] mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/templates" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl fontStyle9 font-bold text-white hover:opacity-90 transition-opacity duration-200" style={{ background: "var(--color3)" }}>
          Browse Templates <i className="bx bx-chevron-right text-base"></i>
        </Link>
      </div>
    </section>
  );

  return (
   <> 
    <SEOHead title="Shopping Cart" description="Review your selected templates and proceed to checkout." />
    <section className="min-h-screen bg-[var(--color5)] py-12 sm:py-12 md:py-20 ">
      <div className="w-width">

        <BreadCrumb_Nav
          items={[
            { label: "Home",      path: "/"          },
            { label: "Templates", path: "/templates" },
            { label: "Cart",      path: "/cart"      },
          ]}
        />

        {/* ── Header ── */}
        <div className="mb-6 mt-10">
          <h1 className="fontStyle5 font-bold text-[var(--color6)] mb-1">Shopping Cart</h1>
          <p className="fontStyle9 text-[var(--color4)]">{items.length} item{items.length !== 1 ? "s" : ""} in your cart</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Cart Items ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item._id} className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-3 sm:p-4 flex gap-3 sm:gap-4 items-center hover:border-[var(--color6)]/20 transition-colors duration-200">
                <div className="w-20 h-14 sm:w-32 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color5)]">
                  {item.image ? (
                    <img src={imgUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center fontStyle10 text-[var(--color4)]">No Image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="fontStyle10 font-bold text-[var(--color4)] uppercase tracking-wider">{item.tag}</span>
                      <h3 className="fontStyle8 font-bold text-[var(--color6)] leading-snug mt-0.5 truncate">{item.name}</h3>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="shrink-0 w-8 h-8 rounded-lg bg-[var(--color11)] border border-[var(--color6)]/10 text-[var(--color4)] flex items-center justify-center hover:border-red-400/30 hover:text-red-400 transition-all duration-200 cursor-pointer"
                    >
                      <i className="bx bx-trash text-sm"></i>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="fontStyle8 font-extrabold text-[var(--color6)]">${item.price}</span>
                    {item.originalPrice > item.price && (
                      <>
                        <span className="fontStyle10 line-through text-[var(--color4)]">${item.originalPrice}</span>
                        <span className="fontStyle10 font-bold px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-500">
                          {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Order Summary ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">

            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 sm:p-5">
              <p className="fontStyle8 font-bold text-[var(--color6)] mb-4">Order Summary</p>

              {/* Items list */}
              <div className="space-y-2 pb-4 border-b border-[var(--color6)]/10">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="fontStyle10 text-[var(--color4)] truncate mr-2">{item.name}</span>
                    <span className="fontStyle10 font-semibold text-[var(--color6)] shrink-0">${item.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="py-4 border-b border-[var(--color6)]/10">
                <p className="fontStyle10 font-semibold text-[var(--color6)] mb-2">Coupon Code</p>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="e.g. SAVE10"
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 rounded-xl border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle10 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/40 transition-colors duration-200 disabled:opacity-50 min-w-0"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied}
                    className="px-3 py-2 rounded-xl fontStyle10 font-bold border border-[var(--color6)]/15 text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {couponApplied ? <i className="bx bx-check text-green-500"></i> : "Apply"}
                  </button>
                </div>
                {couponApplied && (
                  <p className="fontStyle10 text-green-500 mt-1.5 flex items-center gap-1">
                    <i className="bx bx-check-circle"></i> 10% discount applied!
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="fontStyle9 text-[var(--color4)]">Subtotal</span>
                  <span className="fontStyle9 font-semibold text-[var(--color6)]">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="fontStyle9 text-green-500">Discount</span>
                    <span className="fontStyle9 font-semibold text-green-500">-${discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color6)]/10">
                  <span className="fontStyle8 font-bold text-[var(--color6)]">Total</span>
                  <span className="fontStyle7 font-extrabold text-[var(--color6)]">${total}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 space-y-3">
                <Link
                  to="/checkout"
                  className="w-full py-3 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200"
                  style={{ background: "var(--color3)" }}
                >
                  <i className="bx bx-credit-card text-base"></i>
                  Proceed to Checkout
                </Link>
                <Link
                  to="/templates"
                  className="w-full py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 flex items-center justify-center gap-2 hover:bg-[var(--color11)] transition-colors duration-200"
                >
                  <i className="bx bx-arrow-back text-base"></i>
                  Continue Shopping
                </Link>
              </div>

            </div>

            {/* Trust badges */}
            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4">
              {[
                { icon: "bx-shield-check", label: "Secure Payment",     desc: "256-bit SSL encryption"     },
                { icon: "bx-refresh",      label: "30-Day Refund",       desc: "No questions asked"         },
                { icon: "bx-support",      label: "24/7 Support",        desc: "We're always here to help"  },
              ].map((b, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 2 ? "border-b border-[var(--color6)]/10" : ""}`}>
                  <i className={`bx ${b.icon} text-xl text-[var(--color4)] shrink-0`}></i>
                  <div>
                    <p className="fontStyle10 font-semibold text-[var(--color6)] m-0">{b.label}</p>
                    <p className="fontStyle10 text-[var(--color4)] m-0">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
   </> 
  );
}