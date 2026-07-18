import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { registerAPI, verifyOTPAPI, resendOTPAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── Floating bg shapes ──────────────────────────────────────
function AuthDots() {
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] h-[3px] rounded-full bg-white/15 absolute animate-pulse"
          style={{
            left: `${(i % 7) * 14 + 2}%`,
            top: `${Math.floor(i / 7) * 16 + 4}%`,
            animationDelay: `${(i * 0.12) % 1.5}s`,
            animationDuration: `${2 + (i % 3)}s`,
          }}
        />
      ))}
    </>
  );
}

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="w-[380px] h-[380px] border-2 border-white/10 rounded-full absolute -top-16 -left-24 animate-spin" style={{ animationDuration: "32s" }} />
      <div className="w-[180px] h-[180px] border border-white/8 rounded-full absolute -bottom-5 -right-12 animate-spin" style={{ animationDuration: "22s", animationDirection: "reverse" }} />
      <AuthDots />
      <div className="w-16 h-16 border-2 border-white/20 rounded-2xl absolute top-[38%] right-9 animate-bounce" style={{ animationDuration: "5s", transform: "rotate(-15deg)" }} />
      <div className="w-5 h-5 bg-white/15 rounded-md absolute bottom-40 left-[15%] animate-bounce" style={{ animationDuration: "4.5s", animationDelay: "0.8s", transform: "rotate(25deg)" }} />
    </div>
  );
}

// ── Password strength bar ────────────────────────────────────
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
          <div key={i} className="flex-1 h-[3px] rounded-full transition-all duration-300"
            style={{ background: i < score ? lvl.color : "rgba(0,0,0,0.08)" }} />
        ))}
      </div>
      <span className="fontStyle10 font-semibold" style={{ color: lvl.color }}>{lvl.label} password</span>
    </div>
  );
}

const OTP_LENGTH = 6;

