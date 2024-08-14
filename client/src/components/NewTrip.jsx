import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import './styles/NewTripForm.css';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { setTripDestinations } from '../redux/trip/tripActions';
import { geocodeCity } from './geocode.js'; // Import the geocoding utility

const NewTrip = () => {
  const [tripName, setTripName] = useState(''); // Added state for trip name
  const [destinations, setDestinations] = useState([{ city: '', dates: { start: '', end: '' } }]);
  const [activities, setActivities] = useState([]);
  const [people, setPeople] = useState(1);
  const [travelType, setTravelType] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleActivityToggle = (activity) => {
    if (activities.includes(activity)) {
      setActivities(activities.filter(a => a !== activity));
    } else {
      setActivities([...activities, activity]);
    }
  };

  const handleTravelTypeToggle = (type) => {
    setTravelType(type);
    console.log(`Selected travel type: ${type}`);
  };

  const handleCityChange = (index, value) => {
    const newDestinations = [...destinations];
    newDestinations[index].city = value;
    setDestinations(newDestinations);
  };

  const handleDateChange = (index, dateType, value) => {
    const newDestinations = [...destinations];
    newDestinations[index].dates[dateType] = value;
    setDestinations(newDestinations);
  };

  const addDestination = () => {
    setDestinations([...destinations, { city: '', dates: { start: '', end: '' } }]);
  };

  const removeDestination = (index) => {
    const newDestinations = destinations.filter((_, i) => i !== index);
    setDestinations(newDestinations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const formattedDestinations = await Promise.all(
        destinations.map(async (dest) => {
          const { lat, lon } = await geocodeCity(dest.city);
          return {
            location: dest.city,
            latitude: lat,
            longitude: lon,
            start_date: dest.dates.start,
            end_date: dest.dates.end
          };
        })
      );

      const data = {
        user_id: currentUser._id, // Ensure this is a valid ObjectId
        trip_name: tripName, // Added trip_name to data
        destinations: formattedDestinations,
        activities,
        peopleCount: people,
        travelType
      };

      const response = await fetch('http://localhost:8000/api/trip/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Trip created successfully:', result);

      // Dispatch destinations to Redux store
      dispatch(setTripDestinations(formattedDestinations));

      // Navigate to Preferences page
      navigate('/preferences');
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <br />
      <div className="form-container">
        <h1 className='H3'>Plan your next adventure</h1>
        <div className="TripName">
          <label>Trip Name :</label>
          <input 
            type="text"
            placeholder="Enter a Name that describes a trip" 
            value={tripName}
            onChange={(e) => setTripName(e.target.value)} // Set trip name
          />
        </div>
        {destinations.map((destination, index) => (
          <div key={index} className="destination">
            {destinations.length > 1 && index > 0 && <FontAwesomeIcon icon={faLink} className='chain-symbol' />}
            <br />
            {destinations.length > 1 && index > 0 && <FontAwesomeIcon icon={faLink} className='chain-symbol' />}
            {destinations.length > 1 && index > 0 && <h2 className='medTextSize'>Going Next to {index > 0 && <button className="remove-destination" onClick={() => removeDestination(index)}>Remove</button>}</h2>}
            {index === 0 && <label htmlFor={`city-${index}`}>Where do you want to go?</label>}
            <input
              type="text"
              id={`city-${index}`}
              placeholder="Select a city"
              value={destination.city}
              onChange={(e) => handleCityChange(index, e.target.value)}
            />
            <div className="dates">
              <label>Start Date: </label>
              <input
                type="date"
                value={destination.dates.start}
                onChange={(e) => handleDateChange(index, 'start', e.target.value)}
              />
              <label>End Date: </label>
              <input
                type="date"
                value={destination.dates.end}
                onChange={(e) => handleDateChange(index, 'end', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button className="add-destination" onClick={addDestination}>+ Add destination</button>

        <div className="activities">
          <label>Select the kind of activities you want to do</label>
          <div className="activity-options">
            {['Kid Friendly', 'Museums', 'Shopping', 'Historical', 'Outdoor Adventures', 'Art & Cultural', 'Amusement Parks'].map(activity => (
              <button
                key={activity}
                className={activities.includes(activity) ? 'active' : ''}
                onClick={() => handleActivityToggle(activity)}
              >
                {activity}
              </button>
            ))}
          </div>
        </div>

        <div className="people">
          <label>How many people are going?</label>
          <div className="people-selector">
            <button onClick={() => setPeople(Math.max(1, people - 1))}>-</button>
            <span>{people} Person{people > 1 ? 's' : ''}</span>
            <button onClick={() => setPeople(people + 1)}>+</button>
          </div>
        </div>

        {people >= 2 && (
          <div className="people">
            <label>Who is traveling with you?</label>
            <div className="activity-options">
              {['Couple', 'Friends', 'Family'].map(type => (
                <button
                  key={type}
                  className={travelType === type ? 'active' : ''}
                  onClick={() => handleTravelTypeToggle(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

<button type="submit" onClick={handleSubmit} onTouchEnd={handleSubmit} className="create-trip-button">Create New Trip</button>
        <p className="terms-conditions">
          By clicking Create New Trip, you agree to our <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
      <Footer />
    </>
  );
};

export default NewTrip;
