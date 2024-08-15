import React from "react";
import "./styles/TripCreate.css";
import Star from "../utils/Star.jsx";
import { deleteTripDestinations } from "../redux/trip/tripActions.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const TripCreate = ({ showReviewPage, closeReview }) => {
  if (!showReviewPage) return null;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReviewSubmit = () => {
    navigate('/new-trip')
    dispatch(deleteTripDestinations());
    closeReview();
  }

  return (
    <>
      <div className="modal-overlay" onClick={closeReview}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeReview}>
            &times;
          </button>
          <h2 className="H2">Review</h2>
          <br />
          <form>
            {/* <div className="form-group">
              <label htmlFor="tripName">Trip Name</label>
              <input
                type="text"
                id="tripName"
                name="tripName"
                required
              />
            </div> */}

            <div className="star-group">
              {/* <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
              /> */}
              <Star />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <p className="textSpecial">Give a short description of how you felt about our service.</p>
              <textarea rows={5} id="description" name="description" required />
            </div>

            {/* <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input type="date" id="endDate" name="endDate" required />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input type="text" id="destination" name="destination" required />
            </div>

            <div className="form-group">
              <label htmlFor="travelers">Number of Travelers</label>
              <input
                type="number"
                id="travelers"
                name="travelers"
                min="1"
                required
              />
            </div> */}

            <button type="submit" className="submit-button" onClick={handleReviewSubmit}>
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default TripCreate;
