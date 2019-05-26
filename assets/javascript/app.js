$(document).ready(function () {

    var topic = ["apples", "bananas", "avocados", "bread"];

    var queryTopic = "";
    var queryApiKey = "k4lIc25Cnm8PVmdTTePqX37D2HFooSyY";
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var queryString = "";

    var topicGifs = [];

    for (var i = 0; i < topic.length; i++) {
        var newButton = $("<button>").text(topic[i]);
        newButton.addClass("btn btn-primary btn-sm");
        $("#button-group").append(newButton);
    };

    $("button").on("click", function () {
        clearGifs();
        topicGifs = [];
        queryTopic = $(this).text();
        generateURL(queryTopic);
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

    function generateURL(str) {
        return queryString = queryURL + "api_key=" + queryApiKey + "&" + "q=" + str + "&" + "limit=10";
    }

    function getGifs(str) {
        $.ajax({
            url: str,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                topicGifs.push(response.data[j]);
                generateGif(j);
            };
        });
    };

    function generateGif(num) {
        var imageContainer = $("<figure>").addClass("figure");
        var imageGif = $("<img>").attr("src", topicGifs[num].images.fixed_height_still.url);
        imageGif.addClass("gif figure-img img-fluid rounded");
        imageGif.attr("alt", topicGifs[num].title);
        imageGif.attr("data-value", num);
        imageGif.attr("data-moving", "off");
        var imageRating = $("<figcaption>");
        var ratingText = "Rated: " + topicGifs[num].rating.toUpperCase();
        imageRating.text(ratingText);
        imageRating.addClass("figure-caption text-left");
        $(imageContainer).append(imageGif);
        $(imageContainer).append(imageRating);
        $("#gif-gallery").append(imageContainer);
    }

    function clearGifs() {
        $("#gif-gallery").empty();
    };

});