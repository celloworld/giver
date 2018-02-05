"use strict";

const errorHandler = require('errorhandler');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config');
const routes = require('../routes');

const mongoConnStr = "mongodb://"
    + `${process.env.MONGO_HOST || 'localhost'}`
    + `:${process.env.MONGO_PORT || '27017'}`
    + `/${process.env.MONGO_DB || 'giver'}`;

module.exports = function boot (app) {

    config(app);

    MongoClient.connect(mongoConnStr, function(err, db) {

        if (err) throw err;

        app.db = db;

        routes(app);

        app.use(errorHandler({
            dumpExceptions: app.enabled('debug'),
            showStack: app.enabled('debug')
        }));

    });


    return app;
}