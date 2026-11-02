import { useEffect, useState, useCallback } from "react";
import "./App.css";

// Dynamic atmospheric background elements
import Aurora from "./components/Aurora/Aurora";
import Particles from "./components/Particles/Particles";
import SpotlightCard from "./components/SpotlightCard/SpotlightCard";

// Modular UI components
import WeatherHeader from "./components/WeatherHeader";
import CurrentWeatherHero from "./components/CurrentWeatherHero";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import MetricsGrid from "./components/MetricsGrid";
import AirQualityCard from "./components/AirQualityCard";

// Meteorological services and dynamic themes
import { fetchFullWeather, getWeatherTheme } from "./utils/weatherApi";

// Icons
import {
  LayoutDashboard,
  Calendar,
  Clock,
  Wind,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const DEFAULT_CITY = "Mumbai";
const RECENT_SEARCHES_KEY = "rakexura_weather_recent_cities";
const PREFERRED_UNITS_KEY = "rakexura_weather_units";

export default function App() {
  const [searchQuery, setSearchQuery] = useState(DEFAULT_CITY);
  const [activeCity, setActiveCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Temperature unit: 'metric' (°C) or 'imperial' (°F)
  const [units, setUnits] = useState(() => {
    return localStorage.getItem(PREFERRED_UNITS_KEY) || "metric";
  });

  // Recent searches list
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      return saved ? JSON.parse(saved) : ["Mumbai", "London", "Tokyo", "New York"];
    } catch {
      return ["Mumbai", "London", "Tokyo", "New York"];
    }
  });

  // Dynamic visual theme (Aurora + Particles + Spotlight)
  const [theme, setTheme] = useState(() => ({
    auroraColors: ["#0052D4", "#4364F7", "#6FB1FC"],
    spotlightColor: "rgba(0, 198, 255, 0.18)",
    particleColors: ["#ffffff", "#e0f7ff", "#a5f3fc"],
    particleSpeed: 0.06,
    accentColor: "#00f5d4",
  }));

  // Add a searched city to recent search history
  const addRecentSearch = (city) => {
    if (!city) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      return updated;
    });
  };

  // Primary weather fetcher
  const loadWeather = useCallback(
    async ({ query, lat, lon, targetUnits = units }) => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFullWeather({
          query: query || activeCity,
          lat,
          lon,
          units: targetUnits,
        });

        setWeatherData(data);
        setActiveCity(data.current.city);
        setSearchQuery(data.current.city);

        // Update dynamic atmospheric shader theme based on weather conditions
        const dynamicTheme = getWeatherTheme(data.current.icon, data.current.condition);
        setTheme(dynamicTheme);

        addRecentSearch(data.current.city);
      } catch (err) {
        setError(err.message || "Failed to fetch weather data. Check your connection or city name.");
      } finally {
        setLoading(false);
      }
    },
    [activeCity, units]
  );

  // Handle unit switch (°C <-> °F)
  const handleToggleUnits = (newUnits) => {
    if (newUnits === units) return;
    setUnits(newUnits);
    localStorage.setItem(PREFERRED_UNITS_KEY, newUnits);
    loadWeather({ query: activeCity, targetUnits: newUnits });
  };

  // Handle GPS location detection
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your current browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadWeather({ lat: latitude, lon: longitude });
      },
      () => {
        setError("Location permission denied. Please allow location access or search manually.");
        setLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Initial load
  useEffect(() => {
    loadWeather({ query: DEFAULT_CITY });
  }, []);

  return (
    <div className="app">
      {/* 1. Dynamic WebGL Aurora Atmospheric Sky */}
      <div className="bg-aurora-wrapper">
        <Aurora
          colorStops={theme.auroraColors}
          blend={0.55}
          amplitude={1.1}
          speed={0.5}
        />
      </div>

      {/* 2. Interactive Ambient Particles */}
      <div className="bg-particles-wrapper">
        <Particles
          particleColors={theme.particleColors}
          particleCount={160}
          particleSpread={8}
          speed={theme.particleSpeed}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          particleHoverFactor={0.7}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* 3. Main Glassmorphic Dashboard Card */}
      <SpotlightCard
        className="main-dashboard-card"
        spotlightColor={theme.spotlightColor}
      >
        {/* Top Search, Locate & Unit Controls */}
        <WeatherHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={() => loadWeather({ query: searchQuery })}
          onLocateMe={handleLocateMe}
          units={units}
          onToggleUnits={handleToggleUnits}
          recentSearches={recentSearches}
          onSelectCity={(city) => {
            setSearchQuery(city);
            loadWeather({ query: city });
          }}
          loading={loading}
        />

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !weatherData && (
          <div className="loading-skeleton-container">
            <div className="main-spinner" />
            <span style={{ fontSize: 14, color: "#94a3b8" }}>
              Loading weather data...
            </span>
          </div>
        )}

        {/* Weather Content & Multi-Tab System */}
        {weatherData && (
          <>
            {/* Hero Current Weather Card */}
            <CurrentWeatherHero
              current={weatherData.current}
              units={units}
            />

            {/* Navigation Tabs */}
            <div className="weather-nav-tabs">
              <button
                type="button"
                className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard size={15} />
                <span>Overview</span>
              </button>

              <button
                type="button"
                className={`tab-btn ${activeTab === "hourly" ? "active" : ""}`}
                onClick={() => setActiveTab("hourly")}
              >
                <Clock size={15} />
                <span>24h Hourly</span>
              </button>

              <button
                type="button"
                className={`tab-btn ${activeTab === "forecast" ? "active" : ""}`}
                onClick={() => setActiveTab("forecast")}
              >
                <Calendar size={15} />
                <span>5-Day Forecast</span>
              </button>

              {weatherData.airQuality && (
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "air" ? "active" : ""}`}
                  onClick={() => setActiveTab("air")}
                >
                  <Wind size={15} />
                  <span>Air Quality</span>
                </button>
              )}
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
              <>
                <HourlyForecast
                  hourly={weatherData.hourly}
                  unit={units}
                />
                <MetricsGrid
                  current={weatherData.current}
                  units={units}
                />
              </>
            )}

            {/* Tab 2: Hourly Breakdown */}
            {activeTab === "hourly" && (
              <>
                <HourlyForecast
                  hourly={weatherData.hourly}
                  unit={units}
                />
                <div style={{ marginTop: 14 }}>
                  <MetricsGrid
                    current={weatherData.current}
                    units={units}
                  />
                </div>
              </>
            )}

            {/* Tab 3: 5-Day Forecast */}
            {activeTab === "forecast" && (
              <DailyForecast daily={weatherData.daily} />
            )}

            {/* Tab 4: Air Quality & Health Index */}
            {activeTab === "air" && (
              <AirQualityCard aqiData={weatherData.airQuality} />
            )}
          </>
        )}

        {/* Dashboard Footer */}
        <div className="app-footer">
          <div className="footer-brand">
            <Sparkles size={14} className="text-cyan-400" />
            <span>
              <strong>Rakexura Weather</strong> · Accurate real-time forecasts
            </span>
          </div>

          <button
            type="button"
            className="footer-refresh-btn"
            onClick={() => loadWeather({ query: activeCity })}
            disabled={loading}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Updating..." : "Refresh Live"}</span>
          </button>
        </div>
      </SpotlightCard>
    </div>
  );
}
