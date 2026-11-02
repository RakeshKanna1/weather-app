import PropTypes from "prop-types";
import {
  Thermometer,
  Droplets,
  Wind,
  Compass,
  Gauge,
  Eye,
  Cloud,
  Sunrise,
  Sunset,
} from "lucide-react";

export default function MetricsGrid({ current, units = "metric" }) {
  if (!current) return null;

  const speedUnit = units === "metric" ? "km/h" : "mph";
  const tempUnit = units === "metric" ? "°C" : "°F";

  // Estimate Dew Point (Magnus formula approximation)
  const calculateDewPoint = (t, rh) => {
    if (!t || !rh) return t;
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * t) / (b + t)) + Math.log(rh / 100);
    return Math.round((b * alpha) / (a - alpha));
  };

  const dewPoint = calculateDewPoint(current.temp, current.humidity);

  return (
    <div className="metrics-bento-grid">
      {/* 1. Feels Like */}
      <div className="metric-box">
        <div className="metric-header">
          <Thermometer size={16} className="text-amber-400" />
          <span>Feels Like</span>
        </div>
        <div className="metric-value">{current.feelsLike}{tempUnit}</div>
        <div className="metric-subtext">
          {current.feelsLike > current.temp
            ? "Humidity makes it feel warmer"
            : current.feelsLike < current.temp
            ? "Wind makes it feel cooler"
            : "Matches actual temperature"}
        </div>
      </div>

      {/* 2. Humidity & Dew Point */}
      <div className="metric-box">
        <div className="metric-header">
          <Droplets size={16} className="text-cyan-400" />
          <span>Humidity</span>
        </div>
        <div className="metric-value">{current.humidity}%</div>
        <div className="metric-subtext">Dew point is {dewPoint}{tempUnit}</div>
      </div>

      {/* 3. Wind & Direction */}
      <div className="metric-box">
        <div className="metric-header">
          <Wind size={16} className="text-teal-400" />
          <span>Wind Speed</span>
        </div>
        <div className="metric-value">
          {current.windSpeed} <span className="metric-unit">{speedUnit}</span>
        </div>
        <div className="metric-wind-row">
          <Compass size={14} className="text-teal-300" style={{ transform: `rotate(${current.windDeg || 0}deg)` }} />
          <span>Wind from {current.windDir} ({current.windDeg}°)</span>
        </div>
      </div>

      {/* 4. Visibility */}
      <div className="metric-box">
        <div className="metric-header">
          <Eye size={16} className="text-indigo-400" />
          <span>Visibility</span>
        </div>
        <div className="metric-value">
          {current.visibility} <span className="metric-unit">km</span>
        </div>
        <div className="metric-subtext">
          {current.visibility >= 10 ? "Clear visibility" : "Haze or fog present"}
        </div>
      </div>

      {/* 5. Pressure */}
      <div className="metric-box">
        <div className="metric-header">
          <Gauge size={16} className="text-purple-400" />
          <span>Pressure</span>
        </div>
        <div className="metric-value">
          {current.pressure} <span className="metric-unit">hPa</span>
        </div>
        <div className="metric-subtext">
          {current.pressure >= 1013 ? "Standard atmospheric pressure" : "Lower barometric pressure"}
        </div>
      </div>

      {/* 6. Cloudiness */}
      <div className="metric-box">
        <div className="metric-header">
          <Cloud size={16} className="text-sky-400" />
          <span>Cloud Cover</span>
        </div>
        <div className="metric-value">{current.clouds}%</div>
        <div className="metric-bar-container">
          <div className="metric-bar-fill" style={{ width: `${current.clouds}%` }} />
        </div>
      </div>

      {/* 7. Solar Cycle (Sunrise / Sunset) */}
      <div className="metric-box span-2">
        <div className="metric-header">
          <Sunrise size={16} className="text-amber-400" />
          <span>Sunrise & Sunset</span>
        </div>
        <div className="sun-cycle-container">
          <div className="sun-event">
            <Sunrise size={22} className="text-amber-400" />
            <div>
              <span className="sun-sub">Sunrise</span>
              <span className="sun-time-val">{current.sunrise}</span>
            </div>
          </div>
          <div className="sun-divider" />
          <div className="sun-event">
            <Sunset size={22} className="text-orange-400" />
            <div>
              <span className="sun-sub">Sunset</span>
              <span className="sun-time-val">{current.sunset}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MetricsGrid.propTypes = {
  current: PropTypes.object,
  units: PropTypes.string,
};
