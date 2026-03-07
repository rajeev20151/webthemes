import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home",      to: "/",          icon: "bx-home-alt-2"   },
  { label: "Templates", to: "/templates", icon: "bx-layout"       },
  { label: "Pricing",   to: "/pricingpage",   icon: "bx-purchase-tag" },
  { label: "Contact",   to: "/contact",   icon: "bx-envelope"     },
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id:      i,
  size:    4 + (i % 5) * 2,
  x:       (i * 23 + 7) % 100,
  y:       (i * 17 + 11) % 100,
  delay:   (i * 0.6) % 5,
  dur:     5 + (i % 4) * 2,
  opacity: 0.05 + (i % 3) * 0.03,
}));

// ─────────────────────────────────────────────
// GLITCH TEXT
// ─────────────────────────────────────────────

function GlitchText({ text }) {
  return (
    <>
      <span className="glitch404" data-text={text}>{text}</span>
      <style>{`
        .glitch404 {
          position: relative;
          display: inline-block;
          color: var(--color6);
        }
        .glitch404::before,
        .glitch404::after {
          content: attr(data-text);
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
        }
        .glitch404::before {
          color: #e63946;
          animation: g1 4s infinite;
          clip-path: polygon(0 15%, 100% 15%, 100% 35%, 0 35%);
        }
        .glitch404::after {
          color: #1d7df0;
          animation: g2 4s infinite;
          clip-path: polygon(0 60%, 100% 60%, 100% 78%, 0 78%);
        }
        @keyframes g1 {
          0%,88%,100% { transform:translate(0); opacity:0; }
          89% { transform:translate(-4px,1px); opacity:1; }
          91% { transform:translate(4px,-1px); opacity:1; }
          93% { transform:translate(0); opacity:0; }
        }
        @keyframes g2 {
          0%,88%,100% { transform:translate(0); opacity:0; }
          90% { transform:translate(4px,2px); opacity:1; }
          92% { transform:translate(-4px,-2px); opacity:1; }
          94% { transform:translate(0); opacity:0; }
        }
      `}</style>
    </>
  );
}

// ─────────────────────────────────────────────
// CIRCULAR COUNTDOWN TIMER
// ─────────────────────────────────────────────

function Countdown({ seconds, onComplete }) {
  const [left, setLeft] = useState(seconds);
  const circumference = 2 * Math.PI * 15;

  useEffect(() => {
    if (left <= 0) { onComplete?.(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, onComplete]);

  const progress = (seconds - left) / seconds;

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative w-10 h-10 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke="var(--color6)"
            strokeOpacity=".08"
            strokeWidth="2.5"
          />
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke="var(--color6)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center fontStyle10 font-bold text-[var(--color6)]">
          {left}
        </span>
      </div>
      <span className="fontStyle9 text-[var(--color4)]">
        Auto-redirecting to home in{" "}
        <span className="font-semibold text-[var(--color6)]">{left}s</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN 404 PAGE
// ─────────────────────────────────────────────

export default function NotFound() {
  const navigate         = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) => ({
    transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
  });

  return (
    <section
      className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden bg-[var(--color5)]"
      aria-labelledby="nf-heading"
    >

      {/* ── Dot grid background ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color6) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          opacity: 0.04,
        }}
      />

      {/* ── Floating particles ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-[var(--color6)]"
            style={{
              width: p.size, height: p.size,
              left: `${p.x}%`, top: `${p.y}%`,
              opacity: p.opacity,
              animation: `pfloat ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
            }}
          />
        ))}
        <style>{`
          @keyframes pfloat {
            from { transform: translateY(0) scale(1); }
            to   { transform: translateY(-24px) scale(1.1); }
          }
        `}</style>
      </div>

      {/* ── Giant ghost number ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span
          className="font-black text-[var(--color6)]"
          style={{
            fontSize: "clamp(200px,34vw,560px)",
            opacity: 0.03,
            letterSpacing: "-0.05em",
            fontFamily: "'Google Sans', sans-serif",
            lineHeight: 1,
          }}
        >
          404
        </span>
      </div>

      {/* ── Content ── */}
      <div className="w-width relative z-10">
        <div className="max-w-2xl mx-auto">

          {/* Status chip */}
          <div style={fadeUp(0)} className="mb-8">
            <span className="inline-flex items-center gap-2.5 fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)] border border-[var(--color6)]/15 px-4 py-2 rounded-full bg-[var(--color5)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
              </span>
              Error 404 &nbsp;&middot;&nbsp; Page Not Found
            </span>
          </div>

          {/* Headline row */}
          <div style={fadeUp(0.1)} className="flex items-center gap-5 mb-6 flex-wrap">
            <h1
              id="nf-heading"
              className="font-black leading-none text-[var(--color6)] select-none"
              style={{ font: "clamp(80px,11vw,130px)/1 'Google Sans',sans-serif", letterSpacing: "-0.04em" }}
            >
              <GlitchText text="404" />
            </h1>
            <div className="w-px h-20 bg-[var(--color6)]/12 hidden sm:block"></div>
            <div>
              <p className="fontStyle5 font-bold text-[var(--color6)] leading-snug">
                Page Not Found
              </p>
              <p className="fontStyle9 text-[var(--color4)] mt-1">
                We searched everywhere — nothing here.
              </p>
            </div>
          </div>

          {/* Description */}
          <p style={fadeUp(0.18)} className="fontStyle8 text-[var(--color4)] max-w-lg leading-relaxed mb-10">
            The page you're looking for may have been moved, renamed, or removed.
            Use the links below to get back on track.
          </p>

          {/* CTA buttons */}
          <div style={fadeUp(0.26)} className="flex flex-wrap items-center gap-4 mb-10">
            <Link
              to="/"
              className="group fontStyle8 font-semibold inline-flex items-center gap-3 pl-7 pr-2.5 py-2.5
                bg-[var(--color6)] rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <span className="text-[var(--color5)]">Go to Homepage</span>
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--color5)] transition-transform duration-300 group-hover:rotate-90">
                <i className="bx bx-home-alt-2 text-lg text-[var(--color6)]"></i>
              </span>
            </Link>
          </div>

          {/* Countdown */}
          <div style={fadeUp(0.33)}>
            <Countdown seconds={15} onComplete={() => navigate("/")} />
          </div>

          {/* Divider */}
          <div style={fadeUp(0.4)} className="flex items-center gap-4 my-14">
            <div className="flex-1 h-px bg-[var(--color6)]/10"></div>
            <span className="fontStyle10 uppercase tracking-widest text-[var(--color4)]">
              Quick Navigation
            </span>
            <div className="flex-1 h-px bg-[var(--color6)]/10"></div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_LINKS.map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                style={fadeUp(0.46 + i * 0.08)}
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl text-center
                  border border-[var(--color6)]/12 bg-[var(--color5)]
                  hover:border-[var(--color6)] hover:shadow-[5px_5px_0px_var(--color6)]
                  transition-all duration-300"
              >
                <span className="w-11 h-11 rounded-xl flex items-center justify-center
                  bg-[var(--color6)]/6 group-hover:bg-[var(--color6)] transition-colors duration-300">
                  <i className={`bx ${link.icon} text-xl text-[var(--color6)] group-hover:text-[var(--color5)] transition-colors duration-300`}></i>
                </span>
                <span className="fontStyle9 font-semibold text-[var(--color6)]">{link.label}</span>
                <i className="bx bx-right-arrow-alt text-[var(--color4)] -mt-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"></i>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}