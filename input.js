
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
                                        toX:mouseState.x, toY:mouseState.y});
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

        
        var lastDrawnObject = drawnObjects.pop();
        console.log('undo');

        if(!lastDrawnObject.type)
            return;

        // delete the object
        if(lastDrawnObject.type == 'dot'){
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');
            drawDot(lastDrawnObject.fromX, lastDrawnObject.fromY, '#FFFFFF');
        }

        else if(lastDrawnObject.type == 'line'){
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
}

document.body.onkeyup = function(event){
    if(event.keyCode == ctrlKeyCode)
        isCtrlPressed = false;
}