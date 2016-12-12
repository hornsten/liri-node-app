// *************************************** Global Variables **********************************
var Twitter = require('twitter');
var keys = require('./keys.js');
var inquirer = require("inquirer");
var spotify = require('spotify');
var request = require('request');
var open = require('open');
var fs = require("fs"); //this is the file stream object
var client = new Twitter(keys.twitterKeys);

// *************************************** Main Process **********************************
// Ask Liri to perform a task
function liri() {

    // Prompts user to choose from a list of tasks for Liri to perform
    inquirer.prompt([{
            type: "list",
            name: "userChoice",
            message: "What can I do for you?",
            choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'beautiful-flowers!', 'do-what-it-says']
        }

    ]).then(function(choice) {

        if ((choice.userChoice) === 'my-tweets') {
            // Liri will print a list of my latest tweets
            myTweets();

        } else if (choice.userChoice === 'spotify-this-song') {
            //Liri will provide song information from Spotify based on user request
            spotifyThis();

        } else if (choice.userChoice === 'movie-this') {
            //Liri will provide movie information from OMDB based on user request
            movieThis();

        } else if (choice.userChoice === 'beautiful-flowers!') {
            //Liri provides "beautiful flowers" for the user who chooses this option
            beautifulFlowers();

        } else if (choice.userChoice === 'do-what-it-says') {
            //Liri takes her commands from the first line of random.txt
            doWhatItSays();
        }

    });

}
// *************************************** Functions **********************************
function myTweets() {
    //call to Twitter to get latest tweets from my account.  I don't have 20 yet.
    client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 15 }, function(error, tweets, response) {
        if (error) throw error;
        //For each tweet, log its number, when it was created, and the tweet itself 
        for (var i = 0; i < tweets.length; i++) {
            var text = tweets[i].text;
            var createdAt = tweets[i].created_at;
            console.log(i + ". " + createdAt + " : " + text);
            console.log('___________________________________');
            //append this information to log.txt
            appendToLog(i + ". " + createdAt + " : " + text);
        }
        //After each search, user is given the choice to make more requests to Liri, or quit the interface
        askAnotherQuestion();
    });
}
//When the user chooses spotify-this-song, s/he is presented with this follow-up prompt.
var spotifyPrompt = {
    type: "input",
    name: "song",
    message: "What song would you like to know about?",

    //if user doesn't input anything, "The Sign" is the default
    default: function() {
        return 'The Sign Ace of Base';
    }
}

function spotifyThis() {
    inquirer.prompt(spotifyPrompt).then(function(user) {

        //Search Spotify for user-specified song.

        var theSong = user.song;

        spotify.search({ type: 'track', query: theSong }, function(err, data) {


            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }

            var songInfo = data.tracks.items[0];
            var songData = {
                artist: songInfo.artists[0].name,
                title: songInfo.name,
                link: songInfo.preview_url,
                album: songInfo.album.name
            }

            console.log('***************************************');
            console.log('Artist: ' + songInfo.artists[0].name);
            console.log('Song Title: ' + songInfo.name);
            console.log('Spotify Preview Link: ' + songInfo.preview_url);
            console.log('Album: ' + songInfo.album.name);
            console.log('***************************************');
            appendToLog(songData)
            askAnotherQuestion();

        });
    })

};

