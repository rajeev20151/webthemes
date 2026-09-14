import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetTemplatesQuery } from "../store/apiSlice";
import SEOHead from "../components/SEOHead";
import { SITE_URL } from "../config/siteConfig";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import HeroHeader from "../components/HeroHeader";
import FilterBar from "../components/FilterBar";
import ResultsHeader from "../components/ResultsHeader";
import DemoCard from "../components/DemoCard";
import DemoListItem from "../components/DemoListItem";
import BottomCta from "../components/BottomCta";
import EmptyState from "../components/EmptyState";

export default function DemoPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: templatesData } = useGetTemplatesQuery();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const origin = API_BASE.replace(/\/api$/, "");
  const raw = templatesData ? (Array.isArray(templatesData) ? templatesData : templatesData.templates ?? []) : [];
  const demos = raw.map((t) => {
    const rawImage = Array.isArray(t.images) && t.images[0] ? t.images[0] : null;
    const image = rawImage ? (rawImage.startsWith("http") ? rawImage : `${origin}${rawImage}`) : null;
    const framework = Array.isArray(t.frameworks) && t.frameworks[0] ? t.frameworks[0].toUpperCase() : "HTML/CSS";
    const previewUrl = t.previewUrl ? `${origin}${t.previewUrl}` : t.link || "";
    return {
      id: t._id,
      slug: t.slug,
      title: t.name || "Untitled",
      category: t.category || t.subtitle || "General",
      type: t.tag || "Multi Page",
      tag: t.price === 0 ? "FREE" : "PRO",
      tech: framework.includes("WORDPRESS") ? "WORDPRESS" : "HTML/CSS",
      image,
      frameworks: Array.isArray(t.frameworks) && t.frameworks.length > 0 ? t.frameworks.join(", ") : "",
      views: t.views ?? t.downloads ?? 0,
      price: t.price ?? 0,
      originalPrice: t.originalPrice ?? 0,
      previewUrl,
    };
  });

  const [category, setCategory] = useState("All");
  const [tech, setTech] = useState("All");
  const [tag, setTag] = useState("All");
  const [type, setType] = useState("All Types");
  const [sort, setSort] = useState("Latest");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [viewMode, setViewMode] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const qFromUrl = searchParams.get("q") || "";
    if (qFromUrl !== search) setSearch(qFromUrl);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      search.trim() ? params.set("q", search) : params.delete("q");
      return params;
    }, { replace: true });
  }, [search]);

  let filtered = demos.filter((d) =>
    (category === "All" || d.category === category) &&
    (tech === "All" || d.tech === tech) &&
    (tag === "All" || d.tag === tag) &&
    (type === "All Types" || d.type === type) &&
    (d.title.toLowerCase().includes(search.toLowerCase()) ||
     d.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (sort === "Most Viewed") filtered = [...filtered].sort((a, b) => b.views - a.views);
  if (sort === "A – Z") filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));

  const clearAll = () => {
    setCategory("All"); setTech("All"); setTag("All"); setType("All Types"); setSort("Latest"); setSearch("");
  };
  const hasActiveFilters = category !== "All" || tech !== "All" || tag !== "All" || type !== "All Types" || search;

  const countFor = (field, val) => demos.filter((d) => d[field] === val).length;

  const ALL_CATEGORIES = ["All", ...new Set(demos.map((d) => d.category).filter(Boolean))];
  const ALL_TECH = ["All", ...new Set(demos.map((d) => d.tech).filter(Boolean))];
  const ALL_TAGS = ["All", ...new Set(demos.map((d) => d.tag).filter(Boolean))];

  return (
    <section className="py-12 sm:py-12 md:py-20 bg-[var(--color5)] min-h-screen">
      <SEOHead
        title={search ? `${search} - Demo Templates` : "Demo Showcase - Live Template Previews"}
        description={search
          ? `Browse live demo previews matching "${search}". Explore ${filtered.length} templates with real interactions and layouts.`
          : "Browse live previews of 1000+ free and premium HTML, React, Vue, and WordPress templates. See real interactions and layouts before you download."}
        url={`${SITE_URL}/demos`}
        noindex={!!search}
      />
      <div className="w-width">
        <BreadCrumb_Nav items={[{ label: "Home", path: "/" }, { label: "Demos", path: "/demos" }]} />

        <HeroHeader search={search} />

        <FilterBar
          search={search} setSearch={setSearch}
          sort={sort} setSort={setSort}
          type={type} setType={setType}
          category={category} setCategory={setCategory}
          tech={tech} setTech={setTech}
          tag={tag} setTag={setTag}
          viewMode={viewMode} setViewMode={setViewMode}
          filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen}
          hasActiveFilters={hasActiveFilters} clearAll={clearAll}
          ALL_CATEGORIES={ALL_CATEGORIES} ALL_TECH={ALL_TECH} ALL_TAGS={ALL_TAGS}
          countFor={countFor} filtered={filtered}
        />

        <ResultsHeader filtered={filtered} category={category} hasActiveFilters={hasActiveFilters} clearAll={clearAll} />

        {filtered.length > 0 ? (
          <>
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {filtered.map((demo) => <DemoCard key={demo.id} demo={demo} />)}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-2.5">
                {filtered.map((demo) => <DemoListItem key={demo.id} demo={demo} />)}
              </div>
            )}

            <BottomCta />
          </>
        ) : (
          <EmptyState clearAll={clearAll} />
        )}
      </div>
    </section>
  );
}
