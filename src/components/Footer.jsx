import { useState } from "react";
import { Link } from "react-router-dom";
import CTA from "../sections/CTA";
import { useGetContentsQuery, useSubscribeNewsletterMutation } from "../store/apiSlice";


export default function Footer(){
  
  const { data: contentsData } = useGetContentsQuery();
  const contents = contentsData?.success && contentsData?.contents?.length > 0 ? contentsData.contents[0] : null;

  const [subscribe, { isLoading }] = useSubscribeNewsletterMutation();
  const [footerEmail, setFooterEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleFooterSubscribe = async (e) => {
    e.preventDefault();
    if (!footerEmail || !footerEmail.trim()) {
      setStatus("error");
      setMessage("Please enter your email");
      return;
    }
    try {
      const res = await subscribe({ email: footerEmail.trim() }).unwrap();
      setStatus("success");
      setMessage(res.message || "Subscribed successfully!");
      setFooterEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err?.data?.message || "Something went wrong");
    }
    setTimeout(() => { setStatus(null); setMessage(""); }, 3000);
  };

   return(
      /// ============ footer section =============== ///
      /// ==========================================  ///
      <>
      <CTA />
      <footer className="footer_section py-12 sm:py-16 md:py-20 bg-[var(--color6)]">
      <div className="w-width px-4 sm:px-6 lg:px-1">
         
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-14 md:mb-16">
          
          {/* Col 1 - Brand + Social */}
          <div className="footer_col">
            <div className="mb-5 sm:mb-6">
              <h3 className="fontStyle5 text-[var(--color5)] font-bold mb-3 sm:mb-4">TemplateHub</h3>
              <p className="fontStyle8 text-gray-400 leading-relaxed text-sm sm:text-base">
                Premium business templates and website solutions ready to deploy instantly. 
                Built for modern businesses and creative professionals.
              </p>
            </div>
         
            <div className="flex gap-3 flex-wrap">
            {contents?.socialLinks?.map((social) => (
            <a
            key={social._id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color5)] flex items-center justify-center
            hover:bg-[var(--color9)] hover:scale-110 transition-all duration-300 group"
            >
            <i
            className={`bx bxl-${social.platform} text-[var(--color6)] text-lg sm:text-xl group-hover:text-[var(--color5)]`}
            ></i>
            </a>
            ))}
            </div>
          </div>

          {/* Col 2 - Templates */}
          <div className="footer_col">
            <h4 className="fontStyle6 text-[var(--color5)] font-bold mb-4 sm:mb-6">Templates</h4>
            <ul className="space-y-2 sm:space-y-3">  
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 inline-block hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300">Business Websites</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">E-commerce Stores</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Portfolio Sites</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Landing Pages</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Admin Dashboards</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">SaaS Templates</Link>
              </li>
            </ul>
          </div>
         
          {/* Col 3 - Company */}
          <div className="footer_col">
            <h4 className="fontStyle6 text-[var(--color5)] font-bold mb-4 sm:mb-6">Company</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="text-gray-400">
                <Link to="about" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">About Us</Link>
              </li>
              {/* <li className="text-gray-400">
                <Link to="PricingPage" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Pricing Plans</Link>
              </li> */}
              <li className="text-gray-400">
                <Link to="demo" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Reviews</Link>
              </li>
              <li className="text-gray-400">
                <Link to="blog" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Blog</Link>
              </li>
              <li className="text-gray-400">
                <Link to="contact" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 - Newsletter + Support */}
          <div className="footer_col sm:col-span-2 lg:col-span-1">
            <h4 className="fontStyle6 text-[var(--color5)] font-bold mb-4 sm:mb-6">Stay Updated</h4>
            <p className="fontStyle8 text-gray-400 mb-4 text-sm sm:text-base">
              Subscribe to get updates about new templates and exclusive offers.
            </p>
            
            <form onSubmit={handleFooterSubscribe} className="flex items-center gap-2 max-w-sm lg:max-w-full bg-[var(--color9)] border-2 border-[var(--color5)] rounded-full p-1">
            <input 
            type="email" 
            placeholder="Your email" 
            value={footerEmail}
            onChange={(e) => setFooterEmail(e.target.value)}
            className="flex-1 min-w-0 px-4 py-2.5 bg-transparent text-[var(--color5)] fontStyle8
            border-none placeholder:text-gray-400 outline-none text-sm sm:text-base" 
            />
            <button type="submit" disabled={isLoading} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--color5)] flex items-center justify-center
            hover:scale-110 transition-all duration-300 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed">
            <i className={`bx ${isLoading ? 'bx-loader-alt bx-spin' : 'bx-right-arrow-alt'} text-[var(--color6)] text-xl sm:text-2xl`}></i>
            </button>
            </form>
            {status && (
              <p className={`fontStyle10 text-center mt-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}>
                {message}
              </p>
            )}
            
            <div className="mt-5 sm:mt-6">
              <h5 className="fontStyle7 text-[var(--color5)] font-semibold mb-2 sm:mb-3">Support</h5>
              <ul className="space-y-1.5 sm:space-y-2">
                <li className="text-gray-400">
                  <Link to="#" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Documentation</Link>
                </li>
                <li className="text-gray-400">
                  <Link to="#" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Terms of Service</Link>
                </li>
                <li className="text-gray-400">
                  <Link to="privacy-policy" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t-2 border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="fontStyle8 text-gray-400 text-center sm:text-left text-sm sm:text-base">
              {contents?.copyrightText}
            </p>
            <div className="flex gap-4 sm:gap-6">
              <Link to="#" className="fontStyle8 text-gray-400 hover:text-[var(--color5)] 
                transition-colors duration-300 text-sm sm:text-base">Privacy</Link>
              <Link to="#" className="fontStyle8 text-gray-400 hover:text-[var(--color5)] 
              transition-colors duration-300 text-sm sm:text-base">Terms</Link>
              <Link to="#" className="fontStyle8 text-gray-400 hover:text-[var(--color5)] 
              transition-colors duration-300 text-sm sm:text-base">Cookies</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
    </>
   ) 
}