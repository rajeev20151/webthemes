import { Link } from "react-router-dom";

export default function BreadCrumbNav({ items = [] }) {
  return (
    <nav
      className="mb-8 sm:mb-10 mt-0"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-2 sm:gap-3">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2 sm:gap-3">
              {!isLast ? (
                <>
                  <Link
                    to={item.path}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      fontStyle10 font-bold uppercase tracking-widest
                      text-[var(--color4)] border border-[var(--color6)]/15
                      bg-[var(--color5)] transition-all duration-200
                      hover:text-[var(--color6)] hover:border-[var(--color6)]
                      hover:-translate-y-0.5 hover:shadow-[2px_2px_0_var(--color6)]"
                  >
                    {index === 0 && <i className="bx bx-home-alt text-sm" />}
                    {item.label}
                  </Link>
                  <i className="bx bx-chevron-right text-[var(--color6)]/40 text-lg" />
                </>
              ) : (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full
                  fontStyle10 font-bold uppercase tracking-widest
                  text-[var(--color5)] border-2 border-[var(--color6)]
                  bg-[var(--color6)] shadow-[2px_2px_0_var(--color4)]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
