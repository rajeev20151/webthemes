import { useSelector } from "react-redux";
import SEOHead from "../components/SEOHead";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import { selectCartItems } from "../store/slices/cartSlice";

import useCheckoutForm from "../components/checkout/useCheckoutForm";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import ContactInfoStep from "../components/checkout/ContactInfoStep";
import PaymentStep from "../components/checkout/PaymentStep";
import OrderSummary from "../components/checkout/OrderSummary";
import OrderSuccess from "../components/checkout/OrderSuccess";
import EmptyCart from "../components/checkout/EmptyCart";

/* ── Normalize item structure — DB items have templateId nested, guest items are flat ── */
const norm = (item) => {
  const t = item.templateId || item;
  return {
    id: t._id || item._id,
    name: t.name || item.name || "Untitled",
    price: t.price || item.price || 0,
    image: Array.isArray(t.images) && t.images.length ? t.images[0] : (t.image || item.image || ""),
  };
};

export default function Checkout() {
  const orderItems = useSelector(selectCartItems);
  const form = useCheckoutForm();

  const items = orderItems.map(norm);
  const subtotal = items.reduce((s, n) => s + Number(n.price || 0), 0);
  const { step, info, refs } = form;

  /* ── Empty cart guard ── */
  if (orderItems.length === 0 && step !== 3) return <EmptyCart />;

  /* ══════════════ SUCCESS ══════════════ */
  if (step === 3) {
    return <OrderSuccess email={info.email} items={items} subtotal={subtotal} />;
  }

  /* ══════════════ CHECKOUT ══════════════ */
  return (
    <section className="min-h-screen bg-[var(--color5)] py-12 md:py-20">
      <SEOHead
        title="Checkout"
        description="Complete your purchase securely."
        noindex={true}
      />
      <div className="w-width">

        <BreadCrumb_Nav
          items={[
            { label: "Home",     path: "/"         },
            { label: "Cart",     path: "/cart"     },
            { label: "Checkout", path: "/check-out" },
          ]}
        />

        {/* ── Header + Steps ── */}
        <div className="mt-10 mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="fontStyle5 font-bold text-[var(--color6)]">Checkout</h1>
              <span className="inline-flex items-center gap-1 fontStyle10 font-semibold uppercase tracking-widest text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">
                <i className="bx bx-lock-alt text-xs"></i>
                Secure
              </span>
            </div>
            <p className="fontStyle10 text-[var(--color4)] mt-1.5">
              Complete your details and pay securely. Instant download after payment.
            </p>
          </div>

          <CheckoutStepper step={step} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

          {/* ── LEFT ── */}
          <div className="flex flex-col gap-4 min-w-0">
            {step === 1 && (
              <ContactInfoStep
                form={form}
                firstNameRef={refs.firstName}
                lastNameRef={refs.lastName}
                emailRef={refs.email}
                countryRef={refs.country}
              />
            )}
            {step === 2 && (
              <PaymentStep
                form={form}
                subtotal={subtotal}
                cardNumberRef={refs.cardNumber}
                cardNameRef={refs.cardName}
                expiryRef={refs.expiry}
                cvvRef={refs.cvv}
                upiIdRef={refs.upiId}
              />
            )}
          </div>

          {/* ── RIGHT ── */}
          <OrderSummary items={items} subtotal={subtotal} />
        </div>
      </div>
    </section>
  );
}
