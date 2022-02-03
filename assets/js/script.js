// variables
var cityForm = document.querySelector("#city-form")
var cityInputEl = document.querySelector("#city-name")
var cityTitle = document.querySelector("#city-name-title")
var fiveDayContainer = document.querySelector("#five-day-container")
var dateTitle = document.querySelector("#date-title")
var currIcon = document.querySelector("#current-icon")
var temp = document.querySelector("#temp")
var wind = document.querySelector("#wind")
var humid = document.querySelector("#humid")
var uvindex = document.querySelector("#uvindex")
var localSaveEl = document.querySelector("#pre-results")

var recentSearches = [];
var alreadySearched = [];

var getCityOneCall = function(lat, lon) {
    // Format API into a variable
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lon+'&units=imperial&limit=1&appid=98e81ed518d3c925a1914516654c76a5'

    // make a fetch request
    fetch(apiUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        // Run Func
        displayCity(data)
    })
}

var getCity = function(city) {
    // Format API into a variable
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&limit=1&units=imperial&appid=98e81ed518d3c925a1914516654c76a5'
    
    // make fetch request from defined url
    fetch(apiUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data){
        // display city name
        cityTitle.textContent = data.name

        saveSearch(data.name);

        // set lon and lat to throw into another API to get more specific information
        var lat = data.coord.lat
        var lon = data.coord.lon

        // call function with lat and lon information
        getCityOneCall(lat, lon)
    });
}

var formSubmitHandler = function(event) {
    // Prevent the page reloading
    event.preventDefault();

    // get value from input 
    var city = cityInputEl.value.trim();

    // Make sure name was entered if not throw alert
    if (city) {
        getCity(city);
    } else {
        alert("Please enter a City name")
    };
};

var displayCity = function(data) {
    // Check to make sure the API returned a valid city
    if (data.length === 0) {
        alert("No City Found")
        return;
    };

    // display current date 
    var today = new Date()
    dateTitle.textContent = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();

    // display icon
    currIcon.src = "http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png"

    // display temp
    temp.textContent = "Temp: " + data.current.temp

    // display wind
    wind.textContent = "Wind: " + data.current.wind_speed + " MPH"

    // display humiditiy 
    humid.textContent = "Humidity: " + data.current.humidity

    // display UV Index
    uvindex.textContent = "UV Index: " + data.current.uvi

    displayFiveDay(data);
}

var displayFiveDay = function(data) {

    // clear old content
    fiveDayContainer.textContent = '';

    for (var i = 0; i < 6; i++){

        //create future cards
        var createDay = document.createElement("div");
        createDay.classList = "col-2 border justify-content-end"

        // All Elements
        var createDate = document.createElement("h4");
        var createIcon = document.createElement("img");
        var createTemp = document.createElement("p");
        var createWindSpeed = document.createElement("p");
        var createHumid = document.createElement("p");

        createDate.innerHTML = "Fun o clock"
        createIcon.src = "http://openweathermap.org/img/wn/"+data.current.weather[0].icon+"@2x.png"
        createTemp.innerHTML = "Temp: " + data.daily[i].temp.day
        createWindSpeed.innerHTML = "Wind: " + data.daily[i].wind_speed + " MPH"
        createHumid.innerHTML = "Humidity: " + data.daily[i].humidity

        // append each indiviual Items into createday
        createDay.appendChild(createDate)
        createDay.appendChild(createIcon)
        createDay.appendChild(createTemp)
        createDay.appendChild(createWindSpeed)
        createDay.appendChild(createHumid)

        fiveDayContainer.appendChild(createDay)

    }
}

var parseLocalSave = function() {

    var cityLength = JSON.parse(localStorage.getItem("city"))

    for (var i = 0; i < cityLength.length; i++) {
        for (var j = 0; j <= alreadySearched.length; j++) {
            if (cityLength[i] !== alreadySearched[j]) {
                displayLocalSave[cityLength[i]]
            }
        }
    }

};

var displayLocalSave = function(city) {

    alreadySearched.push(city)

    var createButtons = document.createElement("button")
    createButtons.classList = "mb-3 btn btn-primary btn-lg"
    createButtons.innerHTML = city

    localSaveEl.appendChild(createButtons);
}

var saveSearch = function(cityName) {

    recentSearches.push(cityName);

    localStorage.setItem('city', JSON.stringify(recentSearches));

}

// Run JavaScript with basic city of NY
parseLocalSave();
getCity("New York");

// Click Events
cityForm.addEventListener("submit", formSubmitHandler)