/**
 * Heirarchical conversation example
 */

'use strict';
var Twitter = require('twitter');
var keys = require('./keys.js');
var inquirer = require("inquirer");
var spotify = require('spotify');
var request = require('request');
var fs = require("fs"); //this is the file stream object
var client = new Twitter(keys.twitterKeys);

var liriPrompt = {
    type: 'list',
    name: 'userChoice',
    message: 'Hi, I\'m Liri, Siri\'s brainier sister. What can I do for you?',
    choices: ['my-tweets', 'Right', 'spotify-this-song', 'movie-this', 'do-what-it-says']
};

function main() {
    liriDoThis();
}

function liriDoThis() {
    inquirer.prompt(liriPrompt).then(function(answers) {
        var choice = answers.userChoice;
        if (choice === 'my-tweets') {
            client.get('statuses/user_timeline', { screen_name: 'jhornsten', count: 15 }, function(error, tweets, response) {
                if (error) throw error;

                for (var i = 0; i < tweets.length; i++) {
                    var text = tweets[i].text;
                    var createdAt = tweets[i].created_at;
                    console.log('******************************************************');
                    console.log(i + ". " + createdAt + " : " + text);
                }

            });
        } else if (choice === 'Right') {
            console.log('You befriend the dwarf');
            console.log('He helps you kill the wolf. You can now move forward');
            encounter2a();
        } else {
            console.log('You cannot go that way');
            encounter1();
        }
    });
}

function encounter2a() {
    inquirer.prompt(directionsPrompt).then(function(answers) {
        var direction = answers.direction;
        if (direction === 'Forward') {
            var output = 'You find a painted wooden sign that says:';
            output += ' \n';
            output += ' ____  _____  ____  _____ \n';
            output += '(_  _)(  _  )(  _ \\(  _  ) \n';
            output += '  )(   )(_)(  )(_) ))(_)(  \n';
            output += ' (__) (_____)(____/(_____) \n';
            console.log(output);
        } else {
            console.log('You cannot go that way');
            encounter2a();
        }
    });
}

function encounter2b() {
    inquirer.prompt({
        type: 'list',
        name: 'weapon',
        message: 'Pick one',
        choices: [
            'Use the stick',
            'Grab a large rock',
            'Try and make a run for it',
            'Attack the wolf unarmed'
        ]
    }).then(function() {
        console.log('The wolf mauls you. You die. The end.');
    });
}

main();
