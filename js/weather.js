// ------------------------------------------------------
// Weather Data Formatting & Theme Logic
// ------------------------------------------------------

// Map OpenWeather icon codes → premium icon URLs
export function getIconForWeather(weatherCode) {
    const code = String(weatherCode);

    if (code.startsWith("2")) return "https://i.imgur.com/8Y9Q93R.png"; // Thunderstorm
    if (code.startsWith("3")) return "https://i.imgur.com/7nQSdJc.png"; // Drizzle
    if (code.startsWith("5")) return "https://i.imgur.com/9b0J7vK.png"; // Rain
    if (code.startsWith("6")) return "https://i.imgur.com/gqI3p3y.png"; // Snow
    if (code.startsWith("7")) return "https://i.imgur.com/K3pI6rj.png"; // Fog/Mist
    if (code === "800")     return "https://i.imgur.com/afP6QKb.png"; // Clear
    if (code.startsWith("80")) return "https://i.imgur.com/9Qe7dQO.png"; // Clouds

    return "https://i.imgur.com/afP6QKb.png"; // Fallback: Clear
}

// ------------------------------------------------------
// SKY THEME SELECTION
// ------------------------------------------------------
export function getSkyTheme(weatherCode, isDaytime) {
    const code = Number(weatherCode);

    // Clear skies
    if (code === 800) {
        return isDaytime ? "clear-day" : "clear-night";
    }

    // Clouds
    if (code >= 801 && code <= 804) {
        return isDaytime ? "cloudy-day" : "cloudy-night";
    }

    // Rain
    if (code >= 500 && code <= 531) {
        return "rain";
    }

    // Snow
    if (code >= 600 && code <= 622) {
        return "snow";
    }

    // Fog / Mist / Smoke
    if (code >= 700 && code <= 799) {
        return "fog";
    }

    return "clear-day";
}

// ------------------------------------------------------
// FORMAT TODAY'S WEATHER
// ------------------------------------------------------
export function formatTodayWeather(data) {
    const weatherCode = data.weather[0].id;
    const icon = getIconForWeather(weatherCode);

    return {
        temperature: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
        pressure: data.main.pressure,
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        description: data.weather[0].description,
        city: data.name,
        icon,
        weatherCode
    };
}

// ------------------------------------------------------
// FORMAT 5-DAY FORECAST (Simplified from 3-hour blocks)
// ------------------------------------------------------
export function formatForecast(data) {
    const dailyMap = {};

    data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];

        if (!dailyMap[date]) {
            dailyMap[date] = {
                temps: [],
                weatherCodes: []
            };
        }

        dailyMap[date].temps.push(entry.main.temp);
        dailyMap[date].weatherCodes.push(entry.weather[0].id);
    });

    // Convert to a clean 5-day list
    const days = Object.keys(dailyMap)
        .slice(0, 5)
        .map(date => {
            const temps = dailyMap[date].temps;
            const codes = dailyMap[date].weatherCodes;

            const avgTemp = Math.round(
                temps.reduce((a, b) => a + b) / temps.length
            );

            // Choose most common weather code
            const weatherCode =
                codes.sort(
                    (a, b) =>
                        codes.filter(v => v === a).length -
                        codes.filter(v => v === b).length
                ).pop();

            return {
                date,
                temp: avgTemp,
                icon: getIconForWeather(weatherCode)
            };
        });

    return days;
}

// ------------------------------------------------------
// DETERMINE IF DAY OR NIGHT
// ------------------------------------------------------
export function isDaytime(weatherData) {
    const now = Date.now() / 1000;
    return now > weatherData.sys.sunrise && now < weatherData.sys.sunset;
}
