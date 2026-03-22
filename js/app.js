import {
    getForecastByCity,
    getForecastByCoords,
    getLocationNameByCoords,
    getWeatherByCity,
    getWeatherByCoords,
} from "./api.js";
import {
    formatDailyForecast,
    formatHourlyForecast,
    formatTimeFromUnix,
    formatTodayWeather,
    formatVisibility,
    getForecastSummary,
    getGradient,
    getPrecipitationTotal,
    getSkyTheme,
} from "./weather.js";

const DEFAULT_CITY = "Winnipeg";
const NEIGHBORHOOD_HINTS = [
    "centre",
    "center",
    "downtown",
    "district",
    "quarter",
    "heights",
    "industrial",
    "park",
    "airport",
    "campus",
    "village",
];

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
    atmospherePressure: document.getElementById("atmosphere-pressure"),
    atmosphereFeelsLike: document.getElementById("atmosphere-feels-like"),
    atmosphereWind: document.getElementById("atmosphere-wind"),
    visibility: document.getElementById("visibility"),
    visibilityText: document.getElementById("visibility-text"),
    precipitation: document.getElementById("precipitation"),
    daylightDuration: document.getElementById("daylight-duration"),
    rainChance: document.getElementById("rain-chance"),
    cloudCover: document.getElementById("cloud-cover"),
    geoCoords: document.getElementById("geo-coords"),
    sunrise: document.getElementById("sunrise"),
    sunset: document.getElementById("sunset"),
    sunArcProgress: document.getElementById("sun-arc-progress"),
    sunDot: document.getElementById("sun-dot"),
    weatherIcon: document.getElementById("weather-icon"),
    hourlyForecast: document.getElementById("hourly-forecast"),
    forecast: document.getElementById("forecast"),
    skyGradient: document.querySelector(".sky-gradient"),
    footerLocation: document.getElementById("footer-location"),
};

function setStatusMessage(message = "", type = "info") {
    elements.statusMessage.textContent = message;
    elements.statusMessage.dataset.state = message ? type : "";
}

function setLoadingState(isLoading, mode = "search") {
    elements.searchButton.disabled = isLoading;
    elements.locationButton.disabled = isLoading;
    elements.searchButton.textContent = isLoading && mode === "search" ? "Searching..." : "Search";
    elements.locationButton.textContent = isLoading && mode === "location" ? "Locating..." : "Use My Location";
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

function buildRangeBounds(forecastDays) {
    if (!forecastDays.length) {
        return { min: 0, max: 0, span: 1 };
    }

    const lows = forecastDays.map((day) => day.low);
    const highs = forecastDays.map((day) => day.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);

    return {
        min,
        max,
        span: Math.max(1, max - min),
    };
}

function renderHourlyForecast(hourlyForecast) {
    elements.hourlyForecast.innerHTML = "";

    hourlyForecast.forEach((hour) => {
        const card = document.createElement("article");
        card.className = "hour-card";

        const label = document.createElement("span");
        label.className = "hour-label";
        label.textContent = hour.label;

        const icon = document.createElement("img");
        icon.src = hour.icon;
        icon.alt = capitalizeFirstLetter(hour.iconAlt);

        const temp = document.createElement("strong");
        temp.textContent = `${hour.temp}°`;

        card.append(label, icon, temp);
        elements.hourlyForecast.appendChild(card);
    });
}

function renderForecast(forecastDays) {
    elements.forecast.innerHTML = "";
    const bounds = buildRangeBounds(forecastDays);

    forecastDays.forEach((day, index) => {
        const forecastCard = document.createElement("article");
        forecastCard.className = "forecast-card";

        const weekday = index === 0
            ? "Today"
            : new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });

        const dayLabel = document.createElement("h4");
        dayLabel.textContent = weekday;

        const icon = document.createElement("img");
        icon.src = day.icon;
        icon.alt = capitalizeFirstLetter(day.iconAlt);

        const tempRange = document.createElement("div");
        tempRange.className = "temp-range";

        const low = document.createElement("span");
        low.textContent = `${day.low}°`;

        const rangeTrack = document.createElement("div");
        rangeTrack.className = "range-track";

        const rangeFill = document.createElement("div");
        rangeFill.className = "range-fill";
        rangeFill.style.left = `${((day.low - bounds.min) / bounds.span) * 100}%`;
        rangeFill.style.width = `${((day.high - day.low) / bounds.span) * 100}%`;

        const high = document.createElement("strong");
        high.textContent = `${day.high}°`;

        rangeTrack.appendChild(rangeFill);
        tempRange.append(low, rangeTrack, high);
        forecastCard.append(dayLabel, icon, tempRange);
        elements.forecast.appendChild(forecastCard);
    });
}

function updateSunArc(currentWeather) {
    if (!currentWeather.sunrise || !currentWeather.sunset) {
        return;
    }

    const nowSeconds = Math.floor(Date.now() / 1000);
    const dayProgressRaw =
        (nowSeconds - currentWeather.sunrise) / (currentWeather.sunset - currentWeather.sunrise);
    const dayProgress = Math.min(1, Math.max(0, dayProgressRaw));

    const visibleArc = Math.max(2, dayProgress * 100);
    elements.sunArcProgress.style.strokeDasharray = `${visibleArc} 100`;
    elements.sunArcProgress.style.strokeDashoffset = "0";

    const centerX = 120;
    const centerY = 100;
    const radius = 100;
    const angle = Math.PI * (1 - dayProgress);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);

    elements.sunDot.setAttribute("cx", x.toFixed(2));
    elements.sunDot.setAttribute("cy", y.toFixed(2));
}

