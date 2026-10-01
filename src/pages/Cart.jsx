import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, setDbCart, selectCartItems } from "../store/slices/cartSlice";
import { useRemoveFromCartApiMutation, useGetCartQuery } from "../store/apiSlice";
import { API_BASE } from "../services/api";

/* ── image URL helper ── */
const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};

/* ── Shared Classes ── */
const CARD_CLS = "rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)]";
const BTN_PRIMARY =
  "bg-color3 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl fontStyle9 font-bold text-white shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200";
const BTN_GHOST =
  "inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 hover:border-[var(--color6)]/40 hover:-translate-y-0.5 transition-all duration-200";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const isAuth = useSelector((state) => state.cart.isAuth);
  const [removeFromCartApi] = useRemoveFromCartApiMutation();
  const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuth });
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Sync API cart into Redux
  useEffect(() => {
    if (isAuth && cartData?.cart?.items) {
      dispatch(setDbCart(cartData.cart.items));
    }
  }, [isAuth, cartData, dispatch]);

  // Normalize item structure — DB items have templateId nested, guest items are flat
  const norm = (item) => {
    const t = item.templateId || item;
    return {
      id: t._id || item._id,
      name: t.title || t.name || "Untitled",
      tag: t.tag || "",
      price: t.price || 0,
      originalPrice: t.originalPrice || 0,
      image: Array.isArray(t.images) && t.images.length ? t.images[0] : (t.image || ""),
    };
  };

  const subtotal = items.reduce((s, i) => s + Number(norm(i).price || 0), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const applyCoupon = () => {
    if (coupon.toLowerCase() === "save10") setCouponApplied(true);
  };

  const handleRemove = (item) => {
    if (isAuth) {
      removeFromCartApi(item.templateId?._id || item.templateId)
        .unwrap()
        .then((res) => {
          dispatch(setDbCart(res?.cart?.items || []));
        })
        .catch(() => {});
    } else {
      dispatch(removeFromCart(item._id));
    }
  };

  if (items.length === 0)
    return (
      <section className="min-h-screen bg-[var(--color5)] flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-sm text-center">
          <div className="bg-color3 w-16 h-16 rounded-2xl text-white flex items-center justify-center mx-auto mb-5 shadow-lg">
            <i className="bx bx-cart text-3xl"></i>
          </div>
          <h2 className="fontStyle5 font-bold text-[var(--color6)] mb-1.5">Your cart is empty</h2>
          <p className="fontStyle9 text-[var(--color4)] mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/templates" className={BTN_PRIMARY}>
            Browse Templates
            <i className="bx bx-chevron-right text-base"></i>
          </Link>
        </div>
      </section>
    );

  return (
    <>
      <SEOHead
        title="Shopping Cart"
        description="Review your selected templates and proceed to checkout."
      />
      <section className="min-h-screen bg-[var(--color5)] py-8 md:py-12">
        <div className="w-width">
          <BreadCrumb_Nav
            items={[
              { label: "Home", path: "/" },
              { label: "Templates", path: "/templates" },
              { label: "Cart", path: "/cart" },
            ]}
          />

          {/* ── Page Header ── */}
          <div className="mb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="fontStyle5 font-bold text-[var(--color6)]">Shopping Cart</h1>
                <span className="bg-color3 fontStyle10 font-bold text-white px-2 py-0.5 rounded-full shadow-md">
                  {items.length}
                </span>
              </div>
              <p className="fontStyle10 text-[var(--color4)] mt-1">
                Review your templates, apply a coupon and continue to checkout.
              </p>
            </div>

            {/* ── Stat chips ── */}
            <div className="flex items-center gap-2.5 flex-wrap lg:flex-nowrap">
              {[
                { icon: "bx-cart", val: `${items.length}`, lbl: "Items" },
                { icon: "bx-receipt", val: `$${subtotal}`, lbl: "Subtotal" },
                { icon: "bx-check-shield", val: "SSL", lbl: "Secure" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[var(--color6)]/10 bg-[var(--color11)]"
                >
                  <span className="w-8 h-8 rounded-lg bg-color3 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <i className={`bx ${s.icon} text-sm`}></i>
                  </span>
                  <div className="leading-tight">
                    <p className="fontStyle9 font-bold text-[var(--color6)]">{s.val}</p>
                    <p className="fontStyle10 text-[var(--color4)]">{s.lbl}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

            {/* ── Cart Items ── */}
            <div className="flex flex-col gap-3 min-w-0">
              {items.map((item) => {
                const n = norm(item);
                const off =
                  n.originalPrice > n.price
                    ? Math.round(((n.originalPrice - n.price) / n.originalPrice) * 100)
                    : 0;

                return (
                  <div
                    key={n.id}
                    className={`${CARD_CLS} group p-2.5 flex flex-col sm:flex-row gap-3 transition-colors duration-200 hover:border-[var(--color6)]/20`}
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-32 shrink-0 rounded-xl overflow-hidden bg-[var(--color5)] border border-[var(--color6)]/5 aspect-video sm:aspect-auto sm:h-24">
                      {n.image ? (
                        <img
                          src={imgUrl(n.image)}
                          alt={n.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-[var(--color4)]">
                          <i className="bx bx-image text-xl"></i>
                          <span className="fontStyle10">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0">
                          {n.tag && (
                            <span className="inline-block fontStyle10 font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color6)]/5 text-[var(--color4)]">
                              {n.tag}
                            </span>
                          )}
                          <h3 className="fontStyle9 font-bold text-[var(--color6)] leading-snug mt-1.5 line-clamp-2">
                            {n.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          aria-label="Remove item"
                          className="shrink-0 w-8 h-8 rounded-lg bg-[var(--color5)] border border-[var(--color6)]/10 text-[var(--color4)] flex items-center justify-center hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 cursor-pointer"
                        >
                          <i className="bx bx-trash text-sm"></i>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="fontStyle8 font-bold text-[var(--color6)]">${n.price}</span>
                        {off > 0 && (
                          <>
                            <span className="fontStyle10 line-through text-[var(--color4)]">
                              ${n.originalPrice}
                            </span>
                            <span className="fontStyle10 font-bold px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-500">
                              {off}% OFF
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Order Summary ── */}
            <aside className={`w-full lg:sticky lg:top-28 ${CARD_CLS} overflow-hidden`}>
              <div className="bg-color3 px-4 py-3.5 relative overflow-hidden">
                <span className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10"></span>
                <span className="absolute -bottom-10 left-6 w-24 h-24 rounded-full border-[12px] border-white/10"></span>
                <div className="relative flex items-center justify-between gap-3">
                  <p className="fontStyle10 font-semibold uppercase tracking-widest text-white/70">
                    Order Summary
                  </p>
                  <p className="fontStyle5 font-bold text-white">${total}</p>
                </div>
              </div>

              <div className="p-4">
                {/* Items list */}
                <div className="space-y-2 pb-3.5 border-b border-[var(--color6)]/10">
                  {items.map((item) => {
                    const n = norm(item);
                    return (
                      <div key={n.id} className="flex items-center justify-between gap-3">
                        <span className="fontStyle10 text-[var(--color4)] truncate flex items-center gap-1.5 min-w-0">
                          <i className="bx bx-check-circle text-sm text-green-500 shrink-0"></i>
                          <span className="truncate">{n.name}</span>
                        </span>
                        <span className="fontStyle10 font-semibold text-[var(--color6)] shrink-0">
                          ${n.price}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon */}
                <div className="py-3.5 border-b border-[var(--color6)]/10">
                  <p className="fontStyle10 font-semibold text-[var(--color6)] mb-2 flex items-center gap-1.5">
                    <i className="bx bx-purchase-tag text-sm"></i>
                    Coupon Code
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. SAVE10"
                      disabled={couponApplied}
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle10 uppercase outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/40 transition-colors duration-200 disabled:opacity-50"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="px-3.5 py-2 rounded-lg fontStyle10 font-bold border border-[var(--color6)]/15 text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-default shrink-0"
                    >
                      {couponApplied ? (
                        <i className="bx bx-check text-base text-green-500"></i>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="fontStyle10 text-green-500 mt-2 flex items-center gap-1.5">
                      <i className="bx bx-check-circle"></i>
                      10% discount applied
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="pt-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="fontStyle10 text-[var(--color4)]">Subtotal</span>
                    <span className="fontStyle10 font-semibold text-[var(--color6)]">${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="fontStyle9 text-green-500">Discount</span>
                      <span className="fontStyle9 font-semibold text-green-500">-${discount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-[var(--color6)]/15">
                    <span className="fontStyle8 font-bold text-[var(--color6)]">Total</span>
                    <span className="fontStyle6 font-bold text-[var(--color6)]">${total}</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-4 flex flex-col gap-2">
                  <Link to="/check-out" className={BTN_PRIMARY}>
                    <i className="bx bx-credit-card text-base"></i>
                    Proceed to Checkout
                  </Link>
                  <Link to="/templates" className={BTN_GHOST}>
                    <i className="bx bx-arrow-back text-base"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
