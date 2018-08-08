
document.onmousemove = function(event){
    mouseState.x = event.pageX;
    mouseState.y = event.pageY; 

    drawingOptionLogic();
}

document.onmousedown = function(){ 
    mouseState.previousX = mouseState.x;
    mouseState.previousY = mouseState.y;
    mouseState.isPressed = true;
}

document.onmouseup = function(){
    mouseState.isPressed = false;

    drawingOptionLogic();
    

    if(isUsingLine && !mouseState.isPressed)
        linesDrawn.push({fromX:mouseState.previousX, fromY:mouseState.previousY, 
            toX:mouseState.x, toY:mouseState.y});
}

document.getElementById('free-drawing').onclick = function(){
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