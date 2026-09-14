export default function ImagePopup({ showPopup, resolvedImages, activeImage, setActiveImage, setShowPopup }) {
  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowPopup(false)}>
      <div className="relative w-full max-w-5xl mx-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowPopup(false)}
          className="absolute -top-12 right-0 sm:right-0 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all text-xl z-10"
        >
          <i className="bx bx-x text-2xl"></i>
        </button>
        <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
          {resolvedImages[activeImage] ? (
            <img
              src={resolvedImages[activeImage]}
              alt={`Preview ${activeImage + 1}`}
              className="w-full max-h-[75vh] object-contain"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center text-white">No image</div>
          )}
          {resolvedImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImage((p) => (p - 1 + resolvedImages.length) % resolvedImages.length)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 hover:scale-110 shadow-md transition-all duration-200"
              >
                <i className="bx bx-chevron-left text-xl"></i>
              </button>
              <button
                onClick={() => setActiveImage((p) => (p + 1) % resolvedImages.length)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 hover:scale-110 shadow-md transition-all duration-200"
              >
                <i className="bx bx-chevron-right text-xl"></i>
              </button>
            </>
          )}
        </div>
        {resolvedImages.length > 1 && (
          <div className="flex gap-2 justify-center mt-3 overflow-x-auto pb-1">
            {resolvedImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`flex-shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? "border-white opacity-100 shadow-md" : "border-transparent opacity-50 hover:opacity-80"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
