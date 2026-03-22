export function formatTodayWeather(data) {
    const primaryWeather = data.weather[0];

    return {
        city: data.name,
        country: data.sys?.country ?? "",
        coords: {
            lat: data.coord?.lat ?? null,
            lon: data.coord?.lon ?? null,
        },
        description: primaryWeather.description,
        temperature: Math.round(data.main.temp),
        high: Math.round(data.main.temp_max),
        low: Math.round(data.main.temp_min),
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed),
        feelsLike: Math.round(data.main.feels_like),
        pressure: data.main.pressure,
        clouds: data.clouds?.all ?? 0,
        visibility: data.visibility ?? 0,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        icon: `https://openweathermap.org/img/wn/${primaryWeather.icon}@2x.png`,
        iconAlt: primaryWeather.description,
        weatherCode: primaryWeather.id,
        timezoneOffset: data.timezone ?? 0,
    };
}

export function formatDailyForecast(forecast) {
    const dailyForecast = [];
    const seenDates = new Set();

    for (const entry of forecast.list) {
        const date = entry.dt_txt.split(" ")[0];

        if (!seenDates.has(date) && dailyForecast.length < 5) {
            dailyForecast.push({
                date,
                low: Math.round(entry.main.temp_min),
                high: Math.round(entry.main.temp_max),
                icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
                iconAlt: entry.weather[0].description,
            });

            seenDates.add(date);
        }
    }

    return dailyForecast;
}

export function formatHourlyForecast(forecast) {
    return forecast.list.slice(0, 8).map((entry, index) => ({
        id: `${entry.dt}-${index}`,
        label: index === 0
            ? "Now"
            : new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                timeZone: "UTC",
            }).format(new Date((entry.dt + (forecast.city?.timezone ?? 0)) * 1000)),
        temp: Math.round(entry.main.temp),
        icon: `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`,
        iconAlt: entry.weather[0].description,
    }));
}

export function getPrecipitationTotal(forecast) {
    const nextDayEntries = forecast.list.slice(0, 8);

    const total = nextDayEntries.reduce((sum, entry) => {
        const rain = entry.rain?.["3h"] ?? 0;
        const snow = entry.snow?.["3h"] ?? 0;
        return sum + rain + snow;
    }, 0);

    return `${total.toFixed(1)} mm`;
}

export function getForecastSummary(currentWeather, forecast) {
    const nextDayEntries = forecast.list.slice(0, 8);
    const maxRainChance = Math.max(
        0,
        ...nextDayEntries.map((entry) => Math.round((entry.pop ?? 0) * 100))
    );
    const averageCloudCover = nextDayEntries.length
        ? Math.round(
            nextDayEntries.reduce((sum, entry) => sum + (entry.clouds?.all ?? 0), 0) / nextDayEntries.length
        )
        : currentWeather.clouds;

    const daylightSeconds = Math.max(0, (currentWeather.sunset ?? 0) - (currentWeather.sunrise ?? 0));
    const daylightHours = Math.floor(daylightSeconds / 3600);
    const daylightMinutes = Math.round((daylightSeconds % 3600) / 60);

    return {
        maxRainChance: `${maxRainChance}%`,
        averageCloudCover: `${averageCloudCover}%`,
        daylightDuration: `${daylightHours}h ${daylightMinutes}m`,
        coordinates:
            currentWeather.coords.lat != null && currentWeather.coords.lon != null
                ? `${currentWeather.coords.lat.toFixed(2)}, ${currentWeather.coords.lon.toFixed(2)}`
                : "--, --",
    };
}

export function formatVisibility(value) {
    return `${(value / 1000).toFixed(1)} km`;
}

export function formatTimeFromUnix(timestamp, timezoneOffsetSeconds = 0) {
    const date = new Date((timestamp + timezoneOffsetSeconds) * 1000);

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC",
    }).format(date);
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
            return "linear-gradient(135deg, #0f3f8f 0%, #1c63dd 42%, #8cc9ff 100%)";
        case "cloudy":
            return "linear-gradient(135deg, #30445e 0%, #60758f 48%, #a7b8cc 100%)";
        case "fog":
            return "linear-gradient(135deg, #646d7e 0%, #8d98a8 50%, #cfd8e2 100%)";
        case "storm":
            return "linear-gradient(135deg, #141c2f 0%, #304668 45%, #4a71b1 100%)";
        case "snow":
            return "linear-gradient(135deg, #42607f 0%, #82a3c9 45%, #d8e4f5 100%)";
        default:
            return "linear-gradient(135deg, #0f3f8f 0%, #1c63dd 42%, #8cc9ff 100%)";
    }
}
