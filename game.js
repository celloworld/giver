var canvas;
var canvasContext;
var gameHeight;
var gameWidth;


var frame = 0

var logEnabled = false;
var logLevel = 0;
var randomizeGame = 0;

var hitCount = 0;




window.onload = function() {
	eventHandling();

	canvas = document.getElementById("game-canvas");
	canvasContext = canvas.getContext('2d');
	gameHeight = canvas.height;
	gameWidth = canvas.width;

	paddle2SurfaceX = gameWidth - (paddleMargin + paddleWidth);

	gameViewportPosY = canvas.getBoundingClientRect().top;
	minPaddleY = gameViewportPosY + paddleHeight/2;
	maxPaddleY = gameViewportPosY + gameHeight - paddleHeight/2;

	randomizeGame = randomizeGame || Math.floor(Math.random() * 60) + 40;
	console.log(`randomizeGame: ${randomizeGame}`);
	initialCircleRadius = 8;
	ballX = Math.floor(gameWidth / 2) + initialCircleRadius ;
	ballY = 240;


    document.onmousemove = handleMouseMove;

	setInterval(function()
		{
			frame++;
			drawEverything();
			moveBall();
		}, 1000/fps);
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

// create white dots to show where the cursor has been
	// dot = document.createElement('div');
	// dot.className = "dot";
	// dot.style.left = event.pageX + "px";
	// dot.style.top = event.pageY + "px";
	// document.body.appendChild(dot);

	// console.log( event.pageY, event.pageX)

	moveUserPaddle(event.pageY);
	window.clearTimeout(paddleTimer);
	// zeroes out paddleVelocity after a frame of inaction.

}


function eventHandling(){
    
    //Keyboard events
	document.addEventListener('keydown', (event) => {
		const event = keydown;
		const keyName = event.key;

		console.log(`Key pressed ${keyName}`);

	}, false);

    document.addEventListener("keypress", (event) => {
    	console.log('keypress fired at:\n' + moment()  )
    }, false); //[second]  

    document.addEventListener("keyup", getEvtType, false); //third

    //Mouse events
    document.addEventListener("click", getEvtType, false); // third

    document.addEventListener("mousedown", getEvtType, false); //first
    document.addEventListener("mouseup", getEvtType, false); //second

	window.onbeforeunload = function(){
   		// insert data to mongo
	}

}



function drawEverything() {



}