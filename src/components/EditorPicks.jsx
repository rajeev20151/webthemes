import { Link } from "react-router-dom";
import StarRating from "./StarRating";

function EditorPickCard({ pick }) {
  return (
    <Link key={pick.id} to={`/template/${pick.slug}`}
      className="group flex flex-col border border-[var(--color6)]/10 rounded-xl overflow-hidden bg-[var(--color11)] shadow-sm hover:shadow-lg hover:border-[var(--color6)]/25 hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative overflow-hidden aspect-video">
        <img src={pick.image} alt={pick.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {pick.originalPrice && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black rounded-full px-2.5 py-1 text-center shadow-md">
            <p className="fontStyle10 font-semibold line-through opacity-60 leading-none">{pick.originalPrice}</p>
            <p className="fontStyle9 font-black leading-none">{pick.price}</p>
          </div>
        )}
        <span className={`absolute top-2 left-2 fontStyle10 font-bold uppercase px-2 py-0.5 rounded text-white text-xs shadow-md ${pick.badgeCls}`}>
          {pick.badge}
        </span>
      </div>
      <div className="p-3">
        <p className="fontStyle9 font-semibold text-[var(--color6)] mb-1.5 line-clamp-1 group-hover:text-[var(--color3)] transition-colors duration-200">{pick.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 fontStyle10 text-[var(--color4)]">
            <i className="bx bx-cart text-xs"></i>
            {(pick.purchases ?? 0).toLocaleString()} Purchases
          </div>
          <div className="flex items-center gap-1">
            <StarRating rating={pick.rating} size="text-xs" />
            <span className="fontStyle10 text-[var(--color4)]">({pick.reviews})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function EditorPicks({ editorPicks, isLoading }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-0.5 bg-[var(--color6)] rounded-full opacity-60"></span>
          <span className="fontStyle10 font-bold uppercase tracking-wider text-[var(--color6)]">Editor's Pick</span>
        </div>
        <Link to="/templates" className="fontStyle10 text-[var(--color4)] hover:text-blue-500 flex items-center gap-1 transition-colors duration-200">
          View All <i className="bx bx-chevron-right text-sm"></i>
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-3.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col border border-[var(--color6)]/10 rounded-xl overflow-hidden bg-[var(--color11)] animate-pulse">
              <div className="aspect-video bg-[var(--color6)]/5"></div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[var(--color6)]/5 rounded w-3/4"></div>
                <div className="h-2 bg-[var(--color6)]/5 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : editorPicks.length > 0 ? (
        <div className="space-y-3.5">
          {editorPicks.map((pick) => (
            <EditorPickCard key={pick.id} pick={pick} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center rounded-xl border border-dashed border-[var(--color6)]/10 bg-[var(--color11)]/30">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color6)]/5 mb-3">
            <i className="bx bx-star text-lg text-[var(--color4)]/60"></i>
          </div>
          <p className="fontStyle9 font-semibold text-[var(--color6)]/70 mb-0.5">No picks yet</p>
          <p className="fontStyle10 text-[var(--color4)]/60">Editor's picks will appear here soon</p>
        </div>
      )}
    </div>
  );
}
