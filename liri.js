var Twitter = require('twitter');
var keys = require('./keys.js');
var inquirer = require("inquirer");
var spotify = require('spotify');
var request = require('request');
var client = new Twitter(keys.twitterKeys);


// Ask LIRI to perform a task
function liri() {

    // Prompts user to choose from a list of tasks for LIRI to perform
    inquirer.prompt([{
            type: "list",
            name: "userChoice",
            message: "Hi, I'm LIRI! Your wish is my command. What can I do for you?",
            choices: ['my-tweets', 'spotify-this-song', 'movie-this']
        }

    ]).then(function(choice) {

        // If the user wants LIRI to print a list of my latest tweets
        if ((choice.userChoice) === 'my-tweets') {
            client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 15 }, function(error, tweets, response) {
                if (error) throw error;

                for (var i = 0; i < tweets.length; i++) {
                    var text = tweets[i].text;
                    var createdAt = tweets[i].created_at;
                    console.log('******************************************************');
                    console.log('');
                    console.log(i + ". " + createdAt + " : " + text);
                    console.log('');

                }


            });

        } else if (choice.userChoice === 'spotify-this-song') {

            inquirer.prompt([

                {
                    type: "input",
                    name: "song",
                    message: "What song would you like to know about?"
                }

            ]).then(function(user) {

                //Search Spotify for user-specified song. If they don't enter a song, the
                //default will be "The Sign" by Ace of Base
                spotify.search({ type: 'track', query: user.song }, function(err, data) {
                    if (err) {
                        console.log('Error occurred: ' + err);
                        return;
                    }
                    var songInfo = data.tracks.items[0];

                    console.log('***************************************');
                    console.log('Artist: ' + songInfo.artists[0].name);
                    console.log('Song Title: ' + songInfo.name);
                    console.log('Spotify Preview Link: ' + songInfo.preview_url);
                    console.log('Album: ' + songInfo.album.name);
                    console.log('***************************************');
                    return;

                });
            })

        } else if (choice.userChoice === 'movie-this') {

            inquirer.prompt([

                {
                    type: "input",
                    name: "movie",
                    message: "What movie would you like to know about?"
                }

            ]).then(function(user) {

                // Run a request to the OMDB API with the user's movie specified. 
                //Still need to figure out: If they don't specify a title, the result will be "Mr. Nobody"

                var queryUrl = "http://www.omdbapi.com/?t=" + user.movie + "&y=&plot=short&tomatoes=true&r=json";

                request(queryUrl, function(error, response, body) {

                    // If the request is successful
                    if (!error && response.statusCode === 200) {

                        // Parse the body of the site and print the movie info

                        console.log('********************************************************');
                        console.log("Title: " + JSON.parse(body).Title);
                        console.log("Year: " + JSON.parse(body).Year);
                        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                        console.log("Country: " + JSON.parse(body).Country);
                        console.log("Language: " + JSON.parse(body).Language);
                        console.log("Plot: " + JSON.parse(body).Plot);
                        console.log("Actors: " + JSON.parse(body).Actors);
                        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
                        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                        console.log('********************************************************');

                    }
                });

            });
        }

    });

}

//Start LIRI
liri();
