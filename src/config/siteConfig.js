/* ---======== Site-wide SEO Config ========---
   Single source of truth — site name / URL / defaults
   yahin change karo, poori app me apply ho jayega */

export const SITE_NAME = import.meta.env.VITE_SITE_NAME || "TemplateWorld";
export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

export const DEFAULT_DESCRIPTION =
  "Download free and premium HTML, React, Vue js, Next js templates. Browse 1000+ responsive templates for landing pages, portfolios, e-commerce, and more.";

export const DEFAULT_IMAGE = "/og-default.jpg";

/* Pages me brand name hardcode karne ki zarurat nahi:
   description="Login to your {site} account"  ->  auto replace */
export const seoText = (text = "") => String(text).replace(/\{site\}/g, SITE_NAME);
