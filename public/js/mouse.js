(function(){
    var userData = {
        userID: null,
        sessionData: []
    }
    var momentFormat = 'MM/DD/YYYY hh:mm:ss:SSS';
    var sessionBegan = moment().format(momentFormat);
    var ring, dot, eventDoc, doc, body, pageX, pageY;
    var cursorPosition;
    var lastEventCompletionTime = null;

    $(document).ready(()=>{
        handleKeyPress();
        handleClick();
        document.onmousemove = handleMouseMove;
        setInterval( function() {
            if(userData.sessionData.length){
                console.log(userData.sessionData);
                $.post("http://localhost:3000/save", userData, function(response) {
                    // if(insertedID === 'done') {
                        console.log("ajax success!\n", response.message);
                    // }
                    // if(typeof insertedID == "object" && insertedID.hasOwnProperty('$$$')) console.log(insertedID);
                    userData.sessionData = [];
                    userData.userID = userData.userID || response.insertedId;
                });
            }
        }, 2000);

    });

    function gatherEventData(eventData) {
        lastEventCompletionTime = eventData.completionTime;
        userData.sessionData.push(eventData);
    }

    function handleMouseMove(event) {
        let completionTime = moment().valueOf();
        if(!lastEventCompletionTime) lastEventCompletionTime = completionTime;

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

        cursorPosition = {"x": event.pageX, "y": event.pageY};
        
        gatherEventData({
            "completionTime": completionTime,
            "eventType": "cursor-move",
            "coordinates": cursorPosition,
            "downTime": calculateTimelapseBetweenEvents(completionTime)
        });
    }

    function calculateTimelapseBetweenEvents(completionTime){
        let downTime;
        if (lastEventCompletionTime) downTime = completionTime.valueOf() - lastEventCompletionTime.valueOf();
        else downTime = completionTime.valueOf() - sessionBegan.valueOf();
        
        return downTime.valueOf();
    };

    function handleKeyPress(){
        let completionTime = moment().valueOf();
        if(!lastEventCompletionTime) lastEventCompletionTime = completionTime;
        
        //TODO: log where the dom focus is while they type

        document.addEventListener('keydown', (event) => {
            const keyName = event.key;

            console.log(`Key pressed ${keyName}`);

            gatherEventData({
                "completionTime": completionTime,
                "eventType": "keydown",
                "keyPressed": keyName,
                "downTime": calculateTimelapseBetweenEvents(completionTime)
            });
        }, false);
    }

    function handleClick() {
        let completionTime = moment().valueOf();
        if(!lastEventCompletionTime) lastEventCompletionTime = completionTime;

        document.addEventListener("mousedown", (event) => {
            ring = document.createElement('div');
            ring.className = "ring";
            ring.style.left = cursorPosition[0] + "px";
            ring.style.top = cursorPosition[1] + "px";
            $(document.body.appendChild(ring)).fadeOut(4000, function(){$(this).remove()});
        

            function simpleKeys (original) {
              return Object.keys(original).reduce(function (obj, key) {
                obj[key] = typeof original[key] === 'object' ? '{ ... }' : original[key];
                return obj;
              }, {});
            }
            let el = event.target.className !== '' ? event.target.className.split(/\s+/) : event.target.tagName.toLowerCase() ;
            console.log(el, "\n", event.target.tagName );
            gatherEventData({
                "completionTime": completionTime,
                "eventType": "mousedown",
                "coordinates": cursorPosition,
                "targetTag": event.target.tagName.toLowerCase(),
                "targetClass": event.target.className.split(/\s+/),
                "downTime": calculateTimelapseBetweenEvents(completionTime)
            });
        }, false);

        // document.addEventListener("mouseup", (event)=>{}, false); //second
        // document.addEventListener("click", (event)=>{}, false); // third
    }
})();