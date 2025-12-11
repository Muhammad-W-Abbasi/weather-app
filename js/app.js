import {
    getWeatherByCity,
    getForecastByCity,
    getWeatherByCoords,
    getForecastByCoords
} from "./api.js";

import {
    formatTodayWeather,
    formatForecast,
    getSkyTheme,
    getGradient
} from "./weather.js";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");

const tempEl = document.getElementById("temperature");
const cityEl = document.getElementById("city-name");
const conditionEl = document.getElementById("condition-text");
const highEl = document.getElementById("high-temp");
const lowEl = document.getElementById("low-temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const feelsEl = document.getElementById("feels-like");
const pressureEl = document.getElementById("pressure");
const iconEl = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("forecast");
const sky = document.querySelector(".sky-gradient");

async function loadWeather(city) {
    try {
        const weatherData = await getWeatherByCity(city);
        const forecastData = await getForecastByCity(city);

        updateUI(weatherData, forecastData);
    } catch {
        alert("City not found.");
    }
}

function updateUI(weatherData, forecastData) {
    const today = formatTodayWeather(weatherData);
    const forecast = formatForecast(forecastData);

    tempEl.textContent = `${today.temperature}°`;
    cityEl.textContent = today.city;
    conditionEl.textContent = capitalize(today.description);
    highEl.textContent = `H: ${today.high}°`;
    lowEl.textContent = `L: ${today.low}°`;
    humidityEl.textContent = `${today.humidity}%`;
    windEl.textContent = `${today.wind} km/h`;
    feelsEl.textContent = `${today.feels_like}°`;
    pressureEl.textContent = `${today.pressure} hPa`;

    iconEl.src = today.icon;

    renderForecast(forecast);

    const theme = getSkyTheme(today.weatherCode);
    sky.style.background = getGradient(theme);
}

function renderForecast(list) {
    forecastContainer.innerHTML = "";

    list.forEach((day, i) => {
        const el = document.createElement("div");
        el.className = "forecast-card";
        el.style.setProperty("--delay", `${i * 0.15}s`);

        const date = new Date(day.date);
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

        el.innerHTML = `
            <h4>${weekday}</h4>
            <img src="${day.icon}" alt="">
            <p>${day.temp}°</p>
        `;

        forecastContainer.appendChild(el);
    });
}

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim()) loadWeather(cityInput.value.trim());
});

cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && cityInput.value.trim()) {
        loadWeather(cityInput.value.trim());
    }
});

locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const weatherData = await getWeatherByCoords(lat, lon);
        const forecastData = await getForecastByCoords(lat, lon);

        updateUI(weatherData, forecastData);
    });
});

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

loadWeather("Winnipeg");
