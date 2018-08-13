function drawDot(x, y, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, 360);
    context.fill();
    context.closePath();
}

function drawLine(fromX, fromY, toX, toY, color){
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
}

function saveCanvas(){
    canvasDrawings.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  
}

function setCanvasBackground(){
    context.drawImage(canvasDrawings, 0, 0);
}

function removeLastLine(){
    if(probeLines.length < 1)
        return;

    var lastProbeLine = probeLines.pop();
    
    context.beginPath();

    context.moveTo(lastProbeLine.fromX, lastProbeLine.fromY);
    context.lineTo(lastProbeLine.toX, lastProbeLine.toY);
    context.strokeStyle = '#FFFFFF';
    context.stroke();

    context.moveTo(lastProbeLine.fromX, lastProbeLine.fromY);
    context.lineTo(lastProbeLine.toX, lastProbeLine.toY);
    context.stroke();

    context.moveTo(lastProbeLine.fromX, lastProbeLine.fromY);
    context.lineTo(lastProbeLine.toX, lastProbeLine.toY);
    context.stroke();

    context.moveTo(lastProbeLine.fromX, lastProbeLine.fromY);
    context.lineTo(lastProbeLine.toX, lastProbeLine.toY);
    context.stroke();
    
    context.closePath();
}

function drawingOptionLogic(){
    if(isUsingFreeDraw && mouseState.isPressed){
        console.log(drawnObjects.length);
        drawDot(mouseState.x, mouseState.y, colorButton.value);
        drawnObjects.push({type:'dot', fromX:mouseState.x, fromY:mouseState.y});
        // save the object to last drawn objects
    }

    if(isUsingLine && mouseState.isPressed){
        removeLastLine();
        drawLine(mouseState.previousX, mouseState.previousY, mouseState.x, mouseState.y, colorButton.value);
        
        probeLines.push({fromX: mouseState.previousX, fromY:mouseState.previousY,
                     toX: mouseState.x, toY: mouseState.y});
    }

    else if(isUsingLine && !mouseState.isPressed){
        // nullify probeLines
        probeLines.pop();
    }
}

function main(){
    if(mouseState.isPressed){

    }
}

setInterval(main, 1);
