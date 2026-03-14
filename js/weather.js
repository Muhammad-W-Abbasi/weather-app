export function formatTodayWeather(data) {
    const primaryWeather = data.weather[0];

    return {
        city: data.name,
        description: primaryWeather.description,
        temperature: Math.round(data.main.temp),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        icon: `https://openweathermap.org/img/wn/${primaryWeather.icon}@2x.png`,
        iconAlt: primaryWeather.description,
        weatherCode: primaryWeather.id
    };
}

export function formatForecast(forecast) {
    const dailyForecast = [];
    const seenDates = new Set();

    for (const entry of forecast.list) {
        const date = entry.dt_txt.split(" ")[0];

        if (!seenDates.has(date) && dailyForecast.length < 5) {
            dailyForecast.push({
                date,
                temp: Math.round(entry.main.temp),
                icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
                iconAlt: entry.weather[0].description,
            });

            seenDates.add(date);
        }
    }

    return dailyForecast;
}

export function getSkyTheme(code) {
    if (code >= 200 && code < 600) return "storm";
    if (code >= 600 && code < 700) return "snow";
    if (code >= 700 && code < 800) return "fog";
    if (code === 800) return "clear";
    if (code > 800) return "cloudy";
    return "clear";
}

export function getGradient(theme) {
    switch (theme) {
        case "clear":
            return "linear-gradient(to bottom, #4facfe, #00f2fe)";
        case "cloudy":
            return "linear-gradient(to bottom, #8e9eab, #eef2f3)";
        case "fog":
            return "linear-gradient(to bottom, #cfd9df, #e2ebf0)";
        case "storm":
            return "linear-gradient(to bottom, #373b44, #4286f4)";
        case "snow":
            return "linear-gradient(to bottom, #dae2f8, #d6a4a4)";
        default:
            return "linear-gradient(to bottom, #4facfe, #00f2fe)";
    }
}
