var Twitter = require('twitter');
var keys = require('./keys.js');

var client = new Twitter(keys.twitterKeys);

client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 20 }, function(error, tweets, response) {
    if (error) throw error;
    console.log(JSON.stringify(tweets, null, 2)); // The favorites. 
    // console.log(JSON.stringify(response, null, 2)); // Raw response object. 
});
