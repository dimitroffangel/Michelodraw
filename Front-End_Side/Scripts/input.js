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

    if(isUsingBezierCurve3D && mouseState.isPressed && pointsFromBezierCurve3DListed.length < numberOfPointsClickedForBezierCurve3D){
        drawBezierControlPoint(mouseState.x, mouseState.y, colorButton.value);
    }

    else if(isUsingBezierCurve3D && mouseState.isPressed){
        drawnObjects.push({type:'bezier-curve-3d', points:[...pointsFromBezierCurve3DListed], color:colorButton.value, accuracy:0.01});
        drawBezierCurveCubic(colorButton.value);
        pointsFromBezierCurve3DListed = [];
    }
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

document.getElementById('bezier-curve-cubic').onclick = function(){
    if(!isUsingBezierCurve3D){
        // disable the ability to use more than one instrument at once
        if(isUsingFreeDraw)
            isUsingFreeDraw = false;

        if(isUsingLine)
            isUsingLine = false;
    }

    isUsingBezierCurve3D= !isUsingBezierCurve3D;
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

        RemoveDrawnObject(lastDrawnObject);
    }

    else if(isCtrlPressed && event.keyCode == 89){
        var lastUndidObject = undidDrawnObjects.pop();

        console.log(lastUndidObject);

        if(!lastUndidObject)
            return;
        // draw the object and add it to drawnObjects
        
        ResurrectRemoveObject(lastUndidObject);
    }
}

document.body.onkeyup = function(event){
    if(event.keyCode == ctrlKeyCode)
        isCtrlPressed = false;
}