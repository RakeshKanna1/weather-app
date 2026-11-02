import PropTypes from "prop-types";
import WeatherIcon from "./WeatherIcon";
import { Droplets } from "lucide-react";

export default function DailyForecast({ daily = [] }) {
  if (!daily || daily.length === 0) return null;

  return (
    <div className="forecast-section">
      <div className="section-header">
        <span className="section-title">5-Day Forecast</span>
        <span className="section-tag">Daily</span>
      </div>

      <div className="daily-list">
        {daily.map((day, idx) => (
          <div key={idx} className="daily-row">
            <div className="daily-day-info">
              <span className="daily-name">{idx === 0 ? "Today" : day.dayName}</span>
              <span className="daily-date">{day.fullDateStr}</span>
            </div>

            <div className="daily-condition-col">
              <WeatherIcon code={day.icon} size={26} />
              <span className="daily-desc">{day.description}</span>
            </div>

            {day.pop > 10 ? (
              <div className="daily-rain-chance">
                <Droplets size={12} className="text-cyan-400" />
                <span>{day.pop}%</span>
              </div>
            ) : (
              <div className="daily-rain-chance empty">
                <span>--</span>
              </div>
            )}

            <div className="daily-temp-range">
              <span className="temp-low">{day.minTemp}°</span>
              <div className="temp-bar-container">
                <div
                  className="temp-bar-fill"
                  style={{
                    width: `${Math.min(100, Math.max(30, (day.maxTemp - day.minTemp) * 10))}%`,
                  }}
                />
              </div>
              <span className="temp-high">{day.maxTemp}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

DailyForecast.propTypes = {
  daily: PropTypes.array,
};
