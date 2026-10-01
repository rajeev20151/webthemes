// Single source of truth for lazy route chunks.
// AppRoutes uses these for `lazy()`, useRoutePrefetch uses them to warm the
// chunks ahead of time so a link click renders immediately.

export const pageLoaders = {
  "/": () => import("../pages/Home"),
  "/about": () => import("../pages/About"),
  "/templates": () => import("../pages/Templates"),
  "/blog": () => import("../pages/Blog"),
  "/blog/:slug": () => import("../pages/BlogDetail"),
  "/template/:slug": () => import("../pages/Themes"),
  "/demo": () => import("../pages/DemoPage"),
  "/contact": () => import("../pages/Contact"),
  "/privacy-policy": () => import("../pages/PrivacyPolicy"),
  "/login": () => import("../pages/Login"),
  "/signup": () => import("../pages/Signup"),
  "/forgotPassword": () => import("../pages/ForgotPassword"),
  "/cart": () => import("../pages/Cart"),
  "/check-out": () => import("../pages/CheckOut"),
  "/profile": () => import("../pages/Profile"),
};

const started = new Set();

function load(key) {
  if (started.has(key)) return;
  const loader = pageLoaders[key];
  if (!loader) return;
  started.add(key);
  loader().catch(() => {
    started.delete(key);
  });
}

// "/blog/hello-world" -> Blog + BlogDetail, "/template/x" -> Themes
export function prefetchPath(href) {
  if (typeof href !== "string" || !href) return;

  const pathname = href.split(/[?#]/)[0] || "/";
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : "/";

  if (pageLoaders[path]) {
    load(path);
    return;
  }

  const parent = `/${path.split("/")[1] || ""}`;
  if (parent === "/") return;
  load(parent);

  const dynamic = `${parent}/:slug`;
  if (pageLoaders[dynamic]) load(dynamic);
}

export function prefetchAllPaths() {
  Object.keys(pageLoaders).forEach(load);
}
