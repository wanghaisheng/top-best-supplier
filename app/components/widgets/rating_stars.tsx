// components/RatingStars.js

const RatingStars = ({ ratingScore }) => {
  // Calculate the number of full stars
  if (ratingScore > 5) {
    ratingScore = 5;
  }
  const fullStars = Math.floor(ratingScore);

  // Calculate the remainder for the half star
  const remainder = ratingScore - fullStars;

  return (
    <div className="flex items-center">
      <span className="mr-2 text-black">{ratingScore}</span>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <svg
          key={index}
          className="w-5 h-5 fill-current text-red-600"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.6 6.3H19l-5.3 3.7L15.9 19 10 15.4 4.1 19l1.6-7L1 7.3h6.4L10 1z" />
        </svg>
      ))}
      {/* Half star */}
      {remainder > 0 && (
        <svg className="w-5 h-5 fill-current text-red-600" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="50%"
                style={{ stopColor: "#ff0000", stopOpacity: 1 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "transparent", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient id="grayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="50%"
                style={{ stopColor: "transparent", stopOpacity: 1 }}
              />
              <stop
                offset="50%"
                style={{ stopColor: "#ccc", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <path
            d="M10 1l2.6 6.3H19l-5.3 3.7L15.9 19 10 15.4 4.1 19l1.6-7L1 7.3h6.4L10 1z"
            fill="url(#redGradient)"
          />
          <path
            d="M10 1l2.6 6.3H19l-5.3 3.7L15.9 19 10 15.4 4.1 19l1.6-7L1 7.3h6.4L10 1z"
            fill="url(#grayGradient)"
          />
        </svg>
      )}
      {/* Empty stars */}

      {[...Array(5 - Math.ceil(ratingScore))].map((_, index) => (
        <svg
          key={index}
          className="w-5 h-5 fill-current text-gray-400"
          viewBox="0 0 20 20"
        >
          <path d="M10 1l2.6 6.3H19l-5.3 3.7L15.9 19 10 15.4 4.1 19l1.6-7L1 7.3h6.4L10 1z" />
        </svg>
      ))}
    </div>
  );
};

export default RatingStars;
