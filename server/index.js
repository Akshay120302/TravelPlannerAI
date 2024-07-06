import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios'; 
import userRouter from "./routes/User.route.js";
import authRouter from "./routes/Auth.route.js";
import tripRouter from "./routes/Trip.route.js";
import { chatBotHandler } from "./controllers/Chatbot.controller.js";
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

const __dirname = path.resolve();

const app = express();
const port = process.env.PORT || 8000;

app.get('/api/weather', async (req, res) => {
    const { latitude, longitude } = req.query;
    console.log(`Fetching weather data for: lat=${latitude}, lon=${longitude}`);
    
    const options = {
      method: 'GET',
      url: 'https://weatherapi-com.p.rapidapi.com/current.json',
      params: { q: `${latitude},${longitude}` },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY_W,
        'x-rapidapi-host': process.env.REACT_APP_X_RAPIDAPI_HOST_W,
      },
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).send('Server Error');
    }
});

// app.get('/api/air-quality', async (req, res) => {
//     const { latitude, longitude } = req.query;
//     console.log(`Fetching air quality data for: lat=${latitude}, lon=${longitude}`);
    
//     const options = {
//       method: 'GET',
//       url: 'https://air-quality.p.rapidapi.com/current/airquality',
//       params: { lon: longitude, lat: latitude },
//       headers: {
//         'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY_AQ,
//         'x-rapidapi-host': process.env.REACT_APP_X_RAPIDAPI_HOST_AQ,
//       },
//     };
  
//     try {
//       const response = await axios.request(options);
//       res.json(response.data);
//     } catch (error) {
//       console.error('Error fetching air quality data:', error);
//       res.status(500).send('Server Error');
//     }
// });

app.get('/api/air-quality', async (req, res) => {
    const { latitude, longitude } = req.query;
  
    const options = {
      method: 'GET',
      url: 'https://air-quality.p.rapidapi.com/current/airquality',
      params: { lon: longitude, lat: latitude },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY_AQ,
        'x-rapidapi-host': process.env.REACT_APP_X_RAPIDAPI_HOST_AQ,
      },
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      res.status(500).send('Server Error');
    }
  });

app.get('/api/destinations', async (req, res) => {
    const { destination } = req.query;
    console.log(`Fetching destination ID for: ${destination}`);
    
    const options = {
      method: 'GET',
      url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
      params: { name: destination, locale: 'en-gb' },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY_DID,
        'x-rapidapi-host': process.env.REACT_APP_X_RAPIDAPI_HOST_DID,
      }
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching destination ID:', error);
      res.status(500).send('Server Error');
    }
});
  
app.get('/api/hotels', async (req, res) => {
    const { dest_id, checkout_date, adults_number } = req.query;
    console.log(`Fetching hotels for: dest_id=${dest_id}, checkout_date=${checkout_date}, adults_number=${adults_number}`);
    
    const options = {
      method: 'GET',
      url: 'https://booking-com.p.rapidapi.com/v1/hotels/search',
      params: {
        checkout_date,
        order_by: 'popularity',
        filter_by_currency: 'AED',
        include_adjacency: 'true',
        children_number: '2',
        categories_filter_ids: 'class::2,class::4,free_cancellation::1',
        room_number: '1',
        dest_id,
        dest_type: 'city',
        adults_number,
        page_number: '0',
        checkin_date: '2024-09-14',
        locale: 'en-gb',
        units: 'metric',
        children_ages: '5,0'
      },
      headers: {
        'x-rapidapi-key': process.env.REACT_APP_X_RAPIDAPI_KEY_DesData,
        'x-rapidapi-host': process.env.REACT_APP_X_RAPIDAPI_HOST_DesData,
      }
    };
  
    try {
      const response = await axios.request(options);
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).send('Server Error');
    }
});

// Use CORS middleware
app.use(cors());

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/trip', tripRouter); // Ensure this is correctly mapped
app.use('/api/chatbot', chatBotHandler);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'));
  });

// MIDDLEWARES
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
