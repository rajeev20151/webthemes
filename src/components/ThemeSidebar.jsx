import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, setDbCart } from "../store/slices/cartSlice";
import { useAddToCartApiMutation } from "../store/apiSlice";
import DownloadButtons from "./DownloadButtons";
import EditorPicks from "./EditorPicks";
import ThemeMetaCard from "./ThemeMetaCard";
import NewsletterCard from "./NewsletterCard";
import TagPill from "./TagPill";

export default function ThemeSidebar({ theme, isFree, resolvedPreviewUrl, resolvedDownloadUrl, editorPicks, editorPicksLoading, email, setEmail }) {
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
    <div className="hidden lg:flex flex-col gap-5 flex-shrink-0 w-[290px] xl:w-[310px] sticky top-6">
      <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <span className="fontStyle7 font-bold text-[var(--color6)]">
            {isFree ? "Free download" : `$${theme.price}`}
          </span>
          <Link to="#" className="fontStyle9 text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors duration-200">
            License <i className="bx bx-chevron-right text-sm"></i>
          </Link>
        </div>
        <DownloadButtons isFree={isFree} price={theme.price} link={theme.link} previewUrl={resolvedPreviewUrl} downloadUrl={resolvedDownloadUrl} theme={theme} addToCart={handleAddToCart} />
        <div className="mt-4 space-y-2 mb-5">
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
        <div className="pt-4 border-t border-[var(--color6)]/10 flex items-center gap-2 fontStyle8 text-[var(--color4)]">
          <i className="bx bx-download text-base"></i>
          <strong className="text-[var(--color6)] mr-1">{theme.downloads || 0}</strong> Downloads
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
        <span className="fontStyle8 font-semibold text-[var(--color6)]">Questions?</span>
        <Link to="/contact" className="fontStyle9 font-semibold text-[var(--color6)] border-2 border-[var(--color6)]/20 px-4 py-2 rounded-lg hover:bg-[var(--color6)] hover:text-[var(--color5)] hover:border-[var(--color6)] transition-all duration-200">
          Contact Author
        </Link>
      </div>

      <EditorPicks editorPicks={editorPicks} isLoading={editorPicksLoading} />

      <ThemeMetaCard theme={theme} />

      {(theme.tags || []).length > 0 && (
        <div className="rounded-2xl border border-[var(--color6)]/10 bg-[var(--color11)] p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="fontStyle9 text-[var(--color4)] mb-3">Tags</p>
          <div className="flex flex-wrap gap-2">
            {(theme.tags || []).map((tag) => <TagPill key={tag} label={tag} />)}
          </div>
        </div>
      )}

      <NewsletterCard email={email} setEmail={setEmail} />
    </div>
  );
}
