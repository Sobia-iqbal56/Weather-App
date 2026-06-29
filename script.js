console.log("JavaScript Loaded");

// =========================
// Select HTML Elements
// =========================
const body = document.getElementById("body");
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search-btn");
const locationBtn = document.getElementById("location-btn");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feels-like");
const country = document.getElementById("country");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");
const minTemp = document.getElementById("min-temp");
const maxTemp = document.getElementById("max-temp");
const weatherIcon = document.getElementById("weather-icon");
const weatherCard = document.querySelector(".weather-card");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const day = document.getElementById("day");
const date = document.getElementById("date");
const time = document.getElementById("time");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const errorCard = document.getElementById("error-card");

const errorTitle = document.getElementById("error-title");

// =========================
// API Key
// =========================
const apiKey = "31a3623000d5c2060602d3020ccf0aef";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
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

// =========================
// Display Weather Data
// =========================
function displayWeather(data) {
  cityName.textContent = data.name;

  temperature.textContent = Math.round(data.main.temp) + "°C";

  description.textContent =
    data.weather[0].description.charAt(0).toUpperCase() +
    data.weather[0].description.slice(1);
  const weatherMain = data.weather[0].main;
  changeBackground(weatherMain);

  humidity.textContent = data.main.humidity + "%";

  wind.textContent = data.wind.speed + " m/s";
  feelsLike.textContent = Math.round(data.main.feels_like) + "°C";

  country.textContent = data.sys.country;

  visibility.textContent = data.visibility / 1000 + " km";

  pressure.textContent = data.main.pressure + " hPa";

  minTemp.textContent = Math.round(data.main.temp_min) + "°C";

  maxTemp.textContent = Math.round(data.main.temp_max) + "°C";

  const iconCode = data.weather[0].icon;

  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherIcon.style.display = "block";
  sunrise.textContent = formatTime(data.sys.sunrise);

  sunset.textContent = formatTime(data.sys.sunset);
  weatherCard.classList.remove("fade-in");
  void weatherCard.offsetWidth;
  weatherCard.classList.add("fade-in");
}

// ShowError Function
function showError(title, message) {
  errorTitle.textContent = title;

  errorMessage.textContent = message;

  errorCard.style.display = "block";

  weatherIcon.style.display = "none";
}
//hideError function
function hideError() {
  errorCard.style.display = "none";
}

// =========================
// Fetch Weather
// =========================
async function fetchWeather(url) {
  try {
    loading.style.display = "block";
    errorMessage.style.display = "none";

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    loading.style.display = "none";
    hideError();
    searchBtn.disabled = true;
    locationBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    loading.style.display = "none";
    searchBtn.disabled = false;
    locationBtn.disabled = false;
    searchBtn.textContent = "Search";

    if (!response.ok) {
      showError(
        "❌ City Not Found",
        "Please check the spelling and try again.",
      );

      weatherIcon.style.display = "none";

      return;
    }

    displayWeather(data);
    hideError();
  } catch (error) {
    loading.style.display = "none";

    weatherIcon.style.display = "none";

    showError("⚠ Connection Error", "Unable to connect. Please try again.");
    errorMessage.style.display = "block";
  }
}

// =========================
// Search by City
// =========================
function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetchWeather(url);
}

// =========================
// Search by Location
// =========================
function getWeatherByLocation(latitude, longitude) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  fetchWeather(url);
}

// =========================
// Get Current Location
// =========================
function getLocation() {
  navigator.geolocation.getCurrentPosition(
    showPosition,

    function () {
      showError("📍 Location Denied", "Please allow location access.");
      errorMessage.style.display = "block";
    },
  );
}

// =========================
// Location Success
// =========================
function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  getWeatherByLocation(latitude, longitude);
}

// =========================
// Search Button
// =========================
function searchWeather() {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("🔍 Empty Search", "Please enter a city name.");
    errorMessage.style.display = "block";

    return;
  }

  getWeather(city);
}

// =========================
// Event Listeners
// =========================

// Search Button
searchBtn.addEventListener("click", searchWeather);

// Press Enter
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchWeather();
  }
});

// Current Location
locationBtn.addEventListener("click", getLocation);

// ==========================
// Background Gradients
// ==========================
const backgrounds = {
  Clear: "linear-gradient(to bottom right,#FFD54F,#FF9800)",

  Clouds: "linear-gradient(to bottom right,#90A4AE,#607D8B)",

  Rain: "linear-gradient(to bottom right,#1565C0,#0D47A1)",

  Snow: "linear-gradient(to bottom right,#ECEFF1,#B0BEC5)",

  Default: "linear-gradient(to bottom right,#74b9ff,#00cec9)",
};

// ==========================
// Change Background
// ==========================
function changeBackground(weatherMain) {
  if (backgrounds[weatherMain]) {
    body.style.background = backgrounds[weatherMain];
  } else {
    body.style.background = backgrounds.Default;
  }
}
//Format time function
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
//Update time function
function updateDateTime() {
  const now = new Date();
  const currentDay = days[now.getDay()];
  const currentDate = now.getDate();
  const currentMonth = months[now.getMonth()];
  const currentYear = now.getFullYear();

  let hours = now.getHours();
  let minutes = now.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours || 12;
  minutes = minutes.toString().padStart(2, "0");
  hours = hours.toString().padStart(2, "0");
  day.textContent = currentDay;
  date.textContent = currentDate + " " + currentMonth + " " + currentYear;
  time.textContent = hours + ":" + minutes + " " + period;
}
//Live date and time
// =========================
// Live Date & Time
// =========================
updateDateTime();
setInterval(updateDateTime, 1000);