function beautifulFlowers() {
    var rickRoll = "Never Gonna Give You Up";

    spotify.search({ type: 'track', query: rickRoll }, function(err, data) {


        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songInfo = data.tracks.items[0];

        open(songInfo.preview_url);
        console.log(" ");
        console.log('!!!!!!!!!!!!!!!!!You just got Rickrolled!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!!!!!!!!!!!!You just got Rickrolled!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!!!!!!!!!!!!You just got Rickrolled!!!!!!!!!!!!!!!!!');
        console.log('**********************************************************');
        console.log('Artist: ' + songInfo.artists[0].name);
        console.log('Preview URL ' + songInfo.preview_url);
        console.log('Album: ' + songInfo.album.name);
        console.log('**********************************************************');
        console.log('!!!!!!!!!!!!!!!!!You just got Rickrolled!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!!!!!!!!!!!!You just got Rickrolled!!!!!!!!!!!!!!!!!');
        console.log('!!!!!!!!!!!!!!!!!You just got Rickrolled!!!!!!!!!!!!!!!!!');
        console.log(" ");

        console.log('I\'m *actually* having fun now!  Wait...already over it...');

        appendToLog(songInfo.artists[0].name + "...User Was Rickrolled.");
        askAnotherQuestion();

    });
}
//When the user chooses movie-this, s/he is presented with this follow-up prompt.

var moviePrompt = {
    type: "input",
    name: "movie",
    message: "What movie would you like to know about?",
    //if user doesn't input anything, "Mr. Nobody" is the default
    default: function() {
        return 'Mr. Nobody';
    }
}

var goAgain = {
    type: 'confirm',
    name: 'goAgain',
    message: '...<sigh>...Anything else (hit enter for YES, if you must)?',
    default: true
}

function askAnotherQuestion() {
    inquirer.prompt(goAgain).then(function(user) {
        if (user.goAgain) {
            liri();
        } else {
            console.log(' ');
            console.log('Well, this has been...different. Thanks, I guess? Bye, weirdo...[Liri has disconnected].');
            console.log(' ');
        }
    })
}

function movieThis() {

    inquirer.prompt(moviePrompt).then(function(user) {

        // Run a request to the OMDB API with the user's movie specified. 

        var queryUrl = "http://www.omdbapi.com/?t=" + user.movie + "&y=&plot=short&tomatoes=true&r=json";

        request(queryUrl, function(error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                // Parse the body of the site and print the movie info

                var movieData = {
                    title: JSON.parse(body).Title,
                    year: JSON.parse(body).Year,
                    imdbRating: JSON.parse(body).imdbRating,
                    country: JSON.parse(body).Country,
                    language: JSON.parse(body).Language,
                    plot: JSON.parse(body).Plot,
                    actors: JSON.parse(body).Actors,
                    rotten_tomatoes_rating: JSON.parse(body).tomatoRating,
                    rotten_tomatoes_URL: JSON.parse(body).tomatoURL
                }

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

                appendToLog(JSON.stringify(movieData, null, 2));
                askAnotherQuestion();
            }

        });

    });
}

function doWhatItSays() {
    //This function grabs the first line of random.txt, splits it into an array, and uses the two indices as arguments
    fs.readFile('random.txt', "utf8", function(error, data) {

        if (error) {
            return console.log(error);

        } else {
            //splits the first line of random.txt into an array
            var myArray = data.split(',');
            //if myArray[0] is 'spotify-this-song'...
            if (myArray[0] === 'spotify-this-song') {
                //search for the song specified in myArray[1]  
                var radSong = myArray[1];

                spotify.search({ type: 'track', query: radSong }, function(err, data) {

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
                    askAnotherQuestion();

                });
                //if myArray[0] wants a movie...
            } else if (myArray[0] === 'movie-this') {
                //search for the movie
                var coolMovie = myArray[1];

                var queryUrl = "http://www.omdbapi.com/?t=" + coolMovie + "&y=&plot=short&tomatoes=true&r=json";

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
                    askAnotherQuestion();
                });

                //if myArray wants my tweets, get them
            } else if (myArray[0] === 'my-tweets') {
                myTweets();
                askAnotherQuestion();
            }

        }

    })
}
//function to append all the search results to log.txt
function appendToLog(info) {
    var f = 'log.txt';

    fs.appendFile(f, info, function(err) {
        if (err)
            console.error(err);
    });
}

//Start Liri
console.log('Hi, I\'m Liri, your bored assistant.');
liri();
