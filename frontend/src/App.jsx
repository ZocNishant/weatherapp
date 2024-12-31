import { useState, useEffect } from "react";
import axios from "axios";
import WeatherImage from "./assets/weather.png";

const App = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const api_key = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`;

        fetchWeatherData(url);
      });
    }
  }, []);

  const fetchWeatherData = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      weatherReport(data);
      setWeatherData(data);
      savewWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

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

      document.getElementById("city").innerHTML =
        data.name + "," + data.sys.country;

      // console.log(Math.floor(data.main.temp - 273));
      document.getElementById("temprature").innerText =
        Math.floor(data.main.temp - 273) + "&deg C";

      document.getElementById("clouds").innerText = data.weather[0].description;

      let icon1 = data.weather[0].icon;

      let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
      document.getElementById("img").src = iconurl;
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const hourForcast = (forecast) => {
    document.querySelector(".templist").innerHTML = "";

    for (let i = 0; i < 5; i++) {
      let date = new Date(forecast.list[i] * 1000);

      let hourR = document.createElement("div");
      hourR.setAttribute("class", "next");

      let div = document.createElement("div");
      let time = document.createElement("p");

      time.setAttribute("class", "time");
      time.innerText = date
        .toLocaleDateString(undefined, "Asia/Kathmandu")
        .replace(":00", "");

      let temp = document.createElement("p");
      temp.innerText =
        Math.floor(forecast.list[i].main.temp_max - 273) +
        " °C" +
        " / " +
        Math.floor(forecast.list[i].main.temp_min - 273) +
        " °C";

      div.appendChild(time);
      div.appendChild(temp);

      let desc = document.createElement("p");
      desc.setAttribute("class", "desc");
      desc.innerText = forecast.list[i].weather[0].description;

      hourR.appendChild(div);
      hourR.appendChild(desc);

      document.querySelector(".templist").appendChild(hourR);
    }
  };
  const dayForcast = (forecast) => {
    document.querySelector(".weekF").innerHTML = "";
    for (let i = 8; i < forecast.list.length; i += 8) {
      // console.log(forecast.list[i]);
      let div = document.createElement("div");
      div.setAttribute("class", "dayF");

      let day = document.createElement("p");
      day.setAttribute("class", "date");
      day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(
        undefined,
        "Asia/Pokhara"
      );
      div.appendChild(day);

      let temp = document.createElement("p");
      temp.innerText =
        Math.floor(forecast.list[i].main.temp_max - 273) +
        " °C" +
        " / " +
        Math.floor(forecast.list[i].main.temp_min - 273) +
        " °C";
      div.appendChild(temp);

      let description = document.createElement("p");
      description.setAttribute("class", "desc");
      description.innerText = forecast.list[i].weather[0].description;
      div.appendChild(description);

      document.querySelector(".weekF").appendChild(div);
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
