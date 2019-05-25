$(document).ready(function () {

    var topic = ["apples", "bananas", "avocados", "bread"];

    var queryTopic = "monkeys";
    var queryApiKey = "k4lIc25Cnm8PVmdTTePqX37D2HFooSyY";
    var queryURL = "https://api.giphy.com/v1/gifs/search?";

    var queryString = queryURL + "api_key=" + queryApiKey + "&" + "q=" + queryTopic + "&" + "limit=15";

    $.ajax({
        url: queryString,
        method: "GET"
    }).then(function (response) {
        console.log(response.data);
    })

});