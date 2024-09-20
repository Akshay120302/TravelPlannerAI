import React, { useState } from "react";
import "./styles/TripCreate.css";
import { deleteTripDestinations } from "../redux/trip/tripActions.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const TripCreate = ({ showReviewPage, closeReview , id }) => {
  if (!showReviewPage) return null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { destinations } = useSelector((state) => state.trip);

  const [rating, setRating] = useState(null);
  const [rateColor, setRateColor] = useState(null);
  const [formData, setFormData] = useState({
    rating: "",
    description: "",
    avatar: currentUser?.avatar || "",
    username: currentUser?.username || "",
    destinations: destinations || [],
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data to be sent:", formData);
  
      const response = await fetch("/api/review/postReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit review.");
        return;
      }
  
      const data = await response.json();
      console.log(data);
  
      // Update the trip's status to false
      await updateTrip();
  
      closeReview();
      navigate("/create-trip");
      dispatch(deleteTripDestinations());
      location.reload();
    } catch (e) {
      console.error("Error posting review:", e);
      setError("An error occurred while submitting the review.");
    }
  };
  

  const updateTrip = async () => {
    try {
      const response = await fetch(`/api/trip/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: false }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating trip status:", errorData.message);
        return;
      }
  
      const updatedTrip = await response.json();
      console.log("Trip status updated successfully:", updatedTrip);
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  };


  return (
    <>
      <div className="modal-overlay" onClick={closeReview}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeReview}>
            &times;
          </button>
          <h2 className="H2">Review</h2>
          <br />
          <form onSubmit={handleReviewSubmit}>
            <div className="star-group">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                {[...Array(5)].map((star, index) => {
                  const currentRate = index + 1;
                  return (
                    <label key={index} style={{ cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="rate"
                        id="rating"
                        value={currentRate}
                        onClick={() => {
                          setRating(currentRate);
                          setFormData({ ...formData, rating: currentRate });
                        }}
                        style={{ display: "none" }}
                        required
                      />
                      <FaStar
                        color={
                          currentRate <= (rateColor || rating)
                            ? "yellow"
                            : "grey"
                        }
                        size={24}
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <p className="textSpecial">
                Give a short description of how you felt about our service.
              </p>
              <textarea
                rows={5}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
            >
              Submit Review
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default TripCreate;
