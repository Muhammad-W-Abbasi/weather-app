# Weather Application

A weather application built with HTML, CSS, and modular JavaScript using the OpenWeather API.

This project is designed to showcase:
- asynchronous API integration with `fetch` and `async/await`
- separation of concerns across API, formatting, and UI logic
- responsive UI implementation without a framework
- practical error handling for user-driven weather searches

## Live Demo

[https://wamiq-weather.netlify.app/](https://wamiq-weather.netlify.app/)

## Features

- search weather by city name
- load weather using the browser's current location
- display current temperature, condition, high/low, humidity, wind, feels-like temperature, and pressure
- show a 5-day forecast
- apply a dynamic background gradient based on current weather conditions
- surface loading and error feedback directly in the interface

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES modules)
- OpenWeather API

## Project Structure

- [index.html](/Users/wamiqabbasi/Documents/Playground/weather-app/index.html): application layout and UI regions
- [css/style.css](/Users/wamiqabbasi/Documents/Playground/weather-app/css/style.css): responsive styling, glassmorphism treatment, and motion
- [js/api.js](/Users/wamiqabbasi/Documents/Playground/weather-app/js/api.js): API request helpers and response validation
- [js/weather.js](/Users/wamiqabbasi/Documents/Playground/weather-app/js/weather.js): data formatting and theme mapping utilities
- [js/app.js](/Users/wamiqabbasi/Documents/Playground/weather-app/js/app.js): event handling, async UI flow, and rendering

## Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Muhammad-W-Abbasi/weather-app.git
```

2. Open [index.html](/Users/wamiqabbasi/Documents/Playground/weather-app/index.html) in a browser.

No build step or dev server is required.

## API Notes

This project uses the OpenWeather API.

The app currently supports a runtime configuration override through `window.WEATHER_APP_CONFIG.openWeatherApiKey` before the main app script runs.

The current implementation still includes a fallback client-side key because this project is deployed as a static frontend and is intended to work without a backend. That preserves ease of review and local setup, but it is not a secure way to protect a third-party secret.

For a production-grade version, weather requests should be proxied through a backend or serverless function so the API key is never exposed in client code.

## Engineering Notes

- API access is centralized in a single module instead of being duplicated in UI code.
- Weather display formatting is separated from DOM rendering logic.
- Search and geolocation flows share the same loading and rendering pipeline, which keeps behavior more consistent and easier to maintain.

## Remaining Technical Debt

- The fallback API key is still client-exposed because the project is framework-free and fully static.
- There is no automated test setup.
- The app currently supports metric units only.
