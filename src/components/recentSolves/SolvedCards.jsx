const SolvedCards = () => {
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden w-[280px]">

      {/* Image */}
      <img
        src='https://images.squarespace-cdn.com/content/v1/573365789f726693272dc91a/1704992146415-CI272VYXPALWT52IGLUB/AdobeStock_201419293.jpeg?format=1500w'
        alt=''
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-3">

        {/* Title */}
        <h3 className="text-lg font-semibold text-[#03373D]">
          Title
        </h3>

        {/* Category */}
        <p className="text-sm text-[#4A6B70]">
          Categ
        </p>

        {/* Badges */}
        <div className="flex gap-2 flex-wrap">

          {/* Status Badge */}
          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
            {status}
          </span>

          {/* Priority Badge */}
          {/* <span
            className={`text-xs px-3 py-1 rounded-full ${
              priority === "High"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {priority} Priority
          </span> */}

        </div>

        {/* Location */}
        <p className="text-sm text-gray-500">
          📍 Loc
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">

          {/* Upvote */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-[#03373D]">
            👍 <span>up</span>
          </div>

          {/* Button */}
          <button className="bg-[#03373D] text-white text-sm px-4 py-2 rounded-md hover:bg-[#02282D] transition">
            View Details
          </button>

        </div>
      </div>
    </div>
  );
};

export default SolvedCards;