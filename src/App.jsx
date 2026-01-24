import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./App.css";

// Import icons
import Search from "./assets/searchicon.png";
import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.png";
import snowIcon from "./assets/Snow.png";
import rainIcon from "./assets/rain.png";
import clearIcon from "./assets/clear-sky.png";
import drizzleIcon from "./assets/heavy-rain.png";
import sunIcon from "./assets/sunny.png";

const WeatherDetails = ({
  icon,
  temp,
  feelsLike,
  description,
  city,
  country,
  lat,
  log,
  Humidity,
  Wind,
  sunrise,
  sunset,
}) => {
  return (
    <div className="weather-card">
      <div className="image">
        <img className="weatherimg" src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp}°C</div>
      <div className="feels-like">Feels like: {feelsLike}°C</div>
      <div className="description">{description}</div>
      <div className="location">
        {city}, <span>{country}</span>
      </div>

      <div className="cord">
        <div>
          <span>Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span>Longitude</span>
          <span>{log}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="elements">
          <img src={humidityIcon} alt="Humidity" />
          <div className="data">
            <div>{Humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>

        <div className="elements">
          <img src={windIcon} alt="Wind" />
          <div className="data">
            <div>{Wind} km/h</div>
            <div className="text">Wind</div>
          </div>
        </div>
      </div>

      <div className="sun-data">
        <div>🌅 Sunrise: {sunrise}</div>
        <div>🌇 Sunset: {sunset}</div>
      </div>
    </div>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  feelsLike: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  Humidity: PropTypes.number.isRequired,
  Wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  sunrise: PropTypes.string.isRequired,
  sunset: PropTypes.string.isRequired,
};

function App() {
  const [text, setText] = useState("mumbai");
  const [icon, setIcon] = useState(sunIcon);
  const [temp, setTemp] = useState(0);
  const [feelsLike, setFeelsLike] = useState(0);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("mumbai");
  const [country, setCountry] = useState("India");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [Humidity, setHumidity] = useState(0);
  const [Wind, setWind] = useState(0);
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": clearIcon,
    "02n": clearIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

  const search = async () => {
    setLoading(true);
    let api_key = "8f4587e44b05428d895cf28df09897c2";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === "404") {
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setFeelsLike(Math.floor(data.main.feels_like));
      setDescription(data.weather[0].description);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);

      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sunIcon);

      // Convert sunrise/sunset to local time
      const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();
      setSunrise(sunriseTime);
      setSunset(sunsetTime);

      setCityNotFound(false);
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="app">
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div className="search-icon" onClick={search}>
            <img className="searchicon" src={Search} alt="Search" />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {Error && <div className="error-message">{Error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {!loading && !cityNotFound && !Error && (
          <WeatherDetails
            icon={icon}
            temp={temp}
            feelsLike={feelsLike}
            description={description}
            city={city}
            country={country}
            lat={lat}
            log={log}
            Humidity={Humidity}
            Wind={Wind}
            sunrise={sunrise}
            sunset={sunset}
          />
        )}

        
      </div>
    </div>
  );
}

export default App;
