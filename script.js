document.addEventListener('DOMContentLoaded', () => {// Selectors
const cityElement = document.querySelector(".place");
const datetimeElement = document.querySelector(".date_time p");
const weatherForecastElement = document.querySelector('.description p');
const weatherTemperatureElement = document.querySelector(".temperature h2");
const weatherIconElement = document.querySelector(".icon");
const weatherMinElement = document.querySelector(".weather_minmax p:first-child");
const weatherMaxElement = document.querySelector(".weather_minmax p:last-child");
const weatherRealFeelElement = document.querySelector('.realfeel');
const weatherHumidityElement = document.querySelector('.humidity');
const weatherWindElement = document.querySelector('.windspeed');
const weatherPressureElement = document.querySelector('.pressure');

let currCity="Hyderabad";
const searchForm = document.querySelector(".search");
const searchInput = document.querySelector(".search-bar");

const API_KEY = '6cc75012a81a0cce60612966604976e1'; 

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = searchInput.value.trim();
    if (searchValue !== '') {
        currCity = searchValue;
        getWeather();
        searchInput.value = "";
    }
});

function convertTimeStamp(timestamp, timezone) {
    const offsetInMinutes = timezone / 60; 
    const offsetHours = Math.floor(offsetInMinutes / 60);
    const offsetMinutes = offsetInMinutes % 60;

    const date = new Date(timestamp * 1000);
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const convertedDate = new Date(utc + (offsetHours * 60 + offsetMinutes) * 60000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    return convertedDate.toLocaleString("en-US", options);
}


function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(country);
}

function getWeather() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=metric`)
        .then((response) => response.json())
        .then((data) => {
            cityElement.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetimeElement.innerHTML = convertTimeStamp(data.dt, data.timezone);
            weatherForecastElement.innerHTML = data.weather[0].main;
            weatherTemperatureElement.innerHTML = `${data.main.temp.toFixed()}&#176C`;
            weatherIconElement.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
            weatherMinElement.innerHTML = `Min: ${data.main.temp_min.toFixed()}&#176C`;
            weatherMaxElement.innerHTML = `Max: ${data.main.temp_max.toFixed()}&#176C`;
            weatherRealFeelElement.innerHTML = `${data.main.feels_like.toFixed()}&#176C`;
            weatherHumidityElement.innerHTML = `${data.main.humidity}%`;
            weatherWindElement.innerHTML = `${data.wind.speed} m/s`;
            weatherPressureElement.innerHTML = `${data.main.pressure} hPa`;
        })
        .catch((error) => {
            console.error("Error", error);
            alert("Error fetching weather data. Please input a correct city.");
        });
}


window.addEventListener('load', getWeather);
});