export default function Signup() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  // ── Step: "form" | "otp" ──
  const [step, setStep] = useState("form");

  const [mounted, setMounted]         = useState(false);
  const [form, setForm]               = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed]           = useState(false);
  const [focused, setFocused]         = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  // OTP state
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

  // Step change hone pe mounted re-trigger karo (smooth transition)
  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  // Countdown for resend
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

  const inputCls = `w-full pl-11 pr-4 py-[14px] rounded-[14px]
    border-[1.5px] border-[var(--color6)]/10 bg-[var(--color5)]
    fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)]
    focus:border-[var(--color6)] focus:shadow-[4px_4px_0_var(--color6)]
    transition-all duration-200`;

  // ── STEP 1: Register ─────────────────────────────────────
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

  // ── OTP input handlers ───────────────────────────────────
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
    if (e.key === "ArrowLeft"  && index > 0)            refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus();
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

  // ── STEP 2: Verify OTP ───────────────────────────────────
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

  // ── Resend OTP ───────────────────────────────────────────
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
      <SEOHead title="Sign Up" description="Create a free TemplateWorld account to download templates and access exclusive features." />

      <BreadCrumb_Nav
        items={[
          { label: "Home", path: "/" },
          { label: "Login", path: "/login" },
          { label: "Signup", path: "/signup" },
        ]}
      />

      <div className="min-h-screen bg-[var(--color5)] flex items-center justify-center md:p-10">
        <div className={`w-full max-w-[920px] grid grid-cols-1 md:grid-cols-2 rounded-[20px] sm:rounded-[28px] overflow-hidden
          border-2 border-[var(--color6)] shadow-[8px_8px_0_var(--color6)] sm:shadow-[14px_14px_0_var(--color6)]
          transition-all duration-500 ease-out
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

          {/* ── LEFT: Form / OTP panel ── */}
          <div className="bg-[var(--color5)] p-8 sm:p-10 md:p-[52px_48px] flex flex-col justify-center overflow-y-auto">

            {/* ════════ STEP 1: Register Form ════════ */}
            {step === "form" && (
              <>
                <div className={fadeUp("delay-100")}>
                  <Link to="/" className="inline-block mb-5 md:mb-7">
                    <svg width="34" height="28" viewBox="0 0 36 30" fill="none">
                      <path d="M0 0L9 15L0 30H8L18 15L8 0H0Z" fill="var(--color6)" />
                      <path d="M14 0L23 15L14 30H22L32 15L22 0H14Z" fill="var(--color6)" opacity="0.4" />
                    </svg>
                  </Link>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-1">Get started</p>
                  <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-1">Create account</h1>
                  <p className="fontStyle9 text-[var(--color4)] mb-6 md:mb-7">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[var(--color6)] font-bold underline underline-offset-4">Log in →</Link>
                  </p>
                </div>

                <form className="flex flex-col gap-4 sm:gap-[18px]" onSubmit={handleRegister}>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                      <i className="bx bx-error-circle text-red-400 text-base flex-shrink-0" />
                      <p className="fontStyle10 text-red-500 font-semibold">{error}</p>
                    </div>
                  )}

                  {/* Name */}
                  <div className={fadeUp("delay-150")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Full Name</label>
                    <div className="relative">
                      <i className={`bx bx-user absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${focused === "name" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input type="text" name="name" autoComplete="name" required placeholder="Aryan Mehta"
                        value={form.name}
                        onFocus={() => setFocused("name")} onBlur={() => setFocused("")}
                        onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
                        className={inputCls} />
                    </div>
                  </div>

                  {/* Email */}
                  <div className={fadeUp("delay-200")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Email</label>
                    <div className="relative">
                      <i className={`bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${focused === "email" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input type="email" name="email" autoComplete="email" required placeholder="you@example.com"
                        value={form.email}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                        onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(""); }}
                        className={inputCls} />
                    </div>
                  </div>

                  {/* Password */}
                  <div className={fadeUp("delay-[250ms]")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Password</label>
                    <div className="relative">
                      <i className={`bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${focused === "pass" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input type={showPass ? "text" : "password"} name="password" autoComplete="new-password" required placeholder="Min. 8 characters"
                        value={form.password} 
                        onFocus={() => setFocused("pass")} onBlur={() => setFocused("")}
                        onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }}
                        className={`${inputCls} pr-12`} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex">
                        <i className={`bx ${showPass ? "bx-hide" : "bx-show"} text-[17px]`} />
                      </button>
                    </div>
                    <StrengthBar password={form.password} />
                  </div>

                  {/* Confirm */}
                  <div className={fadeUp("delay-300")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">Confirm Password</label>
                    <div className="relative">
                      <i className={`bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200 ${focused === "confirm" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input type={showConfirm ? "text" : "password"} name="confirm" autoComplete="new-password" required placeholder="Repeat password"
                        value={form.confirm}
                        onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")}
                        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        className={`${inputCls} pr-12 ${mismatch ? "!border-red-400 !shadow-[3px_3px_0_#ef4444]" : ""}`} />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex">
                        <i className={`bx ${showConfirm ? "bx-hide" : "bx-show"} text-[17px]`} />
                      </button>
                    </div>
                    {mismatch && <p className="fontStyle10 text-red-400 font-semibold mt-1">Passwords do not match</p>}
                  </div>

                  {/* Terms */}
                  <div className={`!flex !items-center gap-3 ${fadeUp("delay-[330ms]")}`}>
                    <button type="button" onClick={() => setAgreed(!agreed)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200
                        ${agreed ? "bg-[var(--color6)] border-[var(--color6)] shadow-[2px_2px_0_var(--color4)]" : "border-[var(--color6)]/20 bg-[var(--color5)] hover:border-[var(--color6)]"}`}>
                      {agreed && <i className="bx bx-check text-[var(--color5)] text-lg" />}
                    </button>
                    <p className="fontStyle10 text-[var(--color4)] leading-relaxed">
                      I agree to the{" "}
                      <Link to="/terms" className="text-[var(--color6)] font-bold underline underline-offset-4">Terms</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-[var(--color6)] font-bold underline underline-offset-4">Privacy Policy</Link>
                    </p>
                  </div>

                  {/* Submit */}
                  <div className={fadeUp("delay-[360ms]")}>
                    <button type="submit"
                      disabled={loading || !agreed || !!mismatch || !form.password || !form.name || !form.email}
                      className="w-full py-[13px] sm:py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                        fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                        !flex !items-center justify-center gap-2
                        hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                        active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_var(--color4)]
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                      {loading
                        ? <><i className="bx bx-loader-alt animate-spin text-base" /> Sending OTP…</>
                        : <>Continue <i className="bx bx-right-arrow-alt text-lg" /></>
                      }
                    </button>
                  </div>

                  {/* Divider + OAuth */}
                  <div className={`flex items-center gap-3 ${fadeUp("delay-[380ms]")}`}>
                    <div className="flex-1 h-px bg-[var(--color6)]/8" />
                    <span className="fontStyle10 text-[var(--color4)]">or sign up with</span>
                    <div className="flex-1 h-px bg-[var(--color6)]/8" />
                  </div>
                  <div className={`flex gap-3 ${fadeUp("delay-[400ms]")}`}>
                    {[{ icon: "bxl-google", label: "Google" }, { icon: "bxl-github", label: "GitHub" }].map(({ icon, label }) => (
                      <button key={label} type="button"
                        className="flex-1 py-2.5 sm:py-3 rounded-xl border-[1.5px] border-[var(--color6)]/12 bg-[var(--color5)]
                          fontStyle9 font-semibold text-[var(--color6)]
                          !flex !items-center justify-center gap-2
                          hover:border-[var(--color6)] hover:shadow-[3px_3px_0_var(--color6)]
                          hover:-translate-x-px hover:-translate-y-px transition-all duration-200">
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
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color6)] flex items-center justify-center mb-5 md:mb-7">
                    <i className="bx bx-envelope-open text-[var(--color5)] text-xl sm:text-2xl" />
                  </div>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-1">Verify email</p>
                  <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-1">Enter OTP</h1>
                  <p className="fontStyle9 text-[var(--color4)] mb-7">
                    Code sent to{" "}
                    <span className="font-bold text-[var(--color6)]">{form.email}</span>
                  </p>
                </div>

                {/* OTP boxes */}
                <div className={`flex gap-2 sm:gap-3 mb-5 ${fadeUp("delay-150")}`} onPaste={handlePaste}>
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
                      className={`w-11 h-14 sm:w-12 sm:h-16 text-center rounded-[14px]
                        border-[1.5px] bg-[var(--color5)] outline-none
                        fontStyle4 font-black text-[var(--color6)] text-xl
                        caret-transparent transition-all duration-200
                        ${digit
                          ? "border-[var(--color6)] shadow-[3px_3px_0_var(--color6)]"
                          : "border-[var(--color6)]/15 focus:border-[var(--color6)] focus:shadow-[3px_3px_0_var(--color6)]"
                        }
                        ${error ? "!border-red-400" : ""}`}
                    />
                  ))}
                </div>

                {/* Error / Success */}
                {error && (
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl bg-red-50 border border-red-200 ${fadeUp()}`}>
                    <i className="bx bx-error-circle text-red-400 text-base flex-shrink-0" />
                    <p className="fontStyle10 text-red-500 font-semibold">{error}</p>
                  </div>
                )}
                {success && (
                  <div className={`flex items-center gap-2 mb-4 p-3 rounded-xl bg-green-50 border border-green-200 ${fadeUp()}`}>
                    <i className="bx bx-check-circle text-green-500 text-base flex-shrink-0" />
                    <p className="fontStyle10 text-green-600 font-semibold">{success}</p>
                  </div>
                )}

                {/* Verify button */}
                <div className={fadeUp("delay-200")}>
                  <button type="button" onClick={handleVerify}
                    disabled={loading || otp.length < OTP_LENGTH}
                    className="w-full py-[13px] sm:py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                      fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                      !flex !items-center justify-center gap-2
                      hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                      active:translate-x-px active:translate-y-px
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                    {loading
                      ? <><i className="bx bx-loader-alt animate-spin text-base" /> Verifying…</>
                      : <>Verify & Create Account <i className="bx bx-right-arrow-alt text-lg" /></>
                    }
                  </button>
                </div>

                {/* Resend */}
                <div className={`flex items-center gap-3 mt-4 ${fadeUp("delay-[250ms]")}`}>
                  <div className="flex-1 h-px bg-[var(--color6)]/8" />
                  <span className="fontStyle10 text-[var(--color4)]">or</span>
                  <div className="flex-1 h-px bg-[var(--color6)]/8" />
                </div>

                <div className={fadeUp("delay-300")}>
                  <button type="button" onClick={handleResend}
                    disabled={countdown > 0 || resending}
                    className="w-full mt-3 py-[11px] rounded-[14px] border-[1.5px] border-[var(--color6)]/15
                      text-[var(--color4)] fontStyle9 font-semibold
                      !flex !items-center justify-center gap-2
                      hover:border-[var(--color6)] hover:text-[var(--color6)]
                      hover:shadow-[3px_3px_0_var(--color6)] hover:-translate-x-px hover:-translate-y-px
                      disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
                    {resending
                      ? <><i className="bx bx-loader-alt animate-spin text-base" /> Resending…</>
                      : countdown > 0
                        ? <><i className="bx bx-time-five text-base" /> Resend in {countdown}s</>
                        : <><i className="bx bx-refresh text-base" /> Resend OTP</>
                    }
                  </button>
                </div>

                {/* Back to form */}
                <div className={`mt-5 ${fadeUp("delay-[330ms]")}`}>
                  <button type="button" onClick={() => { setStep("form"); setError(""); setDigits(Array(OTP_LENGTH).fill("")); }}
                    className="flex items-center justify-center gap-2 w-full fontStyle9 font-semibold text-[var(--color4)]
                      hover:text-[var(--color6)] transition-colors duration-200 group">
                    <i className="bx bx-arrow-back text-base transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to Signup
                  </button>
                </div>
              </>
            )}

          </div>

          {/* ── RIGHT: Black decorative panel ── */}
          <div className="bg-[var(--color6)] p-8 sm:p-10 md:p-[60px_48px] flex flex-col justify-center relative min-h-[260px] md:min-h-[620px]">
            <FloatingShapes />

            <div className={`relative z-10 ${slideIn("delay-100")}`}>
              {/* <span className="inline-block px-4 py-1.5 rounded-full border border-white/20
                fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color10)] mb-5 md:mb-7">
                Join 50,000+ brands
              </span> */}
              <h2 className="fontStyle3 font-black text-[var(--color5)] leading-[1.1] mb-4 md:mb-5">
                Your brand deserves better.
              </h2>
              <p className="fontStyle9 text-[var(--color10)] leading-[1.75] max-w-[270px]">
                Stop settling for average. Get access to premium templates that convert, designed by world-class designers.
              </p>
            </div>

            {/* Step indicator — right panel me */}
            <div className={`hidden sm:flex flex-col gap-4 relative z-10 mt-8 md:mt-10 ${slideIn("delay-200")}`}>
              {[
                { label: "Fill your details", icon: "bx-user-plus",    done: step === "otp", active: step === "form" },
                { label: "Verify your email", icon: "bx-check-circle", done: false,          active: step === "otp"  },
                { label: "Start exploring",   icon: "bx-rocket",       done: false,          active: false           },
              ].map(({ label, icon, done, active }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
                    ${active ? "bg-[var(--color5)]" : done ? "bg-white/30" : "bg-white/10"}`}>
                    <i className={`bx ${done ? "bx-check" : icon} text-sm
                      ${active ? "text-[var(--color6)]" : "text-[var(--color5)]"}`} />
                  </div>
                  <span className={`fontStyle9 font-medium transition-all duration-300
                    ${active ? "text-[var(--color5)]" : "text-[var(--color10)]"}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className={`hidden sm:block relative z-10 border-t border-white/10 pt-6 mt-8 md:mt-10 ${slideIn("delay-300")}`}>
              <p className="fontStyle10 text-[var(--color10)] leading-relaxed">
                "The best investment we made for our brand."
              </p>
              <span className="fontStyle10 text-white/30 mt-1 block">— Rajeev Sharma, Founder</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}