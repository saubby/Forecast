var searchcity = $("#searchinput");
var searchButton = $("#searchbtn");
var clearButton = $("#clearhistorybtn");
var current_city = $("#main-city-name");
var current_temp = $("#city-temp");
var current_hum = $("#city-hum");
var current_wind = $("#city-wind");
var Cities = [];

function init(c) {
    for (var i = 0; i < Cities.length; i++) {
        if (c.toUpperCase() === Cities[i]) {
            return -1;
        }
    }
    return 1;
}

var APIKey = "a0aca8a89948154a4182dcecc780b513";
function displayweather(event) {
    event.preventDefault();
    if (searchcity.val().trim() !== "") {
        city = searchcity.val().trim();
        APIcalls(city);
    }
}

function APIcalls(event) {
    console.log(event);
    event.preventDefault();

    var inputcity = $("#searchinput").val();
    console.log(inputcity);


    var queryurl = "https://api.openweathermap.org/data/2.5/weather?q=" + inputcity + "&APPID=" + APIKey;
    console.log(queryurl);

    $.ajax({
        url: queryurl,
        method: "GET",

    }).then(function (response) {

        console.log(response);
        var weathericon = response.weather[0].icon;
        var iconurl = "https://openweathermap.org/img/wn/" + weathericon + "@2x.png";

        var date = new Date(response.dt * 1000).toLocaleDateString();
        $(current_city).html(response.name + "(" + date + ")" + "<img src = " + iconurl + ">");

        var tempT = (response.main.temp - 273.15) * 1.80 + 32;
        $(current_temp).html((tempT).toFixed(2) + "&#8457");
        $(current_hum).html(response.main.humidity + "%");

        var ws = response.wind.speed;
        var windsmph = (ws * 2.237).toFixed(1);
        $(current_wind).html(windsmph + "MPH");

        forecast(response.id);
        if (response.cod == 200) {
            Cities = JSON.parse(localStorage.getItem("cityname"));
            console.log(Cities);

            if (Cities == null) {
                Cities = [];
                Cities.push(Cities.toUpperCase());
                localStorage.setItem("cityname", JSON.stringify(Cities));
                addintoList(city);
            }
            else {
                if (init(city) > 0) {
                    Cities.push(city.toUpperCase());
                    localStorage.setItem("cityname", JSON.stringify(Cities));
                    addintoList(city);
                }
            }
        }

    });
}

function forecast(cityID) {
    var dayovr = false;
    var forecasturl = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;

    $.ajax({
        url: forecasturl,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        for (i = 0; i < 5; i++) {

            var date = new Date((response.list[((i + 1) * 8) - 1].dt) * 1000).toLocaleDateString();
            var codeicon = response.list[((i + 1) * 8) - 1].weather[0].icon;
            var urlicon = "https://openweathermap.org/img/wn/" + codeicon + ".png";
            var tempF = response.list[((i + 1) * 8) - 1].main.temp;
            var tempT = (((tempF - 273.5) * 1.80) + 32).toFixed(2);
            var humidity = response.list[((i + 1) * 8) - 1].main.humidity;
            console.log(i);

            $("#date" + i).html(date);
            $("#icon" + i).html("<img src = " + urlicon + ">");
            $("#temp" + i).html(tempT + "&#8457");
            $("#hum" + i).html(humidity + "%");


        }
    });
}

function addintoList(c) {
    var listEl = $("<li>" + c.toUpperCase() + "</li>");
    $(listEl).attr("class", "list-group-item");
    $(listEl).attr("data-value", c.toUpperCase());
    $(".listgroup").append(listEl);
}

function pastseach(event) {
    var liE = event.target;
    if (event.target.matches("li")) {
        city = liE.textContent.trim();
        APIcalls(city);
    }
}

function loadlatestcity() {
    $("ul").empty();
    var Cities = JSON.parse(localStorage.getItem("cityname"));
    if (Cities !== null) {
        Cities = JSON.parse(localStorage.getItem("cityname"));
        for (i = 0; i < Cities.length; i++) {
            addintoList(Cities[i]);
        }
        city = Cities[i - 1];
        APIcalls(city);
    }
}
function clrhistory(event) {
    event.preventDefault();
    Cities = [];
    localStorage.removeItem("cityname");
    document.location.reload();

}


$("#searchbtn").on("click", APIcalls);
$(document).on("click", pastseach);
$(window).on("load", loadlatestcity);
$("#clearhistorybtn").on("click", clrhistory);