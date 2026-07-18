import { useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

/* ── Mock Order ── */
const orderItems = [
  { id: 1, name: "Agency Pro",   price: 29, image: "https://placehold.co/400x260/6366f1/ffffff?text=Agency+Pro"  },
  { id: 2, name: "SaaS Landing", price: 49, image: "https://placehold.co/400x260/34d399/ffffff?text=SaaS+Landing" },
];

/* ── Shared Classes ── */
const labelCls = "block fontStyle10 font-semibold uppercase tracking-wider text-[var(--color4)] mb-1.5";

function inputCls(err) {
  return `w-full px-4 py-2.5 rounded-xl border fontStyle9 outline-none placeholder-[var(--color4)] transition-colors duration-200 bg-[var(--color5)] text-[var(--color6)] ${
    err ? "border-red-400 focus:border-red-400" : "border-[var(--color6)]/15 focus:border-[var(--color6)]/40"
  }`;
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 fontStyle10 text-red-400 mt-1.5">
      <i className="bx bx-error-circle text-sm"></i> {msg}
    </p>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 sm:p-6">
      <p className="fontStyle8 font-bold text-[var(--color6)] mb-5">{title}</p>
      {children}
    </div>
  );
}

/* ── Validators ── */
const luhn = (n) => {
  let s = 0, alt = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i]);
    if (alt) { d *= 2; if (d > 9) d -= 9; }
    s += d; alt = !alt;
  }
  return s % 10 === 0;
};

const validate = {
  info: (f) => {
    const e = {};
    if (!f.firstName.trim())                               e.firstName = "First name is required";
    else if (!/^[a-zA-Z\s]{2,}$/.test(f.firstName.trim())) e.firstName = "Only letters allowed, min 2 chars";
    if (!f.lastName.trim())                                e.lastName  = "Last name is required";
    else if (!/^[a-zA-Z\s]{2,}$/.test(f.lastName.trim()))  e.lastName  = "Only letters allowed, min 2 chars";
    if (!f.email.trim())                                   e.email     = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email     = "Enter a valid email address";
    if (!f.country)                                        e.country   = "Please select a country";
    return e;
  },
  card: (f) => {
    const e = {};
    const num = f.cardNumber.replace(/\s/g, "");
    if (!num)                        e.cardNumber = "Card number is required";
    else if (!/^\d{16}$/.test(num))  e.cardNumber = "Enter a valid 16-digit card number";
    else if (!luhn(num))             e.cardNumber = "Invalid card number";

    if (!f.cardName.trim())                               e.cardName = "Cardholder name is required";
    else if (!/^[a-zA-Z\s]{3,}$/.test(f.cardName.trim())) e.cardName = "Enter full name as on card (letters only)";

    if (!f.expiry.trim()) {
      e.expiry = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.expiry)) {
      e.expiry = "Use MM/YY format";
    } else {
      const [mm, yy] = f.expiry.split("/").map(Number);
      const now = new Date();
      const exp = new Date(2000 + yy, mm - 1, 1);
      if (exp < new Date(now.getFullYear(), now.getMonth(), 1)) e.expiry = "Card has expired";
    }

    if (!f.cvv.trim())              e.cvv = "CVV is required";
    else if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = "Enter a valid 3 or 4 digit CVV";
    return e;
  },
  upi: (f) => {
    const e = {};
    if (!f.upiId.trim())                                    e.upiId = "UPI ID is required";
    else if (!/^[\w.\-_]{3,}@[a-zA-Z]{2,}$/.test(f.upiId)) e.upiId = "Enter a valid UPI ID (e.g. name@upi)";
    return e;
  },
};

