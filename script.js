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
     ---city name
     ---the date
     -an icon representation of weather conditions
     ---the temperature
     ---the humidity
     ---wind speed
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
var currentCity = document.getElementById("currentCity");
var forecastWeather = document.getElementById("fiveDayForecastParent");

//API VARIABLES
var key = "a4f7a3221af4f53e4523d3f11a44ccec";
var searchTerm;
//var lat;
//var long;
//var weatherUrl = "api.openweathermap.org/data/2.5/forecast?lat=" + stringLat + "&lon=" + stringLong + "&appid=" + key;

var today = dayjs();
var tomorrow = dayjs().add(1, "day");
var daysOfForecast = [];


//populate daysOfForecast[] with the current weeks days
// function addDaysOfWeek() {
//     for(i=0; i<5; i++) {
//         daysOfForecast.push(tomorrow.add(i, "day").format("MMM D, YYYY"));
//     }
//     //console.log(daysOfForecast);
//     return(daysOfForecast);
// }

function displaySearchHistory() {
    historyParent.innerHTML = "";

    var historyToDisplay = JSON.parse(localStorage.getItem("searchHistory"));
    if(historyToDisplay === null){
        historyToDisplay = [];
    }

    for(var x=0; x < historyToDisplay.length; x++) {
        var listEl = document.createElement("li");
        listEl.style.listStyleType = "arabic";
        var btnEl = document.createElement("button");
        btnEl.textContent = historyToDisplay[x];
        btnEl.setAttribute("data-value", historyToDisplay[x]);
        btnEl.style.margin = "5px";

        listEl.appendChild(btnEl);
        historyParent.appendChild(listEl);
    }
}

historyParent.addEventListener("click", function(event){
    if(event.target.matches("button")){
        var city = event.target.getAttribute("data-value");

        console.log(city);
        getLatLog(city);
        displaySearchHistory();
        displayTodayData();
        displayForecastData();
    }
})

function displayTodayData(weatherData) {
    //create elements for .todayCard
    todayWeather.innerHTML = "";

    currentCity.textContent = weatherData.city.name;

    var titleEl = document.createElement("h4");
    titleEl.textContent = today.format("MMM D, YYYY");

    var iconEl = document.createElement("img");
    //iconEl.setAttribute("src", icon data)

    var tempEl = document.createElement("p");
    //fill with data from fetch request
    tempEl.textContent = "Temp: " + Math.trunc(weatherData.list[0].main.temp) + "°F";

    var humidityEl = document.createElement("p");
    //fill with data from fetch request
    humidityEl.textContent = "Humidity: " + weatherData.list[0].main.humidity + "%";

    var windEl = document.createElement("p");
    //fill with data from fetch request
    windEl.textContent = "Wind Speed: " + Math.trunc(weatherData.list[0].wind.speed) + " MPH";

    todayWeather.appendChild(titleEl);
    todayWeather.appendChild(iconEl);
    todayWeather.appendChild(tempEl);
    todayWeather.appendChild(humidityEl);
    todayWeather.appendChild(windEl);
}

//THE FOR LOOP IN HERE DOESN'T FIRE FOR SOME REASON
function displayForecastData(weatherData) {
    //create elements for .fiveDayForecastParent

    forecastWeather.innerHTML = "";
    for(var x=0; x < weatherData.list.length; x++){
        var substringResult = weatherData.list[x].dt_txt.substring(11,13);

        if(substringResult == "12"){
            var listEl = document.createElement("li");
            listEl.style.border = "2px solid black";
            listEl.style.listStyleType = "none";
            listEl.style.margin = "5px";
            listEl.style.padding = "5px";
        
            var titleFiveEl = document.createElement("h4");
            var day = dayjs(weatherData.list[x].dt_txt).format("MMM D, YYYY");
            titleFiveEl.textContent = day;
    
            var iconFiveEl = document.createElement("img");
            //iconFiveEl.setAttribute("src", weatherData.list[x].weather[0].icon);
        
            var tempFiveEl = document.createElement("p");
            //fill with data from fetch request
            tempFiveEl.textContent = "Temp: " + Math.trunc(weatherData.list[x].main.temp) + "°F";
        
            var humidityFiveEl = document.createElement("p");
            //fill with data from fetch request
            humidityFiveEl.textContent = "Humidity: " + weatherData.list[x].main.humidity + "%";
        
            var windFiveEl = document.createElement("p");
            //fill with data from fetch request
            windFiveEl.textContent = "Wind Speed: " + Math.trunc(weatherData.list[x].wind.speed) + " MPH";
        
            listEl.appendChild(titleFiveEl);
            listEl.appendChild(iconFiveEl);
            listEl.appendChild(tempFiveEl);
            listEl.appendChild(humidityFiveEl);
            listEl.appendChild(windFiveEl);
            forecastWeather.appendChild(listEl);

        }
    }
    
}

function getWeatherData(lat, long) {
    console.log(lat);
    console.log(long);
    //console.log(typeof long);
    var stringLat = lat.toString();
    var stringLong = long.toString();
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + stringLat + "&lon=" + stringLong + "&appid=" + key + "&units=imperial";

    //console.log(weatherUrl);

    fetch(weatherUrl).then(function (response){
        response.json().then(function (data){
            console.log(data);
            displayTodayData(data);
            displayForecastData(data);
        })
    })
}

function getLatLog(cityName) {
    //console.log(searchInput.value);
    var geoUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + key;
    
    fetch(geoUrl).then(function (response){
        response.json().then(function (data){
            console.log(data);
            var lat = data[0].lat;
            //console.log(lat);
            var long = data[0].lon;
            //console.log(long);
            //getWeatherData(lat, long);

            getWeatherData(lat, long);
        })
    })
    
}

/*
1. capture user input to var
2. save the value of that var into localStorage
3. create a button and set its val and text = to user input
4. on click call fetch function
*/
function getUserInput(event) {
    event.preventDefault();
    searchTerm = searchInput.value;
    //if the user searches with nothing in the search bar, don't save it to localStorage
    if(searchTerm === ""){
        return;
    }
    //grab whatever searches are saved in local storage
    var searchToSave = JSON.parse(localStorage.getItem("searchHistory"));
    //if nothing is saved, set array equal to an empty array
    if (searchToSave === null){
        searchToSave = [];
    }

    //if the current search is already in localStorage, run the functions without saving it again
    if(searchToSave.includes(searchTerm)){
        getLatLog(searchTerm)
        displaySearchHistory();
        displayTodayData();
        displayForecastData();
        return;
    }
    //push the currently searched item into searchToSave[]
    searchToSave.push(searchTerm);
    //re-save searchToSave[] into localStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchToSave));

    getLatLog(searchTerm);
    displaySearchHistory();
    displayTodayData();
    displayForecastData();
}

searchBtn.addEventListener("click", getUserInput);

displaySearchHistory();
//addDaysOfWeek();