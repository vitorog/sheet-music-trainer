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
var SHEET_LEFT_MARGIN = 5;
var SHEET_TOP_MARGIN = 20;
var TREBLE_CLEF_X;
var TREBLE_CLEF_Y;
var TREBLE_CLEF_LEFT_MARGIN = 50; // Relative to Sheet Music position
var TREBLE_CLEF_TOP_MARGIN = 40; // Relative to Sheet Music position
var TREBLE_CLEF_SIZE_FACTOR = 9;
var STEM_HEIGHT = 125;
var TREBLE_C3_POS = 0;
var SHEET_LINES_START_Y = 0; // Y-Position of the topmost line in the sheet music
var TREBLE_NOTES_POSITION = {}
var BASS_NOTES_POSITION = {}
var MUSIC_NOTES = {}

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
	SHEET_TOP_MARGIN = SHEET_TOP_MARGIN * CANVAS_HEIGHT / 100;
	TREBLE_CLEF_Y = SHEET_TOP_MARGIN - TREBLE_CLEF_TOP_MARGIN;
	SHEET_LEFT_MARGIN = SHEET_LEFT_MARGIN * CANVAS_WIDTH / 100;
	TREBLE_CLEF_X = SHEET_LEFT_MARGIN + TREBLE_CLEF_LEFT_MARGIN;
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
	SHEET_LINES_START_Y = lineStartY;
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

function initNotesPosition() {
	MUSIC_NOTES[1] = 'C';
	MUSIC_NOTES[2] = 'D';
	MUSIC_NOTES[3] = 'E';
	MUSIC_NOTES[4] = 'F';
	MUSIC_NOTES[5] = 'G';
	MUSIC_NOTES[6] = 'A';
	MUSIC_NOTES[7] = 'B';

	TREBLE_C3_POS = SHEET_LINES_START_Y + 5 * LINE_SPACING;
	// From C3 to A4
	var numNotes = 13;
	var noteIdx = 1;
	var noteRange = 3;
	for(var i = 0; i < 13; i++){
		if(noteIdx > 7){
			noteIdx = 1;
			noteRange = noteRange + 1;
		}
		var noteId = MUSIC_NOTES[noteIdx] + noteRange;
		console.log(noteId)
		TREBLE_NOTES_POSITION[noteId] = TREBLE_C3_POS - i * getHalfStepValue();
		noteIdx = noteIdx + 1;
	}

	BASS_E2_POS = SHEET_LINES_START_Y + 5 * LINE_SPACING;

	// From G2 to C3
	var numNotes = 13;
	var noteIdx = 3;
	var noteRange = 2;
	for(var i = 0; i < 13; i++){
		if(noteIdx > 7){
			noteIdx = 1;
			noteRange = noteRange + 1;
		}
		var noteId = MUSIC_NOTES[noteIdx] + noteRange;
		console.log(noteId)
		BASS_NOTES_POSITION[noteId] = BASS_E2_POS - i * getHalfStepValue();
		noteIdx = noteIdx + 1;
	}

}

function getHalfStepValue() {
	return LINE_SPACING / 2;
}

function getStepValue() {
	return 2 * getHalfStepValue();
}

function drawNote(clef, note) {
	var noteX = 200;
	var noteY = TREBLE_NOTES_POSITION['C4'];
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
}

function main() {
	setup();
	drawSheetPage();
	initNotesPosition();
	drawNote();
	var gui = new dat.GUI();
}

main();
