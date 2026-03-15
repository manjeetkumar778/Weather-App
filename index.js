
 const API_KEY = "8fa9d55603e2e3480f5b8e3f0cee7138";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherInfo = document.getElementById("weatherInfo");
const errorMessage = document.getElementById("errorMessage");
const defaultMessage = document.getElementById("defaultMessage");
const loading = document.getElementById("loading");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const dateElem = document.getElementById("date");
const weatherIcon = document.getElementById("weatherIcon");

const forecast = document.getElementById("forecast");
const forecastCards = document.getElementById("forecastCards");


searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});
cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
})

function getWeather(city) {
    loading.style.display = "block";
    errorMessage.style.display = "none";
    weatherInfo.style.display = "none";
    forecast.style.display = "none";
    defaultMessage.style.display = "none";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
        .then(res => res.json())
        .then(data => {
            loading.style.display = "none";
            if (data.cod !== 200) {
                errorMessage.textContent = data.message;
                errorMessage.style.display = "block";
                return;
            }

            
            weatherInfo.style.display = "block";
            cityName.textContent = `${data.name}, ${data.sys.country}`;
            temperature.textContent = Math.round(data.main.temp);
            description.textContent = data.weather[0].description;
            humidity.textContent = `${data.main.humidity}%`;
            windSpeed.textContent = `${data.wind.speed} m/s`;
            sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            dateElem.textContent = new Date().toDateString();

            // Weather icon
            const wMain = data.weather[0].main.toLowerCase();
            if (wMain.includes("cloud")) weatherIcon.textContent = "☁️";
            else if (wMain.includes("rain") || wMain.includes("drizzle")) weatherIcon.textContent = "🌧️";
            else if (wMain.includes("thunder")) weatherIcon.textContent = "⛈️";
            else if (wMain.includes("snow")) weatherIcon.textContent = "❄️";
            else if (wMain.includes("clear")) weatherIcon.textContent = "☀️";
            else weatherIcon.textContent = "🌤️";

            
            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`)
                .then(res => res.json())
                .then(forecastData => {
                    if (forecastData.cod !== "200") return;
                    forecastCards.innerHTML = "";
                    const daily = {};
                    forecastData.list.forEach(item => {
                        const dateStr = item.dt_txt.split(" ")[0];
                        const hour = item.dt_txt.split(" ")[1].split(":")[0];
                        if (hour === "12" && !daily[dateStr]) daily[dateStr] = item;
                    });
                    Object.keys(daily).forEach(dateStr => {
                        const item = daily[dateStr];
                        const day = new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' });
                        let icon = "🌤️";
                        const main = item.weather[0].main.toLowerCase();
                        if (main.includes("cloud")) icon = "☁️";
                        else if (main.includes("rain") || main.includes("drizzle")) icon = "🌧️";
                        else if (main.includes("thunder")) icon = "⛈️";
                        else if (main.includes("snow")) icon = "❄️";
                        else if (main.includes("clear")) icon = "☀️";

                        const card = document.createElement("div");
                        card.className = "forecast-card";
                        card.innerHTML = `<div class="day">${day}</div><div class="icon">${icon}</div><div class="temp">${Math.round(item.main.temp)}°C</div>`;
                        forecastCards.appendChild(card);
                    });
                    forecast.style.display = "block";
                })
                .catch(err => { console.error(err); forecast.style.display = "none"; });
        })
        .catch(err => {
            console.error(err);
            loading.style.display = "none";
            errorMessage.textContent = "Unable to fetch data. Please check your API key and network.";
            errorMessage.style.display = "block";
        });
}
