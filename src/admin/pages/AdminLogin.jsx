import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLoginAPI } from "../services/adminApi";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
    const navigate = useNavigate();
    const { login } = useAdminAuth();
    const [form,    setForm]    = useState({ email: "", password: "" });
    const [error,   setError]   = useState("");
    const [loading, setLoading] = useState(false);
    const [show,    setShow]    = useState(false);

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
            login(data.user, data.token);
            navigate("/admin");
        } catch (err) {
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <style>{`
            @keyframes float-slow  { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(30px,-30px) } }
            @keyframes float-slow2 { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(-25px,25px) } }
            @keyframes fade-up     { from{ opacity:0; transform:translateY(24px) } to{ opacity:1; transform:translateY(0) } }
            .login-orb1 { animation: float-slow  8s ease-in-out infinite; }
            .login-orb2 { animation: float-slow2 10s ease-in-out infinite; }
            .login-fade { animation: fade-up 0.55s ease both; }
            .login-fade-1 { animation: fade-up 0.55s 0.05s ease both; }
            .login-fade-2 { animation: fade-up 0.55s 0.15s ease both; }
            .login-fade-3 { animation: fade-up 0.55s 0.25s ease both; }
            .login-fade-4 { animation: fade-up 0.55s 0.35s ease both; }
            .login-fade-5 { animation: fade-up 0.55s 0.45s ease both; }
        `}</style>

        <div className="dark min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "var(--admin-bg)" }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="login-orb1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-30" style={{ background: "var(--admin-accent-grad)" }} />
                <div className="login-orb2 absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-20" style={{ background: "var(--admin-accent-grad)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--admin-border)] opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-[var(--admin-border)] opacity-10" />
            </div>

            <div className="w-full max-w-[400px] relative z-10">
                <div className="login-fade-1 flex flex-col items-center mb-8">
                    <h1 className="fs5 font-bold text-[var(--admin-text)] tracking-tight">Welcome back</h1>
                    <p className="fs9 text-[var(--admin-muted)] mt-1">Sign in to your admin account</p>
                </div>

                <div className="login-fade-2 admin-card p-7">
                    {error && (
                        <div className="flex items-center gap-2.5 bg-[var(--admin-danger-soft)] border border-[var(--admin-danger)] rounded-xl px-4 py-3 mb-5">
                            <svg className="w-4 h-4 text-[var(--admin-danger)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                            </svg>
                            <p className="fs10 text-[var(--admin-danger)] m-0">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="fs10 font-semibold text-[var(--admin-subtext)] uppercase tracking-wider">Email address</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@demo.com"
                                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 fs9 text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)] transition-all duration-200" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                                <label className="fs10 font-semibold text-[var(--admin-subtext)] uppercase tracking-wider">Password</label>
                                <a href="#" className="fs10 text-[var(--admin-accent)] hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input type={show ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••"
                                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-xl px-4 py-2.5 pr-11 fs9 text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent-soft)] transition-all duration-200" />
                                <button type="button" onClick={() => setShow((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-[var(--admin-text)] transition-colors bg-transparent border-none cursor-pointer p-0">
                                    {show ? (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                            <path d="M1 1l22 22"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full text-white fs9 font-semibold py-2.5 rounded-xl mt-1 hover:opacity-85 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer shadow-[0_4px_14px_rgba(99,102,241,0.3)]"
                            style={{ background: "var(--admin-accent-grad)" }}>
                            {loading && (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                            )}
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                <div className="login-fade-3 flex items-center justify-center mt-6">
                    <p className="fs10 text-[var(--admin-muted)]">Admin access only. Unauthorized access is prohibited.</p>
                </div>
            </div>
        </div>
        </>
    );
}