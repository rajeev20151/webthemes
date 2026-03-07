import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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

export default function Login() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`;

  const slideIn = (delay = "") =>
    `transition-all duration-700 ease-out ${delay} ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const inputCls = `w-full pl-11 pr-4 py-[14px] rounded-[14px]
    border-[1.5px] border-[var(--color6)]/10 bg-[var(--color5)]
    fontStyle9 text-[var(--color6)] outline-none placeholder:text-[var(--color4)]
    focus:border-[var(--color6)] focus:shadow-[4px_4px_0_var(--color6)]
    transition-all duration-200`;

  return (
    
    <div className="min-h-screen bg-[var(--color5)] flex items-center justify-center p-10 py-24">
      <div className={`w-full max-w-[900px] grid grid-cols-2 rounded-[28px] overflow-hidden
        border-2 border-[var(--color6)] shadow-[14px_14px_0_var(--color6)]
        transition-all duration-500 ease-out
        ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
        
        {/* ── LEFT: Black panel ── */}
        <div className="bg-[var(--color6)] p-[60px_48px] flex flex-col justify-between relative min-h-[580px]">
          <FloatingShapes />

          {/* Logo + heading */}
          <div className={slideIn("delay-100")}>
            <Link to="/" className="inline-block mb-12">
              <svg width="38" height="32" viewBox="0 0 36 30" fill="none">
                <path d="M0 0L9 15L0 30H8L18 15L8 0H0Z" fill="white" />
                <path d="M14 0L23 15L14 30H22L32 15L22 0H14Z" fill="white" opacity="0.4" />
              </svg>
            </Link>
            <h2 className="fontStyle3 font-black text-[var(--color5)] leading-[1.1] mb-4">
              Design meets<br />purpose.
            </h2>
            <p className="fontStyle9 text-[var(--color10)] mb-5 leading-relaxed max-w-[260px]">
              Access thousands of premium templates crafted for brands that mean business.
            </p>
          </div>

          {/* Features */}
          <div className={`flex flex-col gap-3 relative z-10 ${slideIn("delay-200")}`}>
            {[
              { icon: "bx-check-shield", text: "Bank-level security" },
              { icon: "bx-rocket", text: "Launch in minutes"   },
              { icon: "bx-palette", text: "Fully customisable"  },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/12 flex items-center justify-center flex-shrink-0">
                  <i className={`bx ${icon} text-[var(--color5)] text-sm`} />
                </div>
                <span className="fontStyle9 text-[var(--color10)] font-medium">{text}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className={`relative z-10 border-t border-white/10 pt-6 mt-8 ${slideIn("delay-300")}`}>
            <p className="fontStyle10 text-[var(--color10)] leading-relaxed">
              "The best investment we made for our brand."
            </p>
            <span className="fontStyle10 text-white/30 mt-1 block">— Rajeev Sharma, Founder</span>
          </div>
        </div>

        {/* ── RIGHT: Form panel ── */}
        <div className="bg-[var(--color5)] p-[60px_48px] flex flex-col justify-center">

          <div className={fadeUp("delay-150")}>
            <p className="fontStyle10 font-bold tracking-[0.12em] uppercase text-[var(--color4)] mb-2">
              Welcome back
            </p>
            <h1 className="fontStyle4 font-black text-[var(--color6)] leading-[1.1] mb-1">
              Sign in
            </h1>
            <p className="fontStyle9 text-[var(--color4)] mb-9">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[var(--color6)] font-bold underline underline-offset-4">
                Sign up free →
              </Link>
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div className={fadeUp("delay-200")}>
              <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)] block mb-2">
                Email address
              </label>
              <div className="relative">
                <i className={`bx bx-envelope absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200
                  ${focused === "email" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                <input
                  type="email" required placeholder="you@example.com"
                  value={form.email}
                  onFocus={() => setFocused("email")} onBlur={() => setFocused("")}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Password */}
            <div className={fadeUp("delay-[250ms]")}>
              <div className="flex justify-between mb-2">
                <label className="fontStyle10 font-bold tracking-[0.1em] uppercase text-[var(--color4)]">
                  Password
                </label>
                <Link to="/forgotPassword" className="fontStyle10 font-semibold text-[var(--color4)] underline underline-offset-4">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <i className={`bx bx-lock-alt absolute left-4 top-1/2 -translate-y-1/2 text-base transition-colors duration-200
                  ${focused === "pass" ? "text-[var(--color6)]" : "text-[var(--color4)]"}`} />
                <input
                  type={showPass ? "text" : "password"} required placeholder="••••••••"
                  value={form.password}
                  onFocus={() => setFocused("pass")} onBlur={() => setFocused("")}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`${inputCls} pr-12`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color4)] hover:text-[var(--color6)] transition-colors flex">
                  <i className={`bx ${showPass ? "bx-hide" : "bx-show"} text-[17px]`} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className={fadeUp("delay-300")}>
              <button type="submit" disabled={loading}
                className="w-full py-[15px] rounded-[14px] bg-[var(--color6)] text-[var(--color5)]
                  fontStyle9 font-bold tracking-[0.04em] border-2 border-[var(--color6)]
                  !flex !items-center justify-center gap-2
                  hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color4)]
                  active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_var(--color4)]
                  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                {loading
                  ? <><i className="bx bx-loader-alt animate-spin text-base" /> Signing in…</>
                  : <>Sign In <i className="bx bx-right-arrow-alt text-lg" /></>
                }
              </button>
            </div>

            {/* Divider */}
            <div className={`flex items-center gap-3 ${fadeUp("delay-[330ms]")}`}>
              <div className="flex-1 h-px bg-[var(--color6)]/8" />
              <span className="fontStyle10 text-[var(--color4)]">or</span>
              <div className="flex-1 h-px bg-[var(--color6)]/8" />
            </div>

            {/* OAuth */}
            <div className={`flex gap-3 ${fadeUp("delay-[360ms]")}`}>
              {[
                { icon: "bxl-google", label: "Google" },
                { icon: "bxl-github", label: "GitHub" },
              ].map(({ icon, label }) => (
                <button key={label} type="button"
                  className="flex-1 py-3 rounded-xl border-[1.5px] border-[var(--color6)]/12 bg-[var(--color5)]
                    fontStyle9 font-semibold text-[var(--color6)]
                    !flex !items-center justify-center gap-2
                    hover:border-[var(--color6)] hover:shadow-[3px_3px_0_var(--color6)]
                    hover:-translate-x-px hover:-translate-y-px transition-all duration-200">
                  <i className={`bx ${icon} text-base`} /> {label}
                </button>
              ))}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}