import { Link } from "react-router-dom";
import CTA from "../sections/CTA";


export default function Footer(){
   return(
      /// ============ footer section =============== ///
      /// ==========================================  ///
      <>
      <CTA />
      <footer className="footer_section py-20 bg-[var(--color6)]">
      <div className="w-width">
         
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="footer_col">
            <div className="mb-6">
              <h3 className="fontStyle5 text-[var(--color5)] font-bold mb-4">TemplateHub</h3>
              <p className="fontStyle8 text-gray-400 leading-relaxed">
                Premium business templates and website solutions ready to deploy instantly. 
                Built for modern businesses and creative professionals.
              </p>
            </div>
         
            <div className="flex gap-3">
              <Link to="#" className="w-10 h-10 rounded-full bg-[var(--color5)] flex items-center justify-center
              hover:bg-[var(--color9)] hover:scale-110 transition-all duration-300 group">
                <i className="bx bxl-facebook text-[var(--color6)] text-xl group-hover:text-[var(--color5)]"></i>
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[var(--color5)] flex items-center justify-center
              hover:bg-[var(--color9)] hover:scale-110 transition-all duration-300 group">
                <i className="bx bxl-twitter text-[var(--color6)] text-xl group-hover:text-[var(--color5)]"></i>
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[var(--color5)] flex items-center justify-center
              hover:bg-[var(--color9)] hover:scale-110 transition-all duration-300 group">
                <i className="bx bxl-instagram text-[var(--color6)] text-xl group-hover:text-[var(--color5)]"></i>
              </Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[var(--color5)] flex items-center justify-center
              hover:bg-[var(--color9)] hover:scale-110 transition-all duration-300 group">
                <i className="bx bxl-linkedin text-[var(--color6)] text-xl group-hover:text-[var(--color5)]"></i>
              </Link>
            </div>
          </div>

          <div className="footer_col">
            <h4 className="fontStyle6 text-[var(--color5)] font-bold mb-6">Templates</h4>
            <ul className="space-y-3">  
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 inline-block  hover:text-[var(--color5)] hover:pl-2 
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
         
          <div className="footer_col">
            <h4 className="fontStyle6 text-[var(--color5)] font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li className="text-gray-400">
                <Link to="about" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">About Us</Link>
              </li>
              <li className="text-gray-400">
                <Link to="PricingPage" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Pricing Plans</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Reviews</Link>
              </li>
              <li className="text-gray-400">
                <Link to="blog" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Blog</Link>
              </li>
              <li className="text-gray-400">
                <Link to="#" className="fontStyle8 hover:text-[var(--color5)] hover:pl-2 
                transition-all duration-300 inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer_col">
            <h4 className="fontStyle6 text-[var(--color5)] font-bold mb-6">Stay Updated</h4>
            <p className="fontStyle8 text-gray-400 mb-4">
              Subscribe to get updates about new templates and exclusive offers.
            </p>
            
            <div className="newsletter_form">
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 px-4 py-3 rounded-full  bg-[var(--color9)] text-[var(--color5)] fontStyle8
                border-2 focus:border-[var(--color5)] focus:border-[var(--color5)] !placeholder:text-[var(--color4)] outline-none transition-all duration-300" />
                <button className="w-12 h-12 rounded-full bg-[var(--color5)] !flex items-center justify-center
                hover:scale-110 transition-all duration-300 flex-shrink-0">
                  <i className="bx bx-right-arrow-alt text-[var(--color6)] text-2xl"></i>
                </button>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="fontStyle7 text-[var(--color5)] font-semibold mb-3">Support</h5>
              <ul className="space-y-2">
                {/* <li className="text-gray-400">
                  <Link to="#" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Help Center</Link>
                </li> */}
                <li className="text-gray-400">
                  <Link to="#" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Documentation</Link>
                </li>
                <li className="text-gray-400">
                  <Link to="#" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Terms of Service</Link>
                </li>
                <li className="text-gray-400">
                  <Link to="#" className="fontStyle8 hover:text-[var(--color5)] 
                  transition-colors duration-300">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t-2 border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="fontStyle8 text-gray-400 text-center md:text-left">
              © 2026 TemplateHub. All rights reserved. Crafted with <span className="text-red-500">♥</span> for developers.
            </p>
            <div className="flex gap-6 text-gray-400 hover:text-[var(--color5)] 
              transition-colors duration-300">
              <Link to="#" className="fontStyle8 ">Privacy</Link>
              <Link to="#" className="fontStyle8 text-gray-400 hover:text-[var(--color5)] 
              transition-colors duration-300">Terms</Link>
              <Link to="#" className="fontStyle8 text-gray-400 hover:text-[var(--color5)] 
              transition-colors duration-300">Cookies</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
    </>
   ) 
}