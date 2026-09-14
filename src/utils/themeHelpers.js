import { API_URL as API_BASE } from "../store/apiSlice";

export const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};

export function buildEditorPicks(all, currentId) {
  return all
    .filter((t) => t._id !== currentId)
    .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 3)
    .map((t) => ({
      id: t._id,
      title: t.name,
      price: t.price === 0 ? "Free" : `$${t.price}`,
      purchases: t.downloads || 0,
      rating: t.rating || 0,
      reviews: t.reviews || 0,
      image: t.images?.[0]
        ? t.images[0].startsWith("http")
          ? t.images[0]
          : `${API_BASE.replace(/\/api\/?$/, "")}${t.images[0]}`
        : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      badge: (t.frameworks?.[0] || "TEMPLATE").toUpperCase(),
      badgeCls: t.price === 0 ? "bg-green-500" : "bg-violet-700",
      originalPrice: t.originalPrice ? `$${t.originalPrice}` : null,
    }));
}

export function buildRelatedProducts(all, currentId, currentCategory) {
  return all
    .filter((t) => t._id !== currentId)
    .sort((a, b) => {
      const aMatch = (a.category || "").toLowerCase() === (currentCategory || "").toLowerCase() ? 1 : 0;
      const bMatch = (b.category || "").toLowerCase() === (currentCategory || "").toLowerCase() ? 1 : 0;
      return bMatch - aMatch || (b.downloads || 0) - (a.downloads || 0);
    })
    .slice(0, 3)
    .map((t) => ({
      id: t._id,
      title: t.name,
      price: t.price === 0 ? "Free" : `$${t.price}`,
      downloads: t.downloads || 0,
      rating: t.rating || 0,
      reviews: t.reviews || 0,
      image: t.images?.[0]
        ? t.images[0].startsWith("http")
          ? t.images[0]
          : `${API_BASE.replace(/\/api\/?$/, "")}${t.images[0]}`
        : "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    }));
}
