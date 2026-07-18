import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAllReviewsAPI } from "../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviewsAPI();
        if (data.success) setReviews(data.reviews);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReviews();
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section className="reviews_section py-12 sm:py-12 md:py-16 lg:py-20 xl:py-20">
      <div className="w-width">
        <div className="text-center mb-16">
          <h2 className="fontStyle4 text-[var(--color6)] font-bold">What our clients say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="p-6 border-[2px] border-[var(--color6)] rounded-2xl bg-[var(--color5)] shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] transition-all duration-300"
            >
              <p className="fontStyle8 text-[var(--color8)] mb-6">
                {r.comment || r.text || ""}
              </p>
              <div className="flex items-center gap-1 mb-2 fontStyle7">
                {Array.from({ length: r.rating || 5 }).map((_, i) => (
                  <i key={i} className="bx bxs-star text-orange-500"></i>
                ))}
              </div>
              <h4 className="fontStyle7 text-[var(--color6)] fw-bold">
                <b>{r.userName || r.name || "Anonymous"}</b>
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-20 text-center z-30 relative">
        <Link
          to="/reviews"
          className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 bg-[var(--color6)] rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <span className="text-[var(--color5)]">More trusted customers</span>
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)] transition-all duration-300 group-hover:rotate-90">
            <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
          </span>
        </Link>
      </div> */}
    </section>  
  );
}