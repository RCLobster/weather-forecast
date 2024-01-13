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

var today = dayjs();
var tomorrow = dayjs().add(1, "day");
var daysOfForecast = [];

function onLoad() {
    getLatLog("Los Angeles");
    displaySearchHistory();
    displayTodayData();
    displayForecastData();
}

function displaySearchHistory() {
    //clear displayed history list
    historyParent.innerHTML = "";
    //grab history from local storage
    var historyToDisplay = JSON.parse(localStorage.getItem("searchHistory"));
    //if nothing is stored, set historyToDisplay to an empty []
    if(historyToDisplay === null){
        historyToDisplay = [];
    }
    //create the list of past searches from localStorage array
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

//when a button in my search history is clicked...
historyParent.addEventListener("click", function(event){
    //check if what you click IS a button element
    if(event.target.matches("button")){
        //if it IS a button, grab the "data-value" off THAT button and save to var city
        var city = event.target.getAttribute("data-value");

        //console.log(city);
        //run all my display functions and pass city into getLatLog() to run an api call using the data from searchHistory
        getLatLog(city);
        displaySearchHistory();
        displayTodayData();
        displayForecastData();
    }
})

//use the data from weatherAPI fetch to populate the webpage with relevant data
function displayTodayData(weatherData) {
    //create elements for .todayCard
    todayWeather.innerHTML = "";
    //update the title of today's forecast
    currentCity.textContent = weatherData.city.name;

    var titleEl = document.createElement("h4");
    titleEl.textContent = today.format("MMM D, YYYY");

    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.list[0].weather[0].icon.replace("n", "d") + "@2x.png")

    var tempEl = document.createElement("p");

    tempEl.textContent = "Temp: " + Math.trunc(weatherData.list[0].main.temp) + "°F";

    var humidityEl = document.createElement("p");

    humidityEl.textContent = "Humidity: " + weatherData.list[0].main.humidity + "%";

    var windEl = document.createElement("p");

    windEl.textContent = "Wind Speed: " + Math.trunc(weatherData.list[0].wind.speed) + " MPH";

    todayWeather.appendChild(titleEl);
    todayWeather.appendChild(iconEl);
    todayWeather.appendChild(tempEl);
    todayWeather.appendChild(humidityEl);
    todayWeather.appendChild(windEl);
}

//use the data from weatherAPI fetch to populate the webpage with relevant data
function displayForecastData(weatherData) {
    //clear out whatever is currently displayed
    forecastWeather.innerHTML = "";
    //create elements for .fiveDayForecastParent
    for(var x=0; x < weatherData.list.length; x++){
        //go through dt_txt at index [x] and grab the 12th and 13th character in the string
        var substringResult = weatherData.list[x].dt_txt.substring(11,13);
        //check if the 12th and 13th character == "12", then run the loop with that index[x] data
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
            iconFiveEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherData.list[x].weather[0].icon.replace("n", "d") + "@2x.png");
        
            var tempFiveEl = document.createElement("p");

            tempFiveEl.textContent = "Temp: " + Math.trunc(weatherData.list[x].main.temp) + "°F";
        
            var humidityFiveEl = document.createElement("p");

            humidityFiveEl.textContent = "Humidity: " + weatherData.list[x].main.humidity + "%";
        
            var windFiveEl = document.createElement("p");

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

//use data from getLatLong() to make a new fetch request to get weather data for a city with a specified lat and long value
function getWeatherData(lat, long) {
    console.log(lat);
    console.log(long);
    //console.log(typeof long);
    var stringLat = lat.toString();
    var stringLong = long.toString();
    var weatherUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + stringLat + "&lon=" + stringLong + "&appid=" + key + "&units=imperial";

    //console.log(weatherUrl);
    //take the data received from fetch and send it to my display functions
    fetch(weatherUrl).then(function (response){
        response.json().then(function (data){
            console.log(data);
            displayTodayData(data);
            displayForecastData(data);
        })
    })
}

//make a fetch request using the searched city name to grab the specific lat andn long coordinates of that city
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
            //send lat and long data up to make a new fetch request to weatherAPI using these lat and long coordinates
            getWeatherData(lat, long);
        })
    })
    
}

//capture user input from search bar and use it to trigger fetch requests and data display functions
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

//when the search button is clicked run my getUserInput()
searchBtn.addEventListener("click", getUserInput);

//run the two below functions on page load
onLoad();
displaySearchHistory();