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
var SHEET_TOP_MARGIN = 25;
var TREBLE_CLEF_X;
var TREBLE_CLEF_Y;
var TREBLE_CLEF_LEFT_MARGIN = 50; // Relative to Sheet Music position
var TREBLE_CLEF_TOP_MARGIN = 40; // Relative to Sheet Music position
var TREBLE_CLEF_SIZE_FACTOR = 9;
var BASS_CLEF_X;
var BASS_CLEF_Y;
var BASS_CLEF_SIZE_FACTOR = 9;
var BASS_CLEF_LEFT_MARGIN = 50;
var BASS_CLEF_TOP_MARGIN = 10;
var STEM_HEIGHT = 125;
var TREBLE_C3_POS = 0;
var SHEET_LINES_START_Y = 0; // Y-Position of the top line in the sheet music
var SHEET_LINES_END_Y  = 0; // Y-Position of the bottom line in the sheet music
var TREBLE_NOTES_POSITION = {}
var BASS_NOTES_POSITION = {}
var MUSIC_NOTES = {}
var CURRENT_NOTE = '';
var MODE = 'waiting';
var NOTE_TIME = 0;


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
	BASS_CLEF_X = SHEET_LEFT_MARGIN + BASS_CLEF_LEFT_MARGIN;
	BASS_CLEF_Y = SHEET_TOP_MARGIN + BASS_CLEF_TOP_MARGIN;
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

function drawBassClef() {
	var bassImg = new Image();

	bassImg.onload = function() {
	 imgWidth = bassImg.width;
	 imgHeight = bassImg.height;
	 CONTEXT.drawImage(bassImg, BASS_CLEF_X, BASS_CLEF_Y, imgWidth / BASS_CLEF_SIZE_FACTOR, imgHeight / BASS_CLEF_SIZE_FACTOR);
	};
	bassImg.src = 'images/bass_clef.png';
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
		SHEET_LINES_END_Y = lineEndY + (LINE_SPACING * i);
		CONTEXT.beginPath();
		CONTEXT.moveTo(lineStartX,lineStartY + (LINE_SPACING * i));
		CONTEXT.lineTo(lineEndX, SHEET_LINES_END_Y);
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

	initTrebleNotesPosition();
	initBassNotesPosition();
}

function initTrebleNotesPosition() {
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

}

function initBassNotesPosition() {
	BASS_E2_POS = SHEET_LINES_START_Y + 5 * LINE_SPACING;

	// From E1 to C3
	var numNotes = 13;
	var noteIdx = 3;
	var noteRange = 1;
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
	var noteX = SHEET_X + SHEET_LEFT_MARGIN + SHEET_WIDTH / 4;
	var noteY;
	if(clef == 'treble'){
			noteY = TREBLE_NOTES_POSITION[note];
			drawTrebleClef();
	}else if(clef == 'bass'){
			noteY = BASS_NOTES_POSITION[note];
			drawBassClef();
	}
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

	if(note == 'C3' || note == 'A4' || note == 'E1'){
		lineStartX =  SHEET_X + SHEET_LEFT_MARGIN;
		lineEndX = SHEET_X + SHEET_WIDTH - SHEET_RIGHT_MARGIN;
		lineStartY = noteY;
		lineEndY = noteY;
		CONTEXT.beginPath();
		CONTEXT.moveTo(lineStartX, lineStartY);
		CONTEXT.lineTo(lineEndX, lineEndY);
		CONTEXT.stroke();
	}

}

function drawQuestionMark() {
	CONTEXT.font = "50px Arial";
	CONTEXT.fillStyle = 'black';
	CONTEXT.fillText("?", 0, CANVAS_HEIGHT);
}

function drawSheetPage() {
	// White background
	CONTEXT.beginPath();
	CONTEXT.rect(SHEET_X,SHEET_Y,SHEET_WIDTH,SHEET_HEIGHT);
	CONTEXT.fillStyle = 'white';
	CONTEXT.fill();
	drawLines();
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function generateRandomNote() {
	var clef = 'treble';
	var note = getRandomNumber(1, 7);
	var num = getRandomNumber(1, 2);
	if(num == 1) {
		clef = 'treble';
		if(note < 7){
			var range = getRandomNumber(3,4);
		}else{
			var range = 3;
		}
	}else{
		clef = 'bass';
		if(note > 2){
			var range = getRandomNumber(1,2);
		}if(note == 1){
			var range = getRandomNumber(2,3);
		}else if(note == 2){
			var range = 2;
		}
	}

	var noteId = MUSIC_NOTES[note] + String(range);
	console.log("Generated note: " + noteId);
	CURRENT_NOTE = noteId;
	drawNote(clef, noteId);
}

function draw() {
	MODE = 'waiting'
	CONTEXT.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	drawSheetPage();
	generateRandomNote();
	drawQuestionMark();
	printTime();
}

function checkNote(note) {
	if(CURRENT_NOTE[0]==note){
		console.log('Correct!');
		drawResultMsg('Correct: ' + CURRENT_NOTE);
	}else{
		console.log('Wrong!');
		drawResultMsg('Wrong: ' + CURRENT_NOTE);
	}
	MODE = 'next';
}

function drawResultMsg(message) {
	CONTEXT.beginPath();
	CONTEXT.rect(0,CANVAS_HEIGHT - 50, 50, 50);
	CONTEXT.fillStyle = 'white';
	CONTEXT.fill();
	CONTEXT.font = "50px Arial";
	CONTEXT.fillStyle = 'black';
	CONTEXT.fillText(message, 0, CANVAS_HEIGHT);
}

function printTime() {
	CONTEXT.beginPath();
	CONTEXT.rect(CANVAS_WIDTH - 150, CANVAS_HEIGHT - 50, 150, 50);
	CONTEXT.fillStyle = 'white';
	CONTEXT.fill();
	CONTEXT.font = "50px Arial";
	CONTEXT.fillStyle = 'black';
	CONTEXT.fillText(NOTE_TIME  / 1000 + ' s', CANVAS_WIDTH - 150, CANVAS_HEIGHT);
	if(MODE == 'waiting'){
		NOTE_TIME = NOTE_TIME + 100;
	}
}

function main() {
	setup();
	drawSheetPage();
	initNotesPosition();


	window.addEventListener('keydown', function(event) {
		if(MODE == 'waiting'){
				var inputId = String.fromCharCode(event.keyCode);
	      console.log(inputId);
				checkNote(inputId);
		}else{
			NOTE_TIME = 0;
			draw();
		}
	}, false);
	setInterval(printTime, 100);
	draw();
	var gui = new dat.GUI();
}

main();
