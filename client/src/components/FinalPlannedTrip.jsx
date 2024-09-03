import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./styles/FinalPlannedTrip.css";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";
import "react-vertical-timeline-component/style.min.css";
import Chatbot from "./Chatbot";
import axios from "axios";
import { useSelector } from "react-redux";
import TripCreate from "./TripCreate";
import Navbar from "./Navbar";
import {
  FaUserFriends
} from "react-icons/fa";
import AddUser from "./AddUser";

const EventCard = ({ dest }) => (
  <VerticalTimelineElement
    contentStyle={{ background: "#1d1836", color: "#fff" }}
    contentArrowStyle={{ borderRight: "7px solid  #232631" }}
    date={`${dest.start_date}`}
    iconStyle={{ background: "#4A90E2" }}
    icon={
      <img
        src={markerIconPng}
        alt="Destination"
        className="w-[100%] h-[100%] object-contain"
      />
    }
  >
    <div>
      <h3 className="text-white text-[24px]">{dest.location}</h3>
    </div>
  </VerticalTimelineElement>
);

const FinalPlannedTrip = () => {
  const { destinations } = useSelector((state) => state.trip);
  console.log(destinations);

  const [initialLocation, setInitialLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [error, setError] = useState("");

  const closeReview = () => setShowReviewPage(false);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get("/api/weather", {
        params: { latitude, longitude },
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchAirQualityData = async (latitude, longitude) => {
    try {
      const response = await axios.get("/api/air-quality", {
        params: { latitude, longitude },
      });
      setAirQualityData(response.data);
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  };

  const fetchLocationData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      setPlaceName(data.display_name);
      console.log(data.display_name);
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation && !initialLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const location = [latitude, longitude];
        setInitialLocation(location);
        setCurrentLocation(location);
        fetchWeatherData(latitude, longitude);
        fetchAirQualityData(latitude, longitude);
        fetchLocationData(latitude, longitude);
      });
    }

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = [latitude, longitude];
        setCurrentLocation(newLocation);
        fetchWeatherData(latitude, longitude);
        fetchAirQualityData(latitude, longitude);
        fetchLocationData(latitude, longitude);
      });
    }, 60000); // Check location every minute

    return () => clearInterval(intervalId);
  }, [initialLocation]);

  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center);
    return null;
  };

  const [addUser , setAddUser] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Replace with your API endpoint
      const response = await axios.post('/api/add-user', formData);
      // Handle successful response
      console.log(response.data);
      setAddUser(false); // Close the modal on success
    } catch (err) {
      // Handle error response
      console.error(err);
      setError("Failed to add user. Please try again.");
    }
  };

  return (
    <>
    <div className="mb-10">
    <Navbar/>

    </div>
    <br />
    <div className="final-planned-trip-container border-t border-gray-500">
      <motion.div className="LeftHalf" variants={textVariant}>
        <p className="flex justify-center">Your Trip Planned and Ready 🥳</p>
        <div className="flex align-center justify-center flex-row gap-2 mt-2 rounded-full border-2 border-gray-500 bg-green-700" onClick={() => setAddUser(true)}>
          <FaUserFriends style={{backgroundColor: "green"}}/> 
          Add Users
          </div>
          {addUser ? <AddUser setAddUser={setAddUser} handleAddUser = {handleAddUser} error={error} />: ""}
        <div className="mt-20 flex flex-col" id="test">
          <VerticalTimeline>
            {initialLocation && (
              <EventCard key="initial" dest={{ start_date: "Start", location: placeName }} />
            )}
            {destinations.map((dest, index) => (
              <EventCard key={index} dest={dest} />
            ))}
          </VerticalTimeline>
          <div className="flex justify-center items-start h-['max-content'] mt-10">
            <button className="w-[20%] h-['max-content'] rounded-full border-2 border-gray-500 bg-red-700 !text-white hover:bg-red-900" onClick={()=>{setShowReviewPage(true)}}>
              End Trip
            </button>
            {showReviewPage && (<TripCreate showReviewPage={showReviewPage} closeReview = {closeReview}/>)}
          </div>
        </div>
      </motion.div>
      <div className="map-chat-container-FT">
        <div className="map-container-FT">
          {currentLocation ? (
            <MapContainer
              center={currentLocation}
              zoom={15}
              style={{ height: "100%", width: "100%", position: "sticky" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={currentLocation}
                icon={
                  new L.Icon({
                    iconUrl: markerIconPng,
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowUrl: markerShadowPng,
                    shadowSize: [41, 41],
                    className: "transparent-marker-icon",
                  })
                }
              >
                <Popup>{placeName || "Your Location"}</Popup>
              </Marker>
              <ChangeView center={currentLocation} />
            </MapContainer>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
        <div className="chatbot-container">
          <Chatbot weatherData={weatherData} airQualityData={airQualityData} />
        </div>
      </div>
    </div>
    </>
  );
};

export default FinalPlannedTrip;
