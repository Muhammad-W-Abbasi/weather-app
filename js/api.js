const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const DEFAULT_UNITS = "metric";
const RUNTIME_CONFIG = globalThis.WEATHER_APP_CONFIG ?? {};

const API_KEY = RUNTIME_CONFIG.openWeatherApiKey || "2b92dc5d53890ef7b0ded6cf2e0244f0";

async function fetchWeatherData(endpoint, params) {
    if (!API_KEY) {
        throw new Error("Weather service is not configured.");
    }

    const searchParams = new URLSearchParams({
        appid: API_KEY,
        units: DEFAULT_UNITS,
        ...params,
    });

    const response = await fetch(`${BASE_URL}/${endpoint}?${searchParams.toString()}`);

    if (!response.ok) {
        const fallbackMessage = response.status === 404
            ? "We couldn't find weather data for that location."
            : "Unable to load weather data right now.";
        throw new Error(fallbackMessage);
    }

    return response.json();
}

export function getWeatherByCity(city) {
    return fetchWeatherData("weather", { q: city.trim() });
}

export function getForecastByCity(city) {
    return fetchWeatherData("forecast", { q: city.trim() });
}

export function getWeatherByCoords(lat, lon) {
    return fetchWeatherData("weather", { lat, lon });
}

export function getForecastByCoords(lat, lon) {
    return fetchWeatherData("forecast", { lat, lon });
}

export async function getLocationNameByCoords(lat, lon) {
    if (!API_KEY) {
        throw new Error("Weather service is not configured.");
    }

    const searchParams = new URLSearchParams({
        lat,
        lon,
        limit: 5,
        appid: API_KEY,
    });

    const response = await fetch(`${GEO_URL}/reverse?${searchParams.toString()}`);

    if (!response.ok) {
        throw new Error("Unable to resolve your current location name.");
    }

    return response.json();
}
