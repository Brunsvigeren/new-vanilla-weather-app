function formatDate(timestamp) {
  let date = new Date(timestamp);
  let dateDate = date.getDate();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `Last updated: ${day}, ${month} ${dateDate}th | ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row" id="forecast">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        ` 
            <div class="col-sm">
              <div class="icon-little">
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt=""
                width="42"/>
                <h6 class="day">${formatDay(forecastDay.dt)}</h6>
                <div class="forecast-temperatures">
                  <span class="forecast-max-temp">${Math.round(
                    forecastDay.temp.max
                  )}°</span> 
                  <span class="forecast-min-temp">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>
            </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "c7f4649fa1bab9096cc8bdc788602750";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let temperatureElement = document.querySelector("#temp");
  let cityElement = document.querySelector("#current-city");
  let descriptionElement = document.querySelector("#description");
  let windElement = document.querySelector("#wind-speed");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date-and-time");
  let iconElement = document.querySelector("#main-icon");

  celsius = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsius);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function search(city) {
  let units = "metric";
  let apiKey = "c7f4649fa1bab9096cc8bdc788602750";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function showFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheit = (celsius * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheit);
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsius);
}

let celsius = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#f");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#c");
celsiusLink.addEventListener("click", showCelsius);

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiKey = "c7f4649fa1bab9096cc8bdc788602750";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showCurrentWeather);
}

function showCurrentWeather(response) {
  let currentTemp = document.querySelector("#temp");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = Math.round(response.data.main.humidity);
  let currentWind = document.querySelector("#wind-speed");
  currentWind.innerHTML = Math.round(response.data.wind.speed);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

let currentCityButton = document.querySelector("#current-button");
currentCityButton.addEventListener("click", getCurrentLocation);

function onLoadCurrentLocation() {
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}

search("Copenhagen");

/*window.onload = onLoadCurrentLocation();*/
