console.log('yeeee');
var colorButton = document.getElementById('colorButton');
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var mouseState = {
    x:0,
    y:0,
    isPressed:false
};
var radius = 5;

function drawDot(){
    context.fillStyle = colorButton.value;
    context.beginPath();
    context.arc(mouseState.x, mouseState.y, radius, 0, 360);
    context.closePath();
    context.fill();

    console.log(mouseState.x + " ; " + mouseState.y);
}

<<<<<<< HEAD
function main(){
    if(mouseState.isPressed)
        drawDot();
}

=======
>>>>>>> added  free drawing tool
document.onmousemove = function(event){
    mouseState.x = event.pageX;
    mouseState.y = event.pageY; //asd

<<<<<<< HEAD
    if(mouseState.isPressed) // work please
=======
    if(mouseState.isPressed)
>>>>>>> added  free drawing tool
        drawDot();
}

document.onmousedown = function(){ 
    mouseState.isPressed = true;
}

document.onmouseup = function(){
    mouseState.isPressed = false;
}