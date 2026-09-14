import { Link } from "react-router-dom";
import TagBadge from "./TagBadge";
import TechBadge from "./TechBadge";

export default function DemoListItem({ demo }) {
  return (
    <div
      className="group flex items-center gap-3 sm:gap-4 border border-[var(--color6)]/12 rounded-2xl bg-[var(--color11)] p-3 sm:p-4
        hover:border-[var(--color6)]/30 hover:bg-[var(--color11)] hover:shadow-[3px_3px_0px_rgba(0,0,0,0.06)]
        transition-all duration-200"
    >
      <Link to={`/template/${demo.slug}`} className="flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color1)] block w-[clamp(80px,18vw,130px)] aspect-[13/9]">
        {demo.image && (
          <img src={demo.image} alt={demo.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <TagBadge tag={demo.tag} />
          {demo.tech && <TechBadge tech={demo.frameworks} />}
          <span className="flex items-center gap-1.5">
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
          </span>
        </div>
        <h3 className="fontStyle7 font-bold text-[var(--color6)] truncate mb-1">
          <Link to={`/template/${demo.slug}`} className="hover:text-[var(--color4)] transition-colors duration-200">
            {demo.title}
          </Link>
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1">
            <i className="bx bx-folder-open text-xs"></i>
            {demo.category}
          </span>
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1 hidden xs:flex">
            <i className="bx bx-layer text-xs"></i>
            {demo.type}
          </span>
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1">
            <i className="bx bx-show text-xs"></i>
            {demo.views} views
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-2">
        <Link to={`/template/${demo.slug}`} className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200">
          <i className="bx bx-info-circle text-sm"></i>
          View Details
        </Link>
        {demo.previewUrl && (
          <a href={demo.previewUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200">
            <i className="bx bx-play-circle text-sm"></i>
            Preview
          </a>
        )}
        <Link to={`/template/${demo.slug}`} className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200">
          <i className="bx bx-info-circle text-base"></i>
        </Link>
        {demo.previewUrl && (
          <a href={demo.previewUrl} target="_blank" rel="noopener noreferrer" className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--color6)] text-[var(--color5)] hover:opacity-80 transition-opacity duration-200">
            <i className="bx bx-play-circle text-base"></i>
          </a>
        )}
      </div>
    </div>
  );
}
