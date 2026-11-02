import PropTypes from "prop-types";
import WeatherIcon from "./WeatherIcon";
import ShinyText from "./ShinyText/ShinyText";
import DecryptedText from "./DecryptedText/DecryptedText";
import { Clock, Navigation, ArrowUp, ArrowDown } from "lucide-react";

export default function CurrentWeatherHero({ current, units = "metric" }) {
  if (!current) return null;

  const tempUnit = units === "metric" ? "C" : "F";

  return (
    <div className="current-hero-card">
      {/* Top Location & Time Bar */}
      <div className="hero-top-bar">
        <div className="hero-location-wrap">
          <h1 className="hero-city-title">
            <DecryptedText
              key={current.city}
              text={current.city}
              animateOn="view"
              speed={40}
              maxIterations={10}
            />
          </h1>
          <span className="hero-country-badge">{current.country}</span>
        </div>

        <div className="hero-local-time">
          <Clock size={13} className="text-cyan-400" />
          <span>{current.localTime} Local</span>
        </div>
      </div>

      {/* Main Temperature & Weather Visuals */}
      <div className="hero-main-content">
        <div className="hero-weather-visual">
          <div className="hero-icon-container">
            <WeatherIcon code={current.icon} size={84} />
          </div>
          <div className="hero-condition-text">
            <span className="hero-condition-main">{current.condition}</span>
            <span className="hero-condition-desc">{current.description}</span>
          </div>
        </div>

        <div className="hero-temp-block">
          <div className="hero-temp-value">
            <ShinyText
              text={`${current.temp}°`}
              color="#ffffff"
              shineColor="#a5f3fc"
              speed={3}
            />
            <span className="hero-temp-unit">{tempUnit}</span>
          </div>

          <div className="hero-temp-details">
            <div className="hero-feels-like">
              Feels like <strong>{current.feelsLike}°</strong>
            </div>

            <div className="hero-high-low">
              <span className="hl-item high">
                <ArrowUp size={12} /> {current.tempMax}°
              </span>
              <span className="hl-divider">•</span>
              <span className="hl-item low">
                <ArrowDown size={12} /> {current.tempMin}°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Geolocation Coordinates Strip */}
      <div className="hero-coords-strip">
        <div className="coord-chip">
          <Navigation size={12} className="text-teal-400" />
          <span>Lat: <strong>{current.lat.toFixed(2)}</strong></span>
        </div>
        <div className="coord-chip">
          <span>Lon: <strong>{current.lon.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
}

CurrentWeatherHero.propTypes = {
  current: PropTypes.object,
  units: PropTypes.string,
};
