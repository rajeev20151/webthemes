export default function ImageGallery({ resolvedImages, activeImage, setActiveImage, setShowPopup, isFree, price, downloads }) {
  return (
    <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border-2 border-[var(--color6)]/10 bg-[var(--color11)] shadow-lg shadow-black/5">
      <div className="relative overflow-hidden aspect-video">
  {resolvedImages[activeImage] ? (
    <div className="w-full h-full overflow-y-auto">
      <img
        src={resolvedImages[activeImage]}
        alt={`Preview ${activeImage + 1}`}
        className="w-full h-auto min-h-full object-cover object-top transition-all duration-500 cursor-pointer"
        onClick={() => resolvedImages.length > 0 && setShowPopup(true)}
      />
    </div>
  ) : (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[var(--color3)]/5 via-transparent to-[var(--color3)]/10">
    <div className="w-20 h-20 rounded-3xl bg-white/80 shadow-lg border border-[var(--color3)]/10 flex items-center justify-center mb-4">
    <i className="bx bx-image-alt text-4xl text-[var(--color3)]"></i>
    </div>

    <p className="fontStyle9 text-base sm:text-lg font-bold text-[var(--color4)]">
    No Image Available
    </p>

    <p className="fontStyle10 text-xs sm:text-sm text-[var(--color4)]/50 mt-1">
    Image preview is unavailable
    </p>
    </div>
  )}

  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
    <span
      className="fontStyle10 font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-white shadow-md"
      style={{ background: "var(--color3)" }}
    >
      {isFree ? "FREE" : `$${price}`}
    </span>

    <span className="fontStyle10 px-3 py-1.5 rounded-full bg-black/60 text-white backdrop-blur-sm flex items-center gap-1.5 shadow-md">
      <i className="bx bx-download text-sm"></i>
      {downloads || 0} Downloads
    </span>
  </div>

  {resolvedImages.length > 1 && (
    <>
      <button
        onClick={() =>
          setActiveImage(
            (p) => (p - 1 + resolvedImages.length) % resolvedImages.length
          )
        }
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 hover:scale-110 shadow-md transition-all duration-200"
      >
        <i className="bx bx-chevron-left text-lg"></i>
      </button>

      <button
        onClick={() =>
          setActiveImage((p) => (p + 1) % resolvedImages.length)
        }
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 hover:scale-110 shadow-md transition-all duration-200"
      >
        <i className="bx bx-chevron-right text-lg"></i>
      </button>
    </>
  )}
</div>
      {resolvedImages.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto">
          {resolvedImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`flex-shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? "border-[var(--color6)] opacity-100 shadow-md" : "border-transparent opacity-50 hover:opacity-80"}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
