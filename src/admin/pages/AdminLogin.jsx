import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginAPI, adminVerifyOTPAPI, adminResendOTPAPI } from "../services/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAdminAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [needsOTP, setNeedsOTP] = useState(false);
    const [emailForOTP, setEmailForOTP] = useState("");
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setInterval(() => setCooldown((c) => c - 1), 1000);
        return () => clearInterval(t);
    }, [cooldown]);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) return setError("All fields are required.");
        setLoading(true);
        try {
            const data = await adminLoginAPI(form.email, form.password);
            if (!data.success) throw new Error(data.message);
            if (data.needsOTP) {
                setEmailForOTP(data.email);
                setNeedsOTP(true);
                return;
            }
            login(data.user, data.token);
            navigate("/batman");
        } catch (err) {
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) return setError("Please enter the 6-digit OTP.");
        setError("");
        setOtpLoading(true);
        try {
            const data = await adminVerifyOTPAPI(emailForOTP, otp);
            if (!data.success) throw new Error(data.message);
            login(data.user, data.token);
            navigate("/batman");
        } catch (err) {
            setError(err.message || "Invalid OTP.");
        } finally {
            setOtpLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (cooldown > 0) return;
        setError("");
        setResending(true);
        try {
            const data = await adminResendOTPAPI(emailForOTP);
            if (!data.success) throw new Error(data.message);
            setCooldown(60);
            setOtp("");
        } catch (err) {
            setError(err.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    const handleBackToLogin = () => {
        setNeedsOTP(false);
        setError("");
        setOtp("");
    };

    return (
        <>
        <style>{`
            @keyframes float-1 { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(30px,-40px) } }
            @keyframes float-2 { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(-25px,30px) } }
            @keyframes float-3 { 0%,100%{ transform:translate(0,0) rotate(0deg) } 50%{ transform:translate(15px,15px) rotate(120deg) } }
            @keyframes fade-in { from{ opacity:0; transform:translateY(16px) } to{ opacity:1; transform:translateY(0) } }
            @keyframes slide-up { from{ opacity:0; transform:translateY(24px) scale(0.97) } to{ opacity:1; transform:translateY(0) scale(1) } }
            @keyframes glow-pulse { 0%,100%{ opacity:0.3 } 50%{ opacity:0.7 } }
            @keyframes shimmer { 0%{ background-position:-200% 0 } 100%{ background-position:200% 0 } }
            @keyframes border-glow { 0%,100%{ border-color:rgba(99,102,241,0.15) } 50%{ border-color:rgba(99,102,241,0.35) } }
            .al-float-1 { animation: float-1 9s ease-in-out infinite; }
            .al-float-2 { animation: float-2 11s ease-in-out infinite; }
            .al-float-3 { animation: float-3 14s ease-in-out infinite; }
            .al-fade    { animation: fade-in 0.5s ease both; }
            .al-slide   { animation: slide-up 0.45s ease both; }
            .al-d1 { animation-delay: 0.05s; }
            .al-d2 { animation-delay: 0.12s; }
            .al-d3 { animation-delay: 0.2s; }
            .al-d4 { animation-delay: 0.28s; }
            .al-glow { animation: glow-pulse 3s ease-in-out infinite; }
            .al-shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 2.5s ease-in-out infinite; }
            .al-input {
                width:100%; min-height:46px; background:rgba(15,23,42,0.45);
                border:1px solid rgba(255,255,255,0.07); border-radius:12px;
                padding:0 14px 0 42px; color:var(--admin-text); font-size:0.875rem;
                outline:none; transition:all 0.25s ease;
            }
            .al-input:focus { border-color:rgba(99,102,241,0.45); box-shadow:0 0 0 3px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.03); background:rgba(15,23,42,0.6); }
            .al-input::placeholder { color:rgba(148,163,184,0.5); }
            .al-input-otp {
                width:100%; min-height:52px; background:rgba(15,23,42,0.45);
                border:1.5px solid rgba(255,255,255,0.07); border-radius:14px;
                padding:0 16px; color:var(--admin-text); font-size:1.5rem; font-weight:700;
                outline:none; transition:all 0.25s ease; text-align:center; letter-spacing:12px;
            }
            .al-input-otp:focus { border-color:rgba(99,102,241,0.5); box-shadow:0 0 0 3px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.03); background:rgba(15,23,42,0.6); }
            .al-input-otp::placeholder { color:rgba(148,163,184,0.3); letter-spacing:12px; }
            .al-btn {
                width:100%; min-height:48px; border:none; border-radius:12px;
                font-weight:600; font-size:0.875rem; cursor:pointer; position:relative;
                overflow:hidden; transition:all 0.25s ease; display:flex; align-items:center;
                justify-content:center; gap:8px; color:#fff;
                background:linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #6366f1 100%);
                background-size:200% 100%; animation:shimmer 3s ease-in-out infinite;
                box-shadow:0 4px 24px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
            }
            .al-btn:hover { box-shadow:0 6px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.2); transform:translateY(-1px); }
            .al-btn:active { transform:translateY(0); box-shadow:0 2px 12px rgba(99,102,241,0.2); }
            .al-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
            .al-card {
                border-radius:20px; padding:32px 28px; position:relative; overflow:hidden;
                background:rgba(30, 41, 59, 0.55);
                border:1px solid rgba(255,255,255,0.06);
                box-shadow:0 32px 64px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.02) inset, 0 1px 0 rgba(255,255,255,0.04) inset;
                backdrop-filter:blur(32px) saturate(1.4);
            }
            .al-icon-box {
                width:52px; height:52px; border-radius:14px; display:flex; align-items:center;
                justify-content:center; position:relative; overflow:hidden;
                background:linear-gradient(135deg, #6366f1 0%, #818cf8 100%);
                box-shadow:0 8px 32px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.2);
            }
        `}</style>

        <div className="dark min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(150deg, #070b16 0%, #0c1324 30%, #111827 60%, #0a0f1e 100%)" }}>

            {/* Subtle dot grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
                style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

            {/* Ambient orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="al-float-1 absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full blur-[100px] opacity-[0.07]"
                    style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
                <div className="al-float-2 absolute -bottom-32 -left-32 w-[440px] h-[440px] rounded-full blur-[100px] opacity-[0.05]"
                    style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)" }} />
                <div className="al-float-3 absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-[0.03]"
                    style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)" }} />
            </div>

            {/* Decorative rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="w-[380px] h-[380px] rounded-full border border-[rgba(255,255,255,0.025)] absolute -translate-x-1/2 -translate-y-1/2" style={{ top: "50%", left: "50%" }} />
                <div className="w-[300px] h-[300px] rounded-full border border-[rgba(255,255,255,0.035)] absolute -translate-x-1/2 -translate-y-1/2" style={{ top: "50%", left: "50%" }} />
                <div className="w-[220px] h-[220px] rounded-full border border-[rgba(255,255,255,0.05)] absolute -translate-x-1/2 -translate-y-1/2" style={{ top: "50%", left: "50%" }} />
            </div>

            {/* Main card */}
            <div className="w-full max-w-[400px] relative z-10">
                {/* Logo + heading */}
                <div className="al-slide al-d1 flex flex-col items-center mb-7">
                    <div className="al-icon-box mb-5">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <div className="absolute inset-0 rounded-[14px] al-shimmer" />
                    </div>
                    {needsOTP ? (
                        <>
                            <h1 className="text-xl sm:text-[22px] font-bold text-[var(--admin-text)] tracking-tight m-0">Verify OTP</h1>
                            <p className="fontStyle9 text-[var(--admin-muted)] mt-1.5 m-0 text-center">
                                {/* Code sent to <span className="text-[var(--admin-accent)] font-semibold">{emailForOTP}</span> */}
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl sm:text-[22px] font-bold text-[var(--admin-text)] tracking-tight m-0">Admin Panel</h1>
                            <p className="fontStyle9 text-[var(--admin-muted)] mt-1.5 m-0">Sign in to continue</p>
                        </>
                    )}
                </div>

                {/* Form card */}
                <div className="al-card al-slide al-d2">
                    <div className="absolute top-0 left-8 right-8 h-[1px] al-shimmer" />

                    {error && (
                        <div className="flex items-center gap-3 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.18)] rounded-xl px-4 py-3 mb-5 al-fade">
                            <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.12)] flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-[var(--admin-danger)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                                </svg>
                            </div>
                            <p className="fontStyle9 text-[var(--admin-danger)] m-0">{error}</p>
                        </div>
                    )}

                    {needsOTP ? (
                        <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="fontStyle9 font-semibold text-[var(--admin-subtext)] uppercase tracking-wider m-0">One-time code</label>
                                <input type="text" inputMode="numeric" maxLength={6} value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    placeholder="000000" className="al-input-otp" />
                            </div>

                            <button type="submit" disabled={otpLoading} className="al-btn al-d3">
                                {otpLoading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                        </svg>
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Verify & continue</span>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-between mt-1">
                                <button type="button" onClick={handleBackToLogin}
                                    className="fontStyle9 text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors bg-transparent border-none cursor-pointer m-0">
                                    &larr; Back
                                </button>
                                <button type="button" onClick={handleResendOTP} disabled={resending || cooldown > 0}
                                    className="fontStyle9 text-[var(--admin-accent)] hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed m-0">
                                    {resending ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="fontStyle9 font-semibold text-[var(--admin-subtext)] uppercase tracking-wider m-0">Email</label>
                                <div className="relative">
                                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-muted)] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="4" width="20" height="16" rx="3"/>
                                        <path d="M2 8l10 7 10-7"/>
                                    </svg>
                                    <input type="email" name="email" value={form.email} onChange={handleChange}
                                        placeholder="admin@example.com" className="al-input" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="fontStyle9 font-semibold text-[var(--admin-subtext)] uppercase tracking-wider m-0">Password</label>
                                </div>
                                <div className="relative">
                                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--admin-muted)] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                    </svg>
                                    <input type={show ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                                        placeholder="Enter password" className="al-input" style={{ paddingRight: 44 }} />
                                    <button type="button" onClick={() => setShow((s) => !s)}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:bg-[rgba(255,255,255,0.05)] transition-all bg-transparent border-none cursor-pointer rounded-lg">
                                        {show ? (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <path d="M1 1l22 22"/>
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="al-btn al-d3">
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                        </svg>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="al-slide al-d4 flex items-center justify-center mt-5 gap-1.5">
                    <svg className="w-3 h-3 text-[var(--admin-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <p className="fontStyle10 text-[var(--admin-muted)] m-0">Admin access only</p>
                </div>
            </div>
        </div>
        </>
    );
}
