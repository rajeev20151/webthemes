import { Link } from "react-router-dom";
import StarRating from "./StarRating";

export default function RelatedProducts({ relatedProducts }) {
  return (
    <div className="mt-10 sm:mt-14">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <span className="w-7 h-0.5 bg-[var(--color6)] rounded-full opacity-70"></span>
          <div>
            <h2 className="fontStyle6 font-bold text-[var(--color6)] tracking-tight">Related products</h2>
            <p className="fontStyle10 text-[var(--color4)]">Themes in the same category.</p>
          </div>
        </div>
        <Link to="/templates" className="fontStyle9 font-semibold text-[var(--color6)] flex items-center gap-1 hover:gap-2 hover:text-blue-500 transition-all duration-200">
          View all <i className="bx bx-chevron-right text-base"></i>
        </Link>
      </div>
      {relatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {relatedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/template/${product.slug}`}
              className="group border-2 border-[var(--color6)]/10 rounded-2xl overflow-hidden bg-[var(--color11)] shadow-sm hover:shadow-xl hover:border-[var(--color6)]/30 hover:-translate-y-1.5 transition-all duration-300"
            >
              <div className="relative overflow-hidden aspect-[13/9]">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className={`absolute top-2.5 left-2.5 fontStyle10 font-bold uppercase px-2.5 py-1 rounded-full text-white text-xs shadow-md ${product.price === "Free" ? "bg-green-500" : "bg-[var(--color3)]"}`}>
                  {product.price}
                </span>
              </div>
              <div className="p-3.5">
                <h3 className="fontStyle9 font-semibold text-[var(--color6)] mb-2 line-clamp-2 leading-snug group-hover:text-[var(--color3)] transition-colors duration-200">{product.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 fontStyle10 text-[var(--color4)]">
                    <i className="bx bx-download text-xs"></i>
                    {product.downloads.toLocaleString()} downloads
                  </div>
                  <div className="flex items-center gap-1">
                    <StarRating rating={product.rating} size="text-xs" />
                    <span className="fontStyle10 text-[var(--color4)]">({product.reviews})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 sm:py-16 text-center rounded-2xl border border-dashed border-[var(--color6)]/15 bg-[var(--color11)]/40">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color6)]/5 mb-4">
            <i className="bx bx-palette text-2xl text-[var(--color4)]"></i>
          </div>
          <p className="fontStyle9 font-semibold text-[var(--color6)] mb-1">No related themes found</p>
          <p className="fontStyle10 text-[var(--color4)] mb-5">Explore more templates in our collection</p>
          <Link to="/templates" className="fontStyle9 font-semibold inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--color6)] text-[var(--color5)] hover:opacity-85 transition-opacity duration-200">
            Browse all templates <i className="bx bx-chevron-right text-base"></i>
          </Link>
        </div>
      )}
    </div>
  );
}
