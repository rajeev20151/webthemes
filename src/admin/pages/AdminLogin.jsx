import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const navigate  = useNavigate();
    const [form,    setForm]    = useState({ email: "", password: "" });
    const [error,   setError]   = useState("");
    const [loading, setLoading] = useState(false);
    const [show,    setShow]    = useState(false);

    /* ---======= Handlers =======---- */
    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.email || !form.password) return setError("All fields are required.");
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1000));
        if (form.email === "admin@demo.com" && form.password === "admin123") {
            sessionStorage.setItem("admin", JSON.stringify({ email: form.email }));
            navigate("/admin");
        } else {
            setError("Invalid email or password.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[var(--admin-bg)] flex items-center justify-center p-4">
            <div className="w-full max-w-[420px]">

                {/* ===== Logo ===== */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-[14px] bg-[var(--admin-accent)] text-white fs6 font-extrabold flex items-center justify-center mb-3">
                        A
                    </div>
                    <h1 className="fs6 font-bold text-admin">Welcome back</h1>
                    <p className="fs9 text-admin-muted mt-1">Sign in to your admin account</p>
                </div>

                {/* ===== Card ===== */}
                <div className="admin-card">

                    {/* Error Alert */}
                    {error && (
                        <div className="flex items-center gap-2 bg-[var(--admin-danger-soft)] border border-[var(--admin-danger)] rounded-[10px] px-4 py-3 mb-5">
                            <svg className="w-4 h-4 text-[var(--admin-danger)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                            </svg>
                            <p className="fs10 text-[var(--admin-danger)]">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col gap-[0.4rem]">
                            <label className="fs10 font-semibold text-admin">Email address</label>
                            <input
                                type="email" name="email" value={form.email}
                                onChange={handleChange} placeholder="admin@demo.com"
                                className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[10px] px-4 py-[0.6rem] fs9 text-admin outline-none placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] transition-colors"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-[0.4rem]">
                            <div className="flex items-center justify-between">
                                <label className="fs10 font-semibold text-admin">Password</label>
                                <a href="#" className="fs10 text-[var(--admin-accent)] hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={show ? "text" : "password"} name="password"
                                    value={form.password} onChange={handleChange} placeholder="••••••••"
                                    className="w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-[10px] px-4 py-[0.6rem] pr-11 fs9 text-admin outline-none placeholder:text-[var(--admin-muted)] focus:border-[var(--admin-accent)] transition-colors"
                                />
                                <button type="button" onClick={() => setShow((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)] hover:text-admin transition-colors bg-transparent border-none cursor-pointer p-0">
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

                        {/* Submit */}
                        <button type="submit" disabled={loading}
                            className="w-full bg-admin-grad text-white fs9 font-semibold py-[0.7rem] rounded-[10px] mt-1 hover:opacity-85 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none cursor-pointer">
                            {loading && (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                            )}
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>
                </div>

                {/* Demo hint */}
                <p className="text-center fs10 text-admin-muted mt-5">
                    Demo → <span className="text-[var(--admin-accent)]">admin@demo.com</span> / <span className="text-[var(--admin-accent)]">admin123</span>
                </p>

            </div>
        </div>
    );
}