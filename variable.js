var colorButton = document.getElementById('color-button');
var canvas = document.getElementById('main-board');
var context = canvas.getContext('2d');
var isUsingFreeDraw = true;
var isUsingLine = false;
var probeLines = [];
var canvasDrawings = document.getElementById('canvas-drawings');
var drawnObjects = [];
var undidDrawnObjects = [];
var isShiftPressed;
var isCtrlPressed;

const shiftKeyCode= 16;
const ctrlKeyCode = 17;

var mouseState = {
    x:0,
    y:0,
    previousX:0,
    previousY:0,
    isPressed:false
};
var radius = 5;