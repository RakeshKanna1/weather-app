import PropTypes from "prop-types";
import { ShieldCheck, AlertTriangle, Wind, Info } from "lucide-react";

export default function AirQualityCard({ aqiData }) {
  if (!aqiData) return null;

  const { level, label, color, description, advisory, components = {} } = aqiData;

  const pollutants = [
    { name: "PM2.5", value: components.pm2_5 ? Math.round(components.pm2_5) : "--", unit: "µg/m³", desc: "Fine Particles" },
    { name: "PM10", value: components.pm10 ? Math.round(components.pm10) : "--", unit: "µg/m³", desc: "Coarse Dust" },
    { name: "NO₂", value: components.no2 ? Math.round(components.no2) : "--", unit: "µg/m³", desc: "Nitrogen Dioxide" },
    { name: "O₃", value: components.o3 ? Math.round(components.o3) : "--", unit: "µg/m³", desc: "Ozone" },
    { name: "SO₂", value: components.so2 ? Math.round(components.so2) : "--", unit: "µg/m³", desc: "Sulfur Dioxide" },
    { name: "CO", value: components.co ? Math.round(components.co) : "--", unit: "µg/m³", desc: "Carbon Monoxide" },
  ];

  return (
    <div className="aqi-card">
      <div className="aqi-header">
        <div className="aqi-title-wrap">
          <Wind size={18} className="text-cyan-400" />
          <span className="aqi-title">Air Quality Index</span>
        </div>
        <div
          className="aqi-badge"
          style={{
            backgroundColor: `${color}20`,
            borderColor: `${color}40`,
            color: color,
          }}
        >
          {level <= 2 ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
          <span>{label} · Level {level} of 5</span>
        </div>
      </div>

      <div className="aqi-bar-track">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`aqi-step ${step <= level ? "active" : ""}`}
            style={{
              backgroundColor: step <= level ? color : "rgba(255, 255, 255, 0.08)",
            }}
          />
        ))}
      </div>

      <p className="aqi-desc">{description}</p>
      <div className="aqi-advisory">
        <Info size={14} className="text-amber-400 shrink-0" />
        <span>{advisory}</span>
      </div>

      <div className="pollutants-grid">
        {pollutants.map((p, idx) => (
          <div key={idx} className="pollutant-item">
            <div className="pollutant-name">{p.name}</div>
            <div className="pollutant-value">{p.value} <span className="pollutant-unit">{p.unit}</span></div>
            <div className="pollutant-desc">{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

AirQualityCard.propTypes = {
  aqiData: PropTypes.object,
};
