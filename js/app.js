// ------------------------------------------------------
// App Logic & UI Rendering
// ------------------------------------------------------

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
    isDaytime
} from "./weather.js";


// DOM Elements
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


// ------------------------------------------------------
// MAIN ENTRY POINT
// ------------------------------------------------------
async function loadWeather(city) {
    try {
        const weatherData = await getWeatherByCity(city);
        const forecastData = await getForecastByCity(city);

        updateUI(weatherData, forecastData);

    } catch (error) {
        alert("City not found. Try again.");
    }
}


// ------------------------------------------------------
// UI UPDATE FUNCTION
// ------------------------------------------------------
function updateUI(weatherData, forecastData) {
    const today = formatTodayWeather(weatherData);
    const forecast = formatForecast(forecastData);

    // Update hero
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

    // Render forecast
    renderForecast(forecast);

    // Update sky theme
    const isDay = isDaytime(weatherData);
    const theme = getSkyTheme(today.weatherCode, isDay);

    applySkyTheme(theme);
}


// ------------------------------------------------------
// RENDER FORECAST CARDS
// ------------------------------------------------------
function renderForecast(forecastData) {
    forecastContainer.innerHTML = "";

    forecastData.forEach((day, index) => {
        const dateObj = new Date(day.date);
        const weekday = dateObj.toLocaleDateString("en-US", { weekday: "short" });

        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.style.setProperty("--delay", `${index * 0.15}s`);

        card.innerHTML = `
            <h4>${weekday}</h4>
            <img src="${day.icon}" alt="">
            <p>${day.temp}°</p>
        `;

        forecastContainer.appendChild(card);
    });
}


// ------------------------------------------------------
// APPLY SKY ANIMATION THEME
// ------------------------------------------------------
function applySkyTheme(theme) {
    const gradient = document.querySelector(".sky-gradient");
    const stars = document.querySelector(".stars-layer");
    const rain = document.querySelector(".rain-layer");
    const fog = document.querySelector(".fog-layer");

    // Reset layers
    stars.style.opacity = 0;
    rain.classList.remove("rain-active");
    fog.style.opacity = 0;

    switch (theme) {
        case "clear-day":
            gradient.style.background = "linear-gradient(to bottom, #4facfe, #00f2fe)";
            break;

        case "clear-night":
            gradient.style.background = "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)";
            stars.style.opacity = 0.35;
            break;

        case "cloudy-day":
            gradient.style.background = "linear-gradient(to bottom, #d7dde8, #757f9a)";
            break;

        case "cloudy-night":
            gradient.style.background = "linear-gradient(to bottom, #434343, #000000)";
            stars.style.opacity = 0.2;
            break;

        case "rain":
            gradient.style.background = "linear-gradient(to bottom, #667db6, #0082c8, #0082c8, #667db6)";
            rain.classList.add("rain-active");
            break;

        case "snow":
            gradient.style.background = "linear-gradient(to bottom, #e0eafc, #cfdef3)";
            break;

        case "fog":
            gradient.style.background = "linear-gradient(to bottom, #a6a6a6, #d5d5d5)";
            fog.style.opacity = 0.5;
            break;

        default:
            gradient.style.background = "linear-gradient(to bottom, #4facfe, #00f2fe)";
    }
}


// ------------------------------------------------------
// SEARCH BUTTON
// ------------------------------------------------------
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) loadWeather(city);
});

// ENTER KEY SEARCH
cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) loadWeather(city);
    }
});


// ------------------------------------------------------
// GEOLOCATION BUTTON
// ------------------------------------------------------
locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;

        const weatherData = await getWeatherByCoords(latitude, longitude);
        const forecastData = await getForecastByCoords(latitude, longitude);

        updateUI(weatherData, forecastData);
    });
});


// ------------------------------------------------------
// UTILITY
// ------------------------------------------------------
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


// ------------------------------------------------------
// INITIAL LOAD (DEFAULT CITY)
// ------------------------------------------------------
loadWeather("Winnipeg");
