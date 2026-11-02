import PropTypes from "prop-types";
import WeatherIcon from "./WeatherIcon";
import { Droplets, Wind } from "lucide-react";

export default function HourlyForecast({ hourly = [], unit = "metric" }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="forecast-section">
      <div className="section-header">
        <span className="section-title">Hourly Forecast</span>
        <span className="section-tag">Next 24 Hours</span>
      </div>

      <div className="hourly-scroll-container">
        {hourly.map((item, idx) => {
          const timeLabel = new Date(item.time).toLocaleTimeString([], {
            hour: "numeric",
            hour12: true,
          });

          return (
            <div key={idx} className="hourly-card">
              <span className="hourly-time">{idx === 0 ? "Now" : timeLabel}</span>
              <div className="hourly-icon-wrapper">
                <WeatherIcon code={item.icon} size={28} />
              </div>
              <span className="hourly-temp">{item.temp}°</span>
              
              {item.pop > 0 ? (
                <div className="hourly-pop">
                  <Droplets size={11} className="text-cyan-400" />
                  <span>{item.pop}%</span>
                </div>
              ) : (
                <div className="hourly-wind">
                  <Wind size={11} className="text-slate-400" />
                  <span>{item.windSpeed}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

HourlyForecast.propTypes = {
  hourly: PropTypes.array,
  unit: PropTypes.string,
};