export default function Checkout() {
  const [step,      setStep]      = useState(1);
  const [loading,   setLoading]   = useState(false);
  const [payMethod, setPayMethod] = useState("card");

  /* ── Form States ── */
  const [info, setInfo] = useState({ firstName: "", lastName: "", email: "", country: "" });
  const [card, setCard] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
  const [upi,  setUpi]  = useState({ upiId: "" });

  /* ── Error States ── */
  const [infoErr, setInfoErr] = useState({});
  const [cardErr, setCardErr] = useState({});
  const [upiErr,  setUpiErr]  = useState({});

  const subtotal = orderItems.reduce((s, i) => s + i.price, 0);

  /* ── Formatters ── */
  const fmtCard   = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  /* ── Submit Handlers ── */
  const submitInfo = () => {
    const e = validate.info(info);
    setInfoErr(e);
    if (!Object.keys(e).length) setStep(2);
  };

  const submitPay = async () => {
    let e = {};
    if (payMethod === "card") e = validate.card(card);
    if (payMethod === "upi")  e = validate.upi(upi);
    if (payMethod === "card") setCardErr(e);
    if (payMethod === "upi")  setUpiErr(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep(3);
  };

  /* ══════════════ SUCCESS ══════════════ */
  if (step === 3) return (
    <section className="min-h-screen bg-[var(--color5)] flex items-center justify-center px-4">
      <SEOHead
      title="Order Confirmed"
      description="Your order has been confirmed successfully."
      noindex={true}
    />
      <div className="text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <i className="bx bx-check-circle text-5xl text-green-500"></i>
        </div>
        <h2 className="fontStyle5 font-bold text-[var(--color6)] mb-2">Order Confirmed!</h2>
        <p className="fontStyle9 text-[var(--color4)] mb-1">Thank you for your purchase.</p>
        <p className="fontStyle10 text-[var(--color4)] mb-8">A confirmation has been sent to <span className="text-[var(--color6)] font-semibold">{info.email}</span></p>

        <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 mb-6 text-left">
          <p className="fontStyle10 font-bold uppercase tracking-wider text-[var(--color4)] mb-3">Order Details</p>
          <div className="space-y-2">
            {orderItems.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <span className="fontStyle9 text-[var(--color6)]">{item.name}</span>
                <span className="fontStyle9 font-bold text-[var(--color6)]">${item.price}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 mt-3 border-t border-[var(--color6)]/10 flex items-center justify-between">
            <span className="fontStyle8 font-bold text-[var(--color6)]">Total Paid</span>
            <span className="fontStyle7 font-extrabold text-[var(--color6)]">${subtotal}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1 py-3 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200" style={{ background: "var(--color3)" }}>
            <i className="bx bx-download text-base"></i> Download Templates
          </Link>
          <Link to="/templates" className="flex-1 py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 flex items-center justify-center hover:bg-[var(--color11)] transition-colors duration-200">
            Browse More
          </Link>
        </div>
      </div>
    </section>
  );

  /* ══════════════ CHECKOUT ══════════════ */
  return (
    <section className="min-h-screen bg-[var(--color5)] pb-16">
      <SEOHead
      title="Checkout"
      description="Complete your purchase securely."
      noindex={true}
    />
      <div className="w-width pt-6 sm:pt-10">

        {/* Header + Steps */}
        <div className="mb-6 sm:mb-8">
          <h1 className="fontStyle5 font-bold text-[var(--color6)] mb-4">Checkout</h1>
          <div className="flex items-center gap-3">
            {["Contact Info", "Payment"].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex items-center gap-2 fontStyle10 font-semibold transition-all duration-200
                  ${step > i + 1 ? "text-green-500" : step === i + 1 ? "text-[var(--color6)]" : "text-[var(--color4)]"}`}>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center fontStyle10 font-bold transition-all duration-200
                    ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-[var(--color6)] text-[var(--color5)]" : "border border-[var(--color6)]/15 text-[var(--color4)]"}`}>
                    {step > i + 1 ? <i className="bx bx-check text-sm"></i> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </div>
                {i < 1 && <div className={`w-12 h-px transition-colors duration-300 ${step > 1 ? "bg-green-500" : "bg-[var(--color6)]/10"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* STEP 1: Contact Info */}
            {step === 1 && (
              <SectionCard title="Contact Information">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input
                      className={inputCls(infoErr.firstName)}
                      value={info.firstName}
                      onChange={e => { setInfo(p => ({ ...p, firstName: e.target.value })); setInfoErr(p => ({ ...p, firstName: "" })); }}
                      placeholder="John"
                    />
                    <ErrorMsg msg={infoErr.firstName} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input
                      className={inputCls(infoErr.lastName)}
                      value={info.lastName}
                      onChange={e => { setInfo(p => ({ ...p, lastName: e.target.value })); setInfoErr(p => ({ ...p, lastName: "" })); }}
                      placeholder="Doe"
                    />
                    <ErrorMsg msg={infoErr.lastName} />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={labelCls}>Email Address</label>
                  <input
                    className={inputCls(infoErr.email)}
                    type="email"
                    value={info.email}
                    onChange={e => { setInfo(p => ({ ...p, email: e.target.value })); setInfoErr(p => ({ ...p, email: "" })); }}
                    placeholder="john@example.com"
                  />
                  <ErrorMsg msg={infoErr.email} />
                </div>

                <div className="mt-4">
                  <label className={labelCls}>Country</label>
                  <div className="relative">
                    <select
                      className={`${inputCls(infoErr.country)} appearance-none pr-10 cursor-pointer`}
                      value={info.country}
                      onChange={e => { setInfo(p => ({ ...p, country: e.target.value })); setInfoErr(p => ({ ...p, country: "" })); }}
                    >
                      <option value="">Select country...</option>
                      {["India", "United States", "United Kingdom", "Canada", "Australia"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color4)]">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                  <ErrorMsg msg={infoErr.country} />
                </div>

                <button
                  onClick={submitInfo}
                  className="mt-6 w-full py-3 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200 border-none cursor-pointer"
                  style={{ background: "var(--color3)" }}
                >
                  Continue to Payment <i className="bx bx-chevron-right text-base"></i>
                </button>
              </SectionCard>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <SectionCard title="Payment Method">

                <div className="flex gap-2 mb-5">
                  {[
                    { id: "card",   label: "Credit Card", icon: "bx-credit-card" },
                    { id: "paypal", label: "PayPal",       icon: "bxl-paypal"     },
                    { id: "upi",    label: "UPI",          icon: "bx-mobile-alt"  },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => { setPayMethod(m.id); setCardErr({}); setUpiErr({}); }}
                      className={`flex-1 py-2.5 rounded-xl fontStyle10 font-semibold border transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5
                        ${payMethod === m.id
                          ? "border-[var(--color6)] text-[var(--color6)] bg-[var(--color11)]"
                          : "border-[var(--color6)]/10 text-[var(--color4)] hover:border-[var(--color6)]/25"}`}
                    >
                      <i className={`bx ${m.icon} text-lg sm:text-base`}></i>
                      <span className="hidden sm:inline">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Card Fields */}
                {payMethod === "card" && (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelCls}>Card Number</label>
                      <div className="relative">
                        <input
                          className={`${inputCls(cardErr.cardNumber)} pr-12`}
                          value={card.cardNumber}
                          onChange={e => { setCard(p => ({ ...p, cardNumber: fmtCard(e.target.value) })); setCardErr(p => ({ ...p, cardNumber: "" })); }}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color4)]">
                          <i className="bx bx-credit-card text-lg"></i>
                        </span>
                      </div>
                      <ErrorMsg msg={cardErr.cardNumber} />
                    </div>
                    <div>
                      <label className={labelCls}>Cardholder Name</label>
                      <input
                        className={inputCls(cardErr.cardName)}
                        value={card.cardName}
                        onChange={e => { setCard(p => ({ ...p, cardName: e.target.value })); setCardErr(p => ({ ...p, cardName: "" })); }}
                        placeholder="John Doe"
                      />
                      <ErrorMsg msg={cardErr.cardName} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className={labelCls}>Expiry Date</label>
                        <input
                          className={inputCls(cardErr.expiry)}
                          value={card.expiry}
                          onChange={e => { setCard(p => ({ ...p, expiry: fmtExpiry(e.target.value) })); setCardErr(p => ({ ...p, expiry: "" })); }}
                          placeholder="MM / YY"
                          maxLength={5}
                        />
                        <ErrorMsg msg={cardErr.expiry} />
                      </div>
                      <div>
                        <label className={labelCls}>CVV</label>
                        <input
                          className={inputCls(cardErr.cvv)}
                          value={card.cvv}
                          onChange={e => { setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })); setCardErr(p => ({ ...p, cvv: "" })); }}
                          placeholder="•••"
                          maxLength={4}
                          type="password"
                        />
                        <ErrorMsg msg={cardErr.cvv} />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal */}
                {payMethod === "paypal" && (
                  <div className="text-center py-8 rounded-xl border border-[var(--color6)]/10 bg-[var(--color5)]">
                    <i className="bx bxl-paypal text-5xl text-blue-500 mb-3 block"></i>
                    <p className="fontStyle9 text-[var(--color4)] max-w-xs mx-auto">You'll be redirected to PayPal to complete your payment securely.</p>
                  </div>
                )}

                {/* UPI */}
                {payMethod === "upi" && (
                  <div>
                    <label className={labelCls}>UPI ID</label>
                    <input
                      className={inputCls(upiErr.upiId)}
                      value={upi.upiId}
                      onChange={e => { setUpi({ upiId: e.target.value }); setUpiErr({}); }}
                      placeholder="yourname@upi"
                    />
                    <ErrorMsg msg={upiErr.upiId} />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col xs:flex-row gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="xs:w-auto w-full px-5 py-3 rounded-xl fontStyle9 font-semibold text-[var(--color6)] border border-[var(--color6)]/15 hover:bg-[var(--color11)] transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <i className="bx bx-arrow-back"></i> Back
                  </button>
                  <button
                    onClick={submitPay}
                    disabled={loading}
                    className="flex-1 py-3 rounded-xl fontStyle9 font-bold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none"
                    style={{ background: "var(--color3)" }}
                  >
                    {loading ? (
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : <i className="bx bx-lock-alt text-base"></i>}
                    {loading ? "Processing..." : `Pay $${subtotal}`}
                  </button>
                </div>

                <p className="fontStyle10 text-[var(--color4)] text-center mt-3 flex items-center justify-center gap-1">
                  <i className="bx bx-shield-check text-green-500"></i>
                  Secured with 256-bit SSL encryption
                </p>

              </SectionCard>
            )}
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">

            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 sm:p-5">
              <p className="fontStyle8 font-bold text-[var(--color6)] mb-4">Order Summary</p>
              <div className="space-y-3 pb-4 border-b border-[var(--color6)]/10">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="flex-1 fontStyle10 text-[var(--color6)] truncate">{item.name}</span>
                    <span className="fontStyle10 font-bold text-[var(--color6)] shrink-0">${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="fontStyle9 text-[var(--color4)]">Subtotal</span>
                  <span className="fontStyle9 font-semibold text-[var(--color6)]">${subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="fontStyle9 text-[var(--color4)]">Tax</span>
                  <span className="fontStyle9 font-semibold text-green-500">Free</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[var(--color6)]/10">
                  <span className="fontStyle8 font-bold text-[var(--color6)]">Total</span>
                  <span className="fontStyle7 font-extrabold text-[var(--color6)]">${subtotal}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4">
              {[
                { icon: "bx-shield-check", label: "Secure Checkout",  desc: "256-bit SSL encryption"    },
                { icon: "bx-refresh",      label: "30-Day Refund",    desc: "No questions asked"         },
                { icon: "bx-download",     label: "Instant Download", desc: "Access immediately"         },
              ].map((b, i) => (
                <div key={i} className={`flex items-center gap-3 py-2.5 ${i < 2 ? "border-b border-[var(--color6)]/10" : ""}`}>
                  <i className={`bx ${b.icon} text-xl text-green-500 shrink-0`}></i>
                  <div>
                    <p className="fontStyle10 font-semibold text-[var(--color6)] m-0 leading-tight">{b.label}</p>
                    <p className="fontStyle10 text-[var(--color4)] m-0">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}