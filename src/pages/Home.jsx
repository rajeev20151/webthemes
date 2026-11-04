import Hero from "../sections/Hero";
import Features from "../sections/Features";
import Stats from "../sections/Stats";
import FAQ from "../sections/FAQ";
import PopularTemplates from "../sections/PopularTemplates";
import TemplateSlider from "../sections/TemplateSlider";
import Reviews from "../sections/Reviews";
import TechScroll from "../sections/TechScroll";
import SEOHead from "../components/SEOHead";
import { SITE_NAME, SITE_URL } from "../config/siteConfig";

export default function Home(){
   return(
    <>
     <SEOHead
       title="Free & Premium Templates - Download HTML, React, Next.js Templates"
       description="Download free and premium HTML, React, Next.js, Vue js templates. Browse responsive templates for landing pages, portfolios, e-commerce, and more."
       jsonLd={{
         "@context": "https://schema.org",
         "@type": "WebSite",
         "name": SITE_NAME, 
         "url": SITE_URL,
         "potentialAction": {
           "@type": "SearchAction",
           "target": `${SITE_URL}/templates?q={search_term_string}`,
           "query-input": "required name=search_term_string"
         }
       }}
     />
     <Hero />
      <Features />
      <TechScroll />
      <PopularTemplates />
      <TemplateSlider />
      {/* <Stats /> */}
     <Reviews />
    </>
   ) 
}