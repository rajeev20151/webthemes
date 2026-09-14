import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DownloadButtons({ compact = false, isFree = true, price = 0, link = "", previewUrl = "", downloadUrl = "", theme = {}, addToCart = () => {} }) {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handlePreview = () => {
    const url = previewUrl || link;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = () => {
    if (!token) {
      navigate("/login", {
        state: { from: window.location.pathname },
      });
      return;
    }
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleAddToCart = () => {
    addToCart({
      _id: theme._id,
      name: theme.name,
      price: theme.price,
      originalPrice: theme.originalPrice,
      image: theme.images?.[0] || "",
      tag: theme.tag,
    });
    navigate("/cart");
  };

  return (
    <div className={compact ? "flex gap-3 flex-col sm:flex-row gap-3" : "space-y-3"}>
      {isFree ? (
        <button onClick={handleDownload} className={`${compact ? "flex-1" : "w-full"} py-3.5 cursor-pointer rounded-xl fontStyle8 font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500`}>
          <i className="bx bx-download text-lg"></i>
          Download
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className={`${compact ? "flex-1" : "w-full"} py-3.5 cursor-pointer rounded-xl fontStyle8 font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`} style={{ background: "var(--color3)", boxShadow: "0 10px 25px -8px var(--color3)" }}>
          <i className="bx bx-cart-add text-lg"></i>
          Add to Cart - ${price}
        </button>
      )}
      <button
        onClick={handlePreview}
        className={`${compact ? "flex-1" : "w-full"} py-3.5 cursor-pointer rounded-xl fontStyle8 font-semibold text-green-500 border-2 border-green-500/30 flex items-center justify-center gap-2 hover:bg-green-500/8 hover:border-green-500/50 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500`}
      >
        Live Preview <i className="bx bx-link-external text-base"></i>
      </button>
    </div>
  );
}
