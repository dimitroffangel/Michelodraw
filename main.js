
function drawDot(){
    context.fillStyle = colorButton.value;
    context.beginPath();
    context.arc(mouseState.x, mouseState.y, radius, 0, 360);
    context.fill();
    context.closePath();
}

function drawLine(){
    context.beginPath();
    context.moveTo(mouseState.previousX, mouseState.previousY);
    context.lineTo(mouseState.x, mouseState.y);
    context.lineWidth = 1;
    context.strokeStyle = colorButton.value;
    context.stroke();
    context.closePath();
}

function removeLastLine(){
    if(probeLines.length < 1)
        return;

    var lastProbeLines = probeLines.pop();
    
    context.beginPath();
    context.moveTo(lastProbeLines.fromX, lastProbeLines.fromY);
    context.lineTo(lastProbeLines.toX, lastProbeLines.toY);
    context.strokeStyle = '#FFFFFF';
    context.stroke();

    context.moveTo(lastProbeLines.fromX, lastProbeLines.fromY);
    context.lineTo(lastProbeLines.toX, lastProbeLines.toY);
    context.stroke();

    context.moveTo(lastProbeLines.fromX, lastProbeLines.fromY);
    context.lineTo(lastProbeLines.toX, lastProbeLines.toY);
    context.stroke();

    context.moveTo(lastProbeLines.fromX, lastProbeLines.fromY);
    context.lineTo(lastProbeLines.toX, lastProbeLines.toY);
    context.stroke();
    context.closePath();
}

function drawingOptionLogic(){
    if(isUsingLine && mouseState.isPressed){
        removeLastLine();
        drawLine();
        
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
        if(isUsingFreeDraw)
            drawDot();
    }
}

setInterval(main, 30);
