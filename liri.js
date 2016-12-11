var Twitter = require('twitter');
var keys = require('./keys.js');
var inquirer = require("inquirer");

var client = new Twitter(keys.twitterKeys);


// Ask LIRI to perform a task
function liri() {

    // Prompts user to choose from a list of tasks for LIRI to perform
    inquirer.prompt([{
            type: "list",
            name: "userChoice",
            message: "Hi, I'm LIRI! Your wish is my command. What can I do for you?",
            choices: ["my-tweets"]
        }

    ]).then(function(choice) {

        // If the user's guess matches the number then...
        if ((choice.userChoice) === "my-tweets") {
            client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 20 }, function(error, tweets, response) {
                if (error) throw error;
                // console.log(JSON.stringify(tweets, null, 2)); // The tweets.

                for (var i = 0; i < tweets.length; i++) {
                    var text = tweets[i].text;
                    var createdAt = tweets[i].created_at;
                    console.log(i + ". " + createdAt + " : " + text);
                }


            });
        } else {

            console.log('Try again');

        }
    });

}

//Start the app
liri();
