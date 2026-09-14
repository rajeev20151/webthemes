import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setDbCart } from "../store/slices/cartSlice";
import { useAddToCartApiMutation } from "../store/apiSlice";
import StarRating from "./StarRating";
import DownloadButtons from "./DownloadButtons";
import TagPill from "./TagPill";
import ThemeMetaCard from "./ThemeMetaCard";
import NewsletterCard from "./NewsletterCard";

export default function MobileThemeInfo({ theme, isFree, resolvedPreviewUrl, resolvedDownloadUrl, email, setEmail }) {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.cart.isAuth);
  const [addToCartApi] = useAddToCartApiMutation();

  const handleAddToCart = (item) => {
    if (isAuth) {
      addToCartApi({ templateId: item._id }).unwrap().then((res) => dispatch(setDbCart(res?.cart?.items || []))).catch(() => {});
    } else {
      dispatch(addToCart(item));
    }
  };

  return (
    <>
      <div className="lg:hidden space-y-4 mb-6">
        <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="fontStyle8 font-bold text-[var(--color6)]">
              {isFree ? "Free download" : `$${theme.price}`}
            </span>
            <Link to="#" className="fontStyle9 text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors duration-200">
              License <i className="bx bx-chevron-right text-sm"></i>
            </Link>
          </div>
          <DownloadButtons isFree={isFree} price={theme.price} link={theme.link} previewUrl={resolvedPreviewUrl} downloadUrl={resolvedDownloadUrl} theme={theme} addToCart={handleAddToCart} />
          <div className="mt-3 flex flex-wrap gap-3">
            {(isFree
              ? ["Open source", "Commercial use", "Free updates"]
              : ["Premium Support", "Commercial use", "Free updates"]
            ).map((perk, i) => (
              <div key={i} className="flex items-center gap-1.5 fontStyle10 text-[var(--color8)]">
                <i className="bx bx-check text-green-500 text-sm"></i>
                {perk}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { icon: "bx-tag",      label: "Version",   value: theme.version    },
            { icon: "bx-calendar", label: "Updated",   value: theme.updateDate },
            { icon: "bx-folder",   label: "Category",  value: theme.category   },
            { icon: "bx-download", label: "Downloads", value: theme.downloads || 0 },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-[var(--color6)]/10 bg-[var(--color11)] p-3 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <i className={`bx ${item.icon} text-[var(--color4)] text-lg block mb-1`}></i>
              <p className="fontStyle10 text-[var(--color4)]">{item.label}</p>
              <p className="fontStyle10 font-semibold text-[var(--color6)]">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden mt-8 space-y-4">
        <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 shadow-sm">
          <div className="space-y-2">
            {(isFree
              ? ["Open source", "Use in commercial projects", "Life time free updates"]
              : ["Premium Support", "Use in commercial projects", "Life time free updates"]
            ).map((perk, i) => (
              <div key={i} className="flex items-center gap-2 fontStyle9 text-[var(--color8)]">
                <i className="bx bx-check text-green-500 text-base flex-shrink-0"></i>
                {perk}
              </div>
            ))}
          </div>
          <div className="pt-4 mt-4 border-t border-[var(--color6)]/10 flex items-center gap-2 fontStyle8 text-[var(--color4)]">
            <i className="bx bx-download text-base"></i>
            <strong className="text-[var(--color6)] mr-1">{theme.downloads || 0}</strong> Downloads
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 flex items-center justify-between shadow-sm">
          <span className="fontStyle8 font-semibold text-[var(--color6)]">Questions?</span>
          <Link to="/contact" className="fontStyle9 font-semibold text-[var(--color6)] border-2 border-[var(--color6)]/20 px-4 py-2 rounded-lg hover:bg-[var(--color6)] hover:text-[var(--color5)] hover:border-[var(--color6)] transition-all duration-200">
            Contact Author
          </Link>
        </div>

        <ThemeMetaCard theme={theme} />

        {(theme.tags || []).length > 0 && (
          <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 sm:p-5 shadow-sm">
            <p className="fontStyle9 text-[var(--color4)] mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {(theme.tags || []).map((tag) => <TagPill key={tag} label={tag} />)}
            </div>
          </div>
        )}

        <NewsletterCard email={email} setEmail={setEmail} />
      </div>
    </>
  );
}
