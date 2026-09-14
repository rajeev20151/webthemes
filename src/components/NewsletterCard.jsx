import { useState } from "react";
import { Link } from "react-router-dom";
import { useSubscribeNewsletterMutation } from "../store/apiSlice";

export default function NewsletterCard({ email, setEmail }) {
  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }

    try {
      const res = await subscribe({ email: email.trim() }).unwrap();
      setStatus("success");
      setMessage(res.message || "Subscribed successfully!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err?.data?.message || "Something went wrong");
    }

    setTimeout(() => {
      setStatus(null);
      setMessage("");
    }, 3000);
  };

  return (
    <div className="rounded-2xl border border-[var(--color6)]/10 bg-gradient-to-br from-[var(--color11)] to-[var(--color11)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.07]" style={{ background: "linear-gradient(135deg,#fdc830,#f37335)" }} />
      <p className="fontStyle8 font-semibold text-[var(--color6)] mb-1 relative">Get new themes or big discounts in your inbox.</p>
      <p className="fontStyle9 text-[var(--color4)] mb-4 relative">Never spam.</p>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-[var(--color6)]/15 bg-[var(--color5)] text-[var(--color6)] fontStyle9 outline-none placeholder-[var(--color4)] focus:border-[var(--color6)]/50 focus:ring-2 focus:ring-[var(--color6)]/10 transition-all duration-200 mb-3 relative"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl fontStyle9 font-bold text-white bg-color3 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status && (
        <p className={`fontStyle10 text-center mt-2 relative ${status === "success" ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
