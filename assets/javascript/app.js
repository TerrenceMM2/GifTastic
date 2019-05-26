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
        return queryString = queryURL + "api_key=" + queryApiKey + "&" + "q=" + str + "&" + "limit=15";
    }

    function getGifs(str) {
        $.ajax({
            url: str,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                topicGifs.push(response.data[j]);
                var imageGif = $("<img>").attr("src", topicGifs[j].images.fixed_height_still.url);
                imageGif.addClass("gif");
                imageGif.attr("alt", topicGifs[j].title);
                imageGif.attr("data-value", j);
                imageGif.attr("data-moving", "off");
                $("#gif-gallery").append(imageGif);
            };
        });
    };

    function clearGifs () {
        $("#gif-gallery").empty();
    };

});