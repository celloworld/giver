var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert'),
    moment = require('moment'),
    shortid = require('shortid'),
    ObjectId = require('mongodb').ObjectID;

app.use(errorHandler);
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
    let testColldb = db.collection('test');
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
        function checkUserForCookie(){
            // TODO: Aggregate a timeline across multiple sessions for returning users
            // TODO: return UserID to index
        };
        // else generate userID
        // userID = userID || shortid.generate();
        res.render('index', checkUserForCookie());
        // window.onbeforeunload = function() {
        //     alert('hi');
        //     db.collection(today).insert(sessionEvents);
        // }
    });
    app.post('/save', function(req, res, next) {
        console.log(req.body);
        let sessionData = req.body.sessionData;
        let userID = req.body.userID || null;
        if (userID) {
            testColldb.update({"_id": userID}, { $push: { "sessionData": { $each: sessionData} } })
            .then(function(doc) {
                res.json({message: "updated " + userID + " with " + sessionData.length + " events", insertedId: userID});
            })
            .catch(function(err) {
                errorHandler(err);
            });
        } else {
            testColldb.insertOne({"sessionData": sessionData})
            .then(function(result) {
                res.json({message: 'created user with _id: ' + result.insertedId, insertedId: result.insertedId});
            })
            .catch(function(err) {
                errorHandler(err);
            });
        }
    });

    app.get('/history', function(req, res, next){
        var userList = testColldb.find({},{_id:1}).toArray(function(err, docs) {
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
            var userData = testColldb.findOne({"_id": user});
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
            var userData = testColldb.findOne({"_id": user});
            userData.then((doc) => {
                res.json(doc.sessionData)
            });
        }
    });
    

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});







