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

        else if(lastDrawnObject.type == 'bezier-curve-3d'){
            var accuracy = lastDrawnObject.accuracy;
            var pointsFromTheBezierCurve = lastDrawnObject.points;
            undidDrawnObjects.push({type:'bezier-curve-3d', accuracy:accuracy, points:[...pointsFromTheBezierCurve], color:lastDrawnObject.color});
            console.log(lastDrawnObject);
            console.log(pointsFromTheBezierCurve);
            context.strokeStyle = '#FFFFFF';
            context.moveTo(pointsFromTheBezierCurve[0].fromX, pointsFromTheBezierCurve[0].fromY);

            for(var j = 0; j < 10; j++){
                for (var i=0; i<1; i+=accuracy){
                     var p = bezier(i, pointsFromTheBezierCurve[0], pointsFromTheBezierCurve[1], 
                        pointsFromTheBezierCurve[2], pointsFromTheBezierCurve[3]);
                     context.lineTo(p.x, p.y);
                }

                context.stroke();
            }

            context.closePath();       
            context.strokeStyle = colorButton.value;     

            for(var i = 0; i < pointsFromTheBezierCurve.length; ++i){
                drawDot(pointsFromTheBezierCurve[i].fromX, pointsFromTheBezierCurve[i].fromY, '#FFFFFF');
            }
        }
    }

    else if(isCtrlPressed && event.keyCode == 89){
        var lastUndidObject = undidDrawnObjects.pop();

        console.log(lastUndidObject);

        if(!lastUndidObject)
            return;
        // draw the object and add it to drawnObjects
        
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

        else if(lastUndidObject.type == 'bezier-curve-3d'){
            console.log(lastUndidObject);
            var controlPoints = lastUndidObject.points; 
            const numberOfControlPoinst = controlPoints.length;

            pointsFromBezierCurve3DListed = [];
            for(var i = 0; i < numberOfControlPoinst; i++){
                drawBezierControlPoint(controlPoints[i].fromX, controlPoints[i].fromY, lastUndidObject.color);
            }

            drawBezierCurveCubic(lastUndidObject.color);

            drawnObjects.push({type:'bezier-curve-3d', accuracy:lastUndidObject.accuracy, points:[...pointsFromBezierCurve3DListed], color:lastUndidObject.color});
            pointsFromBezierCurve3DListed = [];
        }
    }
}

document.body.onkeyup = function(event){
    if(event.keyCode == ctrlKeyCode)
        isCtrlPressed = false;
}