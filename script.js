/*
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city

THE PLAN
--1. Take in user input (city name)
--2. Geocoding API call to convert city name into lat and long coordinates
3. using result of Geo API, do Weather API call to grab forecast data
4. display today's weather data in .todayCard
    weather data to display:
     -city name
     -the date
     -an icon representation of weather conditions
     -the temperature
     -the humidity
     -wind speed
5. display 5 day future forecast weather data in .forecastCard
6. save current city search in localStorage
7. display history in .historyCard as a button
8. when history button is clicked, re-run a search using that city name
*/

//ELEMENT GRABS
var searchInput = document.getElementById("searchBar");
var searchBtn = document.getElementById("searchBtn");
var historyParent = document.getElementById("historyData");
var todayWeather = document.getElementById("todayData");
var forecastWeather = document.getElementById("fiveDayForecastParent");

//API VARIABLES
var key = "a4f7a3221af4f53e4523d3f11a44ccec";
var lat;
var long;

function getLatLog(event) {
    event.preventDefault();
    //console.log(searchInput.value);
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput.value + "&limit=1&appid=" + key;

    fetch(geoUrl).then(function (response){
        response.json().then(function (data){
            console.log(data);
            lat = data[0].lat;
            console.log(lat);
            long = data[0].lon;
            console.log(long);
        })
    })
}

searchBtn.addEventListener("click", getLatLog);