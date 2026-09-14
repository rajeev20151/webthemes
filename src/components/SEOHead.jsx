import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, seoText } from "../config/siteConfig";

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  url,
  type = "website",
  jsonLd,
  noindex = false,
}) {
  const fullTitle = title ? `${seoText(title)} | ${SITE_NAME}` : SITE_NAME;
  const desc = seoText(description);
  const ogImage = image || DEFAULT_IMAGE;
  const currentUrl = url || `${SITE_URL}${window.location.pathname}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <link rel="canonical" href={currentUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
