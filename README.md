# 🌤️ React Weather App (`weather-app`)
### 🚀 A Minimal, Clean Weather Dashboard built with React & Vite

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-Linter-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![OpenWeatherMap API](https://img.shields.io/badge/OpenWeatherMap_API-v2.5-orange?style=for-the-badge&logo=openweathermap&logoColor=white)](https://openweathermap.org/)

A responsive, beautiful weather forecasting dashboard that queries global cities and returns real-time conditions using the OpenWeatherMap API.

---

## ✨ Features

* **Real-time Queries:** Search weather details for any global city instantly.
* **Atmospheric Data Points:** Displays temperature (Celsius), "Feels Like" index, wind speed (km/h), humidity percentage, and coordinates (Latitude/Longitude).
* **Local Sun Schedule:** Automatically converts raw API UTC timestamps into local-formatted Sunrise and Sunset times.
* **Dynamic Weather Icons:** Adapts display icons to reflect current outdoor conditions (Clear Sky, Rain, Snow, Drizzle, Sunny).
* **Input Helper Listeners:** Supports search queries via mouse clicks or hitting the `Enter` key.
* **State Management:** Loading spinners, error handlers, and "City Not Found" fallbacks.

---

## 🛠️ Tech Stack & Requirements

* **Frontend:** React 18 (Hooks), Vite, CSS3
* **API Fetching:** Native Fetch API
* **API Integration:** OpenWeatherMap API (Current Weather Data endpoint)

---

## 🚀 Setup & Local Development

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/RakeshKanna1/weather-app.git
   cd weather-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure API Credentials:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and insert your OpenWeatherMap API key:
   ```env
   VITE_OPENWEATHER_API_KEY=your-api-key-here
   ```
   *Note: If you do not have an API key, register a free developer account at [openweathermap.org](https://openweathermap.org/) to generate one.*

4. **Run the App:**
   ```bash
   npm run dev
   ```
   Open the terminal link (defaults to [http://localhost:5173](http://localhost:5173)) in your browser.

---

## 🔒 Security Information

* **Safeguarded Keys:** In compliance with security standards, the OpenWeatherMap API key has been refactored to read from Vite's `import.meta.env` system rather than being hardcoded in code.
* **Git Safety:** Ensure the `.env` file containing your private API key is never committed to GitHub. The [.gitignore](.gitignore) file has been pre-configured to block it automatically.
