// src/components/WeatherApp.js
import React, { useState } from 'react';
import axios from 'axios';
import './WeatherApp.css'; // Import the CSS file for styles

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [unit, setUnit] = useState('C'); // State for temperature unit

  const getWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/weather/${city}`);
      setWeatherData(response.data);
      setErrorMessage(''); // Reset error message on successful fetch
    } catch (error) {
      setWeatherData(null);
      setErrorMessage('Could not fetch weather data. Please try again.'); // Set error message on failure
    }
  };

  const temperatureInCelsius = weatherData ? weatherData.main.temp - 273.15 : 0; // Convert from Kelvin
  const temperature = unit === 'F' ? (temperatureInCelsius * 9 / 5) + 32 : temperatureInCelsius;

  return (
    <div className="weather-container">
      <h1 className="header">Weather App</h1>
      <div className="weather-app">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="input-field"
        />
        <button onClick={getWeather} className="get-weather-button">Get Weather</button>
      </div>
      {weatherData && (
        <div className="weather-data">
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          <p>Temperature: {temperature.toFixed(1)}°{unit}</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather icon" />
        </div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message if any */}
    </div>
  );
};

export default WeatherApp;
