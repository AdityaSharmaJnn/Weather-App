const apiKey = "0a72225a4b1ed27866350f314c7e9a00";

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search input");
    const searchBtn = document.querySelector(".search button");
    const weatherIcon = document.querySelector(".weather-icon");
    const weatherDiv = document.querySelector(".weather");
    const errorDiv = document.querySelector(".error");
    const errorMessageParagraph = errorDiv.querySelector('p');

    async function checkWeather(city) {
        const cityName = city.trim();

        errorDiv.style.display = "none";
        weatherDiv.classList.remove("show");

        if (!cityName) {
            errorMessageParagraph.textContent = "Please enter a city name.";
            errorDiv.style.display = "block";
            return;
        }

        try {
            const response = await fetch(apiUrl + encodeURIComponent(cityName) + `&appid=${apiKey}`);

            if (!response.ok) {
                if (response.status === 404) {
                    errorMessageParagraph.textContent = "Invalid City Name. Please try again.";
                } else if (response.status === 401) {
                    errorMessageParagraph.textContent = "API Key Error.";
                } else if (response.status === 429) {
                    errorMessageParagraph.textContent = "Too many requests. Please wait and try again.";
                } else {
                    errorMessageParagraph.textContent = `Could not fetch weather data. API Error: ${response.status}`;
                    console.error("API error:", response.status, response.statusText);
                }
                errorDiv.style.display = "block";
                return;
            }

            const data = await response.json();
            console.log(data);

            document.querySelector(".city").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            const weatherCondition = data.weather[0].main;
            switch (weatherCondition) {
                case "Clouds":
                    weatherIcon.src = "clouds.png";
                    break;
                case "Clear":
                    weatherIcon.src = "clear.png";
                    break;
                case "Rain":
                    weatherIcon.src = "rain.png";
                    break;
                case "Drizzle":
                    weatherIcon.src = "drizzle.png";
                    break;
                case "Mist":
                case "Haze":
                case "Fog":
                    weatherIcon.src = "mist.png";
                    break;
                case "Snow":
                    weatherIcon.src = "snow.png";
                    break;
                default:
                    weatherIcon.src = "https://placehold.co/170x170/00feba/ffffff?text=Unknown";
            }

            weatherDiv.classList.add("show");
            errorDiv.style.display = "none";

        } catch (error) {
            console.error("Error fetching weather data:", error);
            errorMessageParagraph.textContent = "Failed to connect. Check your internet connection.";
            errorDiv.style.display = "block";
            weatherDiv.classList.remove("show");
        }
    }

    searchBtn.addEventListener("click", () => {
        checkWeather(searchBox.value);
    });

    searchBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            checkWeather(searchBox.value);
        }
    });

    checkWeather("New York");
});