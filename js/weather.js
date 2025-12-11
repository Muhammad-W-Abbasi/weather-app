/* ----------------------------------------
   Weather Data Formatter
   Converts raw API data into a clean object
   for the UI to display.
---------------------------------------- */

function formatWeatherData(apiData) {
    if (!apiData) return null;

    return {
        city: apiData.name,
        temperature: `${Math.round(apiData.main.temp)}°C`,
        description: capitalize(apiData.weather[0].description),
        humidity: `Humidity: ${apiData.main.humidity}%`,
        wind: `Wind: ${Math.round(apiData.wind.speed)} m/s`
    };
}

/* Capitalize weather description text */
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
