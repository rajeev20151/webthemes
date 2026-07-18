import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContentsAPI } from "../services/api";

export default function CTA(){
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
     /// =========  cta-section ============ ///
    /// ==================================== ///
    <section className="py-20 bg-[var(--color6)]">
      <div className="w-width text-center">
        <h2 className="fontStyle3 text-[var(--color5)] font-bold mb-6">
          {contents?.footerText}
        </h2>
        <p className="fontStyle6 text-gray-400 mb-10 max-w-2xl mx-auto">
          Join 57,000+ satisfied customers who have built amazing websites with our templates
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/demo" className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 text-[var(--color6)]
        bg-[var(--color5)] rounded-full  shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <span className="font-bold">Explore Demos</span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color6)]
        transition-all duration-300 group-hover:rotate-90">
        <i className="bx bx-up-arrow-alt text-xl text-[var(--color5)]"></i>
        </span>
        </Link>
        </div>
      </div>
    </section>
   ) 
}