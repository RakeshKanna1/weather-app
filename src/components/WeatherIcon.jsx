import PropTypes from "prop-types";
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
} from "lucide-react";

export default function WeatherIcon({ code, className = "w-10 h-10", size = 40 }) {
  const isNight = (code || "").endsWith("n");
  const prefix = (code || "").slice(0, 2);

  switch (prefix) {
    case "01": // Clear
      return isNight ? (
        <Moon size={size} className={`${className} text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]`} />
      ) : (
        <Sun size={size} className={`${className} text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse`} />
      );

    case "02": // Few clouds
      return isNight ? (
        <CloudMoon size={size} className={`${className} text-indigo-300 drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]`} />
      ) : (
        <CloudSun size={size} className={`${className} text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]`} />
      );

    case "03": // Scattered clouds
    case "04": // Broken / Overcast clouds
      return <Cloud size={size} className={`${className} text-slate-300 drop-shadow-[0_0_10px_rgba(203,213,225,0.3)]`} />;

    case "09": // Shower rain / Drizzle
      return <CloudDrizzle size={size} className={`${className} text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]`} />;

    case "10": // Rain
      return <CloudRain size={size} className={`${className} text-blue-400 drop-shadow-[0_0_14px_rgba(59,130,246,0.5)]`} />;

    case "11": // Thunderstorm
      return <CloudLightning size={size} className={`${className} text-purple-400 drop-shadow-[0_0_16px_rgba(168,85,247,0.6)] animate-bounce`} />;

    case "13": // Snow
      return <Snowflake size={size} className={`${className} text-sky-200 drop-shadow-[0_0_15px_rgba(224,242,254,0.6)]`} />;

    case "50": // Mist / Fog / Haze
      return <CloudFog size={size} className={`${className} text-teal-300 drop-shadow-[0_0_10px_rgba(94,234,212,0.3)]`} />;

    default:
      return <Sun size={size} className={`${className} text-amber-400`} />;
  }
}

WeatherIcon.propTypes = {
  code: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.number,
};
