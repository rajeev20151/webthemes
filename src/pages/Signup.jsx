import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { registerAPI, verifyOTPAPI, resendOTPAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function StrengthBar({ password }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const levels = [
    { label: "Weak",   color: "#ef4444" },
    { label: "Fair",   color: "#f97316" },
    { label: "Good",   color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
  ];
  const lvl = levels[score - 1] || levels[0];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`flex-1 h-[3px] rounded-full transition-all duration-300 ${i < score ? "" : "bg-[var(--color6)]/10"}`}
            style={i < score ? { background: lvl.color } : undefined} />
        ))}
      </div>
      <span className="fontStyle10 font-semibold" style={{ color: lvl.color }}>{lvl.label}</span>
    </div>
  );
}

const OTP_LENGTH = 6;

export default function Signup() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const [step, setStep] = useState("form");

  const [mounted, setMounted]         = useState(false);
  const [form, setForm]               = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  const [digits, setDigits]       = useState(Array(OTP_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs                 = Array.from({ length: OTP_LENGTH }, () => null);
  const refs                      = { current: inputRefs };

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const fadeUp = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`;

  const slideIn = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`;

  const mismatch = form.confirm && form.confirm !== form.password;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreed || mismatch) return;
    setLoading(true);
    setError("");
    try {
      const data = await registerAPI(form.name, form.email, form.password);
      if (data.success) {
        setStep("otp");
        setCountdown(60);
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError("");
    if (value && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft"  && index > 0)                  refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1)     refs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const newDigits = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { newDigits[i] = ch; });
    setDigits(newDigits);
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < OTP_LENGTH) { setError("Please enter the complete 6-digit OTP."); return; }
    setLoading(true);
    setError("");
    try {
      const data = await verifyOTPAPI(form.email, otp);
      if (data.success) {
        login(data.user, data.token);
        navigate("/login");
      } else {
        setError(data.message || "Wrong OTP.");
        setDigits(Array(OTP_LENGTH).fill(""));
        refs.current[0]?.focus();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      const data = await resendOTPAPI(form.email);
      if (data.success) {
        setCountdown(60);
        setDigits(Array(OTP_LENGTH).fill(""));
        setSuccess("New OTP sent!");
        setTimeout(() => setSuccess(""), 3000);
        refs.current[0]?.focus();
      } else {
        setError(data.message || "Failed to resend.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const otp = digits.join("");

  return (
    <div className="w-width py-12 sm:py-12 md:py-20">
      <SEOHead title="Sign Up" description="Create a free {site} account to download templates and access exclusive features." />

      <BreadCrumb_Nav
        items={[
          { label: "Home", path: "/" },
          { label: "Login", path: "/login" },
          { label: "Signup", path: "/signup" },
        ]}
      />

      <div className="min-h-screen bg-[var(--color5)] flex items-center justify-center md:p-10">
        <div className={`w-full max-w-[920px] grid grid-cols-1 md:grid-cols-2 rounded-[20px] sm:rounded-[28px] overflow-hidden
          border border-[var(--color6)]/10
          transition-all duration-500 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)" }}>

          {/* ── LEFT: Form / OTP panel ── */}
          <div className="bg-[var(--color5)] p-8 sm:p-10 md:p-[52px_48px] flex flex-col justify-center">

            {/* ════════ STEP 1: Register Form ════════ */}
            {step === "form" && (
              <>
                <div className={fadeUp("delay-100")}>
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <Link to="/" className="inline-block">
                      <svg width="34" height="28" viewBox="0 0 36 30" fill="none">
                        <path d="M0 0L9 15L0 30H8L18 15L8 0H0Z" fill="var(--color6)" />
                        <path d="M14 0L23 15L14 30H22L32 15L22 0H14Z" fill="var(--color6)" opacity="0.4" />
                      </svg>
                    </Link>
                  </div>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-1">Get started</p>
                  <h1 className="fontStyle2 font-black text-[var(--color6)] leading-[1.15] mb-1.5">Create your account</h1>
                  <p className="fontStyle9 text-[var(--color4)] mb-7 md:mb-8">
                    Already registered?{" "}
                    <Link to="/login" className="text-[var(--color6)] font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">Log in</Link>
                  </p>
                </div>

                <form className="flex flex-col gap-4 sm:gap-[18px]" onSubmit={handleRegister}>

                  {error && (
                    <div className={`flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 ${fadeUp()}`}>
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                        </svg>
                      </div>
                      <p className="fontStyle10 text-red-500 font-semibold m-0">{error}</p>
                    </div>
                  )}

                  <div className={fadeUp("delay-150")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Full name</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color4)] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input type="text" name="name" autoComplete="name" required placeholder="Aryan Mehta"
                        value={form.name}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                        className="w-full min-h-[48px] bg-[var(--color5)] border border-[var(--color6)]/10 rounded-xl pl-10 pr-4 py-3 fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)] focus:border-[var(--color6)] focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200" />
                    </div>
                  </div>

                  <div className={fadeUp("delay-200")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Email</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color4)] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input type="email" name="email" autoComplete="email" required placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                        className="w-full min-h-[48px] bg-[var(--color5)] border border-[var(--color6)]/10 rounded-xl pl-10 pr-4 py-3 fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)] focus:border-[var(--color6)] focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200" />
                    </div>
                  </div>

                  <div className={fadeUp("delay-[250ms]")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Password</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color4)] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input type={showPass ? "text" : "password"} name="password" autoComplete="new-password" required placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                        className="w-full min-h-[48px] bg-[var(--color5)] border border-[var(--color6)]/10 rounded-xl pl-10 pr-12 py-3 fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)] focus:border-[var(--color6)] focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200" />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[var(--color4)] hover:text-[var(--color6)] transition-colors bg-transparent border-none cursor-pointer rounded-lg">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {showPass
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                          }
                        </svg>
                      </button>
                    </div>
                    <StrengthBar password={form.password} />
                  </div>

                  <div className={fadeUp("delay-300")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Confirm password</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color4)] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input type={showConfirm ? "text" : "password"} name="confirm" autoComplete="new-password" required placeholder="Repeat password"
                        value={form.confirm}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        className={`w-full min-h-[48px] bg-[var(--color5)] border rounded-xl pl-10 pr-12 py-3 fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)] focus:ring-2 transition-all duration-200 ${mismatch ? "border-red-400 focus:ring-red-200" : "border-[var(--color6)]/10 focus:border-[var(--color6)] focus:ring-[var(--color6)]/10"}`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[var(--color4)] hover:text-[var(--color6)] transition-colors bg-transparent border-none cursor-pointer rounded-lg">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          {showConfirm
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><path d="M1 1l22 22"/></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                          }
                        </svg>
                      </button>
                    </div>
                    {mismatch && <p className="fontStyle10 text-red-500 font-semibold mt-1.5">Passwords do not match</p>}
                  </div>

                  <div className={`flex items-center gap-3 ${fadeUp("delay-[330ms]")}`}>
                    <button type="button" onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${agreed ? "bg-[var(--color6)] border-[var(--color6)]" : "border-[var(--color6)]/20 hover:border-[var(--color6)]"}`}>
                      {agreed && (
                        <svg className="w-3 h-3 text-[var(--color5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </button>
                    <p className="fontStyle10 text-[var(--color4)] leading-relaxed m-0">
                      I agree to the{" "}
                      <Link to="/terms" className="text-[var(--color6)] font-bold underline underline-offset-4">Terms</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-[var(--color6)] font-bold underline underline-offset-4">Privacy Policy</Link>
                    </p>
                  </div>

                  <div className={fadeUp("delay-[360ms]")}>
                    <button type="submit"
                      disabled={loading || !agreed || !!mismatch || !form.password || !form.name || !form.email}
                      className="w-full min-h-[48px] text-[var(--color5)] fontStyle9 font-semibold py-3 rounded-xl mt-1 flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: "var(--color6)", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}>
                      {loading
                        ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending OTP…</>
                        : <><span>Create account</span><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                      }
                    </button>
                  </div>

                  <div className={`flex items-center gap-3 ${fadeUp("delay-[380ms]")}`}>
                    <div className="flex-1 h-px bg-[var(--color6)]/10" />
                    <span className="fontStyle10 text-[var(--color4)]">or sign up with</span>
                    <div className="flex-1 h-px bg-[var(--color6)]/10" />
                  </div>

                  <div className={`flex gap-3 ${fadeUp("delay-[400ms]")}`}>
                    {[{ icon: "bxl-google", label: "Google" }, { icon: "bxl-github", label: "GitHub" }].map(({ icon, label }) => (
                      <button key={label} type="button"
                        className="flex-1 py-2.5 sm:py-3 rounded-xl border border-[var(--color6)]/10 bg-transparent fontStyle9 font-semibold text-[var(--color6)] flex items-center justify-center gap-2 cursor-pointer hover:bg-[var(--color6)]/5 transition-all duration-200">
                        <i className={`bx ${icon} text-base`} /> {label}
                      </button>
                    ))}
                  </div>
                </form>
              </>
            )}

            {/* ════════ STEP 2: OTP Verify ════════ */}
            {step === "otp" && (
              <>
                <div className={fadeUp("delay-100")}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 md:mb-6"
                    style={{ background: "var(--color6)" }}>
                    <svg className="w-6 h-6 text-[var(--color5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-1">Verify email</p>
                  <h1 className="fontStyle2 font-black text-[var(--color6)] leading-[1.15] mb-1.5">Enter OTP</h1>
                  <p className="fontStyle9 text-[var(--color4)] mb-7">
                    Code sent to{" "}
                    <span className="font-bold text-[var(--color6)]">{form.email}</span>
                  </p>
                </div>

                <div className={`flex gap-2 sm:gap-3 mb-6 ${fadeUp("delay-150")}`} onPaste={handlePaste}>
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (refs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      className={`w-11 h-14 sm:w-12 sm:h-16 text-center rounded-xl border-2 bg-[var(--color5)] outline-none fontStyle2 font-bold text-[var(--color6)] caret-transparent transition-all duration-200 ${digit ? "border-[var(--color6)]" : "border-[var(--color6)]/10 focus:border-[var(--color6)]"} ${error ? "!border-red-400" : ""}`} />
                  ))}
                </div>

                {error && (
                  <div className={`flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 mb-5 ${fadeUp()}`}>
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                      </svg>
                    </div>
                    <p className="fontStyle10 text-red-500 font-semibold m-0">{error}</p>
                  </div>
                )}
                {success && (
                  <div className={`flex items-center gap-2.5 p-3.5 rounded-xl bg-green-50 border border-green-200 mb-5 ${fadeUp()}`}>
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <p className="fontStyle10 text-green-600 font-semibold m-0">{success}</p>
                  </div>
                )}

                <div className={fadeUp("delay-200")}>
                  <button type="button" onClick={handleVerify}
                    disabled={loading || otp.length < OTP_LENGTH}
                    className="w-full min-h-[48px] text-[var(--color5)] fontStyle9 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "var(--color6)", boxShadow: "0 4px 14px rgba(0,0,0,0.1)" }}>
                    {loading
                      ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Verifying…</>
                      : <><span>Verify & create account</span><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                    }
                  </button>
                </div>

                <div className={`flex items-center gap-3 mt-4 ${fadeUp("delay-[250ms]")}`}>
                  <div className="flex-1 h-px bg-[var(--color6)]/10" />
                  <span className="fontStyle10 text-[var(--color4)]">or</span>
                  <div className="flex-1 h-px bg-[var(--color6)]/10" />
                </div>

                <div className={fadeUp("delay-300")}>
                  <button type="button" onClick={handleResend}
                    disabled={countdown > 0 || resending}
                    className="w-full mt-3 py-[11px] rounded-xl border border-[var(--color6)]/10 text-[var(--color4)] fontStyle9 font-semibold flex items-center justify-center gap-2 bg-transparent cursor-pointer hover:border-[var(--color6)] hover:text-[var(--color6)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                    {resending
                      ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Resending…</>
                      : countdown > 0
                        ? <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Resend in {countdown}s</>
                        : <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Resend OTP</>
                    }
                  </button>
                </div>

                <div className={`mt-5 ${fadeUp("delay-[330ms]")}`}>
                  <button type="button" onClick={() => { setStep("form"); setError(""); setDigits(Array(OTP_LENGTH).fill("")); }}
                    className="flex items-center justify-center gap-2 w-full fontStyle9 font-semibold text-[var(--color4)] hover:text-[var(--color6)] transition-colors duration-200 bg-transparent border-none cursor-pointer py-2">
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to signup
                  </button>
                </div>
              </>
            )}
          </div>

          {/* ── RIGHT: Dark decorative panel ── */}
          <div className="bg-[var(--color6)] p-8 sm:p-10 md:p-[60px_48px] flex flex-col justify-center relative min-h-[260px] md:min-h-[620px] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

            <div className="absolute top-1/3 -right-20 w-[300px] h-[300px] rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />
            <div className="absolute -bottom-20 -left-20 w-[250px] h-[250px] rounded-full opacity-[0.04] pointer-events-none"
              style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }} />

            <div className={`relative z-10 ${slideIn("delay-100")}`}>
              <h2 className="fontStyle3 font-black text-[var(--color5)] leading-[1.15] mb-4 md:mb-5">
                Your brand deserves better.
              </h2>
              <p className="fontStyle9 text-[var(--color10)] leading-[1.75] max-w-[270px]">
                Stop settling for average. Get access to premium templates that convert, designed by world-class designers.
              </p>
            </div>

            <div className={`hidden sm:flex flex-col gap-4 relative z-10 mt-8 md:mt-10 ${slideIn("delay-200")}`}>
              {[
                { label: "Fill your details",   icon: "bx-user-plus",    done: step === "otp", active: step === "form" },
                { label: "Verify your email",   icon: "bx-check-circle", done: false,          active: step === "otp"  },
                { label: "Start exploring",     icon: "bx-rocket",       done: false,          active: false           },
              ].map(({ label, icon, done, active }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${active ? "bg-[var(--color5)]" : done ? "bg-[var(--color5)]/40" : "bg-[var(--color5)]/15"}`}>
                    <i className={`bx ${done ? "bx-check" : icon} text-sm ${active ? "text-[var(--color6)]" : "text-[var(--color5)]"}`} />
                  </div>
                  <span className={`fontStyle9 font-medium transition-all duration-300 ${active ? "text-[var(--color5)] font-bold" : "text-[var(--color5)]/60"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className={`hidden sm:block relative z-10 border-t border-white/10 pt-6 mt-8 md:mt-10 ${slideIn("delay-300")}`}>
              <p className="fontStyle10 text-[var(--color10)] leading-relaxed">
                "The best investment we made for our brand."
              </p>
              {/* <span className="fontStyle10 text-[var(--color10)] opacity-60 mt-1 block">— Rajeev Sharma, Founder</span> */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
