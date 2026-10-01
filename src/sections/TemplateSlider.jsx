import { useGetPopularTemplatesQuery, API_URL } from "../store/apiSlice";
import { Link } from "react-router-dom";

const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL.replace(/\/api\/?$/, "")}${path}`;
};

const SECTION =
  "relative overflow-hidden py-6 sm:py-8 before:absolute before:left-0 before:top-0 before:z-[5] before:h-full before:w-[40px] before:bg-gradient-to-r before:from-[var(--color5)] before:to-transparent before:content-[''] sm:before:w-[100px] lg:before:w-[180px] after:absolute after:right-0 after:top-0 after:z-[5] after:h-full after:w-[40px] after:bg-gradient-to-l after:from-[var(--color5)] after:to-transparent after:content-[''] sm:after:w-[100px] lg:after:w-[180px]";

/* gap aur pr hamesha barabar rakhein, tabhi loop seamless rehta hai */
const GAP = "gap-3 pr-3 sm:gap-4 sm:pr-4 lg:gap-5 lg:pr-5";

export default function TemplateSlider() {
  const { data: templatesData, isLoading: loading } =
    useGetPopularTemplatesQuery(12);

  const templates = [...(templatesData?.templates ?? [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (loading) {
    return (
      <section className={SECTION}>
        <div className={`flex ${GAP} pl-3 overflow-hidden`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-[180px] w-[240px] flex-shrink-0 animate-pulse rounded-xl bg-[var(--color6)]/5 sm:h-[200px] sm:w-[300px] sm:rounded-2xl lg:w-[350px]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (templates.length === 0) return null;

  // Kam templates hon ya screen badi ho, tab bhi khali jagah na dikhe
  const repeat = Math.max(1, Math.ceil(8 / templates.length));
  const base = Array.from({ length: repeat }).flatMap(() => templates);
  const doubled = [...base, ...base];

  return (
    <section className={SECTION} aria-label="Popular templates">
      <div className="w-max will-change-transform animate-[sliderMove_60s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
        <div className={`flex ${GAP}`}>
          {doubled.map((t, i) => (
            <Link
              key={`${t._id}-${i}`}
              to={`/template/${t.slug}`}
              aria-hidden={i >= base.length}
              tabIndex={i >= base.length ? -1 : 0}
              className="group w-[240px] flex-shrink-0 overflow-hidden rounded-xl border border-[var(--color6)]/8 bg-[var(--color11)] transition-all duration-300 hover:border-[var(--color6)]/20 hover:shadow-lg sm:w-[300px] sm:rounded-2xl lg:w-[350px]"
            >
              <div className="relative overflow-hidden bg-[var(--color11)]">
                <img
                  src={imgUrl(t.images?.[0])}
                  alt={t.name}
                  loading="lazy"
                  decoding="async"
                  className="block w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 sm:p-4">
                  <h3 className="fontStyle9 truncate pr-3 font-bold text-white drop-shadow-md">
                    {t.name}
                  </h3>

                  <span className="flex h-8 w-8 flex-shrink-0 translate-y-2 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <i className="bx bx-right-arrow-alt text-base text-white"></i>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}