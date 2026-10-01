import { SectionCard, FieldLabel, ErrorMsg, ErrorSummary } from "./ui";
import { inputCls, BTN_PRIMARY, BTN_GHOST } from "./styles";
import { CARD_FIELDS } from "./fields";

const METHODS = [
  { id: "card",   label: "Card",   icon: "bx-credit-card" },
  { id: "paypal", label: "PayPal", icon: "bxl-paypal"     },
  { id: "upi",    label: "UPI",    icon: "bx-mobile-alt"  },
];

/* ── Card fields ── */
function CardFields({ form, cardNumberRef, cardNameRef, expiryRef, cvvRef }) {
  const { card, cardErr, touchedCard, cardFields, changeCard, blurCard, format } = form;

  return (
    <div className="flex flex-col gap-4">
      <ErrorSummary
        errors={Object.fromEntries(
          CARD_FIELDS.filter((f) => touchedCard[f.key]).map((f) => [f.key, cardErr[f.key]])
        )}
        fields={cardFields}
        title="Check your card details"
      />
      <div>
        <FieldLabel htmlFor="cardNumber">Card Number</FieldLabel>
        <div className="relative">
          <input
            id="cardNumber"
            ref={cardNumberRef}
            name="cardNumber"
            inputMode="numeric"
            autoComplete="cc-number"
            className={`${inputCls(touchedCard.cardNumber && cardErr.cardNumber)} pr-10 tracking-wider`}
            value={card.cardNumber}
            onChange={e => changeCard("cardNumber", format.card(e.target.value))}
            onBlur={() => blurCard("cardNumber")}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            aria-invalid={!!(touchedCard.cardNumber && cardErr.cardNumber)}
            aria-describedby={touchedCard.cardNumber && cardErr.cardNumber ? "err-cardNumber" : undefined}
          />
          <i className="bx bx-credit-card absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none"></i>
        </div>
        <ErrorMsg id="err-cardNumber" msg={touchedCard.cardNumber ? cardErr.cardNumber : ""} />
      </div>
      <div>
        <FieldLabel htmlFor="cardName">Cardholder Name</FieldLabel>
        <input
          id="cardName"
          ref={cardNameRef}
          name="cardName"
          autoComplete="cc-name"
          className={inputCls(touchedCard.cardName && cardErr.cardName)}
          value={card.cardName}
          onChange={e => changeCard("cardName", e.target.value)}
          onBlur={() => blurCard("cardName")}
          placeholder="John Doe"
          aria-invalid={!!(touchedCard.cardName && cardErr.cardName)}
          aria-describedby={touchedCard.cardName && cardErr.cardName ? "err-cardName" : undefined}
        />
        <ErrorMsg id="err-cardName" msg={touchedCard.cardName ? cardErr.cardName : ""} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FieldLabel htmlFor="expiry">Expiry Date</FieldLabel>
          <input
            id="expiry"
            ref={expiryRef}
            name="expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            className={inputCls(touchedCard.expiry && cardErr.expiry)}
            value={card.expiry}
            onChange={e => changeCard("expiry", format.expiry(e.target.value))}
            onBlur={() => blurCard("expiry")}
            placeholder="MM / YY"
            maxLength={5}
            aria-invalid={!!(touchedCard.expiry && cardErr.expiry)}
            aria-describedby={touchedCard.expiry && cardErr.expiry ? "err-expiry" : undefined}
          />
          <ErrorMsg id="err-expiry" msg={touchedCard.expiry ? cardErr.expiry : ""} />
        </div>
        <div>
          <FieldLabel htmlFor="cvv">CVV</FieldLabel>
          <input
            id="cvv"
            ref={cvvRef}
            name="cvv"
            inputMode="numeric"
            autoComplete="cc-csc"
            className={inputCls(touchedCard.cvv && cardErr.cvv)}
            value={card.cvv}
            onChange={e => changeCard("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
            onBlur={() => blurCard("cvv")}
            placeholder="•••"
            maxLength={4}
            type="password"
            aria-invalid={!!(touchedCard.cvv && cardErr.cvv)}
            aria-describedby={touchedCard.cvv && cardErr.cvv ? "err-cvv" : undefined}
          />
          <ErrorMsg id="err-cvv" msg={touchedCard.cvv ? cardErr.cvv : ""} />
        </div>
      </div>
    </div>
  );
}

/* ── PayPal placeholder ── */
function PayPalPanel() {
  return (
    <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[var(--color6)]/15 bg-[var(--color5)]">
      <span className="w-14 h-14 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3">
        <i className="bx bxl-paypal text-3xl"></i>
      </span>
      <p className="fontStyle10 text-[var(--color4)] max-w-xs mx-auto">
        You'll be redirected to PayPal to complete your payment securely.
      </p>
    </div>
  );
}

/* ── UPI fields ── */
function UpiFields({ form, upiIdRef }) {
  const { upi, upiErr, touchedUpi, upiFields, changeUpi, blurUpi } = form;

  return (
    <div>
      <ErrorSummary
        errors={{ upiId: touchedUpi.upiId ? upiErr.upiId : "" }}
        fields={upiFields}
        title="Check your UPI details"
      />
      <FieldLabel htmlFor="upiId">UPI ID</FieldLabel>
      <div className="relative">
        <i className="bx bx-at absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color4)] pointer-events-none"></i>
        <input
          id="upiId"
          ref={upiIdRef}
          name="upiId"
          className={`${inputCls(touchedUpi.upiId && upiErr.upiId)} pl-10`}
          value={upi.upiId}
          onChange={e => changeUpi(e.target.value)}
          onBlur={blurUpi}
          placeholder="yourname@upi"
          aria-invalid={!!(touchedUpi.upiId && upiErr.upiId)}
          aria-describedby={touchedUpi.upiId && upiErr.upiId ? "err-upiId" : undefined}
        />
      </div>
      <ErrorMsg id="err-upiId" msg={touchedUpi.upiId ? upiErr.upiId : ""} />
      <p className="fontStyle10 text-[var(--color4)] mt-2 flex items-center gap-1.5">
        <i className="bx bx-help-circle text-[var(--color4)]"></i>
        Use your UPI ID in the format name@bank
      </p>
    </div>
  );
}

/* ── STEP 2 · Payment ── */
export default function PaymentStep({ form, subtotal, cardNumberRef, cardNameRef, expiryRef, cvvRef, upiIdRef }) {
  const { payMethod, selectPayMethod, loading, submitPay, setStep } = form;

  return (
    <SectionCard
      num="02"
      icon="bx-wallet"
      title="Payment Method"
      subtitle="Choose how you'd like to pay"
    >
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {METHODS.map((m) => {
          const active = payMethod === m.id;
          return (
            <button
              key={m.id}
              onClick={() => selectPayMethod(m.id)}
              className={`relative py-3.5 rounded-xl fontStyle10 font-semibold border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1
                ${
                  active
                    ? "border-[var(--color6)]/30 text-[var(--color6)] bg-[var(--color5)] shadow-md"
                    : "border-[var(--color6)]/10 text-[var(--color4)] hover:border-[var(--color6)]/25"
                }`}
            >
              {active && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center">
                  <i className="bx bx-check text-[10px]"></i>
                </span>
              )}
              <i className={`bx ${m.icon} text-xl`}></i>
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {payMethod === "card" && (
        <CardFields
          form={form}
          cardNumberRef={cardNumberRef}
          cardNameRef={cardNameRef}
          expiryRef={expiryRef}
          cvvRef={cvvRef}
        />
      )}
      {payMethod === "paypal" && <PayPalPanel />}
      {payMethod === "upi" && <UpiFields form={form} upiIdRef={upiIdRef} />}

      <div className="flex flex-col-reverse sm:flex-row gap-2.5 mt-6">
        <button onClick={() => setStep(1)} className={BTN_GHOST}>
          <i className="bx bx-arrow-back"></i> Back
        </button>
        <button
          onClick={submitPay}
          disabled={loading}
          className={`${BTN_PRIMARY} flex-1 disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed border-none`}
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : <i className="bx bx-lock-alt text-base"></i>}
          {loading ? "Processing..." : `Pay $${subtotal}`}
        </button>
      </div>

      <p className="fontStyle10 text-[var(--color4)] text-center mt-4 flex items-center justify-center gap-1">
        <i className="bx bx-check-shield text-green-500"></i>
        Secured with 256-bit SSL encryption
      </p>
    </SectionCard>
  );
}
