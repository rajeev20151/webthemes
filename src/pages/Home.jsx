import Hero from "../sections/Hero";
import Features from "../sections/Features";
import FAQ from "../sections/FAQ";
import PopularTemplates from "../sections/PopularTemplates";
import Reviews from "../sections/Reviews";
import TechScroll from "../sections/TechScroll";

export default function Home(){
   return(
    <>
     <Hero />
     <Features />
     <TechScroll />
     <PopularTemplates />
     <Reviews />
    </>
   ) 
}