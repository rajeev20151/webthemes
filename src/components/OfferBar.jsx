import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OFFERS = [
  { text: "Flat 50% OFF on all premium templates", short: "Flat 50% OFF on premium templates", cta: "Shop Now",  to: "/templates" },
  { text: "Free lifetime updates on every purchase",     short: "Free lifetime updates",                cta: "Explore",  to: "/templates" },
  { text: "Launch weekend — free downloads on select templates", short: "Free downloads this weekend", cta: "View Demos", to: "/demo" },
];

export default function OfferBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % OFFERS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="offer_bar bg-color3 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="w-width">
        <div className="relative flex items-center justify-center gap-3 sm:gap-4 h-9 sm:h-10">

          <div className="relative flex-1 min-w-0 h-full overflow-hidden" aria-live="polite">
            {OFFERS.map((o, i) => (
              <div
                key={o.text}
                aria-hidden={i !== index}
                className={`absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-500 ${
                  i === index
                    ? "translate-y-0 opacity-100"
                    : i < index
                      ? "-translate-y-full opacity-0"
                      : "translate-y-full opacity-0"
                }`}
              >
                <p className="fontStyle10 text-white/95 truncate text-center min-w-0">
                  <i className="bx bx-bolt text-sm align-middle"></i>{" "}
                  <span className="sm:hidden">{o.short}</span>
                  <span className="hidden sm:inline">{o.text}</span>
                </p>
                <Link
                  to={o.to}
                  tabIndex={i === index ? 0 : -1}
                  className="hidden sm:inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-white/20 hover:bg-white/30 px-2.5 py-0.5 fontStyle10 font-bold text-white transition-colors duration-200"
                >
                  {o.cta}
                  <i className="bx bx-right-arrow-alt text-sm"></i>
                </Link>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
            {OFFERS.map((o, i) => (
              <button
                key={o.text}
                onClick={() => setIndex(i)}
                aria-label={`Offer ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "bg-white w-4" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
