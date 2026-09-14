import { useGetPopularTemplatesQuery, API_URL } from "../store/apiSlice";
import { Link } from "react-router-dom";

const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL.replace(/\/api\/?$/, "")}${path}`;
};

export default function TemplateSlider() {
  const { data: templatesData, isLoading: loading } =
    useGetPopularTemplatesQuery(12);

  const templates = templatesData?.templates ?? [];

  if (loading) {
    return (
      <section className="relative overflow-hidden py-6 sm:py-8 before:absolute before:left-0 before:top-0 before:z-[5] before:h-full before:w-[70px] before:bg-gradient-to-r before:from-[var(--color5)] before:to-transparent before:content-[''] sm:before:w-[120px] lg:before:w-[180px] after:absolute after:right-0 after:top-0 after:z-[5] after:h-full after:w-[70px] after:bg-gradient-to-l after:from-[var(--color5)] after:to-transparent after:content-[''] sm:after:w-[120px] lg:after:w-[180px]"
    >
      <div className="w-max animate-[scrollMove_12s_linear_infinite]">
        <div className="flex gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[180px] w-[240px] flex-shrink-0 animate-pulse rounded-xl bg-[var(--color6)]/5 sm:h-[200px] sm:w-[300px] sm:rounded-2xl lg:w-[350px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
  }

  if (templates.length === 0) return null;

  const doubled = [...templates, ...templates];

  return (
    <section className="relative overflow-hidden py-6 sm:py-8 before:absolute before:left-0 before:top-0 before:z-[5] before:h-full before:w-[70px] before:bg-gradient-to-r before:from-[var(--color5)] before:to-transparent before:content-[''] sm:before:w-[120px] lg:before:w-[180px] after:absolute after:right-0 after:top-0 after:z-[5] after:h-full after:w-[70px] after:bg-gradient-to-l after:from-[var(--color5)] after:to-transparent after:content-[''] sm:after:w-[120px] lg:after:w-[180px]"
    >
      <div className="w-max animate-[scrollMove_12s_linear_infinite]">
        <div className="flex gap-3 sm:gap-4 lg:gap-5">
          {doubled.map((t, i) => (
            <Link
              key={`${t._id}-${i}`}
              to={`/template/${t.slug}`}
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

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
            <h3 className="truncate pr-3 font-[var(--fontStyle9)] font-bold text-white drop-shadow-md">
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