function scoreResolvedLocation(location) {
    const name = (location?.name ?? "").toLowerCase();
    let score = 0;

    if (location?.state) {
        score += 2;
    }

    if (name.includes("winnipeg")) {
        score += 5;
    }

    if (!NEIGHBORHOOD_HINTS.some((hint) => name.includes(hint))) {
        score += 3;
    }

    if (name.split(" ").length <= 2) {
        score += 1;
    }

    return score;
}

function getBestResolvedLocation(locations, fallbackWeather) {
    if (!Array.isArray(locations) || !locations.length) {
        return `${fallbackWeather.city}${fallbackWeather.country ? `, ${fallbackWeather.country}` : ""}`;
    }

    const bestMatch = [...locations].sort((left, right) => {
        return scoreResolvedLocation(right) - scoreResolvedLocation(left);
    })[0];

    return `${bestMatch.name}${bestMatch.country ? `, ${bestMatch.country}` : ""}`;
}

function updateWeatherUI(weatherData, forecastData, resolvedLocationLabel = "") {
    const currentWeather = formatTodayWeather(weatherData);
    const dailyForecast = formatDailyForecast(forecastData);
    const hourlyForecast = formatHourlyForecast(forecastData);
    const precipitation = getPrecipitationTotal(forecastData);
    const forecastSummary = getForecastSummary(currentWeather, forecastData);
    const locationLabel =
        resolvedLocationLabel || `${currentWeather.city}${currentWeather.country ? `, ${currentWeather.country}` : ""}`;

    elements.heroDate.textContent = formatDisplayDate();
    elements.temperature.textContent = `${currentWeather.temperature}°`;
    elements.cityName.textContent = locationLabel;
    elements.conditionText.textContent = capitalizeFirstLetter(currentWeather.description);
    elements.highTemp.textContent = `H: ${currentWeather.high}°`;
    elements.lowTemp.textContent = `L: ${currentWeather.low}°`;
    elements.humidity.textContent = `${currentWeather.humidity}%`;
    elements.wind.textContent = `${currentWeather.wind} km/h`;
    elements.feelsLike.textContent = `${currentWeather.feelsLike}°`;
    elements.pressure.textContent = `${currentWeather.pressure} hPa`;
    elements.atmospherePressure.textContent = `${currentWeather.pressure} hPa`;
    elements.atmosphereFeelsLike.textContent = `${currentWeather.feelsLike}°`;
    elements.atmosphereWind.textContent = `${currentWeather.wind} km/h`;
    elements.visibility.textContent = formatVisibility(currentWeather.visibility);
    elements.visibilityText.textContent = currentWeather.visibility >= 9000
        ? "Visibility remains strong in the current observation window."
        : "Visibility is reduced compared with a clear-sky day.";
    elements.precipitation.textContent = precipitation;
    elements.daylightDuration.textContent = forecastSummary.daylightDuration;
    elements.rainChance.textContent = forecastSummary.maxRainChance;
    elements.cloudCover.textContent = forecastSummary.averageCloudCover;
    elements.geoCoords.textContent = forecastSummary.coordinates;
    elements.sunrise.textContent = formatTimeFromUnix(currentWeather.sunrise, currentWeather.timezoneOffset);
    elements.sunset.textContent = formatTimeFromUnix(currentWeather.sunset, currentWeather.timezoneOffset);
    elements.weatherIcon.src = currentWeather.icon;
    elements.weatherIcon.alt = capitalizeFirstLetter(currentWeather.iconAlt);
    elements.footerLocation.textContent = `Weather for ${locationLabel.split(",")[0]} • Wamiq's Weather Forecast © 2026`;

    renderHourlyForecast(hourlyForecast);
    renderForecast(dailyForecast);
    updateSunArc(currentWeather);

    const weatherTheme = getSkyTheme(currentWeather.weatherCode);
    elements.skyGradient.style.background = getGradient(weatherTheme);
}

async function loadWeatherData(fetchWeather, fetchForecast, mode = "search") {
    setLoadingState(true, mode);
    setStatusMessage(mode === "location" ? "Getting your location..." : "Loading weather data...");

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

async function loadWeatherDataByLocation(lat, lon) {
    setLoadingState(true, "location");
    setStatusMessage("Loading weather data...");

    try {
        const [weatherData, forecastData, locationResults] = await Promise.all([
            getWeatherByCoords(lat, lon),
            getForecastByCoords(lat, lon),
            getLocationNameByCoords(lat, lon).catch(() => []),
        ]);

        const currentWeather = formatTodayWeather(weatherData);
        const resolvedLocationLabel = getBestResolvedLocation(locationResults, currentWeather);
        updateWeatherUI(weatherData, forecastData, resolvedLocationLabel);
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
        () => getForecastByCity(city),
        "search"
    );
}

function loadWeatherByLocation() {
    if (!navigator.geolocation) {
        setStatusMessage("Geolocation is not supported in this browser.", "error");
        return;
    }

    setLoadingState(true, "location");
    setStatusMessage("Requesting access to your current location...");

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            await loadWeatherDataByLocation(coords.latitude, coords.longitude);
        },
        (error) => {
            setLoadingState(false);

            if (error.code === error.PERMISSION_DENIED) {
                setStatusMessage("Location permission was denied. Please allow location access in your browser and try again.", "error");
                return;
            }

            if (error.code === error.POSITION_UNAVAILABLE) {
                setStatusMessage("Your location could not be determined right now. Please try again or search by city.", "error");
                return;
            }

            if (error.code === error.TIMEOUT) {
                setStatusMessage("Location request timed out. Please try again or search by city.", "error");
                return;
            }

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
    () => getForecastByCity(DEFAULT_CITY),
    "search"
);
