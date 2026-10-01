import { API_BASE } from "../../services/api";

/* ── image URL helper ── */
export const imgUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("blob:")) return path;

  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${path}`;
};
