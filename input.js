
document.onmousemove = function(event){
    mouseState.x = event.pageX;
    mouseState.y = event.pageY; 

    drawingOptionLogic();
}

document.onmousedown = function(){ 
    mouseState.previousX = mouseState.x;
    mouseState.previousY = mouseState.y;
    mouseState.isPressed = true;

    if(isUsingLine)
        saveCanvas();
}

document.onmouseup = function(){
    mouseState.isPressed = false;

    if(isUsingLine && !mouseState.isPressed)
    {
        context.clearRect(0,0, canvas.width, canvas.height);
        setCanvasBackground();
        drawLine(mouseState.previousX, mouseState.previousY, mouseState.x, mouseState.y, colorButton.value);
        drawnObjects.push({type:'line', fromX:mouseState.previousX, fromY:mouseState.previousY, 
                                        toX:mouseState.x, toY:mouseState.y, color:colorButton.value});
    }
}

document.getElementById('free-drawing').onclick = function(){
    if(isUsingLine)
        isUsingLine = false;

    isUsingFreeDraw = !isUsingFreeDraw;
}

document.getElementById('line').onclick = function(){
    if(!isUsingLine){
        // disable the ability to use more than one instrument at once
        if(isUsingFreeDraw)
            isUsingFreeDraw = false;
    }

    isUsingLine = !isUsingLine;
}

document.body.onkeydown = function(event){
    isShiftPressed = event.keyCode == shiftKeyCode;

    if(event.keyCode == ctrlKeyCode)
        isCtrlPressed = true;


    if(isCtrlPressed && event.keyCode == 90){
        if(!drawnObjects.length)
            return;

        // add the object to undid objects
        var lastDrawnObject = drawnObjects.pop();

        console.log('undo');

        if(!lastDrawnObject.type)
            return;

        // delete the object
        // the drawing is so much in order to clear the object
        if(lastDrawnObject.type == 'dot'){
            undidDrawnObjects.push({type:'dot', fromX:lastDrawnObject.fromX, fromY: lastDrawnObject.fromY,
                                    color:lastDrawnObject.color});

            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');  

        }

        else if(lastDrawnObject.type == 'line'){
            undidDrawnObjects.push({type:'line', fromX:lastDrawnObject.fromX, fromY: lastDrawnObject.fromY, 
                                    toX: lastDrawnObject.toX, toY: lastDrawnObject.toY, 
                                    color:lastDrawnObject.color});
            drawLine(lastDrawnObject.fromX, lastDrawnObject.fromY, 
                    lastDrawnObject.toX, lastDrawnObject.toY, '#FFFFFF');
            drawLine(lastDrawnObject.fromX, lastDrawnObject.fromY,
                    lastDrawnObject.toX, lastDrawnObject.toY, '#FFFFFF');
            drawLine(lastDrawnObject.fromX, lastDrawnObject.fromY, 
                    lastDrawnObject.toX, lastDrawnObject.toY, '#FFFFFF');
            drawLine(lastDrawnObject.fromX, lastDrawnObject.fromY, 
                    lastDrawnObject.toX, lastDrawnObject.toY, '#FFFFFF');
            drawLine(lastDrawnObject.fromX, lastDrawnObject.fromY, 
                    lastDrawnObject.toX, lastDrawnObject.toY, '#FFFFFF');
            drawLine(lastDrawnObject.fromX, lastDrawnObject.fromY, 
                    lastDrawnObject.toX, lastDrawnObject.toY, '#FFFFFF');
        }
    }

    else if(isCtrlPressed && event.keyCode == 89){
        var lastUndidObject = undidDrawnObjects.pop();

        console.log(lastUndidObject);

        if(!lastUndidObject)
            return;
        /* draw the object and add it to drawnObjects
        */
        if(lastUndidObject.type == 'dot'){
            drawDot(lastUndidObject.fromX, lastUndidObject.fromY, lastUndidObject.color);
            drawnObjects.push({type:'dot', fromX:lastUndidObject.fromX, fromY:lastUndidObject.fromY, 
                                color:lastUndidObject.color});
        }

        else if(lastUndidObject.type == 'line'){
            drawLine(lastUndidObject.fromX, lastUndidObject.fromY, lastUndidObject.toX, lastUndidObject.toY, 
                    lastUndidObject.color);
            drawnObjects.push({type:'line', fromX:lastUndidObject.fromX, fromY:lastUndidObject.fromY, 
                                toX:lastUndidObject.toX, toY:lastUndidObject.toY, color:lastUndidObject.color});
            
            console.log(lastUndidObject.type);
        }
    }
}

document.body.onkeyup = function(event){
    if(event.keyCode == ctrlKeyCode)
        isCtrlPressed = false;
}