import { Link } from "react-router-dom";

export default function BottomCta() {
  return (
    <div className="mt-14 sm:mt-16 rounded-2xl overflow-hidden relative bg-color2">
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20 pointer-events-none glow-gold" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-20 pointer-events-none glow-orange" />

      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-12 flex flex-col md:flex-row md:items-center justify-between gap-7">
        <div className="max-w-md">
          <span className="fontStyle10 font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block mb-4 bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.65)]">
            Start Building Today
          </span>
          <h2 className="fontStyle4 font-bold text-white mb-3 leading-tight">
            Like what you see?
          </h2>
          <p className="fontStyle8 leading-relaxed text-[rgba(255,255,255,0.55)]">
            Every template is free to download. No account required — pick
            your favourite and launch today.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
          <Link to="/templates" className="fontStyle8 font-bold px-7 py-3.5 rounded-xl text-center text-[#0f172a] hover:opacity-90 transition-opacity duration-200 bg-color3">
            Browse Templates
          </Link>
          <Link to="/signup" className="fontStyle8 font-semibold px-7 py-3.5 rounded-xl text-center text-white hover:bg-white/12 transition-colors duration-200 border border-[rgba(255,255,255,0.2)]">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
