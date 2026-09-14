import { Link } from "react-router-dom";
import TagBadge from "./TagBadge";

export default function DemoCard({ demo }) {
  return (
    <div
      className="group border-[2px] border-[var(--color6)] rounded-2xl overflow-hidden bg-[var(--color11)] cursor-pointer
        shadow-[6px_6px_0px_var(--color6)] hover:shadow-[2px_2px_0px_var(--color6)]
        hover:border-[var(--color6)]/40 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative overflow-hidden bg-[var(--color1)] aspect-[13/9]">
        {demo.image && (
          <img
          src={demo.image}
          alt={demo.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <TagBadge tag={demo.tag} />
          <span className="fontStyle10 font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center gap-1">
            <i className="bx bx-show text-xs"></i>
            {demo.views}
          </span>
        </div>

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 px-4">
          {demo.previewUrl && (
            <a
              href={demo.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl fontStyle8 font-bold bg-white text-[#0f172a] hover:bg-white/90 transition-colors duration-150 translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <i className="bx bx-play-circle text-lg"></i>
              Live Preview
            </a>
          )}
          <Link
            to={`/template/${demo.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl fontStyle8 font-semibold border border-white/30 text-white hover:bg-white/10 transition-colors duration-150 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75"
          >
            <i className="bx bx-info-circle text-base"></i>
            View Details
          </Link>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        {demo.frameworks && (
          <span className="fontStyle10 d-block text-[var(--color5)] p-1 px-3 rounded-full bg-color3 text-xs sm:text-sm mb-2">
            {demo.frameworks}
          </span>
        )}
        <div className="flex items-start justify-between align-center gap-2 mb-2.5 mt-4">
          <h3 className="fontStyle7 font-bold text-[var(--color6)] leading-snug">
            <Link to={`/template/${demo.slug}`} className="hover:text-[var(--color4)] transition-colors duration-200">
              {demo.title}
            </Link>
          </h3>
          <div className="flex items-center gap-1.5 mb-2.5">
            {demo.price > 0 ? (
              <>
                {demo.originalPrice > demo.price && (
                  <span className="fontStyle10 text-[var(--color4)] line-through">${demo.originalPrice}</span>
                )}
                <span className="fontStyle7 font-bold text-[var(--color6)]">${demo.price}</span>
              </>
            ) : (
              <span className="fontStyle7 font-bold text-[var(--color6)]">Free</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-[var(--color6)]/8">
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
            <i className="bx bx-folder-open text-sm"></i>
            {demo.category}
          </span>
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5">
            <i className="bx bx-layer text-sm"></i>
            {demo.type}
          </span>
        </div>
      </div>
    </div>
  );
}
