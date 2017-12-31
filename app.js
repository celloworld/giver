var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert'),
    moment = require('moment'),
    shortid = require('shortid'),
    userID = shortid.generate();

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/moment', express.static(__dirname + '/node_modules/moment/min/'));
app.use('/public', express.static(__dirname + '/public'));

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/a', function(err, db) {

    assert.equal(null, err, "error connecting to MongoClient @ __dirname");
    console.log("Successfully connected to MongoDB... sweeeet");

    app.get('/', function(req, res, next) {
        // window.onload = function() {
            // document.onmousemove = handleMouseMove;
        // }
        var today = moment().format('MM/DD/YYYY hh:mm:ss.SSS').toString();
        console.log(today);
        // TODO: compare incoming user profile against preceding profiles
        // if user exists, get id, insert visit date and duration to user profile
        
        // else generate userID
        userID = userID || shortid.generate();
        res.render('index', { 'userID' : userID });
        // window.onbeforeunload = function() {
        //     alert('hi');
        //     db.collection(today).insert(sessionEvents);
        // }
    });
    app.post('/save', function(req, res) {
        console.log(req.body);
        // console.log("req.body: ", req.body);
        // console.log(movie, typeof movie.imdb, typeof movie.title, typeof movie.year, typeof movie);
        // if (typeof movie.imdb != 'string' || typeof movie.title != 'string' || typeof movie.year != 'string') {
            // next('Please fill out the form completely!');
        // }
        // else {
        
        // db.collection('test').insert(req.body);
        
        // res.sendFile('views/success.html', {root: __dirname });

        // }
        res.end("done");
    });
    
    app.use(errorHandler);

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});







