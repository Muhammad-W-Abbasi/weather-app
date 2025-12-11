/* ----------------------------------------
   API Module
   Handles all communication with OpenWeather
---------------------------------------- */

const API_KEY = "2b92dc5d53890ef7b0ded6cf2e0244f0";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/* Fetch weather data by city name */
async function fetchWeather(city) {
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

        const response = await fetch(url);

        // Handle non-200 responses
        if (!response.ok) {
            throw new Error("City not found or API request failed.");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("API Error:", error);
        return null; // app.js will handle null results
    }
}
