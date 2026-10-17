import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SEOHead from "../components/SEOHead";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Home",      to: "/",          icon: "bx-home-alt-2"   },
  { label: "Templates", to: "/templates", icon: "bx-layout"       },
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
          filter: drop-shadow(2px 2px 0 rgba(0,0,0,0.15));
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
// MAIN 404 PAGE
// ─────────────────────────────────────────────

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const fadeUp = (delay = 0) => ({
    transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
    opacity:   mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(18px)",
  });

  return (
    <section
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden bg-[var(--color5)]"
      aria-labelledby="nf-heading"
    >
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for may have been moved, renamed, or removed."
        noindex={true}
      />

      {/* ── Dot grid background ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, var(--color6) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          opacity: 0.05,
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
            to   { transform: translateY(-20px) scale(1.08); }
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
            fontSize: "clamp(160px,30vw,480px)",
            opacity: 0.04,
            letterSpacing: "-0.06em",
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
          <div style={fadeUp(0)} className="mb-10">
            <span className="inline-flex items-center gap-2 fontStyle10 font-bold uppercase tracking-wider text-[var(--color6)] border border-[var(--color6)]/20 px-4 py-1.5 rounded-full bg-[var(--color5)]/80 shadow-sm backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef4444] opacity-70"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ef4444]"></span>
              </span>
              Error 404 &nbsp;&middot;&nbsp; Page Not Found
            </span>
          </div>

          {/* Headline row */}
          <div style={fadeUp(0.12)} className="flex items-baseline gap-4 mb-8 flex-wrap">
            <h1
              id="nf-heading"
              className="font-black leading-none text-[var(--color6)] select-none"
              style={{ font: "clamp(72px,10vw,120px)/1 'Google Sans',sans-serif", letterSpacing: "-0.03em" }}
            >
              <GlitchText text="404" />
            </h1>
            <div className="w-px h-20 bg-[var(--color6)]/10 hidden sm:block"></div>
            <div>
              <p className="fontStyle5 font-bold text-[var(--color6)] leading-tight">
                Page Not Found
              </p>
              <p className="fontStyle9 text-[var(--color4)] mt-1">
                We searched everywhere — nothing here.
              </p>
            </div>
          </div>

          {/* Description */}
          <p style={fadeUp(0.22)} className="fontStyle8 text-[var(--color4)] max-w-lg leading-relaxed mb-12">
            The page you're looking for may have been moved, renamed, or removed.
            Use the links below to get back on track.
          </p>

          {/* CTA buttons */}
          <div style={fadeUp(0.32)} className="flex flex-wrap items-center gap-3 mb-14">
            <Link
              to="/"
              className="group fontStyle8 font-semibold inline-flex items-center gap-3 px-6 py-3
                bg-[var(--color6)] text-[var(--color5)] rounded-xl shadow-[3px_3px_0px_var(--color6)]
                hover:shadow-[2px_2px_0px_var(--color6)] hover:-translate-y-[1px] transition-all duration-200"
            >
              Go to Homepage
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color5)] text-[var(--color6)] transition-transform duration-200 group-hover:rotate-90">
                <i className="bx bx-home-alt-2"></i>
              </span>
            </Link>
          </div>

          {/* Divider */}
          <div style={fadeUp(0.42)} className="flex items-center gap-4 my-16">
            <div className="flex-1 h-px bg-[var(--color6)]/8"></div>
            <span className="fontStyle10 uppercase tracking-wider text-[var(--color4)]">
              Quick Navigation
            </span>
            <div className="flex-1 h-px bg-[var(--color6)]/8"></div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                style={fadeUp(0.5 + i * 0.06)}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl text-center
                  border border-[var(--color6)]/10 bg-[var(--color5)]/60 backdrop-blur-sm
                  hover:border-[var(--color6)] hover:bg-[var(--color5)] hover:shadow-[4px_4px_0px_var(--color6)]
                  hover:-translate-y-[1px] transition-all duration-200"
              >
                <span className="w-9 h-9 rounded-lg flex items-center justify-center
                  bg-[var(--color6)]/5 group-hover:bg-[var(--color6)] group-hover:text-[var(--color5)] transition-all duration-200">
                  <i className={`bx ${link.icon} text-[1rem] text-[var(--color6)]`}></i>
                </span>
                <span className="fontStyle9 font-semibold text-[var(--color6)] group-hover:text-[var(--color6)] transition-colors duration-200">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
