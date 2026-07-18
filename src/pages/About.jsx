import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import BreadCrumb_Nav from "../components/BreadCrumb_Nav";
import SEOHead from "../components/SEOHead";
import FAQ from "../sections/FAQ";
import { getContentsAPI } from "../services/api";

export default function About(){
  
  const [contents, setContents] = useState(null);
   
  useEffect(() => {
  const fetchContent = async () => {
  try {
  const res = await getContentsAPI();
  if (res.success && res.contents.length > 0) {
  setContents(res.contents[0]);
  }
  } catch (err) {
  console.error(err);
  }
  };

  fetchContent();
  }, []);

   return(
    ///-========= about hero section - UNIQUE DESIGN ======///
    ///====================================================///
  <>
    <SEOHead title="About Us" description="Learn about TemplateWorld - your trusted source for free and premium website templates." />
    <section className="about_hero bg-[var(--color5)] py-12 sm:py-12 md:py-20">
      <div className="w-width">
        {/* -----  Breadcrumb-Navigation ----- */}
        <BreadCrumb_Nav
        items={[
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        ]}/>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="mb-6">
              <span className="inline-block px-5 py-1 bg-[var(--color6)] text-[var(--color5)] rounded-full fontStyle8 font-semibold">
                ABOUT US
              </span>
            </div>
            <h1 className="fontStyle3 text-[var(--color6)] font-bold mb-6 leading-tight">
              {contents?.title}
            </h1>
            <p className="fontStyle6 text-[var(--color8)] mb-8 leading-relaxed">
              {contents?.description}
            </p>

            <div className="mt-10">
            <Link to={contents?.buttonLink} className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 
            bg-[var(--color6)]  rounded-full  shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span className="text-[var(--color5)]">{contents?.buttonText}</span>
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)]
            transition-all duration-300 group-hover:rotate-90">
            <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
            </span>
            </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 p-8 border-[2px] border-[var(--color6)] bg-[var(--color5)] rounded-3xl
            shadow-[12px_12px_0px_var(--color6)]">
              
              <div className="grid grid-cols-3 gap-6">
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-code-alt text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-palette text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-rocket text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-diamond text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-heart text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-trophy text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-world text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-bulb text-white text-5xl"></i>
                </div>
                <div className="aspect-square bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <i className="bx bx-star text-white text-5xl"></i>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[var(--color6)] text-[var(--color5)] px-6 py-3 rounded-full
              shadow-lg fontStyle8 font-bold">
                {new Date().getFullYear()} Features
              </div>
            </div>
         
            <div className="absolute top-8 left-8 w-full h-full border-[2px] border-[var(--color6)] rounded-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
    <FAQ />
    </>
   ) 
}