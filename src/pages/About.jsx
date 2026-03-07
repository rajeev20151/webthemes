import { Link } from "react-router-dom"
import BreadCrumb_Nav from "../components/BreadCrumb_Nav"


export default function About(){
   return(
    ///-========= about hero section - UNIQUE DESIGN ======///
    ///====================================================///

    <section class="about_hero bg-[var(--color5)] py-20">
      <div class="w-width">
        {/* -----  Breadcrumb-Navigation ----- */}
        <BreadCrumb_Nav
        items={[
        { label: "Home", path: "/" },
        { label: "About", path: "/about" },
        ]}/>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="mb-6">
              <span class="inline-block px-6 py-2 bg-[var(--color6)] text-[var(--color5)] rounded-full fontStyle8 font-semibold">
                ABOUT US
              </span>
            </div>
            <h1 class="fontStyle3 text-[var(--color6)] font-bold mb-6 leading-tight">
              We Build Digital<br />Excellence
            </h1>
            <p class="fontStyle6 text-[var(--color8)] mb-8 leading-relaxed">
              Since 2020, we've been empowering businesses worldwide with premium templates 
              that combine stunning design with powerful functionality.
            </p>

            <div class="mt-10">
            <Link href="" class="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 
            bg-[var(--color6)]  rounded-full  shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <span class="text-[var(--color5)]">View More Template</span>
            <span class="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)]
            transition-all duration-300 group-hover:rotate-90">
            <i class="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
            </span>
            </Link>
            </div>
          </div>

          <div class="relative">
            <div class="relative z-10 p-8 border-[2px] border-[var(--color6)] bg-[var(--color5)] rounded-3xl
            shadow-[12px_12px_0px_var(--color6)]">
              
              <div class="grid grid-cols-3 gap-6">
                <div class="aspect-square bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-code-alt text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-palette text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-rocket text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-yellow-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-diamond text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-heart text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-trophy text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-world text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-bulb text-white text-5xl"></i>
                </div>
                <div class="aspect-square bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <i class="bx bx-star text-white text-5xl"></i>
                </div>
              </div>
              <div class="absolute -top-4 -right-4 bg-[var(--color6)] text-[var(--color5)] px-6 py-3 rounded-full
              shadow-lg fontStyle8 font-bold">
                Since 2020
              </div>
            </div>
         
            <div class="absolute top-8 left-8 w-full h-full border-[2px] border-[var(--color6)] rounded-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
   ) 
}