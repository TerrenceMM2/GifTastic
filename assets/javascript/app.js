$(document).ready(function () {

    var topic = ["apples", "bananas", "avocados", "bread"];

    var queryTopic = "";
    var queryApiKey = "k4lIc25Cnm8PVmdTTePqX37D2HFooSyY";
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var queryString = "";

    var topicGifs = [];
    var activeGif = "";
    var offsetNumber = 0;

    for (var i = 0; i < topic.length; i++) {
        generateButton(topic[i]);
    };

    $("#button-group").on("click", ".btn", function () {
        $("#more-gifs").show();
        offsetNumber = 0;
        activeGif = $(this).text();
        clearGifs();
        topicGifs = [];
        queryTopic = $(this).text();
        generateURL(queryTopic, offsetNumber);
        getGifs(queryString);
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
        topicGifs.push(searchedWord);
        generateButton(searchedWord);
    });

    $("#more-gifs").on("click", function () {
        event.preventDefault();
        generateURL(activeGif, offsetNumber);
        getGifs(queryString);
    });

    function generateButton(str) {
        var newButton = $("<button>").text(str);
        newButton.addClass("btn btn-primary btn-sm");
        $("#button-group").append(newButton);
    };

    function generateURL(str, num) {
        return queryString = queryURL + "api_key=" + queryApiKey + "&" + "q=" + str + "&" + "limit=10" + "&" + "offset=" + num;
    };

    function getGifs(str) {
        $.ajax({
            url: str,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                topicGifs.push(response.data[j]);
            };
            generateGif(offsetNumber);
            offsetNumber += 10;
        });
    };

    function generateGif(num) {
        var index = num + 10;
        for (var k = num; k < index; k++) {
            var imageContainer = $("<figure>").addClass("figure");
            var imageGif = $("<img>").attr("src", topicGifs[k].images.fixed_height_still.url);
            imageGif.addClass("gif figure-img img-fluid rounded");
            imageGif.attr("alt", topicGifs[k].title);
            // imageGif.attr("data-value", num);
            imageGif.attr("data-moving", "off");
            var imageRating = $("<figcaption>");
            var ratingText = "Rated: " + topicGifs[k].rating.toUpperCase();
            imageRating.text(ratingText);
            imageRating.addClass("figure-caption text-left");
            $(imageContainer).append(imageGif);
            $(imageContainer).append(imageRating);
            $("#gif-gallery").append(imageContainer);
        };
    };

    function clearGifs() {
        $("#gif-gallery").empty();
    };

});