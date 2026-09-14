import { Link } from "react-router-dom";
import { useGetContentsQuery, useGetTemplatesQuery } from "../store/apiSlice";
import { imgUrl } from "../utils/themeHelpers";

export default function Hero() {

  const { data: contentsData, isLoading } = useGetContentsQuery();
  const contents = contentsData?.contents?.[0] || null;

  const { data: templatesData } = useGetTemplatesQuery();
  const templates = templatesData?.templates || [];

  const heroImages = templates
    .slice(0, 10)
    .map((t) => imgUrl(t.images?.[0]))
    .filter(Boolean);

  const duplicatedImages = [...heroImages, ...heroImages];

  return (
    <section className="hero relative ">
    <div id="headlessui-tabs-panel-:ru:"
      role="tabpanel"
      tabIndex="0"
      data-headlessui-state="selected"
      data-selected=""
      aria-labelledby="headlessui-tabs-tab-:ro:">
      <Link className="block h-[70vh] sm:h-[50vh] md:h-[50vh] lg:h-[80vh] xl:h-screen overflow-hidden bg-gray-50 ring max-sm:h-100"
      >
        <div className="flex size-full items-center justify-center">
          <div className="size-530 shrink-0 scale-50 sm:scale-75 lg:scale-100 bg-[var(--color5)]">
            <div className="relative top-(--top,30%) right-(--right,54%) grid size-full origin-top-left rotate-x-55 rotate-y-0 -rotate-z-45 grid-cols-4 gap-5 transform-3d">

              {/* Column 1 */}
              <div className="flex flex-col gap-5 animate-col1" style={{ transform: "translateY(750px)" }}>
                {duplicatedImages.map((img, index) => (
                  <img
                    key={`col1-${index}`}
                    src={img}
                    className="w-full aspect-[970/580] object-cover object-top ring rounded-2xl"
                    width="970"
                    height="580"
                    loading="lazy"
                    decoding="async"
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
                    className="w-full aspect-[970/580] object-cover object-top ring rounded-2xl"
                    width="970"
                    height="436"
                    loading="lazy"
                    decoding="async"
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
                    className="w-full aspect-[970/580] object-cover object-top ring rounded-2xl"
                    width="971"
                    height="395"
                    loading="lazy"
                    decoding="async"
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
                    className="w-full aspect-[970/580] object-cover object-top ring rounded-2xl"
                    width="972"
                    height="854"
                    loading="lazy"
                    decoding="async"
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
  {/* hero content */}

      <div className="absolute inset-0 flex items-center justify-center px-4">

        <div className="hero-content w-full sm:px-6 md:px-8 max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-6xl 
        rounded-3xl border border-3 border-[var(--color5)] text-center bg-blur p-6 sm:p-8 bg-[var(--color10)]">

          {isLoading ? (
            <div
              aria-hidden="true"
              className="h-[38px] sm:h-[46px] md:h-[58px] w-2/3 sm:w-1/2 mx-auto rounded-xl bg-[var(--color6)]/10 animate-pulse mb-8 sm:mb-10"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-[var(--color6)] font-bold fontStyle3 mb-8 sm:mb-10">
              {contents?.title}
            </h1>
          )}
  
          <Link
            to="/demo"
            className="group fontStyle7 inline-flex items-center gap-3 pl-6 sm:pl-8 pr-3 py-3
            bg-[var(--color5)] text-[var(--color6)] rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >

            <span className="font-bold">Explore Demos</span>

            <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color6)]
            transition-all duration-300 group-hover:rotate-90">

              <i className="bx bx-up-arrow-alt text-xl text-[var(--color5)]"></i>

            </span>

          </Link>

        </div>

      </div>

    </section>
  );
}
