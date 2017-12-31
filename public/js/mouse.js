
var eventTimer = 0;
var sessionData = [];
//     userID: {}}


window.onload = function() {
    handleKeyPress();
    // console.log(userID);
    document.onmousemove = handleMouseMove;
    setInterval( function() {
        eventTimer += .5;
        if(eventTimer % 1 == 0 && sessionData.length > 0){
            $.post("http://localhost:3000/save",
                JSON.stringify(sessionData),
                function(data) {
                    if(data === 'done') {
                        console.log("ajax success");
                        sessionData = [];
                    }
                });
            }
    }, 500);

}

function resetEventTimer(){
    eventTimer = 0;
}

function packageEvent(eventData) {
    
    // TODO: post event to express connect to mongo
    // TODO: post event to express connect to mongo
    sessionData.push(eventData);
    // model eventData = {
    //  "startingFrame": 5,
    //  "duration": 3.222,
    //  "eventType": "inactivity"
    // }
}

function handleMouseMove(event) {
    resetEventTimer()
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

    // create 1px divs to show where the cursor has been
    dot = document.createElement('div');
    dot.className = "dot";
    dot.style.left = event.pageX + "px";
    dot.style.top = event.pageY + "px";
    $(document.body.appendChild(dot)).fadeOut(4000, function(){$(this).remove()});

    packageEvent({
        "completionTime": moment().toString(),
        "duration": 0,
        "eventType": "cursor-move",
        "position": [event.pageX, event.pageY]
    });
}


function handleKeyPress(){
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;

        console.log(`Key pressed ${keyName}`);

        // if(event.key == 'ArrowUp'){
        //     fps++;
        //     console.log(`fps: ${fps} \nballVelocity: ${ballVelocity}`);
        // }
        // if(event.key == 'ArrowDown'){
        //     fps--;
        //     console.log(`fps: ${fps} \nballVelocity: ${ballVelocity}`);
        // }

        // if (event.key == 'b'){
        //     logLevel++;
        //     switch (logLevel % 4) {
        //         case 1:
        //             logEnabled = true;
        //             console.log("LOG ENABLED -- LOG LVL 1 - BASIC");
        //             break;
        //         case 2:
        //             console.log("LOG ENABLED -- LOG LVL 2 - DEV");
        //             break;
        //         case 3:
        //             console.log("LOG ENABLED -- LOG LVL 3 - MATH");
        //             break;
        //         case 0:
        //             logEnabled = false;
        //             console.log("LOG DISABLED");
        //             break;

        //     }
        // }
    }, false);
}

