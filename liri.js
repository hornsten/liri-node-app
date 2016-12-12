var Twitter = require('twitter');
var keys = require('./keys.js');
var inquirer = require("inquirer");
var spotify = require('spotify');
var client = new Twitter(keys.twitterKeys);


// Ask LIRI to perform a task
function liri() {

    // Prompts user to choose from a list of tasks for LIRI to perform
    inquirer.prompt([{
            type: "list",
            name: "userChoice",
            message: "Hi, I'm LIRI! Your wish is my command. What can I do for you?",
            choices: ['my-tweets', `spotify-this-song`]
        }

    ]).then(function(choice) {

        // If the user's guess matches the number then...
        if ((choice.userChoice) === 'my-tweets') {
            client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 20 }, function(error, tweets, response) {
                if (error) throw error;
                // console.log(JSON.stringify(tweets, null, 2)); // The tweets.

                for (var i = 0; i < tweets.length; i++) {
                    var text = tweets[i].text;
                    var createdAt = tweets[i].created_at;
                    console.log(i + ". " + createdAt + " : " + text);
                }


            });
        } else if (choice.userChoice === 'spotify-this-song') {

            inquirer.prompt([

                {
                    type: "input",
                    name: "song",
                    message: "What song would you like?"
                }

            ]).then(function(user) {

                spotify.search({ type: 'track', query: user.song }, function(err, data) {
                    if (err) {
                        console.log('Error occurred: ' + err);
                        return;
                    }
                    var songInfo = data.tracks.items[0];
                    var songResult = console.log('Artist: ' + songInfo.artists[0].name);
                    console.log('Song Title: ' + songInfo.name);
                    console.log('Spotify Preview Link: ' + songInfo.preview_url);
                    console.log('Album: ' + songInfo.album.name);
                    return;

                });
            })

        }

    });

}

//Start the app
liri();
