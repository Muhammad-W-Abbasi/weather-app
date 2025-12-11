export function formatTodayWeather(data) {
    return {
        city: data.name,
        description: data.weather[0].description,
        temperature: Math.round(data.main.temp),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
        feels_like: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        weatherCode: data.weather[0].id
    };
}

export function formatForecast(forecast) {
    const daily = [];
    const usedDays = new Set();

    for (let entry of forecast.list) {
        const date = entry.dt_txt.split(" ")[0];
        if (!usedDays.has(date) && daily.length < 5) {
            daily.push({
                date,
                temp: Math.round(entry.main.temp),
                icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`
            });
            usedDays.add(date);
        }
    }

    return daily;
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
