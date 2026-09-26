import { Link } from "react-router-dom";
import { useGetPopularTemplatesQuery, useGetTemplatesRatingsQuery, API_URL } from "../store/apiSlice";

const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_URL.replace(/\/api\/?$/, "")}${path}`;
};

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="p-4 border-2 border-[var(--color6)]/10 rounded-2xl">
        <div className="relative rounded-2xl mb-5 aspect-[4/5] bg-[var(--color6)]/5" />
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-[var(--color6)]/5 rounded-full w-32" />
          <div className="h-4 bg-[var(--color6)]/5 rounded-full w-10" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-[var(--color6)]/5 rounded-full w-24" />
          <div className="h-3 bg-[var(--color6)]/5 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

/* ── Star Rating ── */
function StarRating({ rating = 0, reviews = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bx ${star <= Math.floor(rating) ? "bxs-star" : star - 0.5 <= rating ? "bxs-star-half" : "bx-star"} text-yellow-400 text-sm`}></i>
      ))}
      <span className="fontStyle10 text-[var(--color4)] ml-1">({reviews})</span>
    </div>
  );
}

export default function PopularTemplates() {
  const { data: templatesData, isLoading: loading } = useGetPopularTemplatesQuery(9);
  const templates = [...(templatesData?.templates ?? [])].sort(
  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Batch fetch all ratings in ONE call
  const templateIds = templates.map((t) => t._id).filter(Boolean);
  const { data: ratingsData } = useGetTemplatesRatingsQuery(templateIds, {
    skip: templateIds.length === 0,
  });
  const ratings = ratingsData?.ratings ?? {};

  if (loading) {
    return (
      <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-20">
        <div className="w-width">
          <div className="text-center mb-16">
            <div className="h-6 bg-[var(--color6)]/5 rounded-full w-64 mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (templates.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-20">
      <div className="w-width">
        <div className="text-center mb-16">
          <h2 className="fontStyle4 text-[var(--color6)] font-bold">Pre-created website layouts</h2>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {templates.map((t) => (
                  <div key={t._id} className="group cursor-pointer bg-[var(--color5)] rounded-2xl">
                  <div className="p-4 border-[2px] border-[var(--color6)] rounded-2xl text-center shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] transition-all duration-300">
                  <div className="relative overflow-hidden rounded-2xl mb-5 bg-gray-100 h-[400px] sm:h-[400px] md:h-[400px] lg:h-[430px]">
                  <img
                  src={imgUrl(t.images?.[0])}
                  alt={t.name}
                  loading="lazy"
                  className="block w-full h-auto object-contain object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  {/* Template Page */}
                  <Link
                  to={`/template/${t.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 h-12 rounded-full bg-[var(--color5)] flex items-center justify-center text-[var(--color6)] hover:scale-110 transition-transform duration-300 shadow-lg"
                  aria-label="Open template"
                  >
                  <i className="bx bx-link-external text-2xl"></i>
                  </Link>
                  
                   {/* Heart / Description */}
                  <Link
                  to={`/template/${t.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-12 h-12 rounded-full bg-[var(--color5)] flex items-center justify-center text-[var(--color6)] hover:scale-110 transition-transform duration-300 shadow-lg"
                  aria-label="View template details"
                  >
                  <i className="bx bx-heart text-2xl"></i>
                  </Link>
                  </div>

                <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full fontStyle10 font-semibold uppercase tracking-wider">
                {t.subtitle}
                </span>
                </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="fontStyle7 text-[var(--color6)] font-bold group-hover:text-gray-600 transition-colors duration-300 text-left">
                    <Link to={`/template/${t.slug}`}>{t.name}</Link>
                  </h3>
                  <span className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    {t.price > 0 ? (
                      <>
                        {t.originalPrice > 0 && t.originalPrice > t.price && (
                          <span className="fontStyle10 text-[var(--color4)] line-through">${t.originalPrice}</span>
                        )}
                        <span className="fontStyle7 font-bold text-[var(--color6)]">${t.price}</span>
                      </>
                    ) : (
                      <span className="fontStyle7 font-bold text-[var(--color6)]">Free</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1">
                    <i className="bx bx-cart text-sm"></i>{t.downloads || 0} Purchases
                  </span>
                  <StarRating
                    rating={ratings[t._id]?.rating || 0}
                    reviews={ratings[t._id]?.total || 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <Link
          to="/templates"
          className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 bg-[var(--color6)] rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="text-[var(--color5)]">View More Template</span>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)] transition-all duration-300 group-hover:rotate-90">
            <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
          </span>
        </Link>
      </div>
    </section>
  );
}
