import { Link } from "react-router-dom";
import bgImage from "../assets/images/background5.jpg";

export default function Hero() {

  const images = [
    bgImage,
    bgImage,
    bgImage,
    bgImage,
    bgImage,
    bgImage,
    bgImage,
    bgImage,
  ];

  const duplicatedImages = [...images, ...images];

  return (
    <section className="hero relative ">
    <div className="bg-gray-950/5"  
      id="headlessui-tabs-panel-:ru:"
      role="tabpanel"
      tabIndex="0"
      data-headlessui-state="selected"
      data-selected=""
      aria-labelledby="headlessui-tabs-tab-:ro:">
      <Link className="block h-screen overflow-hidden bg-gray-50 ring ring-gray-950/5 max-sm:h-100"
        href={bgImage}>
        <div className="flex size-full items-center justify-center">
          <div className="size-430 shrink-0 scale-50 sm:scale-75 lg:scale-100 bg-[var(--color5)]">
            <div className="relative top-(--top,30%) right-(--right,54%) grid size-full origin-top-left rotate-x-55 rotate-y-0 -rotate-z-45 grid-cols-4 gap-5 transform-3d">

              {/* Column 1 */}
              <div className="flex flex-col gap-5 animate-col1" style={{ transform: "translateY(750px)" }}>
                {duplicatedImages.map((img, index) => (
                  <img
                    key={`col1-${index}`}
                    src={img}
                    className="aspect-970/580 ring ring-gray-950/5 rounded-2xl"
                    width="970"
                    height="580"
                    alt=""
                  />
                ))}
              </div>

              {/* Column 2 */}
              <div className="flex flex-col gap-5 animate-col2" style={{ transform: "translateY(750px)" }}>
                {duplicatedImages.map((img, index) => (
                  <img
                    key={`col2-${index}`}
                    src={img}
                    className="aspect-970/436 ring ring-gray-950/5 rounded-2xl"
                    width="970"
                    height="436"
                    alt=""
                  />
                ))}
              </div>

              {/* Column 3 */}
              <div className="flex flex-col gap-5 animate-col3" style={{ transform: "translateY(750px)" }}>
                {duplicatedImages.map((img, index) => (
                  <img
                    key={`col3-${index}`}
                    src={img}
                    className="aspect-971/395 ring ring-gray-950/5 rounded-2xl"
                    width="971"
                    height="395"
                    alt=""
                  />
                ))}
              </div>

              {/* Column 4 */}
              <div className="flex flex-col gap-5 animate-col4" style={{ transform: "translateY(1400px)" }}>
                {duplicatedImages.map((img, index) => (
                  <img
                    key={`col4-${index}`}
                    src={img}
                    className="aspect-972/854 ring ring-gray-950/5 rounded-2xl"
                    width="972"
                    height="854"
                    alt=""
                  />
                ))}
              </div>

            </div>
          </div>
        </div>
      </Link>
    </div>
   {/* ------ hero-content ------  */}
   <div className="absolute inset-0 flex items-center justify-center">
   <div className="hero-content w-full sm:px-6 md:px-8 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl 
   xl:max-w-6xl rounded-3xl border border-3 border-[var(--color5)] text-center bg-blur p-8 bg-[var(--color10)]">
   <h1 className="text-[var(--color6)] font-bold fontStyle3 mb-10">Business solutions ready instantly</h1>
   <Link href="" className="group fontStyle7 inline-flex items-center gap-3 pl-8 pr-3 py-3
   bg-[var(--color5)] text-[var(--color6)] rounded-full  shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
   <span className="font-bold">Explore Demos</span>
   <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color6)]
   transition-all duration-300 group-hover:rotate-90">
   <i className="bx bx-up-arrow-alt text-xl text-[var(--color5)]"></i>
   </span>
   </Link>
   </div>
   </div>
    </section>
  );
}
