import { API_BASE } from "../../services/api";

// ── static fallback nav (unchanged) ───────────────────────────────────────────

export const desktopNav = [
  { to: "/",            label: "Home",    icon: "bx-home"         },
  // { to: "/PricingPage", label: "Pricing", icon: "bx-purchase-tag" },
  { to: "/demo",        label: "Demos",   icon: "bx-play-circle"  },
  { to: "/blog",        label: "Blog",    icon: "bx-news"         },
];

export const mobileNav = [
  { to: "/",            label: "Home",    icon: "bx-home"         },
  // { to: "/PricingPage", label: "Pricing", icon: "bx-purchase-tag" },
  { to: "/demo",       label: "Demos",   icon: "bx-play-circle"  },
  // { to: "/reviews",     label: "Reviews", icon: "bx-star"         },
  { to: "/blog",        label: "Blog",    icon: "bx-news"         },
  { to: "/contact",     label: "Contact", icon: "bx-envelope"     },
];

// ── dynamic mega-menu building blocks ─────────────────────────────────────────
// No "tab/type" field exists on templates, only `category`. So each unique
// category becomes its own tab, and the individual templates inside that
// category become the links — all derived live from the API response.

const TAB_ICONS = ["bx-globe", "bx-code-alt", "bx-buildings", "bx-star", "bx-shape-triangle", "bx-category", "bx-grid-alt", "bx-layer"];
const FEATURED_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
  "linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)",
];

function slugify(str) {
  return String(str).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "general";
}

// Build mega-menu tabs dynamically from the fetched templates list.
export function buildMegaMenuTabs(allTemplates) {
  if (!allTemplates.length) return [];

  const groups = new Map();
  allTemplates.forEach((t) => {
    const key = t.category || "General";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(t);
  });

  return Array.from(groups.entries()).map(([category, items], idx) => {
    const featuredItem = items.find((t) => t.tag === "FREE") || items[0];
    return {
      id: slugify(category),
      label: category,
      icon: TAB_ICONS[idx % TAB_ICONS.length],
      links: items.slice(0, 6).map((t) => ({
        id: t._id || t.id,
        to: `/templates?q=${encodeURIComponent(t.title)}`,
        label: t.title,
        desc: t.tag === "FREE" ? "Free template" : "Premium template",
      })),
      featured: {
        tag: featuredItem.tag === "FREE" ? "Free" : "Popular",
        title: featuredItem.title,
        desc: `Explore ${items.length} template${items.length === 1 ? "" : "s"} in ${category}.`,
        cta: "View All →",
        to: `/templates?q=${encodeURIComponent(category)}`,
        bg: FEATURED_GRADIENTS[idx % FEATURED_GRADIENTS.length],
      },
    };
  });
}

// ── resolve thumbnail from API template ───────────────────────────────────────
export function resolveImage(t) {
  const origin = API_BASE.replace(/\/api$/, "");
  const raw = Array.isArray(t.images) && t.images.length > 0 ? t.images[0] : null;
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `${origin}${raw}`;
}
