var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert'),
    moment = require('moment'),
    shortid = require('shortid'),
    userID = null,
    ObjectId = require('mongodb').ObjectID;

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/moment', express.static(__dirname + '/node_modules/moment/min/'));
app.use('/public', express.static(__dirname + '/public'));

function cl(el){console.log(el)};

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    if(err){
        console.error("error message:\n", err.message);
        console.error("error stack:\n", err.stack);
    }
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
        // userID = userID || shortid.generate();
        res.render('index', { 'userID' : userID });
        // window.onbeforeunload = function() {
        //     alert('hi');
        //     db.collection(today).insert(sessionEvents);
        // }
    });
    app.post('/save', function(req, res, next) {
        console.log(req.body);
        // console.log("req.body: ", req.body);
        // console.log(movie, typeof movie.imdb, typeof movie.title, typeof movie.year, typeof movie);
        // if (typeof movie.imdb != 'string' || typeof movie.title != 'string' || typeof movie.year != 'string') {
            // next('Please fill out the form completely!');
        // }
        // else {
        let eventData = req.body;
        if (userID) {
            db.collection('test').update({"_id": userID}, { $push: {"sessionData": { $each: eventData.sessionData});
        } else {
            db.collection('test').insertOne(eventData, function(err, doc){
                if (err) {console.error(err)}
                else {userID = doc._id}
            });
        }
        
        // res.sendFile('views/success.html', {root: __dirname });

        // }
        res.end("done");
    });

    app.get('/history', function(req, res, next){
        var userList = db.collection('test').find({},{_id:1}).toArray(function(err, docs) {
            res.render('history', { 'userList' : docs });
            console.log(docs);
        });;
    })
    app.get('/replay', function(req, res, next) {
        let user = new ObjectId(req.query.user);
        cl(user);
        if(!user){
            console.log("FAILED TO FIND USER!\nquery: " + req.query);
            res.redirect('/history');
        } else{
            var userData = db.collection('test').findOne({"_id": user});
            userData.then((doc) => {
                // cl(doc[0]);
                res.render('replay', {
                    'eventList': doc.sessionData,
                    'userId': req.query.user
                });
            });
        }
        // TODO: compare incoming user profile against preceding profiles
        // if user exists, get id, insert visit date and duration to user profile
        
        // else generate userID
        // userID = userID || shortid.generate();
        // res.render('replay', { 'userID' : userID });
        // window.onbeforeunload = function() {
        //     alert('hi');
        //     db.collection(today).insert(sessionEvents);
        // }
    });
    app.get('/user/:userId/events', function(req, res, next) {
        let user = new ObjectId(req.params.userId);
        cl(user);
        if(!user){
            console.log("FAILED TO FIND USER!\nquery: " + req.query);
            response.status(404).json({error: "FAILED TO FIND USER!"});
        } else{
            var userData = db.collection('test').findOne({"_id": user});
            userData.then((doc) => {
                res.json(doc.sessionData)
            });
        }
    });
    
    app.use(errorHandler);

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});







