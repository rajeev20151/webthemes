import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useMemo,useRef} from "react";

import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import { SITE_NAME } from "../config/siteConfig";
import ReviewsSection from "../components/ReviewsSection";
import ChatSection from "../components/ChatSection";
import StarRating from "../components/StarRating";
import ImageGallery from "../components/ImageGallery";
import ImagePopup from "../components/ImagePopup";
import StickyMobileBar from "../components/StickyMobileBar";
import MobileThemeInfo from "../components/MobileThemeInfo";
import RelatedProducts from "../components/RelatedProducts";
import ThemeSidebar from "../components/ThemeSidebar";

import { useGetTemplateQuery, useGetTemplateReviewsQuery, useGetRelatedTemplatesQuery, useIncrementViewsMutation, API_URL as API_BASE } from "../store/apiSlice";
import { imgUrl } from "../utils/themeHelpers";

export default function Themes() {
  const { slug } = useParams();

  const { data: templateData, isLoading: themeLoading } = useGetTemplateQuery(slug, { skip: !slug });
  const theme = templateData?.template || null;

  const [activeImage, setActiveImage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [email, setEmail] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  const [incrementViews] = useIncrementViewsMutation();

const imageScrollRef = useRef(null);

useEffect(() => {
  if (imageScrollRef.current) {
    imageScrollRef.current.scrollTop = 0;
  }
}, [activeImage]);

  useEffect(() => {
    if (theme?._id) {
      const viewed = JSON.parse(localStorage.getItem("viewedTemplates") || "[]");
      if (!viewed.includes(theme._id)) {
        incrementViews(theme._id);
        localStorage.setItem("viewedTemplates", JSON.stringify([...viewed, theme._id]));
      }
    }
  }, [theme?._id]);

  const { data: reviewsData } = useGetTemplateReviewsQuery(theme?._id, { skip: !theme?._id });

  useEffect(() => {
    if (reviewsData?.stats?.total !== undefined) setReviewCount(reviewsData.stats.total);
  }, [reviewsData]);

  // Fetch related templates by category (max 6) — NOT all templates
  const { data: relatedData, isLoading: relatedLoading } = useGetRelatedTemplatesQuery(
    { category: theme?.category || "", excludeId: theme?._id, limit: 6 },
    { skip: !theme?.category || !theme?._id }
  );
  const relatedProducts = useMemo(() => {
    const list = relatedData?.templates ?? [];
    return list.map((t) => ({
      id: t._id,
      slug: t.slug,
      title: t.name || t.title || "Untitled",
      price: t.price === 0 ? "Free" : `$${t.price}`,
      purchases: t.downloads || 0,
      downloads: t.downloads || 0,
      rating: t.rating || 0,
      reviews: t.reviews || 0,
      image: t.images?.[0]
        ? t.images[0].startsWith("http") ? t.images[0] : `${API_BASE.replace(/\/api\/?$/, "")}${t.images[0]}`
        : "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    }));
  }, [relatedData]);

  // Editor picks — use first 3 from related (already sorted by downloads)
  const editorPicks = useMemo(() => {
    return relatedProducts.slice(0, 3).map((t) => ({
      ...t,
      badge: "TEMPLATE",
      badgeCls: t.price === "Free" ? "bg-green-500" : "bg-violet-700",
    }));
  }, [relatedProducts]);

  useEffect(() => {
    if (!showPopup) return;
    const images = theme?.images || [];
    const handleKey = (e) => {
      if (e.key === "Escape") setShowPopup(false);
      if (e.key === "ArrowLeft") setActiveImage((p) => (p - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveImage((p) => (p + 1) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showPopup, theme?.images]);

  if (themeLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color5)]">
      <p className="fontStyle9 text-[var(--color4)]">Loading...</p>
    </div>
  );
if (!theme) return (
  <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-[var(--color5)] px-5 py-12 sm:py-16">
    <div className="pointer-events-none absolute -left-32 -top-24 h-80 w-80 rounded-full bg-[var(--color6)]/5 blur-[100px]" />
    <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[var(--color6)]/5 blur-[110px]" />
    <div className="relative grid w-full max-w-4xl overflow-hidden rounded-3xl border border-[var(--color6)]/10 bg-[var(--color11)] shadow-2xl shadow-[var(--color6)]/10 md:grid-cols-[0.85fr_1.15fr]">
      <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden p-8 text-white sm:min-h-72 md:min-h-[28rem]" style={{ background: "var(--color3)" }}>
        <span className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/20" />
        <span className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full border border-white/15" />
        <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 shadow-lg backdrop-blur-sm">
          <i className="bx bx-file-blank text-3xl" />
        </div>
        <span className="relative text-[clamp(5rem,13vw,8rem)] font-black leading-none tracking-[-0.08em]">404</span>
        <span className="relative mt-3 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 fontStyle10 font-semibold uppercase tracking-[0.2em]">Page not found</span>
      </div>
      <div className="flex flex-col items-center justify-center px-7 py-10 text-center sm:px-12 md:items-start md:text-left">
        <span className="mb-4 fontStyle10 font-bold uppercase tracking-[0.18em] text-[var(--color4)]">The link may be outdated</span>
        <h1 className="fontStyle4 mb-4 text-2xl font-bold tracking-tight text-[var(--color6)] sm:text-3xl">Template not found</h1>
        <p className="fontStyle9 mb-8 max-w-md leading-7 text-[var(--color4)]">This template may have been removed or the link may be incorrect. Browse the collection to find another one.</p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row md:justify-start">
          <Link to="/templates" style={{ background: "var(--color3)" }} className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl px-5 py-3 fontStyle9 font-semibold text-white shadow-lg shadow-[var(--color6)]/15 transition-all hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color6)]/20">
            Browse templates <i className="bx bx-right-arrow-alt text-xl transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[var(--color6)]/15 px-5 py-3 fontStyle9 font-semibold text-[var(--color6)] transition-colors hover:bg-[var(--color6)]/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color6)]/15">
            <i className="bx bx-home-alt text-lg" /> Go home
          </Link>
        </div>
      </div>
    </div>
  </div>
);

  const resolvedImages = (theme.images || []).map(imgUrl);
  const isFree = !theme.price || theme.price === 0;

  const resolvedPreviewUrl = theme.previewUrl
    ? `${API_BASE.replace(/\/api\/?$/, "")}${theme.previewUrl}`
    : theme.link || "";

  const resolvedDownloadUrl = theme.zipFile
    ? `${API_BASE.replace(/\/api\/?$/, "")}${theme.zipFile}`
    : "";

  const templateImage = resolvedImages[0] || "";

  return (
    <>
      <section className="pb-16 bg-[var(--color5)] min-h-screen">
        <SEOHead
          title={theme.name}
          description={theme.description || `${theme.name} - Free template download. ${theme.category || ""} category.`}
          image={templateImage}
          type="product"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": theme.name,
            "description": theme.description || theme.name,
            "image": templateImage,
            "category": theme.category,
            "brand": { "@type": "Organization", "name": SITE_NAME },
            "offers": {
              "@type": "Offer",
              "price": theme.price || 0,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": theme.rating ? {
              "@type": "AggregateRating",
              "ratingValue": theme.rating,
              "reviewCount": reviewCount || 1
            } : undefined
          }}
        />

        <StickyMobileBar
          theme={theme}
          isFree={isFree}
          resolvedDownloadUrl={resolvedDownloadUrl}
          resolvedPreviewUrl={resolvedPreviewUrl}
        />

        <div className="w-width py-10 sm:py-12 md:py-20">
          <BreadCrumb_Nav
            items={[
              { label: "Home", path: "/" },
              { label: "Templates", path: "/templates" },
              { label: "Templates-Details", path: `/template/${slug}` },
            ]}
          />

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-5">
            <div className="w-full lg:flex-1 min-w-0 flex flex-col lg:block">
              <h1 className="fontStyle5 font-bold text-[var(--color6)] mb-4 sm:mb-5 leading-tight tracking-tight order-1">
                {theme.name}
              </h1>

              <div className="order-2">
                <ImageGallery
                  resolvedImages={resolvedImages}
                  activeImage={activeImage}
                  setActiveImage={setActiveImage}
                  setShowPopup={setShowPopup}
                  isFree={isFree}
                  price={theme.price}
                  downloads={theme.downloads}
                  imageScrollRef={imageScrollRef}
                />
              </div>

              <div className="flex items-center gap-3 mb-5 order-3">
                <StarRating rating={theme.rating || 0} />
                <Link to="#reviews" className="fontStyle9 text-[var(--color4)] hover:text-[var(--color6)] transition-colors duration-200 underline-offset-2 hover:underline">
                  {reviewCount} customers reviews
                </Link>
              </div>

              <div className="order-4">
                <MobileThemeInfo
                  theme={theme}
                  isFree={isFree}
                  resolvedPreviewUrl={resolvedPreviewUrl}
                  resolvedDownloadUrl={resolvedDownloadUrl}
                  email={email}
                  setEmail={setEmail}
                />
              </div>

              <div className="order-5 mt-6 lg:mt-0 border-b border-[var(--color6)]/10 mb-6 flex gap-4 sm:gap-6">
                {["description", "reviews", "discussion"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 fontStyle8 font-semibold capitalize transition-all duration-200 border-b-2 -mb-px ${activeTab === tab ? "border-[var(--color6)] text-[var(--color6)]" : "border-transparent text-[var(--color4)] hover:text-[var(--color6)] hover:border-[var(--color6)]/30"}`}
                  >
                    {tab === "reviews" ? `Reviews (${reviewCount})` : tab === "discussion" ? "Discussion" : "Description"}
                  </button>
                ))}
              </div>

              {activeTab === "description" && (
                <div className="space-y-6 sm:space-y-8 order-6">
                  <p className="fontStyle6 text-[var(--color6)] font-bold leading-relaxed">
                    {theme.subtitle || theme.name}
                  </p>

                  <p className="fontStyle9 text-[var(--color8)] leading-relaxed">
                    {theme.description}
                  </p>

                  {(theme.keyFeatures || []).length > 0 && (
                    <div>
                      <h2 className="fontStyle6 font-bold text-[var(--color6)] mb-4 flex items-center gap-2">
                        <i className="bx bx-check-circle text-[var(--color3)] text-xl"></i>
                        Key Features
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(theme.keyFeatures || []).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2.5 fontStyle8 text-[var(--color8)] rounded-xl px-3.5 py-2.5 bg-[var(--color6)]/[0.03] border border-[var(--color6)]/[0.06] hover:border-[var(--color3)]/30 hover:bg-[var(--color3)]/[0.04] transition-all duration-200">
                            <span className="w-5 h-5 rounded-full bg-[var(--color3)]/10 flex items-center justify-center flex-shrink-0">
                              <i className="bx bx-check text-[var(--color3)] text-xs"></i>
                            </span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(theme.inTheBox || []).length > 0 && (
                    <div>
                      <h2 className="fontStyle6 font-bold text-[var(--color6)] mb-4">In The Box</h2>
                      <div className="space-y-2">
                        {(theme.inTheBox || []).map((item, i) => (
                          <div key={i} className="flex items-center gap-2.5 fontStyle8 text-[var(--color8)]">
                            <i className="bx bx-check-circle text-[var(--color6)] opacity-60 text-base flex-shrink-0"></i>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(theme.libraries || []).length > 0 && (
                    <div>
                      <h2 className="fontStyle6 font-bold text-[var(--color6)] mb-4">Library & Plugins</h2>
                      <div className="space-y-2">
                        {(theme.libraries || []).map((lib, i) => (
                          <div key={i} className="flex items-center gap-2.5 fontStyle8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color6)] flex-shrink-0 opacity-60"></span>
                            <Link to="#" className="text-blue-500 hover:text-blue-600 hover:underline transition-colors duration-200">{lib}</Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="order-6">
                  <ReviewsSection onCountChange={setReviewCount} templateId={theme?._id} />
                </div>
              )}

              {activeTab === "discussion" && (
                <div className="order-6">
                  <ChatSection templateId={theme?._id} />
                </div>
              )}

              <div className="order-7">
                <RelatedProducts relatedProducts={relatedProducts} />
              </div>
            </div>

            <ThemeSidebar
              theme={theme}
              isFree={isFree}
              resolvedPreviewUrl={resolvedPreviewUrl}
              resolvedDownloadUrl={resolvedDownloadUrl}
              editorPicks={editorPicks}
              editorPicksLoading={relatedLoading}
              email={email}
              setEmail={setEmail}
            />
          </div>
        </div>
      </section>

      <ImagePopup
        showPopup={showPopup}
        resolvedImages={resolvedImages}
        activeImage={activeImage}
        setActiveImage={setActiveImage}
        setShowPopup={setShowPopup}
      />
    </>
  );
}
