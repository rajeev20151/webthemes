import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { getTemplatesAPI, getTemplateReviewsAPI, API_BASE } from "../services/api"

const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE.replace(/\/api\/?$/, "")}${path}`;
};

function StarRating({ rating = 0, reviews = 0 }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bx ${star <= Math.floor(rating) ? "bxs-star" : star - 0.5 <= rating ? "bxs-star-half" : "bx-star"} text-yellow-400 text-sm`}></i>
      ))}
      <span className="fontStyle10 text-[var(--color4)] ml-1">({reviews})</span>
    </div>
  )
}

export default function PopularTemplates() {
  const [templates, setTemplates] = useState([])
  const [ratings, setRatings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTemplatesAPI()
      if (res.success) {
        setTemplates(res.templates)

        const ratingMap = {}
        await Promise.all(
          res.templates.map(async (t) => {
            try {
              const r = await getTemplateReviewsAPI(t._id)
              if (r.success) {
                ratingMap[t._id] = {
                  rating: r.stats?.average || 0,
                  total: r.stats?.total || 0,
                }
              }
            } catch {
              ratingMap[t._id] = { rating: 0, total: 0 }
            }
          })
        )
        setRatings(ratingMap)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <div></div>

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-20 xl:py-20">
      <div className="w-width">
        <div className="text-center mb-16">
          <h2 className="fontStyle4 text-[var(--color6)] font-bold">Pre-created website layouts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {templates.slice(0, 9).map((t) => (
            <div key={t._id} className="group cursor-pointer bg-[var(--color5)] rounded-2xl">
              <div className="p-4 border-[2px] border-[var(--color6)] rounded-2xl text-center shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] transition-all duration-300">
                <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[4/5] bg-gray-100">
                  <img
                    src={imgUrl(t.images?.[0])}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                    <Link
                      to={`/template/${t._id}`}
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:!text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                    >
                      <i className="bx bx-link-external text-2xl text-inherit"></i>
                    </Link>
                    <Link
                      to={`/template/${t._id}`}
                      className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:!text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75"
                    >
                      <i className="bx bx-heart text-2xl text-inherit"></i>
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
              <Link to={`/template/${t._id}`}>{t.name}</Link>
              </h3>
              <span className="flex items-center gap-1.5 flex-shrink-0 ml-2">
              {t.price > 0 ? (
              <>
              {t.originalPrice > 0 && t.originalPrice > t.price && (
              <span className="fontStyle10 text-[var(--color4)] line-through">
              ${t.originalPrice}
              </span>
              )}
              <span className="fontStyle7 font-bold text-[var(--color6)]">
              ${t.price}
              </span>
              </>
              ) : (
              <span className="fontStyle7 font-bold text-[var(--color6)]">
              Free
              </span>
              )}
              </span>
              </div>

                <div className="flex items-center justify-between">
                  <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1">
                    <i className="bx bx-cart text-sm"></i>
                    {t.downloads || 0} Purchases
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
  )
}