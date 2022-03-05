var colorButton = document.getElementById('color-button');
var canvas = document.getElementById('main-board');
var xInput = document.getElementById('x-value');
var yInput = document.getElementById('y-value');
var context = canvas.getContext('2d');
var isUsingFreeDraw = true;
var isUsingLine = false;
var isUsingBezierCurve3D = false;
var probeLines = [];
var canvasDrawings = document.getElementById('canvas-drawings');
var drawnObjects = [];
var undidDrawnObjects = [];
var isShiftPressed;
var isCtrlPressed;
var numberOfPointsClickedForBezierCurve3D = 4;
var pointsFromBezierCurve3DListed = [];

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