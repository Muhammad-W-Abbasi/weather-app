import {
    getForecastByCity,
    getForecastByCoords,
    getWeatherByCity,
    getWeatherByCoords,
} from "./api.js";
import {
    formatForecast,
    formatTodayWeather,
    getGradient,
    getSkyTheme,
} from "./weather.js";

const DEFAULT_CITY = "Winnipeg";

const elements = {
    cityInput: document.getElementById("city-input"),
    searchButton: document.getElementById("search-btn"),
    locationButton: document.getElementById("location-btn"),
    statusMessage: document.getElementById("status-message"),
    heroDate: document.getElementById("hero-date"),
    temperature: document.getElementById("temperature"),
    cityName: document.getElementById("city-name"),
    conditionText: document.getElementById("condition-text"),
    highTemp: document.getElementById("high-temp"),
    lowTemp: document.getElementById("low-temp"),
    humidity: document.getElementById("humidity"),
    wind: document.getElementById("wind"),
    feelsLike: document.getElementById("feels-like"),
    pressure: document.getElementById("pressure"),
    weatherIcon: document.getElementById("weather-icon"),
    forecast: document.getElementById("forecast"),
    skyGradient: document.querySelector(".sky-gradient"),
};

function setStatusMessage(message = "", type = "info") {
    elements.statusMessage.textContent = message;
    elements.statusMessage.dataset.state = message ? type : "";
}

function setLoadingState(isLoading) {
    elements.searchButton.disabled = isLoading;
    elements.locationButton.disabled = isLoading;
    elements.searchButton.textContent = isLoading ? "Searching..." : "Search";
    elements.locationButton.textContent = isLoading ? "Locating..." : "Use My Location";
}

function formatDisplayDate(date = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    }).format(date);
}

function capitalizeFirstLetter(value) {
    if (!value) {
        return "";
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderForecast(forecastDays) {
    elements.forecast.innerHTML = "";

    forecastDays.forEach((day, index) => {
        const forecastCard = document.createElement("article");
        forecastCard.className = "forecast-card";
        forecastCard.style.setProperty("--delay", `${index * 0.15}s`);

        const weekday = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });

        const dayLabel = document.createElement("h4");
        dayLabel.textContent = weekday;

        const icon = document.createElement("img");
        icon.src = day.icon;
        icon.alt = capitalizeFirstLetter(day.iconAlt);

        const temperature = document.createElement("p");
        temperature.textContent = `${day.temp}°`;

        forecastCard.append(dayLabel, icon, temperature);

        elements.forecast.appendChild(forecastCard);
    });
}

function updateWeatherUI(weatherData, forecastData) {
    const currentWeather = formatTodayWeather(weatherData);
    const forecast = formatForecast(forecastData);

    elements.heroDate.textContent = formatDisplayDate();
    elements.temperature.textContent = `${currentWeather.temperature}°`;
    elements.cityName.textContent = currentWeather.city;
    elements.conditionText.textContent = capitalizeFirstLetter(currentWeather.description);
    elements.highTemp.textContent = `H: ${currentWeather.high}°`;
    elements.lowTemp.textContent = `L: ${currentWeather.low}°`;
    elements.humidity.textContent = `${currentWeather.humidity}%`;
    elements.wind.textContent = `${currentWeather.wind} km/h`;
    elements.feelsLike.textContent = `${currentWeather.feelsLike}°`;
    elements.pressure.textContent = `${currentWeather.pressure} hPa`;

    elements.weatherIcon.src = currentWeather.icon;
    elements.weatherIcon.alt = capitalizeFirstLetter(currentWeather.iconAlt);

    renderForecast(forecast);

    const weatherTheme = getSkyTheme(currentWeather.weatherCode);
    elements.skyGradient.style.background = getGradient(weatherTheme);
}

async function loadWeatherData(fetchWeather, fetchForecast) {
    setLoadingState(true);
    setStatusMessage("Loading weather data...");

    try {
        const [weatherData, forecastData] = await Promise.all([
            fetchWeather(),
            fetchForecast(),
        ]);

        updateWeatherUI(weatherData, forecastData);
        setStatusMessage("");
    } catch (error) {
        setStatusMessage(error.message || "Unable to load weather data.", "error");
    } finally {
        setLoadingState(false);
    }
}

function handleCitySearch() {
    const city = elements.cityInput.value.trim();

    if (!city) {
        setStatusMessage("Enter a city name to search.", "error");
        elements.cityInput.focus();
        return;
    }

    loadWeatherData(
        () => getWeatherByCity(city),
        () => getForecastByCity(city)
    );
}

function loadWeatherByLocation() {
    if (!navigator.geolocation) {
        setStatusMessage("Geolocation is not supported in this browser.", "error");
        return;
    }

    setLoadingState(true);
    setStatusMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            await loadWeatherData(
                () => getWeatherByCoords(coords.latitude, coords.longitude),
                () => getForecastByCoords(coords.latitude, coords.longitude)
            );
        },
        () => {
            setLoadingState(false);
            setStatusMessage("We couldn't access your location. Please search by city instead.", "error");
        },
        { enableHighAccuracy: true, timeout: 10000 }
    );
}

elements.searchButton.addEventListener("click", handleCitySearch);
elements.cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleCitySearch();
    }
});
elements.locationButton.addEventListener("click", loadWeatherByLocation);

loadWeatherData(
    () => getWeatherByCity(DEFAULT_CITY),
    () => getForecastByCity(DEFAULT_CITY)
);
