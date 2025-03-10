const apiKey = "85c461349d751b0e2392693a041752c0";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search-btn");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {
    const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
    if (!response.ok) {
        alert("City not found!"); // Error handling
        return;
    }
    
    var data = await response.json();
    console.log(data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clear") {
        weatherIcon.src = "images/clear.png"
    }

    if (data.weather[0].main == "Clouds") {
        weatherIcon.src = "images/clouds.png"
    }

    if (data.weather[0].main == "Drizzle") {
        weatherIcon.src = "images/drizzle.png"
    }

    if (data.weather[0].main == "Mist") {
        weatherIcon.src = "images/mitr.png"
    }

    if (data.weather[0].main == "Rain") {
        weatherIcon.src = "images/rain.png"
    }

    if (data.weather[0].main == "Snow") {
        weatherIcon.src = "images/snow.png"
    }



}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});
