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

  if (items.length === 0)
    return (
      <section className="min-h-screen bg-[var(--color5)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-[var(--color11)] border border-[var(--color6)]/10 flex items-center justify-center mx-auto mb-5">
            <i className="bx bx-cart text-4xl text-[var(--color4)]"></i>
          </div>
          <h2 className="fontStyle5 font-bold text-[var(--color6)] mb-2">
            Your cart is empty
          </h2>
          <p className="fontStyle9 text-[var(--color4)] mb-6">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/templates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl fontStyle9 font-bold text-white hover:opacity-90 transition-opacity duration-200"
            style={{ background: "var(--color3)" }}
          >
            Browse Templates{" "}
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
      <section className="min-h-screen bg-[var(--color5)] py-12 sm:py-12 md:py-20">
        <div className="w-width">
          <BreadCrumb_Nav
            items={[
              { label: "Home", path: "/" },
              { label: "Templates", path: "/templates" },
              { label: "Cart", path: "/cart" },
            ]}
          />

          {/* ── Header ── */}
          <div className="mb-8 mt-10">
            <h1 className="fontStyle5 font-bold text-[var(--color6)] mb-1">
              Shopping Cart
            </h1>
            <p className="fontStyle9 text-[var(--color4)]">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* ── Cart Items ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              {items.map((item) => {
                const n = norm(item);
                return (
                <div
                  key={n.id}
                  className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 sm:p-5 flex gap-4 sm:gap-5 items-center hover:border-[var(--color6)]/20 transition-colors duration-200"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-16 sm:w-36 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color5)]">
                    {n.image ? (
                      <img
                        src={imgUrl(n.image)}
                        alt={n.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center fontStyle10 text-[var(--color4)]">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="fontStyle10 font-bold text-[var(--color4)] uppercase tracking-wider">
                          {n.tag}
                        </span>
                        <h3 className="fontStyle8 font-bold text-[var(--color6)] leading-snug mt-0.5 truncate">
                          {n.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => {
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
                      }}
                        className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color5)] border border-[var(--color6)]/10 text-[var(--color4)] flex items-center justify-center hover:border-red-400/30 hover:text-red-400 transition-all duration-200 cursor-pointer"
                      >
                        <i className="bx bx-trash text-base"></i>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <span className="fontStyle8 font-extrabold text-[var(--color6)] text-lg">
                        ${n.price}
                      </span>
                      {n.originalPrice > n.price && (
                        <>
                          <span className="fontStyle10 line-through text-[var(--color4)]">
                            ${n.originalPrice}
                          </span>
                          <span className="fontStyle10 font-bold px-2 py-0.5 rounded-lg bg-green-500/10 text-green-500">
                            {Math.round(
                              ((n.originalPrice - n.price) /
                                n.originalPrice) *
                                100
                            )}
                            % OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );})}
            </div>

            {/* ── Order Summary ── */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0 lg:sticky lg:top-6">
              <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 sm:p-6">
                <p className="fontStyle8 font-bold text-[var(--color6)] mb-5">
                  Order Summary
                </p>

                {/* Items list */}
                <div className="space-y-3 pb-4 border-b border-[var(--color6)]/10">
                  {items.map((item) => {
                    const n = norm(item);
                    return (
                    <div
                      key={n.id}
                      className="flex items-center justify-between"
                    >
                      <span className="fontStyle10 text-[var(--color4)] truncate mr-3">
                        {n.name}
                      </span>
                      <span className="fontStyle10 font-semibold text-[var(--color6)] shrink-0">
                        ${n.price}
                      </span>
                    </div>
                  );})}
                </div>

                {/* Coupon */}
                <div className="py-4 border-b border-[var(--color6)]/10">
                  <p className="fontStyle10 font-semibold text-[var(--color6)] mb-2">
                    Coupon Code
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="e.g. SAVE10"
                      disabled={couponApplied}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle10 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/40 transition-colors duration-200 disabled:opacity-50 min-w-0"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="px-4 py-2.5 rounded-xl fontStyle10 font-bold border border-[var(--color6)]/15 text-[var(--color6)] hover:bg-[var(--color6)] hover:text-[var(--color5)] transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {couponApplied ? (
                        <i className="bx bx-check text-green-500 text-lg"></i>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="fontStyle10 text-green-500 mt-2 flex items-center gap-1">
                      <i className="bx bx-check-circle"></i> 10% discount
                      applied!
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div className="pt-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="fontStyle9 text-[var(--color4)]">
                      Subtotal
                    </span>
                    <span className="fontStyle9 font-semibold text-[var(--color6)]">
                      ${subtotal}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="fontStyle9 text-green-500">
                        Discount
                      </span>
                      <span className="fontStyle9 font-semibold text-green-500">
                        -${discount}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-3 border-t border-[var(--color6)]/10">
                    <span className="fontStyle8 font-bold text-[var(--color6)]">
                      Total
                    </span>
                    <span className="fontStyle7 font-extrabold text-[var(--color6)]">
                      ${total}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 space-y-3">
                  <Link
                    to="/check-out"
                    className="w-full py-3.5 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200"
                    style={{ background: "var(--color3)" }}
                  >
                    <i className="bx bx-credit-card text-base"></i>
                    Proceed to Checkout
                  </Link>
                  <Link
                    to="/templates"
                    className="w-full py-3.5 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 flex items-center justify-center gap-2 hover:bg-[var(--color11)] transition-colors duration-200"
                  >
                    <i className="bx bx-arrow-back text-base"></i>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
