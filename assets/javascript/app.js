$(document).ready(function () {

    var titleArray = ["26xBJJEETvqGHxVIc?", "l3q2GccupHgLPBqZG?", "l3q2PG0N4D2kUua3e?", "d3mmB85lPiyE5jvq?"];
    var titleQueryURL = "https://api.giphy.com/v1/gifs/";

    var topic = ["New York", "Key West", "San Francisco", "Vancouver", "Rio de Janeiro", "Rome", "Paris", "London", "Tokyo", "Abu Dhabi", "Hong Kong", "Sydney", "Bahamas", "Beijing", "Budapest", "Athens", "Madrid"];

    var queryTopic = "";
    var queryApiKey = "k4lIc25Cnm8PVmdTTePqX37D2HFooSyY";
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var queryString = "";

    var weatherApiKey = "9f948945c2a7499da3eb43a912f67a23";
    var weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?";
    var weatherQueryString = "";

    var topicGifs = [];
    var activeGif = "";
    var offsetNumber = 0;

    var favGifs = [];

    createGifTitle("fixed_height_small");

    for (var i = 0; i < topic.length; i++) {
        generateButton(topic[i]);
    };

    $("#button-group").on("click", ".btn", function () {
        $("#more-gifs").css("visibility", "visible");
        $("#clear-gifs").css("visibility", "visible");
        offsetNumber = 0;
        clearGifs();
        topicGifs = [];
        activeGif = $(this).text();
        queryTopic = $(this).text();
        generateURL(queryTopic, offsetNumber);
        getGifs(queryString);
        generateWeatherURL(queryTopic);
        getWeather(weatherQueryString);
    });

    $("#gif-gallery").on("click", ".gif", function () {
        var gifValue = $(this).data("value");
        var gifMoving = $(this).data("moving");
        if (gifMoving === "off") {
            $(this).data("moving", "on");
            $(this).attr("src", topicGifs[gifValue].images.fixed_height.url);
        } else if (gifMoving === "on") {
            $(this).data("moving", "off");
            $(this).attr("src", topicGifs[gifValue].images.fixed_height_still.url);
        };
    });

    $("#user-submit").on("click", function () {
        event.preventDefault();
        var searchedWord = $("#user-input").val().trim();
        if (searchedWord === "") {
            $(".modal").modal("show");
        } else {
            topicGifs.push(searchedWord);
            generateButton(searchedWord);
            $("#user-input").val("");
        };
    });

    $("#more-gifs").on("click", function () {
        event.preventDefault();
        generateURL(activeGif, offsetNumber);
        getGifs(queryString);
    });

    $("#gif-gallery").on("click", "#fav", function () {
        var favValue = $(this).data("fav");
        var dataValue = $(this).data("value");
        var gifIdValue = $(this).data("id");
        console.log(favValue);
        if (favValue === false) {
            console.log("favorited");
            $(this).removeClass("far").addClass("fas");
            $(this).data("fav", true);
            topicGifs[dataValue].favorite = true;
            favGifs.push(topicGifs[dataValue]);
        } else {
            console.log("unfavorited");
            $(this).removeClass("fas").addClass("far");
            $(this).data("fav", false);
            topicGifs[dataValue].favorite = false;
            for (var l = 0; l < favGifs.length; l++) {
                if (favGifs[l].id === gifIdValue) {
                    favGifs.splice(l, 1);
                };
            };
        }
    });

    $("#fav-gifs").on("click", function () {
        event.preventDefault();
        topicGifs = "";
        clearGifs();
        generateGif(0, favGifs);
        clearWeather();
        $("#more-gifs").css("visibility", "hidden");
        $("#clear-gifs").css("visibility", "hidden");
    });

    $("#clear-gifs").on("click", function () {
        clearGifs();
        clearWeather();
        $("#clear-gifs").css("visibility", "hidden");
        $("#more-gifs").css("visibility", "hidden");
    });

    $("#darkModeToggle").on("click", function () {
        if ($("#darkModeToggle").prop("checked")) {
            $("#custom-stylesheet").attr("href", "assets/css/style_dark.css");
        } else {
            $("#custom-stylesheet").attr("href", "assets/css/style_light.css");
        }
    });

    $("#movementToggle").on("click", function () {
        if ($("#movementToggle").prop("checked")) {
            createGifTitle("fixed_height_small");
        } else {
            createGifTitle("fixed_height_small_still");
        }
    });

    // Nests ajax call within a for loop
    // Source: https://stackoverflow.com/questions/21373643/jquery-ajax-calls-in-a-for-loop
    function createGifTitle(str) {
        for (var t = 0; t < titleArray.length; t++) {
            (function (t) {
                $.ajax({
                    url: titleQueryURL + titleArray[t] + "api_key=" + queryApiKey,
                    method: "GET",
                    success: function (response) {
                        $("#letter" + t).attr("src", response.data.images[str].url);
                    }
                });
            })(t);
        };
    };

    function generateButton(str) {
        var newButton = $("<button>").text(str);
        newButton.addClass("btn btn-info btn-lg");
        $("#button-group").append(newButton);
    };

    function generateURL(str, num) {
        return queryString = queryURL + "api_key=" + queryApiKey + "&" + "q=" + str + "&" + "limit=10" + "&" + "offset=" + num;
    };

    function generateWeatherURL(str) {
        return weatherQueryString = weatherQueryURL + "q=" + str + "&" + "APPID=" + weatherApiKey;
    };

    function getGifs(str) {
        $.ajax({
            url: str,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                response.data[j].favorite = false;
                topicGifs.push(response.data[j]);
            };
            generateGif(offsetNumber, topicGifs);
            offsetNumber += 10;
        });
    };

    function generateGif(num, arr) {
        for (var k = num; k < arr.length; k++) {
            var newGif = buildGif(k, arr);
            $("#gif-gallery").append(newGif);
        };
    };

    function buildGif(num, arr) {
        var imageContainer = $("<figure>").addClass("figure");
        imageContainer.attr("style", "width: " + arr[num].images.fixed_height_still.width + "px;");
        var imageGif = $("<img>").attr("src", arr[num].images.fixed_height_still.url);
        imageGif.addClass("gif figure-img img-fluid rounded");
        imageGif.attr("alt", arr[num].title);
        imageGif.attr("data-value", num);
        imageGif.attr("data-moving", "off");
        var imageFav = $("<figcaption>");
        if (arr[num].favorite) {
            var imageText = '<i id="fav" class="fas fa-star float-right" data-fav="true" data-value=' + num + ' data-id=' + arr[num].id + '></i>';
        } else {
            var imageText = '<i id="fav" class="far fa-star float-right" data-fav="false" data-value=' + num + ' data-id=' + arr[num].id + '></i>';
        };
        imageFav.html(imageText);
        var imageRating = $("<figcaption>");
        var ratingText = "Rated: " + arr[num].rating.toUpperCase();
        imageRating.text(ratingText);
        imageRating.addClass("figure-caption text-left");
        var imageTitle = $("<figcaption>");
        var titleText = arr[num].title.italics();
        imageTitle.html(titleText);
        imageTitle.addClass("figure-caption text-left");
        imageContainer.append(imageGif);
        imageContainer.append(imageFav);
        imageContainer.append(imageRating);
        imageContainer.append(imageTitle);
        return imageContainer;
    };

    function clearGifs() {
        $("#gif-gallery").empty();
    };

    // If the words searched is not a city, a 404 is returned (behind the scenes). A message is display but the gifs will still be shown.
    // Source: https://thisinterestsme.com/handle-ajax-error-jquery/
    function getWeather(str) {
        $.ajax({
            url: str,
            method: "GET",
            success: function (response) {
                var tempF = (Math.floor((response.main.temp - 273.15) * 1.80 + 32));
                $("#current-conditions").text("In " + response.name + ", it is currently " + tempF + " F\u00B0 and " + response.weather[0].description + ".");
            },
            error: function () {
                $("#current-conditions").text("Whoops! 😕 This is not a valid location.");
            }
        });
    };

    function clearWeather() {
        $("#current-conditions").empty();
    };

});