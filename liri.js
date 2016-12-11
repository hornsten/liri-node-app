var Twitter = require('twitter');
var keys = require('./keys.js');

var client = new Twitter(keys.twitterKeys);

client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 20 }, function(error, tweets, response) {
    if (error) throw error;
    // console.log(JSON.stringify(tweets, null, 2)); // The tweets.



    for (var i = 0; i < tweets.length; i++) {
        var text = tweets[i].text;
        var createdAt = tweets[i].created_at;
        console.log(i + ". " + createdAt + " : " + text);
    }


    // console.log(JSON.stringify(response, null, 2)); // Raw response object.

});
