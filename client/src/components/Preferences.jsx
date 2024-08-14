import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles/Preferences.css';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';
import FinalPlannedTrip from './FinalPlannedTrip';
import { setSelectedHotel } from '../redux/hotelSelection/hotelSlice';
import loaderJson from './styles/images/Animation - 1721291379782.json'; 
import Lottie from 'react-lottie';

// Define custom marker icons
const markerIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: markerShadowPng,
  shadowSize: [41, 41],
  className: "transparent-marker-icon",
});

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

const Preferences = () => {
  const { destinations } = useSelector((state) => state.trip);
  const hotel = useSelector((state) => state.hotel); // Ensure this matches your Redux store structure
  const dispatch = useDispatch();
  const [budget, setBudget] = useState('Cheap');
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [showHotels, setShowHotels] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [checkoutDate, setCheckoutDate] = useState('2024-09-15');
  const [adultsNumber, setAdultsNumber] = useState(2);
  const [destIds, setDestIds] = useState({});
  const [hotelLocations, setHotelLocations] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHotels, setIsFetchingHotels] = useState(false);

  const handleHotelSelect = (hotel) => {
    if(hotel.hotel_id === selectedHotel){
      
      setSelectedHotel(null);
    }
    console.log('Selected hotel:', hotel);
    dispatch(setHotelSelection(hotel)); // Dispatch the action
    setSelectedHotel(hotel.hotel_id);
  };
  
  const setHotelSelection = (hotel) => ({
    type: 'hotel/setSelectedHotel', // Define a unique action type string
    payload: hotel,
  });

  const handleMealChange = (meal) => {
    setMeals({ ...meals, [meal]: !meals[meal] });
  };

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setBudget(value === '0' ? 'Cheap' : value === '1' ? 'Mid' : 'High');
  };

  const handleNextClick = () => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (currentIndex === 0) {
      // Move from Meal Preference to the first destination
      setCurrentIndex(1);
    } else if (currentIndex < destinations.length) {
      setHotels([]);
      setIsFetchingHotels(true);
      // Move through destinations
      setCurrentIndex(currentIndex + 1);
    } else {
      // Show Hotels after the last destination
      setShowHotels(true);
    }
    
  };

  useEffect(() => {
    if (navigator.geolocation && !location && currentIndex === 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            setPlaceName(data.display_name);
          })
          .catch(error => console.error('Error fetching place name:', error));
      });
    }
  }, [location, currentIndex]);

  useEffect(() => {
    const fetchDestId = async (destination) => {
      try {
        const response = await axios.get('/api/destinations', {
          params: { destination }
        });
        if (response.data && response.data.length > 0) {
          return response.data[0].dest_id;
        }
      } catch (error) {
        console.error('Error fetching destination ID:', error);
      }
      return null;
    };

    const fetchAllDestIds = async () => {
      const newDestIds = {};
      for (const destination of destinations) {
        const destId = await fetchDestId(destination.location);
        if (destId) {
          newDestIds[destination.location] = destId;
        }
      }
      setDestIds(newDestIds);
    };
  
    if (destinations.length > 0) {
      fetchAllDestIds();
    }
  }, [destinations]);

  useEffect(() => {
    if (currentIndex > 0 && currentIndex <= destinations.length) {
      const destination = destinations[currentIndex - 1];
      const destId = destIds[destination.location];
      if (destId) {
        fetch(`https://nominatim.openstreetmap.org/search?q=${destination.location}&format=json`)
          .then(response => response.json())
          .then(data => {
            if (data && data.length > 0) {
              const { lat, lon, display_name } = data[0];
              setLocation([parseFloat(lat), parseFloat(lon)]);
              setPlaceName(display_name);

              // Fetch hotels for the destination
              fetchHotels(destId, checkoutDate, adultsNumber);
            }
          })
          .catch(error => console.error('Error fetching destination location:', error));
      }
    }
  }, [currentIndex, destinations, checkoutDate, adultsNumber, destIds]);

  // const fetchHotels = async (dest_id, checkout_date, adults_number) => {
  //   if (!dest_id) {
  //     console.error('dest_id is missing');
  //     return;
  //   }

  //   try {
  //     const options = {
  //       method: 'GET',
  //       url: 'https://booking-com.p.rapidapi.com/v1/hotels/search',
  //       params: {
  //         checkout_date,
  //         order_by: 'popularity',
  //         filter_by_currency: 'AED',
  //         include_adjacency: 'true',
  //         children_number: '2',
  //         categories_filter_ids: 'class::2,class::4,free_cancellation::1',
  //         room_number: '1',
  //         dest_id,
  //         dest_type: 'city',
  //         adults_number,
  //         page_number: '0',
  //         checkin_date: '2024-09-14',
  //         locale: 'en-gb',
  //         units: 'metric',
  //         children_ages: '5,0'
  //       },
  //       headers: {
  //         'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY_DesData,
  //         'x-rapidapi-host': process.env.REACT_APP_X_RAPIDAPI_HOST_DesData, 
  //       }
  //     };

  //     const response = await axios.request(options);
  //     setHotels(response.data.result);
  //     const hotelCoords = response.data.result.map(hotel => ({
  //       lat: hotel.latitude,
  //       lon: hotel.longitude,
  //       name: hotel.hotel_name,
  //       address: hotel.address
  //     }));
  //     setHotelLocations(hotelCoords);
  //   } catch (error) {
  //     console.error('Error fetching hotels:', error);
  //   }
  // };

  const fetchHotels = async (dest_id, checkout_date, adults_number) => {
    if (!dest_id) {
      console.error('dest_id is missing');
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.get('/api/hotels', {
        params: {
          dest_id,
          checkout_date,
          adults_number,
        }
      });
      setHotels(response.data.result);
      const hotelCoords = response.data.result.map(hotel => ({
        lat: hotel.latitude,
        lon: hotel.longitude,
        name: hotel.hotel_name,
        address: hotel.address,
      }));
      setHotelLocations(hotelCoords);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }finally {
      setIsLoading(false); // Stop loading
    }
  };

  const loaderOptions = {
    loop: true,
    autoplay: true,
    animationData: loaderJson,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          // Permission is granted
          getLocation();
        } else if (permissionStatus.state === 'denied') {
          // Permission is denied
          alert("Location permission has been denied. Please enable it in your browser settings to continue.");
        } else if (permissionStatus.state === 'prompt') {
          // Permission is prompted
          getLocation();
        }
  
        // Handle changes to the permission status
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            getLocation();
          } else if (permissionStatus.state === 'denied') {
            alert("Location permission has been denied. Please enable it in your browser settings to continue.");
          }
        };
      });
    } else {
      // Fallback if navigator.permissions is not available
      getLocation();
    }
  }, [location, currentIndex]);
  
  const getLocation = () => {
    if (navigator.geolocation && !location && currentIndex === 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
  
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            setPlaceName(data.display_name);
          })
          .catch(error => console.error('Error fetching place name:', error));
      }, (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Location permission denied. Please enable it to continue.");
        }
      });
    }
  };

  return (
    <div className="container">
      {isLoading && (
        <div className="loader-container">
          <img src={loaderJson} alt="Loading..." />
        </div>
      )}
      {!showHotels ? (
      <div className="map-container">
        {location ? (
          <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {hotelLocations.map((hotel, index) => (
              <Marker key={index} position={[hotel.lat, hotel.lon]} icon={markerIcon}>
                <Popup>
                  <strong>{hotel.name}</strong><br />
                  {hotel.address}
                </Popup>
              </Marker>
            ))}
            <Marker position={location} icon={markerIcon}>
              <Popup>
                {placeName || 'Your Location'}
              </Popup>
            </Marker>
            <ChangeView center={location} />
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div> ) : ("")}

      {!showHotels ? (
        <>
          {currentIndex === 0 && (
            <div className="meal-preferences-container">
              <h1>Preferences</h1>
              <p>Select the meals you would like to include in your trip, your budget for it and the type of food you prefer.</p>

              <div className="budget-level">
                <label>Budget level</label>
                <p>Depending on the budget level, we will select least or more expensive restaurants.</p>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  defaultValue="0"
                  className="slider"
                  onChange={handleSliderChange}
                />
                <div className="slider-labels">
                  <span className={budget === 'Cheap' ? 'active' : ''}>Cheap</span>
                  <span className={budget === 'Mid' ? 'active' : ''}>Mid</span>
                  <span className={budget === 'High' ? 'active' : ''}>High</span>
                </div>
              </div>

              <div className="meals-to-include">
                <label>Meals to include</label>
                <p>Prices are an estimate of each meal for <a href="/">10 days 2 people</a></p>
                <div className="meal-options">
                  <div className="meal-option">
                    <input
                      type="checkbox"
                      id="breakfast"
                      checked={meals.breakfast}
                      onChange={() => handleMealChange('breakfast')}
                    />
                    <label htmlFor="breakfast">Breakfast</label>
                  </div>
                  <div className="meal-option">
                    <input
                      type="checkbox"
                      id="lunch"
                      checked={meals.lunch}
                      onChange={() => handleMealChange('lunch')}
                    />
                    <label htmlFor="lunch">Lunch</label>
                  </div>
                  <div className="meal-option">
                    <input
                      type="checkbox"
                      id="dinner"
                      checked={meals.dinner}
                      onChange={() => handleMealChange('dinner')}
                    />
                    <label htmlFor="dinner">Dinner</label>
                  </div>
                </div>
              </div>

              <button className="next-button" onClick={handleNextClick}>
                Next
                <svg
                  className="arrow-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}

          {currentIndex > 0 && currentIndex <= destinations.length && (
            <div className="lodging-container">
              <div className="lodging-header">
                <h2>Set your lodging (Optional)</h2>
                <p>Add your lodging, and we'll craft the ideal route around your stay. Optimized adventures start at your doorstep!</p>
                <input type="text" className="lodging-search" placeholder="Search your stay address or hotel name" />
              </div>

              <div className="hotel-cards">
                {hotels.length > 0 ? (
                  hotels.map((hotel, index) => (
                    <div key={index} className={`hotel-card ${selectedHotel === hotel.hotel_id ? 'selected' : ''}`}
                    onClick={() => handleHotelSelect(hotel)}
                    style={{
                      border: selectedHotel === hotel.hotel_id ? '2px solid blue' : '1px solid gray'
                    }}>
                      {/* {console.log(hotel)} */}
                      <img src={hotel.main_photo_url} alt={hotel.hotel_name} />
                      <div className="hotel-info">
                        <h4>{hotel.hotel_name}</h4>
                        <p>{hotel.address}</p>
                        <p className="price">{hotel.currencycode} {hotel.min_total_price}/night</p>
                        <p className="rating">Rating: <span>{hotel.review_score}</span> ({hotel.review_nr} reviews)</p>
                        <a href={hotel.url} target="_blank" rel="noopener noreferrer">Book now</a>
                      </div>
                    </div>
                  ))
                ) : (
                  <Lottie options={loaderOptions} height={150} width={150} />
                )}
              </div>

              <button className="next-button" onClick={handleNextClick}>
                {currentIndex < destinations.length ? 'Next' : "Let's go to my trip!"}
                <svg
                  className="arrow-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <FinalPlannedTrip/>
        
        // <div className="final-step">
        //   <h2>Your trip is ready!</h2>
        //   <button className="go-to-trip-button">
        //     Let's go to my trip! 🔥
        //   </button>
        // </div>
      )}
    </div>
  );
};

export default Preferences;
