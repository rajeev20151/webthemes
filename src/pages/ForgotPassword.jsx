import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { forgotPasswordAPI, resetPasswordAPI } from "../services/api.js";

function AuthDots() {
  return (
    <>
      {Array.from({ length: 48 }).map((_, i) => (
        <div
          key={i}
          className="w-[3px] h-[3px] rounded-full bg-white/15 absolute animate-pulse"
          style={{
            left: `${(i % 8) * 12 + 4}%`,
            top: `${Math.floor(i / 8) * 14 + 5}%`,
            animationDelay: `${(i * 0.1) % 1.5}s`,
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
      <div className="w-[420px] h-[420px] border-2 border-white/10 rounded-full absolute -top-20 -right-24 animate-spin" style={{ animationDuration: "28s" }} />
      <div className="w-[220px] h-[220px] border border-white/8 rounded-full absolute -bottom-4 -left-14 animate-spin" style={{ animationDuration: "20s", animationDirection: "reverse" }} />
      <AuthDots />
      <div className="w-20 h-20 border-2 border-white/20 rounded-2xl absolute bottom-36 right-10 animate-bounce" style={{ animationDuration: "6s", transform: "rotate(20deg)" }} />
      <div className="w-6 h-6 bg-white/15 rounded-md absolute top-[42%] left-[10%] animate-bounce" style={{ animationDuration: "4s", animationDelay: "1s", transform: "rotate(15deg)" }} />
    </div>
  );
}

// ── 4 steps: email → otp → reset → done ──
const STEP = { EMAIL: "email", OTP: "otp", RESET: "reset", DONE: "done" };

export default function ForgotPassword() {
  const [mounted, setMounted]         = useState(false);
  const [step, setStep]               = useState(STEP.EMAIL);
  const [email, setEmail]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [focused, setFocused]         = useState("");
  const [error, setError]             = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setMounted(false);
    setError("");
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [step]);

  const fadeUp = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`;

  const slideIn = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`;

  const mismatch = confirm && confirm !== password;

  const inputCls = `w-full pl-11 pr-4 py-[14px] rounded-[14px]
    border-[1.5px] border-[var(--color6)]/10 bg-[var(--color5)]
    fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)]
    focus:border-[var(--color6)] focus:shadow-[4px_4px_0_var(--color6)]
    transition-all duration-200`;

  // ── Step 1: Send OTP to email ──
  const handleEmail = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await forgotPasswordAPI(email);
      if (data.success === false) throw new Error(data.message);
      setStep(STEP.OTP);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Resend OTP ──
  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await forgotPasswordAPI(email);
      if (data.success === false) throw new Error(data.message);
    } catch (err) {
      setError(err.message || "Could not resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2→3: OTP entered, go to password step ──
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP");
      return;
    }
    setStep(STEP.RESET);
  };

  // ── Step 3: Reset password with OTP ──
  const handleReset = async (e) => {
    e.preventDefault();
    if (mismatch) return;
    setError("");
    setLoading(true);
    try {
      const data = await resetPasswordAPI(email, otp, password);
      if (data.success === false) throw new Error(data.message);
      setStep(STEP.DONE);
    } catch (err) {
      // If OTP was wrong, go back to OTP step
      if (err.message?.toLowerCase().includes("otp")) {
        setOtp("");
        setStep(STEP.OTP);
      }
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Step indicator data ──
  const stepIndicator = [
    { id: STEP.EMAIL, label: "Enter email",      icon: "bx-envelope"     },
    { id: STEP.OTP,   label: "Verify OTP",       icon: "bx-key"          },
    { id: STEP.RESET, label: "New password",      icon: "bx-lock-alt"     },
    { id: STEP.DONE,  label: "All done!",         icon: "bx-check-circle" },
  ];

  const stepsOrder = [STEP.EMAIL, STEP.OTP, STEP.RESET, STEP.DONE];
  const currentIdx = stepsOrder.indexOf(step);

  return (
    <div className="w-width py-12 sm:py-12 md:py-20">
      <SEOHead title="Forgot Password" description="Reset your {site} account password." />
      <BreadCrumb_Nav
        items={[
          { label: "Home", path: "/" },
          { label: "Login", path: "/login" },
          { label: "Forgot Password", path: "/forgot-password" },
        ]}
      />

      <div className="min-h-screen bg-[var(--color5)] flex items-center justify-center">
        <div className={`w-full max-w-[900px] grid grid-cols-1 md:grid-cols-2 rounded-[20px] sm:rounded-[28px] overflow-hidden
          border-2 border-[var(--color6)] shadow-[8px_8px_0_var(--color6)] sm:shadow-[14px_14px_0_var(--color6)]
          transition-all duration-500 ease-out
          ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >

          {/* ── LEFT: Black panel ── */}
          <div className="bg-[var(--color6)] p-8 sm:p-10 md:p-[60px_48px] flex flex-col justify-between relative min-h-[240px] md:min-h-[540px]">
            <FloatingShapes />

            <div className={slideIn("delay-100")}>
              <Link to="/" className="inline-block mb-6 md:mb-12">
                <svg width="38" height="32" viewBox="0 0 36 30" fill="none">
                  <path d="M0 0L9 15L0 30H8L18 15L8 0H0Z" fill="var(--color5)" />
                  <path d="M14 0L23 15L14 30H22L32 15L22 0H14Z" fill="var(--color5)" opacity="0.4" />
                </svg>
              </Link>
              <h2 className="fontStyle3 font-black text-[var(--color5)] leading-[1.1] mb-3 md:mb-4">
                Reset your<br />password.
              </h2>
              <p className="fontStyle9 text-[var(--color10)] leading-relaxed max-w-[260px]">
                We'll send you a secure OTP to reset your password and get back into your account.
              </p>
            </div>

            {/* Step indicator — hidden on small mobile */}
            <div className={`hidden sm:flex flex-col gap-4 mt-6 relative z-10 ${slideIn("delay-200")}`}>
              {stepIndicator.map(({ id, label, icon }) => {
                const idx  = stepsOrder.indexOf(id);
                const done = idx < currentIdx;
                const active = idx === currentIdx;
                return (
                  <div key={id} className="flex items-center gap-3">
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
                );
              })}
            </div>

            {/* Quote — hidden on mobile */}
            <div className={`hidden sm:block relative z-10 border-t border-[var(--color10)] pt-6 mt-8 ${slideIn("delay-300")}`}>
              <p className="fontStyle10 text-[var(--color10)] leading-relaxed">
                "The best investment we made for our brand."
              </p>
              {/* <span className="fontStyle10 text-white/30 mt-1 block">— Rajeev Sharma, Founder</span> */}
            </div>
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="bg-[var(--color5)] p-8 sm:p-10 md:p-[60px_48px] flex flex-col justify-center">

            {/* ── Error message ── */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl border-[1.5px] border-red-400/30 bg-red-50 dark:bg-red-500/10 flex items-start gap-3">
                <i className="bx bx-error-circle text-red-500 text-lg flex-shrink-0 mt-0.5" />
                <p className="fontStyle10 text-red-600 dark:text-red-400 leading-relaxed">{error}</p>
              </div>
            )}

            {/* ── STEP 1: Enter email ── */}
            {step === STEP.EMAIL && (
              <>
                <div className={fadeUp("delay-150")}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color6)] flex items-center justify-center mb-5 md:mb-7">
                    <i className="bx bx-lock-open-alt text-[var(--color5)] text-xl sm:text-2xl" />
                  </div>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-2">
                    Forgot password
                  </p>
                  <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-1">
                    Reset it now
                  </h1>
                  <p className="fontStyle9 text-[var(--color4)] mb-7 md:mb-9">
                    Enter your email and we'll send you a 6-digit OTP to reset your password.
                  </p>
                </div>

                <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleEmail}>
                  <div className={fadeUp("delay-200")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">
                      Email address
                    </label>
                    <div className="relative">
                      <i className={`bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200
                        ${focused === "email" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input
                        type="email" required placeholder="you@example.com"
                        value={email}
                        onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className={fadeUp("delay-[250ms]")}>
                    <button type="submit" disabled={loading}
                      className="w-full py-[13px] sm:py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                        fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                        !flex !items-center justify-center gap-2
                        hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                        active:translate-x-px active:translate-y-px
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                      {loading
                        ? <><i className="bx bx-loader-alt animate-spin text-base" /> Sending…</>
                        : <>Send OTP <i className="bx bx-right-arrow-alt text-lg" /></>
                      }
                    </button>
                  </div>

                  <div className={fadeUp("delay-300")}>
                    <Link to="/login"
                      className="flex items-center justify-center gap-2 fontStyle9 font-semibold text-[var(--color4)]
                        hover:text-[var(--color6)] transition-colors duration-200 group">
                      <i className="bx bx-arrow-back text-base transition-transform duration-300 group-hover:-translate-x-1" />
                      Back to Sign in
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* ── STEP 2: Enter OTP ── */}
            {step === STEP.OTP && (
              <>
                <div className={fadeUp("delay-100")}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[24px] bg-[var(--color6)] flex items-center justify-center mb-5 md:mb-7 mx-auto
                    shadow-[6px_6px_0_var(--color4)]">
                    <i className="bx bx-mail-send text-[var(--color5)] text-3xl sm:text-4xl" />
                  </div>
                </div>

                <div className={`text-center ${fadeUp("delay-150")}`}>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-2">
                    Check your inbox
                  </p>
                  <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-3">
                    Enter OTP
                  </h1>
                  <p className="fontStyle9 text-[var(--color4)] leading-relaxed mb-1 max-w-[300px] mx-auto">
                    We've sent a 6-digit OTP to
                  </p>
                  <p className="fontStyle9 font-bold text-[var(--color6)] mb-6 sm:mb-8">{email}</p>
                </div>

                <form className={`flex flex-col gap-4 ${fadeUp("delay-200")}`} onSubmit={handleOtpSubmit}>
                  <div>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">
                      6-Digit OTP
                    </label>
                    <div className="relative">
                      <i className={`bx bx-key absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200
                        ${focused === "otp" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input
                        type="text" required placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        inputMode="numeric"
                        pattern="\d{6}"
                        value={otp}
                        onFocus={() => setFocused("otp")} onBlur={() => setFocused("")}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className={`${inputCls} tracking-[0.3em] text-center !pl-11 font-bold`}
                      />
                    </div>
                  </div>

                  <button type="submit" disabled={otp.length !== 6}
                    className="w-full py-[13px] sm:py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                      fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                      flex items-center justify-center gap-2
                      hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                      active:translate-x-px active:translate-y-px
                      disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                    Verify OTP <i className="bx bx-right-arrow-alt text-lg" />
                  </button>

                  <div className="p-4 sm:p-5 rounded-2xl border-[1.5px] border-[var(--color6)]/10 bg-[var(--color1)] flex items-start gap-3 sm:gap-4 text-left">
                    <i className="bx bx-info-circle text-[var(--color4)] text-xl flex-shrink-0 mt-0.5" />
                    <p className="fontStyle10 text-[var(--color4)] leading-relaxed">
                      Didn't get it? Check spam folder or wait a few minutes. OTP expires in <strong className="text-[var(--color6)]">10 minutes.</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full py-[13px] sm:py-[15px] rounded-[14px] border-2 border-[var(--color6)] text-[var(--color6)]
                      fontStyle9 font-bold tracking-[0.04em] bg-[var(--color5)]
                      flex items-center justify-center gap-2
                      hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                      disabled:opacity-50 transition-all duration-200">
                    {loading
                      ? <><i className="bx bx-loader-alt animate-spin text-base" /> Resending…</>
                      : <><i className="bx bx-refresh text-base" /> Resend OTP</>
                    }
                  </button>

                  <Link to="/login"
                    className="flex items-center justify-center gap-2 fontStyle9 font-semibold text-[var(--color4)]
                      hover:text-[var(--color6)] transition-colors duration-200 group mt-1">
                    <i className="bx bx-arrow-back text-base transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to Sign in
                  </Link>
                </form>
              </>
            )}

            {/* ── STEP 3: Set new password ── */}
            {step === STEP.RESET && (
              <>
                <div className={fadeUp("delay-100")}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color6)] flex items-center justify-center mb-5 md:mb-7">
                    <i className="bx bx-shield-quarter text-[var(--color5)] text-xl sm:text-2xl" />
                  </div>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-2">
                    Almost there
                  </p>
                  <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-1">
                    New password
                  </h1>
                  <p className="fontStyle9 text-[var(--color4)] mb-7 md:mb-9">
                    Choose a strong password you haven't used before.
                  </p>
                </div>

                <form className="flex flex-col gap-4 sm:gap-5" onSubmit={handleReset}>

                  <div className={fadeUp("delay-150")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <i className={`bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200
                        ${focused === "pass" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input
                        type={showPass ? "text" : "password"} required placeholder="Min. 8 characters"
                        value={password}
                        onFocus={() => setFocused("pass")} onBlur={() => setFocused("")}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputCls} pr-12`}
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex bg-transparent border-0 cursor-pointer">
                        <i className={`bx ${showPass ? "bx-hide" : "bx-show"} text-[17px]`} />
                      </button>
                    </div>
                  </div>

                  <div className={fadeUp("delay-200")}>
                    <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <i className={`bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200
                        ${focused === "confirm" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                      <input
                        type={showConfirm ? "text" : "password"} required placeholder="Repeat password"
                        value={confirm}
                        onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")}
                        onChange={(e) => setConfirm(e.target.value)}
                        className={`${inputCls} pr-12 ${mismatch ? "!border-red-400 !shadow-[3px_3px_0_#ef4444]" : ""}`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex bg-transparent border-0 cursor-pointer">
                        <i className={`bx ${showConfirm ? "bx-hide" : "bx-show"} text-[17px]`} />
                      </button>
                    </div>
                    {mismatch && <p className="fontStyle10 text-red-400 font-semibold mt-1">Passwords do not match</p>}
                  </div>

                  <div className={fadeUp("delay-[250ms]")}>
                    <button type="submit" disabled={loading || !!mismatch || !password}
                      className="w-full py-[13px] sm:py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                        fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                        flex items-center justify-center gap-2
                        hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                        active:translate-x-px active:translate-y-px
                        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                      {loading
                        ? <><i className="bx bx-loader-alt animate-spin text-base" /> Updating…</>
                        : <><i className="bx bx-check-circle text-base" /> Update Password</>
                      }
                    </button>
                  </div>

                  <div className={fadeUp("delay-300")}>
                    <Link to="/login"
                      className="flex items-center justify-center gap-2 fontStyle9 font-semibold text-[var(--color4)]
                        hover:text-[var(--color6)] transition-colors duration-200 group">
                      <i className="bx bx-arrow-back text-base transition-transform duration-300 group-hover:-translate-x-1" />
                      Back to Sign in
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* ── STEP 4: Success ── */}
            {step === STEP.DONE && (
              <div className="flex flex-col items-center text-center">
                <div className={fadeUp("delay-100")}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[24px] bg-green-500 flex items-center justify-center mb-5 md:mb-7 mx-auto
                    shadow-[6px_6px_0_rgba(34,197,94,0.4)]">
                    <i className="bx bx-check text-white text-4xl sm:text-5xl" />
                  </div>
                </div>

                <div className={fadeUp("delay-150")}>
                  <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-green-500 mb-2">
                    Success
                  </p>
                  <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-3">
                    Password updated!
                  </h1>
                  <p className="fontStyle9 text-[var(--color4)] leading-relaxed mb-8 max-w-[300px] mx-auto">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>

                <div className={fadeUp("delay-200")}>
                  <Link to="/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-[13px] sm:py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                      fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                      hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                      transition-all duration-200">
                    Go to Login <i className="bx bx-right-arrow-alt text-lg" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}