// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";

export default function Sidebar() {
  const [weather, setWeather] = useState({
    loading: true,
    error: null,
    min: null,
    max: null,
    date: null,
  });

  useEffect(() => {
    // Open-Meteo query for London (as in lab sheet)
    const url = "https://api.open-meteo.com/v1/forecast?latitude=51.5085&longitude=-0.1257&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FLondon&forecast_days=1&models=ukmo_seamless";

    let cancelled = false;

    async function fetchWeather() {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Defensive parsing: open-meteo returns daily.{time,temperature_2m_max,temperature_2m_min}
        const daily = data?.daily;
        if (!daily || !daily.time || !daily.temperature_2m_min || !daily.temperature_2m_max) {
          throw new Error("Unexpected API response shape");
        }

        // Using first day (forecast_days=1)
        const date = daily.time[0];
        const min = daily.temperature_2m_min[0];
        const max = daily.temperature_2m_max[0];

        if (!cancelled) {
          setWeather({ loading: false, error: null, min, max, date });
        }
      } catch (err) {
        if (!cancelled) {
          setWeather({ loading: false, error: err.message, min: null, max: null, date: null });
        }
      }
    }

    fetchWeather();

    return () => {
      cancelled = true; // cleanup in case component unmounts
    };
  }, []); // run once on mount

  return (
    <aside className="sidebar p-4">
      <h3 className="text-lg font-semibold mb-2">Sidebar</h3>

      <section className="weather-card p-3 rounded-md shadow-sm">
        <h4 className="font-medium mb-1">Today's forecast (London)</h4>

        {weather.loading && <p>Loading weather…</p>}
        {weather.error && <p className="text-red-600">Error: {weather.error}</p>}

        {!weather.loading && !weather.error && (
          <div>
            <p className="text-sm text-gray-600">Date: {weather.date}</p>
            <p className="mt-2">
              Min: <strong>{weather.min}°C</strong>
            </p>
            <p>
              Max: <strong>{weather.max}°C</strong>
            </p>
          </div>
        )}
      </section>

      {/* other sidebar content */}
    </aside>
  );
}
