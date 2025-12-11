# Weather Application

A clean, modular weather application built with HTML, CSS, and JavaScript using the OpenWeather REST API.  
Designed to demonstrate asynchronous logic, structured error handling, and separation of concerns through a multi-file architecture.

---

## Features

- Search weather by city name  
- Real-time temperature, humidity, wind speed, and conditions  
- Clean UI with smooth animations  
- API integration using async/await  
- Error handling for invalid or unknown city names  
- Modular JavaScript structure for readability and maintainability  

---

## Live Demo

Hosted on Netlify:  
https://wamiq-weather.netlify.app/

---

## GitHub Repository

https://github.com/Muhammad-W-Abbasi/weather-app.git

---

## Technologies Used

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- OpenWeather REST API  
- Asynchronous programming (async/await)  
- Netlify (Deployment)  

---

## Project Structure

- `index.html` – Main application layout  
- `css/style.css` – UI styling and animation  
- `js/api.js` – API request handler (`fetchWeather()`)  
- `js/weather.js` – Data formatter for clean UI output  
- `js/app.js` – DOM events, rendering logic, and error handling  
- `README.md` – Project documentation  

---

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/Muhammad-W-Abbasi/weather-app.git
```

2. Open `index.html` in your browser.  
No server or build tools required.


## API Usage

This project uses the OpenWeather API.  
The API key is stored in `js/api.js` for modularity:

```javascript
const API_KEY = "YOUR_API_KEY";
```

## Future Enhancements

- 5-day forecast view  
- Geolocation-based weather (current location)  
- Weather icons and illustrations  
- Light/dark theme toggle  
- Saved search history  
- Temperature unit toggle (Celsius / Fahrenheit)  

---

## Notes

This project emphasizes clean architecture through separation of API logic, formatting logic, and UI rendering.  