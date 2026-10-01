import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, setDbCart } from "../../store/slices/cartSlice";
import { useClearCartApiMutation } from "../../store/apiSlice";
import { validate, fmtCard, fmtExpiry } from "./validation";
import { INFO_FIELDS, CARD_FIELDS, UPI_FIELDS } from "./fields";

/**
 * Owns every piece of checkout form state: values, errors, touched flags,
 * field refs and the submit handlers. The page component only reads from it.
 */
export default function useCheckoutForm() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.cart.isAuth);
  const [clearCartApi] = useClearCartApiMutation();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState("card");

  /* ── Form Values ── */
  const [info, setInfo] = useState({ firstName: "", lastName: "", email: "", country: "" });
  const [card, setCard] = useState({ cardNumber: "", cardName: "", expiry: "", cvv: "" });
  const [upi,  setUpi]  = useState({ upiId: "" });

  /* ── Errors ── */
  const [infoErr, setInfoErr] = useState({});
  const [cardErr, setCardErr] = useState({});
  const [upiErr,  setUpiErr]  = useState({});

  /* ── Touched state — an error is only revealed once a field has been visited ── */
  const [touchedInfo, setTouchedInfo] = useState({});
  const [touchedCard, setTouchedCard] = useState({});
  const [touchedUpi,  setTouchedUpi]  = useState({});

  /* ── Refs so the summary + submit can focus the first offending field ── */
  const firstNameRef = useRef(null);
  const lastNameRef  = useRef(null);
  const emailRef     = useRef(null);
  const countryRef   = useRef(null);
  const cardNumberRef = useRef(null);
  const cardNameRef  = useRef(null);
  const expiryRef    = useRef(null);
  const cvvRef       = useRef(null);
  const upiIdRef     = useRef(null);

  /* ── Field definitions with focus targets (used by summary + submit) ── */
  const infoFields = [
    { key: "firstName", label: "First name",    focus: () => firstNameRef.current?.focus() },
    { key: "lastName",  label: "Last name",     focus: () => lastNameRef.current?.focus() },
    { key: "email",     label: "Email address", focus: () => emailRef.current?.focus() },
    { key: "country",   label: "Country",       focus: () => countryRef.current?.focus() },
  ];
  const cardFields = [
    { key: "cardNumber", label: "Card number",     focus: () => cardNumberRef.current?.focus() },
    { key: "cardName",   label: "Cardholder name", focus: () => cardNameRef.current?.focus() },
    { key: "expiry",     label: "Expiry date",     focus: () => expiryRef.current?.focus() },
    { key: "cvv",        label: "CVV",             focus: () => cvvRef.current?.focus() },
  ];
  const upiFields = [{ key: "upiId", label: "UPI ID", focus: () => upiIdRef.current?.focus() }];

  /* ── Reveal every error for a group on submit ── */
  const reveal = (setter, keys) => setter((p) => ({ ...p, ...Object.fromEntries(keys.map((k) => [k, true])) }));

  /* ── Reveal the error as soon as a field loses focus ── */
  const blurInfo = (key) => {
    setTouchedInfo((p) => ({ ...p, [key]: true }));
    setInfoErr(validate.info(info));
  };
  const blurCard = (key) => {
    setTouchedCard((p) => ({ ...p, [key]: true }));
    setCardErr(validate.card(card));
  };
  const blurUpi = () => {
    setTouchedUpi((p) => ({ ...p, upiId: true }));
    setUpiErr(validate.upi(upi));
  };

  /* ── Once a field is flagged, re-validate on every keystroke so it clears live ── */
  const changeInfo = (key, value) => {
    const next = { ...info, [key]: value };
    setInfo(next);
    if (touchedInfo[key]) setInfoErr(validate.info(next));
  };
  const changeCard = (key, value) => {
    const next = { ...card, [key]: value };
    setCard(next);
    if (touchedCard[key]) setCardErr(validate.card(next));
  };
  const changeUpi = (value) => {
    const next = { upiId: value };
    setUpi(next);
    if (touchedUpi.upiId) setUpiErr(validate.upi(next));
  };

  /* ── Switching method clears the other method's errors ── */
  const selectPayMethod = (id) => {
    setPayMethod(id);
    setCardErr({});
    setUpiErr({});
  };

  /* ── Submit Handlers ── */
  const submitInfo = () => {
    const e = validate.info(info);
    setInfoErr(e);
    reveal(setTouchedInfo, INFO_FIELDS.map((f) => f.key));
    if (Object.keys(e).length) {
      infoFields.find((f) => e[f.key])?.focus();
      return;
    }
    setTouchedInfo({});
    setStep(2);
  };

  const submitPay = async () => {
    let e = {};
    let fields = [];
    if (payMethod === "card") {
      e = validate.card(card);
      fields = cardFields;
      setCardErr(e);
      reveal(setTouchedCard, CARD_FIELDS.map((f) => f.key));
    }
    if (payMethod === "upi") {
      e = validate.upi(upi);
      fields = upiFields;
      setUpiErr(e);
      reveal(setTouchedUpi, UPI_FIELDS.map((f) => f.key));
    }
    if (Object.keys(e).length) {
      fields.find((f) => e[f.key])?.focus();
      return;
    }
    setTouchedCard({});
    setTouchedUpi({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    if (isAuth) {
      clearCartApi().unwrap().then(() => dispatch(setDbCart([]))).catch(() => {});
    } else {
      dispatch(clearCart());
    }
    setStep(3);
  };

  return {
    step, setStep,
    loading,
    payMethod, selectPayMethod,

    info, infoErr, touchedInfo, infoFields,
    card, cardErr, touchedCard, cardFields,
    upi,  upiErr,  touchedUpi,  upiFields,

    changeInfo, blurInfo,
    changeCard, blurCard,
    changeUpi,  blurUpi,

    submitInfo, submitPay,

    refs: {
      firstName: firstNameRef,
      lastName: lastNameRef,
      email: emailRef,
      country: countryRef,
      cardNumber: cardNumberRef,
      cardName: cardNameRef,
      expiry: expiryRef,
      cvv: cvvRef,
      upiId: upiIdRef,
    },

    format: { card: fmtCard, expiry: fmtExpiry },
  };
}
