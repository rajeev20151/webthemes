import { Helmet } from "react-helmet-async";

const SITE_NAME = import.meta.env.VITE_SITE_NAME || "TemplateWorld";
const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

const DEFAULT_DESCRIPTION =
  "Download free and premium HTML, React, Vue js, Next js templates. Browse 1000+ responsive templates for landing pages, portfolios, e-commerce, and more.";

const DEFAULT_IMAGE = "/og-default.jpg";

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = "website",
  jsonLd,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const ogImage = image || DEFAULT_IMAGE;
  const currentUrl = url || `${SITE_URL}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <link rel="canonical" href={currentUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}