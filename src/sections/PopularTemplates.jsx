import { Link } from "react-router-dom"


export default function PopularTemplates(){
   return(
    /// ========= templates section ========= ///
    /// ==================================== ///
    <section className="py-20">
      <div className="w-width">
      <div className="text-center mb-16">
      <h2 className="fontStyle4 text-[var(--color6)] font-bold">Pre-created website layouts</h2>
      </div> 

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        <div className="group cursor-pointer bg-[var(--color5)] rounded-2xl">
        <div className="p-4 border-[2px] border-[var(--color6)] rounded-2xl text-center 
        shadow-[8px_8px_0px_var(--color6)] hover:shadow-[3px_3px_0px_var(--color6)] transition-all duration-300">  
        <div className="relative overflow-hidden rounded-2xl mb-5 aspect-[4/5] bg-gray-100">
        <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop" 
        alt="Aupale Vodka" 
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
        <Link href="#" 
        className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black hover:bg-black hover:!text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
        <i className="bx bx-link-external text-2xl text-inherit"></i></Link>
        <Link href="#" 
        className="w-14 h-14 bg-white rounded-full flex items-center justify-center 
        text-black hover:bg-black hover:!text-white 
        transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 delay-75">
        <i className="bx bx-heart text-2xl text-inherit"></i></Link>
        </div>
        <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full fontStyle10 font-semibold uppercase tracking-wider">Website</span>
        </div>
        </div>

          <div className="space-y-2 flex items-center justify-between">
            <h3 className="fontStyle6 text-[var(--color6)] font-bold group-hover:text-gray-600 transition-colors duration-300"><a href="">Aupale Vodka</a></h3>
            <div className="flex items-center gap-3 fontStyle8 text-gray-600">
               {/* <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <span className="font-semibold text-black">Locomotive</span>
                <span className="bg-[var(--color9)] px-2 py-0.5 rounded text-xs font-semibold">PRO</span>
              </div>  */}
            </div>
          </div>
          </div>
        </div>
   

      </div>
      </div>
    
      <div className="mt-20 text-center">
       <Link href="" className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3 
        bg-[var(--color6)]  rounded-full  shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
        <span className="text-[var(--color5)]">View More Template</span>
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color5)]
        transition-all duration-300 group-hover:rotate-90">
        <i className="bx bx-up-arrow-alt text-xl text-[var(--color6)]"></i>
        </span>
        </Link>
      </div>
    </section>
   ) 
}