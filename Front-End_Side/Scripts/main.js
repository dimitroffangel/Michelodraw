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
        drawDot(mouseState.x, mouseState.y, colorButton.value);
        drawnObjects.push({type:'dot', fromX:mouseState.x, fromY:mouseState.y, color:colorButton.value});
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

function drawAllDrawnObjects(){
    drawnObjects.forEach(function(object){
        if(!object)
            return;
        
            // draw the object and add it to drawnObjects
        if(object.type == 'dot'){
            drawDot(object.fromX, object.fromY, object.color);
        }

        else if(object.type == 'line'){
            drawLine(object.fromX, object.fromY, object.toX, object.toY, 
                    object.color);
        }
    });
}

function main(){
    for(var x = 0; x < canvas.width; x++){
        for(var y = 0; y < canvas.height; y++){
            drawDot(x,y, colorButton.value);
            drawnObjects.push({type:'dot', fromX:x, 
                                fromY:y, color:colorButton.value});            
        }
    }
}

// function undo(){
//     drawnObjects.forEach(function(object){

//     });
// }

// main();
