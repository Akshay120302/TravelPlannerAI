import React from 'react';
import './styles/TripCreate.css';

const TripCreate = ({ isOpen, closeModal }) => {
    if (!isOpen) return null;
  
    return (
      <>
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>&times;</button>
          <h2 className="H2">Create Trip</h2>
          <br />
          <form>
          <div className="form-group">
              <label htmlFor="tripName">Trip Name</label>
              <input
                type="text"
                id="tripName"
                name="tripName"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination</label>
              <input
                type="text"
                id="destination"
                name="destination"
                required
              />
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
            </div>

            <button type="submit" className="submit-button">Create Trip</button>
          </form>
       
        </div>
      </div>
      </>
    );
  };

export default TripCreate;