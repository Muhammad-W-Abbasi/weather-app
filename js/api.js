// ------------------------------------------------------
// Weather API Module
// ------------------------------------------------------

const API_KEY = "2b92dc5d53890ef7b0ded6cf2e0244f0";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Fetch weather by city name
export async function getWeatherByCity(city) {
    try {
        const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching city weather:", error);
        throw error;
    }
}

// Fetch 5-day forecast by city name
export async function getForecastByCity(city) {
    try {
        const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Forecast not available");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching forecast:", error);
        throw error;
    }
}

// Fetch weather using geolocation
export async function getWeatherByCoords(lat, lon) {
    try {
        const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Location weather not found");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching location weather:", error);
        throw error;
    }
}

// Fetch forecast using geolocation
export async function getForecastByCoords(lat, lon) {
    try {
        const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Location forecast not found");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching location forecast:", error);
        throw error;
    }
}
