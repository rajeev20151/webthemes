import { Link } from "react-router-dom";
import logo from "../assets/icons/logo.png";
import { useState, useEffect } from "react";

export default function Navbar() {

  const [changeMode, setChangeMode] = useState(false);

  // Load saved mode on refresh
  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode === "dark") {
      document.body.classList.add("dark");
      setChangeMode(true);
    }
  }, []);

  const toggleMode = () => {
    if (changeMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    setChangeMode(!changeMode);
  };

  return (
    <header className="header bg-[var(--color5)]">
      <div className="w-width">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="logo"><Link to="/" className="fontStyle5 font-bold">
          <img src={logo} alt="" className="w-17" />
          </Link></div>

          {/* Navigation Menu */}
          <nav className="nav_bar">
            <ul className="flex gap-10 fontStyle8 text-[var(--color6)]">
              <li><Link to="/" className="hover:opacity-70 transition duration-300">Home</Link></li>
              <li><Link to="/templates" className="hover:opacity-70 transition duration-300">Templates</Link></li>
              <li><Link to="/PricingPage" className="hover:opacity-70 transition duration-300">Pricing</Link></li>
              <li><Link to="/demos" className="hover:opacity-70 transition duration-300">Demos</Link></li>
              <li><Link to="/reviews" className="hover:opacity-70 transition duration-300">Reviews</Link></li>
              <li><Link to="/blog" className="hover:opacity-70 transition duration-300">Blog</Link></li>
              <li><Link to="/contact" className="hover:opacity-70 transition duration-300">Contact</Link></li>
            </ul>
          </nav>

          {/* Login / Signup */}
          <div className="login_sign flex gap-6 items-center">
            <div className="flex gap-6 items-center">
            <Link to="/login" className="fontStyle8 hover:opacity-70 transition duration-300 text-[var(--color6)]">Log In</Link>
            <Link to="/signup" className="fontStyle8 bg-[var(--color6)] text-[var(--color5)] px-5 py-2 rounded-full hover:opacity-90 transition duration-300">Sign Up</Link>
            </div>

            <div onClick={toggleMode} className="cursor-pointer text-2xl text-[var(--color6)]">
            <i className={`bx ${changeMode ? "bx-moon" : "bx-sun"}`}></i>
            </div>
          </div>
          
        </div>
      </div>
    </header>
  );
}
