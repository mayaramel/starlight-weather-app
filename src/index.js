function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}
let dateElement = document.querySelector("#last-updated");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);


function formatHours(timestamp) {
  const date = new Date(timestamp * 1000)
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}


function showTemperature(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#current-temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#feels").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
    let iconElement = document.querySelector("#current-icon");
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", response.data.weather[0].description);
}


function generateForecastHtml(forecast) {
  return `<div class="col-3">
            <ul>
              <li class="forecast-hours">${formatHours(forecast.dt)}</li>
              <li class="forecast-icons"><img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" /></li>
              <li class="forecast-temperatures">
                <strong>
                  <span class="forecast-max">${Math.round(forecast.main.temp_max)}</span>
                  °
                </strong>
                <span class="forecast-min">${Math.round(forecast.main.temp_min)}</span>
              </li>
            </ul>
          </div>`
}

function showForecast(response){
 
  let forecastHtml = ''
 
  for (let i = 0; i <= 3; i++) {
    forecastHtml += generateForecastHtml(response.data.list[i])
  }
 
  let forecastElement = document.querySelector("#forecast");

  forecastElement.innerHTML = forecastHtml;  
}

function searchCity(city) {
  let apiKey = "7a15ffb253bd1bb95ec79fa9e1cbd022";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showForecast);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "7a15ffb253bd1bb95ec79fa9e1cbd022";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(`${apiUrl}`).then(showTemperature);
  
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function showFahrenheit(event) {
  event.preventDefault();
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function showCelsius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", showFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", showCelsius);

searchCity("The Hague");