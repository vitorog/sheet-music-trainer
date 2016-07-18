//GLOBAL VARIABLES
var CANVAS;
var CONTEXT;
var CANVAS_WIDTH;
var CANVAS_HEIGHT;
var SHEET_WIDTH;
var SHEET_HEIGHT;
var SHEET_X;
var SHEET_Y;
var LINE_SPACING = 50;
var SHEET_RIGHT_MARGIN = 50;
var SHEET_LEFT_MARGIN = 50;
var SHEET_TOP_MARGIN = 250;
var TREBLE_CLEF_X = 100;
var TREBLE_CLEF_Y = 210;
var TREBLE_CLEF_SIZE_FACTOR = 9;
var STEM_HEIGHT = 125;

function setup() {
	CANVAS = document.getElementById("canvas");
	// size = Math.max(window.innerWidth,window.innerHeight)
	CANVAS.width = window.innerWidth * 3 / 4;
	CANVAS.height = window.innerHeight * 3 / 4;
	CONTEXT = CANVAS.getContext("2d");
	CANVAS_WIDTH = CANVAS.width;
	CANVAS_HEIGHT = CANVAS.height;
	SHEET_X = 0;
	SHEET_Y = 0;
	SHEET_WIDTH = CANVAS.width;
	SHEET_HEIGHT = CANVAS.height;
}

function drawTrebleClef() {
	var trebleImg = new Image();

	trebleImg.onload = function() {
	 imgWidth = trebleImg.width;
	 imgHeight = trebleImg.height;
	 CONTEXT.drawImage(trebleImg, TREBLE_CLEF_X, TREBLE_CLEF_Y, imgWidth / TREBLE_CLEF_SIZE_FACTOR, imgHeight / TREBLE_CLEF_SIZE_FACTOR);
	};
	trebleImg.src = 'images/treble_clef.png';
}

function drawLines() {
	// Note lines
	var lineStartX = SHEET_X + SHEET_LEFT_MARGIN;
	var lineStartY = SHEET_Y + SHEET_TOP_MARGIN;
	var lineEndX = SHEET_X + SHEET_WIDTH - SHEET_RIGHT_MARGIN;
	var lineEndY = lineStartY;
	var numLines = 5;

	for(var i = 0; i < 5; i++){
		CONTEXT.beginPath();
		CONTEXT.moveTo(lineStartX,lineStartY + (LINE_SPACING * i));
		CONTEXT.lineTo(lineEndX, lineEndY + (LINE_SPACING * i));
		CONTEXT.stroke();
	}

	// Left border
	lineStartX = SHEET_X + SHEET_LEFT_MARGIN;
	lineEndX = lineStartX;
	lineStartY = SHEET_Y + SHEET_TOP_MARGIN;
	lineEndY = SHEET_Y + SHEET_TOP_MARGIN + ((numLines - 1) * LINE_SPACING);
	CONTEXT.beginPath();
	CONTEXT.moveTo(lineStartX, lineStartY);
	CONTEXT.lineTo(lineEndX, lineEndY);
	CONTEXT.stroke();

	// Right border
	lineStartX =  SHEET_X + SHEET_WIDTH - SHEET_RIGHT_MARGIN;
	lineEndX = lineStartX;
	lineStartY = SHEET_Y + SHEET_TOP_MARGIN;
	lineEndY = SHEET_Y + SHEET_TOP_MARGIN + ((numLines - 1) * LINE_SPACING);
	CONTEXT.beginPath();
	CONTEXT.moveTo(lineStartX, lineStartY);
	CONTEXT.lineTo(lineEndX, lineEndY);
	CONTEXT.stroke();
}

function drawNote(clef, note) {
	var noteX = 400;
	var noteY = 400 - LINE_SPACING / 2;
	var radius = 15;

	CONTEXT.save();
	CONTEXT.beginPath();
	CONTEXT.scale(1.5, 1);
	CONTEXT.arc(noteX, noteY, radius, 0, 2 * Math.PI, false);
	CONTEXT.fillStyle = 'black';
	CONTEXT.fill();

	CONTEXT.beginPath();
	CONTEXT.moveTo(noteX + radius - 2, noteY);
	CONTEXT.lineTo(noteX + radius - 2, noteY - STEM_HEIGHT);
	CONTEXT.lineWidth = 4;
	CONTEXT.stroke();

	CONTEXT.restore();
}

function drawSheetPage() {
	// White background
	CONTEXT.beginPath();
	CONTEXT.rect(SHEET_X,SHEET_Y,SHEET_WIDTH,SHEET_HEIGHT);
	CONTEXT.fillStyle = 'white';
	CONTEXT.fill();
	drawLines();
	drawTrebleClef();
	drawNote();
}

function main() {
	setup();
	drawSheetPage();
	var gui = new dat.GUI();
}

main();
