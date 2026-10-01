import { Link } from "react-router-dom";
import TagBadge from "./TagBadge";

export default function DemoCard({ demo }) {
  return (
    <div
      className="group flex flex-col h-full bg-[var(--color5)] border-2 border-[var(--color6)] rounded-2xl overflow-hidden cursor-pointer
        shadow-[6px_6px_0px_var(--color6)] sm:shadow-[8px_8px_0px_var(--color6)]
        transition-all duration-300
        hover:shadow-[2px_2px_0px_var(--color6)] hover:translate-x-1 hover:translate-y-1 sm:hover:translate-x-1.5 sm:hover:translate-y-1.5"
    >
      {/* ── Image ── */}
      <div className="relative overflow-hidden bg-[var(--color1)] aspect-[13/9] border-b-2 border-[var(--color6)]">
        {demo.image && (
          <img
            src={demo.image}
            alt={demo.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <TagBadge tag={demo.tag} />
          <span className="inline-flex items-center gap-1.5 fontStyle10 font-bold px-3 py-1 rounded-full bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[3px_3px_0px_var(--color6)] rotate-3 transition-all duration-300 group-hover:rotate-0 group-hover:shadow-[1px_1px_0px_var(--color6)]">
            <i className="bx bx-show text-base leading-none"></i>
            {demo.views ?? 0}
          </span>
        </div>

        {/* Hover overlay (original design) */}
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

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Title + Price */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="fontStyle7 font-bold text-[var(--color6)] leading-snug">
            <Link
              to={`/template/${demo.slug}`}
              className="hover:text-[var(--color4)] transition-colors duration-200"
            >
              {demo.title}
            </Link>
          </h3>

          <div className="flex items-center gap-2 shrink-0">
            {demo.price > 0 ? (
              <>
                {demo.originalPrice > demo.price && (
                  <span className="fontStyle10 text-[var(--color4)] line-through">
                    ${demo.originalPrice}
                  </span>
                )}
                <span className="fontStyle9 font-bold bg-color3 text-white px-3 py-1 rounded-full shadow-md shadow-indigo-500/25">
                  ${demo.price}
                </span>
              </>
            ) : (
              <span className="fontStyle9 font-bold bg-[var(--color6)] text-[var(--color5)] px-3 py-1 rounded-full">
                Free
              </span>
            )}
          </div>
        </div>

        {/* Frameworks */}
        {demo.frameworks && (
          <div className="my-3">
            <span className="inline-flex items-center gap-1.5 fontStyle10 font-bold uppercase tracking-wide px-3 py-1 rounded-full bg-[var(--color5)] text-[var(--color6)] border-2 border-[var(--color6)] shadow-[2px_2px_0px_var(--color6)]">
              <i className="bx bx-code-alt text-sm"></i>
              {demo.frameworks}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-dashed border-[var(--color6)]/15">
          <span className="fontStyle10 text-[var(--color4)] flex items-center gap-1.5 truncate">
            <i className="bx bx-folder-open text-sm"></i>
            {demo.category}
          </span>
          <span className="fontStyle10 font-semibold text-[var(--color6)] flex items-center gap-1.5 shrink-0 ml-2">
            <i className="bx bx-layer text-sm"></i>
            {demo.type}
          </span>
        </div>
      </div>
    </div>
  );
}