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

function bezier(t, p0, p1, p2, p3){
    var cX = 3 * (p1.fromX - p0.fromX),
        bX = 3 * (p2.fromX - p1.fromX) - cX,
        aX = p3.fromX - p0.fromX - cX - bX;
          
    var cY = 3 * (p1.fromY - p0.fromY),
        bY = 3 * (p2.fromY - p1.fromY) - cY,
        aY = p3.fromY - p0.fromY - cY - bY;
          
    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.fromX;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.fromY;
          
    return {x: x, y: y};
  };

function drawBezierControlPoint(x, y, color){
    drawDot(x, y, color);
    pointsFromBezierCurve3DListed.push({fromX:x, fromY:y});
}

function drawBezierCurveCubic(color){
    var accuracy = 0.01;
    context.beginPath();
    context.moveTo(pointsFromBezierCurve3DListed[0].fromX, pointsFromBezierCurve3DListed[0].fromY);
    
    console.log({pointsFromBezierCurve3DListed, color});
    for (var i=0; i<1; i+=accuracy){
         var p = bezier(i, pointsFromBezierCurve3DListed[0], pointsFromBezierCurve3DListed[1], 
                           pointsFromBezierCurve3DListed[2], pointsFromBezierCurve3DListed[3]);
         context.lineTo(p.x, p.y);
    }

    context.strokeStyle = color;
    context.stroke();
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
