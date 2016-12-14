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
            //Liri will prompt the user for a song choice...
            inquirer.prompt(spotifyPrompt).then(function(user) {
                //...then search for info about that song
                spotifyThis(user.song);
            });

        } else if (choice.userChoice === 'movie-this') {
            //Liri will prompt the user for a movie choice...
            inquirer.prompt(moviePrompt).then(function(user) {
                //...then search for info about that movie
                movieThis(user.movie);
            });
        } else if (choice.userChoice === 'beautiful-flowers!') {
            //Liri provides "beautiful flowers" for the user who chooses this option
            beautifulFlowers();

        } else if (choice.userChoice === 'do-what-it-says') {
            //Liri takes her first and second (if applicable) prompts from random.txt
            doWhatItSays();
        }

    });

}
// *************************************** Functions **********************************

function myTweets() {
    //call to Twitter to get latest 20 tweets from my account.
    client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 20 }, function(error, tweets, response) {
        if (error) throw error;

        //For each tweet, log its number, when it was created, and the tweet itself 
        for (var i = 0; i < tweets.length; i++) {
            var printTweets = (i + ". " + tweets[i].created_at + " : " + tweets[i].text + "\n-------------------------------\n");
            console.log(printTweets);
            //append this information to log.txt
            appendToLog(printTweets);
        }
        //After each search, user is given the choice to make more requests to Liri, or quit the interface
        askAnotherQuestion();
    });
}

function spotifyThis(awesomeSong) {
    spotify.search({ type: 'track', query: awesomeSong }, function(err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songInfo = data.tracks.items[0];

        var songFacts = '\n***************************************\n' + 'Artist: ' + songInfo.artists[0].name +
            '\nSong Title: ' + songInfo.name + '\nSpotify Preview Link: ' + songInfo.preview_url +
            '\nAlbum: ' + songInfo.album.name + '\n***************************************\n';
        console.log(songFacts);
        appendToLog(songFacts);
        askAnotherQuestion();

    });
}

function movieThis(greatMovie) {

    // Run a request to the OMDB API with the user's movie specified. 

    var queryUrl = "http://www.omdbapi.com/?t=" + greatMovie + "&y=&plot=short&tomatoes=true&r=json";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and print the movie info

            var movieInfo = "\n********************************************************\n" + "Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year + "\nIMDB Rating: " + JSON.parse(body).imdbRating +
                "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language + "\nPlot: " + JSON.parse(body).Plot +
                "\nActors: " + JSON.parse(body).Actors + "\nRotten Tomatoes Rating: " + JSON.parse(body).tomatoRating +
                "\nRotten Tomatoes URL: " + JSON.parse(body).tomatoURL + '\n********************************************************\n';

            console.log(movieInfo);
            appendToLog(movieInfo);
            askAnotherQuestion();
        }

    });
}

function beautifulFlowers() {
    //Rickrolls the user
    var rickRoll = "Never Gonna Give You Up";
    open("https://p.scdn.co/mp3-preview/22bf10aff02db272f0a053dff5c0063d729df988?cid=null");
    var rickRolled = "\n********************YOU JUST GOT RICKROLLED!!!!!!**************\n*\n*\n*\n*\n*\n*\n*";
    console.log(rickRolled);
    appendToLog(rickRolled);
    spotifyThis(rickRoll);
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
                spotifyThis(radSong);

                //if myArray[0] wants a movie...
            } else if (myArray[0] === 'movie-this') {
                //search for the movie
                var coolMovie = myArray[1];
                movieThis(coolMovie);


            } else if (myArray[0] === 'my-tweets') {
                //if myArray wants my tweets, get them
                myTweets();
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

var spotifyPrompt = {
    //When the user chooses spotify-this-song, s/he is presented with this follow-up prompt.
    type: "input",
    name: "song",
    message: "What song would you like to know about?",
    //if user doesn't input anything, "The Sign" by Ace of Base is the default
    default: function() {
        return 'The Sign Ace of Base';
    }
}

var moviePrompt = {
    //When the user chooses movie-this, s/he is presented with this follow-up prompt.
    type: "input",
    name: "movie",
    message: "What movie would you like to know about?",
    //if user doesn't input anything, "Mr. Nobody" is the default
    default: function() {
        return 'Mr. Nobody';
    }
}

var goAgain = {
    //Prompt to find out if user wants to play again before exiting program (default is yes)
    type: 'confirm',
    name: 'goAgain',
    message: '...<sigh>...Anything else (hit enter for YES)?',
    default: true
}

function askAnotherQuestion() {
    //Prompts user to go again, then either restarts or exits program
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

//Start Liri
console.log('Hi, I\'m Liri, your bored assistant.');
liri();
