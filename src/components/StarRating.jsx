export default function StarRating({ rating, size = "text-sm" }) {
  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i key={star} className={`bx ${star <= Math.floor(rating) ? "bxs-star" : star - 0.5 <= rating ? "bxs-star-half" : "bx-star"} text-yellow-400 drop-shadow-sm`}></i>
      ))}
    </div>
  );
}
