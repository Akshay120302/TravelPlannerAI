import React, { useEffect, useState } from "react";

const Partthree = () => {
  const [topReviews, setTopReviews] = useState([]);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const response = await fetch("/api/review/top-reviews");
        const data = await response.json();
        setTopReviews(data);
      } catch (error) {
        console.error("Failed to fetch top reviews:", error);
      }
    };

    fetchTopReviews();
  }, []);

  return (
    <div className="bg-white py-16 px-8">
      <h1 className="text-3xl font-bold text-center mb-4">
        Don't take Our Word for it
      </h1>
      <p className="text-lg text-gray-500 text-center mb-12">
        See what our users have to say about revolutionizing their travel
        experiences with Trip Planner AI.
      </p>
      <div className="flex flex-wrap gap-2 align-center justify-center justify-center space-x-8">
        {topReviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col justify-center align-center w-[100%] p-6 border rounded-lg shadow-lg bg-white h-[400px]"
          >
            <div className="flex items-center mb-4">
              <img
                src={review.avatar || "default-avatar.png"}
                alt={`User ${index + 1}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="text-xl font-semibold">{review.username}</h3>
                {review.destinations && review.destinations.length > 0 ? (
                  <p className="text-gray-600">
                    {review.destinations.map((loc, index) => (
                      <span key={index}>
                        {loc.location}
                        {index < review.destinations.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-gray-600">Traveller</p>
                )}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <span className="text-yellow-500">
                {"★".repeat(review.rating).padEnd(5, "☆")}
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed h-[250px] text-ellipsis whitespace-wrap overflow-hidden overflow-y-auto">
              {review.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partthree;
