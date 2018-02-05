"use strict";

const staticServer = require('express').static;
const path = require('path');
const assert = require('assert');
const moment = require('moment');
const shortid = require('shortid');
const userID = shortid.generate();
const ObjectId = require('mongodb').ObjectID;


module.exports = function routes (app) {

    app.get('/', function (req, res, next) {
        res.render('index', { 'userID' : userID });
    });

    app.post('/save', function (req, res, next) {
        console.log(req.body);
        app.db.collection('test').insert(req.body);
        res.end("done");
    });

    app.get('/history', function (req, res, next) {
        var userList = app.db.collection('test').find({},{_id:1}).toArray(function(err, docs) {
            res.render('history', { 'userList' : docs });
            console.log(docs);
        });
    });

    app.get('/replay', function (req, res, next) {
        let user = new ObjectId(req.query.user);
        cl(user);
        if(!user){
            console.log("FAILED TO FIND USER!\nquery: " + req.query);
            res.redirect('/history');
        } else{
            var userData = app.db.collection('test').findOne({"_id": user});
            userData.then((doc) => {
                // cl(doc[0]);
                res.render('replay', {
                    'eventList': doc.sessionData,
                    'userId': req.query.user,
                    'eventIntervals': calculateEventTiming(doc.sessionData)
                });
            });
        }

        function calculateEventTiming(sessionData){
            var eventIntervals = [];
            for(let i = 0; i < sessionData.length; i++ ) {
                let completionTime = moment(sessionData[i].completionTime).clone();            
                let nextEvent = sessionData[i+1];
            
                // yes, a ternary op would do, but it's not easy to read
                // calculate the time between events based on whether the next event has a duration or is instantaneous
                if(nextEvent.hasOwnProperty("duration")){
                    let nextEventStartTime = moment(nextEvent.completionTime).clone().subtract(nextEvent.duration()).toValue();
                } else {
                    let nextEventStartTime = moment(nextEvent.completionTime).clone().toValue();
                }
                
                eventIntervals.push(nextEventStartTime - completionTime);
            };
        };
        // TODO: compare incoming user profile against preceding profiles
        // if user exists, get id, insert visit date and duration to user profile
    });


    app.get('/user/:userId/events', function (req, res, next) {
        let user = new ObjectId(req.params.userId);
        cl(user);
        if(!user){
            console.log("FAILED TO FIND USER!\nquery: " + req.query);
            response.status(404).json({error: "FAILED TO FIND USER!"});
        } else{
            var userData = app.db.collection('test').findOne({"_id": user});
            userData.then((doc) => {
                res.json(doc.sessionData)
            });
        }
    });

    app.use('/jquery', staticServer(path.join(app.get('root'), '/node_modules/jquery/dist/')));
    app.use('/moment', staticServer(path.join(app.get('root'), '/node_modules/moment/min/')));
    app.use('/public', staticServer(path.join(app.get('root'), '/public')));

}