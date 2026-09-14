import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, setDbCart } from "../store/slices/cartSlice";
import { useAddToCartApiMutation } from "../store/apiSlice";

export default function StickyMobileBar({ theme, isFree, resolvedDownloadUrl, resolvedPreviewUrl }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const isAuth = useSelector((state) => state.cart.isAuth);
  const [addToCartApi] = useAddToCartApiMutation();

  const handleDownload = () => {
    if (!token) {
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }
    if (!resolvedDownloadUrl) return;
    const a = document.createElement("a");
    a.href = resolvedDownloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleAddToCart = () => {
    const item = {
      _id: theme._id,
      name: theme.name,
      price: theme.price,
      originalPrice: theme.originalPrice,
      image: theme.images?.[0] || "",
      tag: theme.tag,
    };
    if (isAuth) {
      addToCartApi({ templateId: theme._id })
        .unwrap()
        .then((res) => dispatch(setDbCart(res?.cart?.items || [])))
        .catch(() => {});
    } else {
      dispatch(addToCart(item));
    }
    navigate("/cart");
  };

  const handlePreview = () => {
    if (resolvedPreviewUrl) window.open(resolvedPreviewUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="hidden sticky top-0 z-50 border-b border-[var(--color6)]/10 bg-[var(--color5)] bg-blur px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="fontStyle10 font-bold text-[var(--color6)] truncate">{(theme.name || "").split("–")[0].trim()}</p>
          <p className="fontStyle10 text-[var(--color4)]">{isFree ? "Free Template" : `$${theme.price}`} · {theme.downloads || 0} Downloads</p>
        </div>
        {isFree ? (
          <button onClick={handleDownload} className="flex-shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-xl fontStyle9 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md shadow-green-500/25 hover:shadow-green-500/40 transition-shadow duration-200">
            <i className="bx bx-download text-base"></i>
            Download
          </button>
        ) : (
          <button onClick={handleAddToCart} className="flex-shrink-0 flex items-center gap-1.5 py-2 px-4 rounded-xl fontStyle9 font-bold text-white shadow-md hover:shadow-lg transition-shadow duration-200" style={{ background: "var(--color3)" }}>
            <i className="bx bx-cart-add text-base"></i>
            ${theme.price}
          </button>
        )}
        <button
          onClick={handlePreview}
          className="flex-shrink-0 w-9 h-9 rounded-xl border-2 border-green-500/30 text-green-500 flex items-center justify-center hover:bg-green-500/8 transition-colors duration-200"
        >
          <i className="bx bx-link-external text-base"></i>
        </button>
      </div>
    </div>
  );
}
