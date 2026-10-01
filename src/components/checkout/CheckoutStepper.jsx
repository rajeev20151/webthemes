import { Fragment } from "react";
import { CARD_CLS } from "./styles";

const STEPS = ["Contact Info", "Payment"];

/* ── Horizontal step indicator ── */
export default function CheckoutStepper({ step }) {
  return (
    <div className={`${CARD_CLS} w-full sm:w-auto flex items-center justify-center px-5 py-3`}>
      {STEPS.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <span
              className={`block w-10 sm:w-14 h-1 rounded-full mx-3 sm:mx-4 shrink-0 transition-colors duration-300 ${
                step > i ? "bg-green-500" : "bg-[var(--color6)]/15"
              }`}
            />
          )}
          <div className="flex items-center gap-2.5 shrink-0">
            <span
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center fontStyle10 font-bold transition-all duration-200 ${
                step > i + 1
                  ? "bg-green-500 text-white border-green-500 shadow-sm"
                  : step === i + 1
                    ? "bg-color3 text-white border-transparent shadow-md"
                    : "bg-[var(--color5)] text-[var(--color4)] border-[var(--color6)]/20"
              }`}
            >
              {step > i + 1 ? <i className="bx bx-check text-xs"></i> : i + 1}
            </span>
            <span
              className={`fontStyle10 font-semibold whitespace-nowrap transition-colors duration-200 ${
                step >= i + 1 ? "text-[var(--color6)]" : "text-[var(--color4)]"
              }`}
            >
              {s}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}
