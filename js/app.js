/* ----------------------------------------
   Application Controller
   Handles UI events and rendering logic
---------------------------------------- */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const errorMessage = document.getElementById("errorMessage");
const weatherDisplay = document.getElementById("weatherDisplay");

const cityNameEl = document.getElementById("cityName");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

/* Main function: fetch → format → render */
async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") return;

    const apiData = await fetchWeather(city);
    const formatted = formatWeatherData(apiData);

    if (!formatted) {
        showError();
        return;
    }

    hideError();
    renderWeather(formatted);
}

/* Render the formatted weather data into the UI */
function renderWeather(data) {
    cityNameEl.textContent = data.city;
    temperatureEl.textContent = data.temperature;
    descriptionEl.textContent = data.description;
    humidityEl.textContent = data.humidity;
    windEl.textContent = data.wind;

    weatherDisplay.classList.remove("hidden");
}

/* Display an error message */
function showError() {
    errorMessage.classList.remove("hidden");
    weatherDisplay.classList.add("hidden");
}

/* Hide the error display */
function hideError() {
    errorMessage.classList.add("hidden");
}

/* Event: click search button */
searchBtn.addEventListener("click", () => {
    getWeather();
});

/* Event: press Enter key */
cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
        getWeather();
    }
});
