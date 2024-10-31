// Our API URL
const API_URL = "https://api.open-meteo.com/v1/forecast";

// Main function to fetch weather based on city name
/* Since our API source requires only longitude and latitude parameters, we first convert the 
    inputed city name to its long and lat values before fetching the API data.
*/
async function getWeather() {
    const city = document.getElementById("city-input").value;

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        // We use geocoding api to fetch latitude and longitude
        const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            alert("City not found.");
            return;
        }

        const { latitude, longitude, name } = locationData.results[0];
        
        // Now Fetch weather data from Open-Meteo
        const weatherResponse = await fetch(`${API_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=auto`);
        const weatherData = await weatherResponse.json();

        // We display the current weather
        const currentWeather = weatherData.current_weather;
        document.getElementById("city-name").innerText = name;
        document.getElementById("current-weather").innerHTML = `
            <b>Current Temperature:</b> ${currentWeather.temperature}°C<br>
            <b>Humidity:</b> ${currentWeather.relative_humidity}%<br>
            <b>Wind Speed:</b> ${currentWeather.windspeed} km/h
        `;

        // Change background color based on temperature level
        document.body.style.backgroundColor = currentWeather.temperature > 25 ? "#ffadad" : "#a9d9ff";

        // 7-Day Forecast
        const forecastData = weatherData.daily;
        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "";

        for (let i = 0; i < 7; i++) {
            const forecastItem = document.createElement("div");
            forecastItem.className = "forecast-item";
            forecastItem.innerHTML = `
                <b>Day ${i + 1}</b><br>
                Max: ${forecastData.temperature_2m_max[i]}°C<br>
                Min: ${forecastData.temperature_2m_min[i]}°C
            `;
            forecastContainer.appendChild(forecastItem);
        }

        document.getElementById("weather-info").classList.remove("hidden");
    } catch (error) {
        alert("Error fetching weather data. Please try again.");
        console.error(error);
    }
}
