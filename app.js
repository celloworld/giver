var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser');
    assert = require('assert');
    shortid = require('shortid');
    userID = userID ? userID : shortid.generate();
    sessionEvents = [] 

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

window.onload = function() {
    eventHandling();

    document.onmousemove = handleMouseMove;


}

function handleMouseMove(event) {

    var dot, eventDoc, doc, body, pageX, pageY;

    event = event || window.event; // IE-ism

    // IfpageX/Y aren't available and clientX/Y
    // are, calculate pageX/Y - logic taken from jQuery
        // Calculate pageX/Y ifmissing and clientX/Y available
    if(event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
            (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
            (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
            (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
            (doc && doc.clientTop  || body && body.clientTop  || 0);
    }

    sendEvent("cursorMotion", moment(), event.pageX, event.pageY, null, null);

// create white dots to show where the cursor has been
    // dot = document.createElement('div');
    // dot.className = "dot";
    // dot.style.left = event.pageX + "px";
    // dot.style.top = event.pageY + "px";
    // document.body.appendChild(dot);

    // console.log( event.pageY, event.pageX)

}

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

function sendEvent(eventType, eventTime, data1, data2, data3, data4){
    // switch(eventType) {
    //     case "cursorMotion":

    // }

    let evt = {
        "type": "cursorMotion",
        "x": data1,
        "y": data2,
        "time": moment()
    } 

    sessionEvents.push(evt);
    if (sessionEvents.length % 10 === 0) console.log(sessionEvents);
}

MongoClient.connect('mongodb://localhost:27017/a', function(err, db) {

    assert.equal(null, err, "error connecting to MongoClient @ __dirname");
    console.log("Successfully connected to MongoDB.");



    app.get('/', function(req, res, next) {
        var today = moment().date();
        
        // TODO: compare incoming user profile against preceding profiles
        // if user exists, get id, insert visit date and duration to user profile
        // else
        // generate userID
        userID = userID ? userID : shortid.generate();
        
        db.collection(today).insert({}).toArray(function(err, docs) {
            res.render(today, { 'data': docs } );
        });
        res.render('index', { 'userID' : userID });

    });

    app.post('/movie-entered', function(req, res, next) {
        var movie = {
            "imdb": req.body.imdb,
            "title": req.body.title,
            "year": req.body.year
        }
        console.log(req.body);
        console.log(movie, typeof movie.imdb, typeof movie.title, typeof movie.year, typeof movie);
        if (typeof movie.imdb != 'string' || typeof movie.title != 'string' || typeof movie.year != 'string') {
            next('Please fill out the form completely!');
        }
        else {
            db.collection('movies').insert(movie);
            res.sendFile('views/success.html', {root: __dirname });

        }
    });
    
    app.use(errorHandler);

    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});




