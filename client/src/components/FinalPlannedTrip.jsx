import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import './styles/FinalPlannedTrip.css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import { motion } from 'framer-motion';
import { styles } from '../styles';
// import { experiences } from '../constants';
import { textVariant } from '../utils/motion';
import 'react-vertical-timeline-component/style.min.css';
import Chatbot from './Chatbot';
import axios from 'axios';
import { useSelector } from 'react-redux';

const EventCard = ({ dest }) => (
  <VerticalTimelineElement
    contentStyle={{ background: '#1d1836', color: '#fff' }}
    contentArrowStyle={{ borderRight: '7px solid  #232631' }}
    date={`${dest.start_date}`}
    iconStyle={{ background: '#4A90E2' }}
    icon={<img src={markerIconPng} alt="Destination" className='w-[100%] h-[100%] object-contain' />}
  >
    <div>
      <h3 className='text-white text-[24px]'>{dest.location}</h3>
    </div>
  </VerticalTimelineElement>
);

const FinalPlannedTrip = () => {

  const { destinations } = useSelector((state) => state.trip);
  console.log(destinations);

  const [location, setLocation] = useState(null); // Initialize as null
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placeName, setPlaceName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await axios.get('/api/weather', {
        params: { latitude, longitude }
      });
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchAirQualityData = async (latitude, longitude) => {
    try {
      const response = await axios.get('/api/air-quality', {
        params: { latitude, longitude }
      });
      setAirQualityData(response.data);
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation && !location && currentIndex === 0) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        fetchWeatherData(latitude, longitude);
        fetchAirQualityData(latitude, longitude);

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            setPlaceName(data.display_name);
          })
          .catch(error => console.error('Error fetching place name:', error));
      });
    }
  }, [location, currentIndex]);

  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center);
    return null;
  };

  return (
    <div className="final-planned-trip-container">
      <motion.div className='LeftHalf' variants={textVariant}>
        <p className={styles.sectionSubText}>
          Your Trip Planned and Ready 🥳
        </p>
        <div className='mt-20 flex flex-col' id='test'>
          <VerticalTimeline>
            {destinations.map((dest, index) => (
              <EventCard key={index} dest={dest} />
            ))}
          </VerticalTimeline>
        </div>
      </motion.div>
      <div className="map-chat-container-FT">
        <div className="map-container-FT">
          {location ? (
            <MapContainer center={location} zoom={15} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={location} icon={new L.Icon({
                iconUrl: markerIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: markerShadowPng,
                shadowSize: [41, 41],
                className: 'transparent-marker-icon'
              })}>
                <Popup>
                  {placeName || 'Your Location'}
                </Popup>
              </Marker>
              <ChangeView center={location} />
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
  );
};

export default FinalPlannedTrip;
