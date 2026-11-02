import { useState } from "react";
import PropTypes from "prop-types";
import { Search, MapPin, X, Clock, Flame } from "lucide-react";

const POPULAR_CITIES = ["Mumbai", "London", "New York", "Tokyo", "Dubai", "Paris"];

export default function WeatherHeader({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onLocateMe,
  units,
  onToggleUnits,
  recentSearches = [],
  onSelectCity,
  loading = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearchSubmit();
    }
  };

  return (
    <div className="weather-header-container">
      {/* Search Bar & Action Bar */}
      <div className="search-action-row">
        <div className={`search-input-box ${isFocused ? "focused" : ""}`}>
          <Search size={18} className="search-lead-icon" />
          <input
            type="text"
            className="search-field"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

          <button
            type="button"
            className="search-submit-btn"
            onClick={onSearchSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner-icon" /> : "Search"}
          </button>
        </div>

        {/* GPS Button */}
        <button
          type="button"
          className="locate-me-btn"
          onClick={onLocateMe}
          title="Detect Current Location"
          disabled={loading}
        >
          <MapPin size={18} />
          <span className="locate-label">My Location</span>
        </button>

        {/* Unit Toggle Switch */}
        <div className="unit-toggle-pill">
          <button
            type="button"
            className={`unit-btn ${units === "metric" ? "active" : ""}`}
            onClick={() => onToggleUnits("metric")}
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${units === "imperial" ? "active" : ""}`}
            onClick={() => onToggleUnits("imperial")}
          >
            °F
          </button>
        </div>
      </div>

      {/* Quick City Presets & Recent Searches */}
      <div className="quick-cities-row">
        <div className="chips-group">
          <span className="chips-label">Popular:</span>
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className="city-chip"
              onClick={() => onSelectCity(city)}
            >
              {city}
            </button>
          ))}
        </div>

        {recentSearches.length > 0 && (
          <div className="chips-group recent">
            <span className="chips-label">Recent:</span>
            {recentSearches.slice(0, 4).map((city) => (
              <button
                key={city}
                type="button"
                className="city-chip recent-chip"
                onClick={() => onSelectCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

WeatherHeader.propTypes = {
  searchQuery: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  onSearchSubmit: PropTypes.func.isRequired,
  onLocateMe: PropTypes.func.isRequired,
  units: PropTypes.string.isRequired,
  onToggleUnits: PropTypes.func.isRequired,
  recentSearches: PropTypes.array,
  onSelectCity: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
