// OpenWeatherMap API Utilities and Helpers

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "8f4587e44b05428d895cf28df09897c2";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Convert wind degree to compass direction
 */
export function getWindDirection(deg) {
  if (deg === undefined || deg === null) return "N";
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Format local time in the searched city using the API's timezone offset (in seconds)
 */
export function formatCityLocalTime(timezoneOffsetSeconds) {
  try {
    const utcNow = Date.now() + new Date().getTimezoneOffset() * 60000;
    const cityDate = new Date(utcNow + timezoneOffsetSeconds * 1000);
    return cityDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  }
}

/**
 * Format timestamp (unix seconds) to 12-hour string (e.g. 6:45 AM)
 */
export function formatUnixTime(timestamp, timezoneOffsetSeconds = 0) {
  if (!timestamp) return "--:--";
  try {
    const utcTime = timestamp * 1000;
    const localTime = new Date(utcTime + timezoneOffsetSeconds * 1000);
    return localTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  } catch {
    return "--:--";
  }
}

/**
 * Get AQI interpretation and health advisory
 */
export function getAQIInfo(aqi) {
  switch (Number(aqi)) {
    case 1:
      return {
        level: 1,
        label: "Good",
        color: "#10b981",
        description: "Air quality is clean and poses minimal risk.",
        advisory: "Great conditions for outdoor activities.",
      };
    case 2:
      return {
        level: 2,
        label: "Fair",
        color: "#84cc16",
        description: "Air quality is acceptable for most people.",
        advisory: "Normal outdoor conditions.",
      };
    case 3:
      return {
        level: 3,
        label: "Moderate",
        color: "#f59e0b",
        description: "Air pollution is elevated for sensitive groups.",
        advisory: "Reduce heavy exertion outdoors if sensitive to dust.",
      };
    case 4:
      return {
        level: 4,
        label: "Poor",
        color: "#ef4444",
        description: "Air quality is unhealthy for sensitive individuals.",
        advisory: "Close windows to keep indoor air clean.",
      };
    case 5:
      return {
        level: 5,
        label: "Very Poor",
        color: "#a855f7",
        description: "Health alert: high levels of pollution.",
        advisory: "Stay indoors when possible and use air purifiers.",
      };
    default:
      return {
        level: 0,
        label: "Unknown",
        color: "#94a3b8",
        description: "Air quality data is currently unavailable.",
        advisory: "Check back later.",
      };
  }
}

/**
 * Calculate dynamic Aurora and Particle themes based on weather code and day/night
 */
export function getWeatherTheme(iconCode, mainCondition) {
  const isNight = (iconCode || "").endsWith("n");
  const condition = (mainCondition || "").toLowerCase();

  // 1. Thunderstorm
  if (condition.includes("thunder") || (iconCode && iconCode.startsWith("11"))) {
    return {
      name: "thunderstorm",
      auroraColors: ["#1e1b4b", "#4338ca", "#6366f1"],
      spotlightColor: "rgba(99, 102, 241, 0.25)",
      particleColors: ["#e0e7ff", "#a5b4fc", "#6366f1"],
      particleSpeed: 0.12,
      accentColor: "#818cf8",
    };
  }

  // 2. Snow
  if (condition.includes("snow") || (iconCode && iconCode.startsWith("13"))) {
    return {
      name: "snow",
      auroraColors: ["#0284c7", "#38bdf8", "#e0f2fe"],
      spotlightColor: "rgba(56, 189, 248, 0.25)",
      particleColors: ["#ffffff", "#f0f9ff", "#bae6fd"],
      particleSpeed: 0.04,
      accentColor: "#38bdf8",
    };
  }

  // 3. Rain & Drizzle
  if (condition.includes("rain") || condition.includes("drizzle") || (iconCode && (iconCode.startsWith("09") || iconCode.startsWith("10")))) {
    return {
      name: "rain",
      auroraColors: ["#0f172a", "#0369a1", "#0284c7"],
      spotlightColor: "rgba(2, 132, 199, 0.25)",
      particleColors: ["#bae6fd", "#7dd3fc", "#38bdf8"],
      particleSpeed: 0.15,
      accentColor: "#38bdf8",
    };
  }

  // 4. Clouds & Mist / Fog
  if (condition.includes("cloud") || condition.includes("mist") || condition.includes("fog") || condition.includes("haze")) {
    if (isNight) {
      return {
        name: "cloudy-night",
        auroraColors: ["#090d16", "#1e293b", "#334155"],
        spotlightColor: "rgba(148, 163, 184, 0.2)",
        particleColors: ["#cbd5e1", "#94a3b8", "#64748b"],
        particleSpeed: 0.03,
        accentColor: "#94a3b8",
      };
    }
    return {
      name: "cloudy-day",
      auroraColors: ["#0f172a", "#334155", "#0284c7"],
      spotlightColor: "rgba(14, 165, 233, 0.2)",
      particleColors: ["#f1f5f9", "#e2e8f0", "#94a3b8"],
      particleSpeed: 0.05,
      accentColor: "#38bdf8",
    };
  }

  // 5. Clear Sky / Sunny
  if (isNight) {
    return {
      name: "clear-night",
      auroraColors: ["#020617", "#1e1b4b", "#10b981"],
      spotlightColor: "rgba(16, 185, 129, 0.2)",
      particleColors: ["#ffffff", "#e0f2fe", "#a7f3d0"],
      particleSpeed: 0.04,
      accentColor: "#34d399",
    };
  }

  return {
    name: "clear-day",
    auroraColors: ["#0284c7", "#f59e0b", "#f97316"],
    spotlightColor: "rgba(245, 158, 11, 0.25)",
    particleColors: ["#ffffff", "#fef3c7", "#fed7aa"],
    particleSpeed: 0.06,
    accentColor: "#fbbf24",
  };
}

/**
 * Fetch complete weather package (current + 5-day forecast + air pollution)
 */
export async function fetchFullWeather({ query, lat, lon, units = "metric" }) {
  if (!API_KEY) {
    throw new Error("Missing OpenWeatherMap API Key");
  }

  // 1. Fetch current weather
  let currentWeatherUrl = "";
  if (lat !== undefined && lon !== undefined) {
    currentWeatherUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`;
  } else {
    currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=${units}`;
  }

  const currentRes = await fetch(currentWeatherUrl);
  const currentData = await currentRes.json();

  if (currentData.cod && String(currentData.cod) !== "200") {
    throw new Error(currentData.message || "City not found");
  }

  const { coord } = currentData;

  // 2. Concurrently fetch 5-day forecast and Air Pollution using coordinates
  const forecastUrl = `${BASE_URL}/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=${units}`;
  const pollutionUrl = `${BASE_URL}/air_pollution?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}`;

  const [forecastRes, pollutionRes] = await Promise.all([
    fetch(forecastUrl).catch(() => null),
    fetch(pollutionUrl).catch(() => null),
  ]);

  const forecastData = forecastRes && forecastRes.ok ? await forecastRes.json() : null;
  const pollutionData = pollutionRes && pollutionRes.ok ? await pollutionRes.json() : null;

  // Process 5-day daily forecast (taking middle-of-day reading or min/max per day)
  const dailyForecasts = [];
  const hourlyForecasts = [];

  if (forecastData && forecastData.list) {
    // Top 8 intervals (24 hours) for hourly forecast
    forecastData.list.slice(0, 8).forEach((item) => {
      hourlyForecasts.push({
        time: item.dt_txt,
        timestamp: item.dt,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        condition: item.weather[0]?.main || "Clear",
        description: item.weather[0]?.description || "",
        icon: item.weather[0]?.icon || "01d",
        pop: Math.round((item.pop || 0) * 100),
        windSpeed: units === "metric" ? Math.round(item.wind.speed * 3.6) : Math.round(item.wind.speed),
        humidity: item.main.humidity,
      });
    });

    // Group by day for 5-day daily forecast
    const dayMap = new Map();
    forecastData.list.forEach((item) => {
      const dateKey = item.dt_txt.split(" ")[0];
      if (!dayMap.has(dateKey)) {
        dayMap.set(dateKey, []);
      }
      dayMap.get(dateKey).push(item);
    });

    dayMap.forEach((items, dateKey) => {
      let minTemp = Infinity;
      let maxTemp = -Infinity;
      let representativeItem = items[Math.floor(items.length / 2)]; // midday representation
      let maxPop = 0;

      items.forEach((it) => {
        if (it.main.temp_min < minTemp) minTemp = it.main.temp_min;
        if (it.main.temp_max > maxTemp) maxTemp = it.main.temp_max;
        if ((it.pop || 0) > maxPop) maxPop = it.pop;
      });

      const dayDate = new Date(dateKey + "T12:00:00Z");
      const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" });
      const fullDateStr = dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      dailyForecasts.push({
        date: dateKey,
        dayName,
        fullDateStr,
        minTemp: Math.round(minTemp),
        maxTemp: Math.round(maxTemp),
        condition: representativeItem.weather[0]?.main || "Clear",
        description: representativeItem.weather[0]?.description || "",
        icon: representativeItem.weather[0]?.icon || "01d",
        pop: Math.round(maxPop * 100),
        humidity: representativeItem.main.humidity,
      });
    });
  }

  // Process air quality
  let aqiInfo = null;
  let airComponents = null;
  if (pollutionData && pollutionData.list && pollutionData.list.length > 0) {
    const aqiNum = pollutionData.list[0].main.aqi;
    aqiInfo = getAQIInfo(aqiNum);
    airComponents = pollutionData.list[0].components;
  }

  return {
    current: {
      city: currentData.name,
      country: currentData.sys.country,
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      tempMin: Math.round(currentData.main.temp_min),
      tempMax: Math.round(currentData.main.temp_max),
      condition: currentData.weather[0].main,
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      humidity: currentData.main.humidity,
      windSpeed: units === "metric" ? Math.round(currentData.wind.speed * 3.6) : Math.round(currentData.wind.speed),
      windDeg: currentData.wind.deg,
      windDir: getWindDirection(currentData.wind.deg),
      pressure: currentData.main.pressure,
      visibility: Math.round((currentData.visibility || 10000) / 1000), // in km
      clouds: currentData.clouds?.all ?? 0,
      sunrise: formatUnixTime(currentData.sys.sunrise, currentData.timezone),
      sunset: formatUnixTime(currentData.sys.sunset, currentData.timezone),
      rawSunrise: currentData.sys.sunrise,
      rawSunset: currentData.sys.sunset,
      timezone: currentData.timezone,
      localTime: formatCityLocalTime(currentData.timezone),
      lat: coord.lat,
      lon: coord.lon,
    },
    hourly: hourlyForecasts,
    daily: dailyForecasts.slice(0, 5),
    airQuality: aqiInfo ? { ...aqiInfo, components: airComponents } : null,
    units,
  };
}
