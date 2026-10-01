import { Link } from "react-router-dom";

export default function BreadCrumbNav({ items = [] }) {
  return (
    <nav
      className="mb-10"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center flex-wrap gap-2 text-sm font-medium text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {!isLast ? (
                <>
                  <Link
                    to={item.path}
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                  <span className="text-gray-400">/</span>
                </>
              ) : (
                <span className="text-blue-600 font-semibold">
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
