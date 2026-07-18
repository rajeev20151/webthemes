import Hero from "../sections/Hero";
import Features from "../sections/Features";
import FAQ from "../sections/FAQ";
import PopularTemplates from "../sections/PopularTemplates";
import Reviews from "../sections/Reviews";
import TechScroll from "../sections/TechScroll";
import SEOHead from "../components/SEOHead";

export default function Home(){
   return(
    <>
     <SEOHead
       title="Free & Premium Templates - Download HTML, React, WordPress"
       description="Download free and premium HTML, React, WordPress templates. Browse 1000+ responsive templates for landing pages, portfolios, e-commerce, and more."
       jsonLd={{
         "@context": "https://schema.org",
         "@type": "WebSite",
         "name": "TemplateWorld",
         "url": window.location.origin,
         "potentialAction": {
           "@type": "SearchAction",
           "target": `${window.location.origin}/templates?q={search_term_string}`,
           "query-input": "required name=search_term_string"
         }
       }}
     />
     <Hero />
     <Features />
     <TechScroll />
     <PopularTemplates />
     <Reviews />
    </>
   ) 
}