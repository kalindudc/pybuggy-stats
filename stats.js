require('dotenv').config();

const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const Users = require('./modules/users');
const Data = require('./modules/data');
const UserData = require('./modules/user-data');
const Errors = require('./modules/errors');
const errorParser = require('./modules/error-parser');
var os = require('os');
var pty = require('node-pty');
const fs = require('fs');
var csv = require('csv-express');

const fileName = "./stats/data-" + Date.now() + '.csv'
// user, problem, problempt attemp #, user attempt #, elapsed/attempt, attempt start time, user type, submitted

// this is our MongoDB database
const dbRoute = process.env.DB_HOST;
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true});

console.log("\nReading problem data...\n");

var problems = {};
const finalData = [];

var emailBlackList = [
    'a@a.com', 
    'b@b.com', 
    'c@c.com', 
    'rachel.dsouza@mail.utoronto.ca', 
    'dsouz210@mail.utoronto.ca',
    'kitty@mail.utoronto.ca',
    'a@abs.com'
];
var validUsers = {};

Data.getProblems((err, data) => {    
    data.forEach((item, i) => {
        problems[item.id] = {
            id: item.id,
            name: item.name,
            index: i
        };
    });

    console.log("\nGot all the problems...\n");
    console.log("\nReading all the all the users\n");
    Users.getAll((err, data) => {
        data.forEach((user, i) => {
            if (!emailBlackList.includes(user.email)) {
                validUsers[user.email] = {
                    email: user.email,
                    type: user.type
                };
            }
        });

        console.log("\nGot all the Users...\n");

        console.log("\nReading all the attempts for all the users and combining them...\n");
        UserData.getAll((err, data) => {
            data.forEach((item, i) => {
                if (!emailBlackList.includes(item.email)) {
                    // user, problem, problempt attemp #, user attempt #, elapsed/attempt, attempt start time, user type, submitted

                    var startTime = new Date(new Date('2019-12-02T15:31:03.036Z').getTime() - (20*1000));
                    item.attempts.forEach((attempt, j) => {
                        // finalData.push({
                        //     user: item.email,
                        //     problem: 'Q' + problems[item.id].index + ':'+ problems[item.id].name,
                        //     attempt: j,
                        //     time: attempt.elapsedTime,
                        //     startTime: new Date(new Date(attempt.createdAt).getTime() - (attempt.elapsedTime*1000)),
                        //     type: validUsers[item.email].type,
                        //     completed: item.complete
                        // });
                        var line = item.email + ',' +
                            'Q' + problems[item.id].index + ':'+ problems[item.id].name + ',' +
                            j + ',' + 
                            attempt.elapsedTime + ',' +
                            new Date(new Date(attempt.createdAt).getTime() - (attempt.elapsedTime*1000)) + ',' +
                            validUsers[item.email].type + ',' +
                            item.complete + "\n";

                        fs.appendFileSync(fileName, line);
                    });
                }
            });

            console.log("\nGot all the User Stats...\n");
            console.log("\n.........................\n");
            console.log("\nData in  " + fileName + "\n");
        });
    });
});




console.log("\n------------------------------\n");
process.on('SIGINT', function() {
    console.log("ok.");
    process.exit();
});