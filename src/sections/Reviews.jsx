import { useState, useRef } from "react";
import { useGetAllReviewsQuery } from "../store/apiSlice";

const INITIAL_COUNT = 6;
const STEP = 6;

export default function Reviews() {
  const { data: reviewsData } = useGetAllReviewsQuery();
  const reviews = reviewsData?.success ? reviewsData.reviews : [];
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const sectionRef = useRef(null);

  if (reviews.length === 0) return null;

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;
  // const remaining = reviews.length - visibleCount;

  const avgRating = (
    reviews.reduce((sum, r) => sum + Math.min(r.rating || 5, 5), 0) / reviews.length
  ).toFixed(1);

  return (
    <section
      ref={sectionRef}
      className="reviews_section py-12 sm:py-12 md:py-16 lg:py-20 xl:py-20"
    >
      <div className="w-width">
        {/* ── Heading ── */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="w-7 h-0.5 rounded-full bg-[var(--color6)] opacity-40 inline-block"></span>
            <span className="fontStyle10 font-bold uppercase tracking-widest text-[var(--color4)]">
              Testimonials
            </span>
            <span className="w-7 h-0.5 rounded-full bg-[var(--color6)] opacity-40 inline-block"></span>
          </div>
          <h2 className="fontStyle4 text-[var(--color6)] font-bold">What our clients say</h2>
        </div>

        {/* ── Rating summary ── */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6 py-4 rounded-2xl border-2 border-[var(--color6)] bg-[var(--color5)] shadow-[5px_5px_0px_var(--color6)]">
            <div className="flex items-center gap-3">
              <span className="fontStyle3 font-bold text-[var(--color6)] leading-none">{avgRating}</span>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i
                      key={i}
                      className={`bx ${i < Math.round(avgRating) ? "bxs-star text-yellow-400" : "bx-star text-[var(--color4)]"} text-base`}
                    ></i>
                  ))}
                </div>
                <p className="fontStyle10 text-[var(--color4)] mt-0.5">Average rating</p>
              </div>
            </div>
            <span className="hidden sm:block w-px h-10 bg-[var(--color6)]/15"></span>
            <div>
              <p className="fontStyle7 font-bold text-[var(--color6)] leading-none">{reviews.length}+</p>
              <p className="fontStyle10 text-[var(--color4)] mt-1">Happy clients</p>
            </div>
          </div>
        </div>

        {/* ── Cards (fade sirf tab dikhega jab aur reviews baaki hon) ── */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4">
            {visibleReviews.map((r, index) => {
              const name = r.userName || r.name || "Anonymous";
              const rating = Math.min(r.rating || 5, 5);
              const isAccent = index % 4 === 0;
              const isOffset = index % 3 === 1;

              return (
                <div key={r._id} className={isOffset ? "lg:mt-10" : ""}>
                  <div
                    className={`group relative flex flex-col h-full p-6 sm:p-7 rounded-2xl overflow-hidden border-2 border-[var(--color6)]
                      shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
                      transition-all duration-300
                      hover:shadow-[2px_2px_0px_var(--color6)] hover:translate-x-1 hover:translate-y-1
                      ${isAccent ? "bg-color3 text-white" : "bg-[var(--color5)]"}`}
                  >
                    {/* Big faded quote */}
                    <i
                      className={`bx bxs-quote-right absolute -top-2 right-3 text-[110px] leading-none pointer-events-none select-none ${
                        isAccent ? "text-white/15" : "text-[var(--color6)]/[0.06]"
                      }`}
                    ></i>

                    {/* Rating pill */}
                    <span
                      className={`relative self-start inline-flex items-center gap-1.5 fontStyle10 font-bold px-3 py-1 rounded-full border-2 -rotate-2 transition-all duration-300 group-hover:rotate-0 mb-5 ${
                        isAccent
                          ? "bg-white text-[#111827] border-[#111827] shadow-[3px_3px_0px_#111827]"
                          : "bg-[var(--color5)] text-[var(--color6)] border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)]"
                      }`}
                    >
                      <i className="bx bxs-star text-yellow-400 text-sm"></i>
                      {rating}.0
                      <span className="flex items-center gap-0.5 ml-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              i < rating ? "bg-yellow-400" : "bg-current opacity-20"
                            }`}
                          ></span>
                        ))}
                      </span>
                    </span>

                    {/* Comment */}
                    <p
                      className={`relative fontStyle8 leading-relaxed mb-6 ${
                        isAccent ? "text-white/90" : "text-[var(--color8)]"
                      }`}
                    >
                      {r.comment || r.text || ""}
                    </p>

                    {/* Author */}
                    <div
                      className={`relative flex items-center gap-3 mt-auto pt-4 border-t-2 border-dashed ${
                        isAccent ? "border-white/30" : "border-[var(--color6)]/15"
                      }`}
                    >
                      <span
                        className={`w-11 h-11 rounded-xl border-2 flex items-center justify-center fontStyle7 font-bold uppercase flex-shrink-0 ${
                          isAccent
                            ? "bg-white text-[#111827] border-[#111827] shadow-[3px_3px_0px_#111827]"
                            : "bg-[var(--color6)] text-[var(--color5)] border-[var(--color6)] shadow-[3px_3px_0px_var(--color4)]"
                        }`}
                      >
                        {name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <h4
                          className={`fontStyle7 font-bold truncate ${
                            isAccent ? "text-white" : "text-[var(--color6)]"
                          }`}
                        >
                          {name}
                        </h4>
                        <p
                          className={`fontStyle10 flex items-center gap-1 ${
                            isAccent ? "text-white/70" : "text-[var(--color4)]"
                          }`}
                        >
                          <i className="bx bxs-badge-check text-sm text-green-400"></i>
                          Verified Client
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-56 z-[5]"
              style={{ background: "linear-gradient(to top, var(--color5), transparent)" }}
            ></div>
          )}
        </div>

        {/* ── Load more / Show less ── */}
        {reviews.length > INITIAL_COUNT && (
          <div className="mt-12 text-center relative z-10">
          {hasMore ? (
          <button
          type="button"
          onClick={() =>
          setVisibleCount((prev) => Math.min(prev + STEP, reviews.length))
          }
          className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 bg-[var(--color6)] rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
          <span className="text-[var(--color5)]">Read Customer Experience</span>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)] transition-all duration-300 group-hover:rotate-90">
          <i className="bx bx-plus text-xl text-[var(--color6)]"></i>
          </span>
          </button>
          ) : (
              <button
                type="button"
                onClick={() => {
                  setVisibleCount(INITIAL_COUNT);
                  sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 bg-[var(--color6)] rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
              >
                <span className="text-[var(--color5)]">Show Less</span>
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)] transition-all duration-300 group-hover:-translate-y-1">
                  <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}