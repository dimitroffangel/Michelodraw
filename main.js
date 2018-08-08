console.log('yeeee');
var colorButton = document.getElementById('colorButton');
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var isUsingFreeDraw = true;
var isUsingLine = false;
var probeLines = [];

var mouseState = {
    x:0,
    y:0,
    previousX:0,
    previousY:0,
    isPressed:false
};
var radius = 5;

function drawDot(){
    context.fillStyle = colorButton.value;
    context.beginPath();
    context.arc(mouseState.x, mouseState.y, radius, 0, 360);
    context.closePath();
    context.fill();
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
    
    
    var additionX = lastProbeLines.fromX - lastProbeLines.toX < 0 ? 1 : 0;

    var additionY = lastProbeLines.fromY - lastProbeLines.toY < 0 ? 1: 0;


    context.beginPath();
    context.moveTo(lastProbeLines.fromX, lastProbeLines.fromY);
    context.lineTo(lastProbeLines.toX+additionX, lastProbeLines.toY+additionY);
    context.lineWidth = 10;
    context.strokeStyle = '#ffffff';
    context.stroke();
    context.closePath();
}

function main(){
    if(mouseState.isPressed){
        if(isUsingFreeDraw)
            drawDot();
    }
}

setInterval(main, 30);

document.onmousemove = function(event){
    mouseState.x = event.pageX;

    mouseState.y = event.pageY; //asdasd
    if(isUsingLine && mouseState.isPressed){
        removeLastLine();
        drawLine();
        
        probeLines.push({fromX: mouseState.previousX, fromY:mouseState.previousY,
                     toX: mouseState.x, toY: mouseState.y});
    }
}

document.onmousedown = function(){ 
    mouseState.previousX = mouseState.x;
    mouseState.previousY = mouseState.y;
    mouseState.isPressed = true;
}

document.onmouseup = function(){
    mouseState.isPressed = false;

    if(isUsingLine)
        probeLines.pop();
}

document.getElementById('free-drawing').onclick = function(){
    isUsingFreeDraw = !isUsingFreeDraw;
}

document.getElementById('line').onclick = function(){
    if(!isUsingLine && isUsingFreeDraw)
        isUsingFreeDraw = false;

    isUsingLine = !isUsingLine;
}