import { Link } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import FAQ from "../sections/FAQ";
import { useGetContentsQuery } from "../store/apiSlice";

const features = [
  {
    icon: "bx-code-alt",
    title: "Clean Code",
    desc: "Well-structured, maintainable code that follows modern best practices.",
  },
  {
    icon: "bx-palette",
    title: "Modern Design",
    desc: "Professionally designed templates that look stunning on every device.",
  },
  {
    icon: "bx-rocket",
    title: "Fast Performance",
    desc: "Optimized for speed so your website loads in seconds.",
  },
  {
    icon: "bx-mobile-alt",
    title: "Fully Responsive",
    desc: "Every template adapts perfectly to desktop, tablet, and mobile.",
  },
];

const TILES = [
  { icon: "bx-code-alt", bg: "from-purple-500 to-blue-500" },
  { icon: "bx-palette", bg: "from-pink-500 to-orange-500" },
  { icon: "bx-rocket", bg: "from-green-500 to-teal-500" },
  { icon: "bx-diamond", bg: "from-yellow-500 to-red-500" },
  { icon: "bx-heart", bg: "from-indigo-500 to-purple-500" },
  { icon: "bx-trophy", bg: "from-cyan-500 to-blue-500" },
  { icon: "bx-world", bg: "from-rose-500 to-pink-500" },
  { icon: "bx-bulb", bg: "from-amber-500 to-orange-500" },
  { icon: "bx-star", bg: "from-emerald-500 to-green-500" },
];

export default function About() {
  const { data: contentsData } = useGetContentsQuery();
  const contents = contentsData?.contents?.[0] || null;

  return (
    <>
      <SEOHead
        title="About Us"
        description="Learn about {site} - your trusted source for free and premium website templates."
      />

      {/* ── Hero Section ── */}
      <section className="about_hero bg-[var(--color5)] py-12 sm:py-12 md:py-20">
        <div className="w-width">
          <BreadCrumb_Nav
            items={[
              { label: "Home", path: "/" },
              { label: "About", path: "/about" },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center mt-10">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] rounded-full fontStyle10 font-bold uppercase tracking-widest -rotate-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4ade80] border border-[var(--color6)] animate-pulse"></span>
                ABOUT US
              </span>
              <h1 className="fontStyle3 text-[var(--color6)] font-bold mb-6 leading-tight">
                {contents?.title || "We Build Templates That Scale"}
              </h1>
              <p className="fontStyle6 text-[var(--color8)] mb-8 leading-relaxed">
                {contents?.description ||
                  "We craft high-quality website templates that help businesses and creators launch faster. Our templates are designed with performance, accessibility, and modern aesthetics in mind."}
              </p>

              <Link
                to={contents?.buttonLink || "/templates"}
                className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 bg-[var(--color6)] rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="text-[var(--color5)]">
                  {contents?.buttonText || "Explore Templates"}
                </span>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)] transition-all duration-300 group-hover:rotate-90">
                  <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
                </span>
              </Link>
            </div>

            <div className="relative mt-4 lg:mt-0">
              <div className="relative z-10 p-5 sm:p-8 border-2 border-[var(--color6)] bg-[var(--color5)] rounded-3xl shadow-[6px_6px_0px_var(--color6)] sm:shadow-[12px_12px_0px_var(--color6)]">
                <div className="grid grid-cols-3 gap-3 sm:gap-6">
                  {TILES.map((t, i) => (
                    <div
                      key={t.icon}
                      className={`group aspect-square bg-gradient-to-br ${t.bg} rounded-2xl flex items-center justify-center
                        border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)]
                        ${i % 2 === 0 ? "-rotate-3" : "rotate-3"}
                        hover:rotate-0 hover:scale-105 hover:shadow-[1px_1px_0px_var(--color6)]
                        transition-all duration-300`}
                    >
                      <i className={`bx ${t.icon} text-white text-3xl sm:text-5xl transition-transform duration-300 group-hover:scale-110`}></i>
                    </div>
                  ))}
                </div>
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] px-4 sm:px-6 py-2 sm:py-3 rounded-full fontStyle8 font-bold rotate-3">
                  {new Date().getFullYear()} Features
                </div>
              </div>
              <div className="hidden sm:block absolute top-8 left-8 w-full h-full border-2 border-dashed border-[var(--color6)]/40 rounded-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section className="bg-[var(--color5)] py-16 sm:py-20">
        <div className="w-width">
          <div className="text-center mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] rounded-full fontStyle10 font-bold uppercase tracking-widest rotate-2 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#fde047] border border-[var(--color6)] animate-pulse"></span>
              WHY CHOOSE US
            </span>
            <h2 className="fontStyle4 font-bold text-[var(--color6)]">
              Everything You Need to Launch Fast
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 pb-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative flex flex-col h-full p-6 rounded-2xl overflow-hidden
                  bg-[var(--color5)] border-2 border-[var(--color6)]
                  shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
                  transition-all duration-300
                  hover:shadow-[2px_2px_0px_var(--color6)] hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-1.5 sm:hover:translate-y-1.5"
              >
                {/* Big faded number */}
                <span className="absolute top-3 right-4 fontStyle5 font-bold leading-none select-none pointer-events-none text-[var(--color6)]/10 group-hover:text-[var(--color6)]/25 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon tile */}
                <div className="w-14 h-14 rounded-2xl bg-color3 flex items-center justify-center mb-5 border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] -rotate-6 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300">
                  <i className={`bx ${f.icon} text-2xl text-white`}></i>
                </div>

                <h3 className="fontStyle7 font-bold text-[var(--color6)] mb-2">
                  {f.title}
                </h3>
                <p className="fontStyle9 text-[var(--color4)] leading-relaxed">
                  {f.desc}
                </p>

                {/* Bottom accent bar */}
                <span className="absolute bottom-0 left-0 h-1.5 w-0 bg-color3 group-hover:w-full transition-all duration-500 ease-out"></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}