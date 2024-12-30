import { useState } from "react";
import axios from "axios";
import WeatherImage from "./assets/weather.png";

const App = () => {
  const [city, setCity] = useState("");

  const api_key = import.meta.env.VITE_API_KEY;

  const searchcity = async () => {
    try {
      const urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

      const response = await axios.get(urlsearch);
      const data = response.data;

      weatherReport(data);

      // Sending data to backend for storage
      savewWeatherData(data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
    setCity("");
  };

  const weatherReport = async (data) => {
    try {
      const urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${api_key}`;
      const forcast = await axios.get(urlcast);
      hourForcast(forcast);
      dayForcast(forcast);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const savewWeatherData = async (data) => {
    try {
      const response = await axios.post(`http://localhost:8888/api/weather`, {
        city: data.name,
        country: data.sys.country,
        temprature: Math.floor(data.main.temp - 273),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.log("Error saving data", error);
    }
  };

  return (
    <>
      <div className="header">
        <h1>WEATHER APP</h1>
        <div>
          <input
            type="text"
            name=""
            id="input"
            placeholder="Enter city name."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button id="search" onClick={searchcity}>
            Search
          </button>
        </div>
      </div>

      <main>
        <div className="weather">
          <h2 id="city">Kathmandu, NP</h2>
          <div className="temp-box">
            <img src={WeatherImage} alt="Weather Image" id="img" />
            <p id="temprature">26 &deg;C</p>
          </div>
          <span id="clouds">Broken Clouds</span>
        </div>
        <div className="divider1"></div>

        <div className="forecstH">
          <p className="cast-header">Upcoming Forecast</p>
          <div className="templist">
            {/* Hourly forcast will be rendered here */}
          </div>
        </div>

        <div className="forecstD">
          <div className="divider2"></div>
          <p className="cast-header">Next 4 Days Forecast</p>
          <div className="weekF">
            {/* Daily forcast will be rendered here */}
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
