
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
        drawLine();
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