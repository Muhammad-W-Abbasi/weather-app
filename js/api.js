const API_KEY = "2b92dc5d53890ef7b0ded6cf2e0244f0";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function getWeatherByCity(city) {
    const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    return res.json();
}

export async function getForecastByCity(city) {
    const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("City not found");
    return res.json();
}

export async function getWeatherByCoords(lat, lon) {
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    return res.json();
}

export async function getForecastByCoords(lat, lon) {
    const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const res = await fetch(url);
    return res.json();
}
