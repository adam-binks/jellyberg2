var objectVolumes = {"blue whales": 223.5, 
				   "footballs": 0.00729,
				   "books": 0.0015,
				   "Cadbury's chocolate bars": 0.001932,
				   "DS cartridges":0.00006,
				   "coffees": 0.000576};

var buildingVolumes = {"Empire State Building": 8094,
					 "Baltic Centre": 8880,
					 "Tower of Pisa": 1963,
					 "Eiffel Tower": 40500,
					 "Wales": 207610*1000000000, 
					 "Russia": 17098242*1000000000,
					 "New Zealand": 268021*1000000000,
					 "a YRS mentor": 0.261};

var largeNumberDigits = {
	6:"million",
	9:"billion",
	12:"trillion",
	15:"quadrillion",
	18:"quintillion",
	21:"sextillion",
	24:"septillion",
	27:"octillion",
	30:"nonillion",
	33:"decillion",
	36:"undecillion",
	39:"duodecillion",
	42:"tredecillion",
	45:"quattuordecillion",
	48:"quindecillion",
	51:"sexdecillion",
	54:"septendecillion",
	57:"octodecillion",
	60:"novemdecillion",
	63:"vigintillion",
	303:"centillion"
};

var maxImagesToDisplay = 3000;
var imageDisplayInterval = 0.2;

var targetResult;
var currentResult = 0;
var selectedObjectName;
var currentIntervalID;


function start() {
	updateSelectProperties();

	var calcButton = document.getElementById("calcButton");
	calcButton.onclick = updateAnswer;
	document.getElementById("output").style.display = 'none';
	document.getElementById("outputWords").style.display = 'none';
}

/// set the dropdown lists to the objects and countries in the database
function updateSelectProperties() {
	// populate the object select menu
	var objectSelect = document.getElementById("objectSelect");
	var objectKeys = Object.keys(objectVolumes);
	populateSelect(objectSelect, objectKeys);

	//populate the building select menu
	var buildingSelect = document.getElementById("buildingSelect");
	var buildingKeys = Object.keys(buildingVolumes);
	populateSelect(buildingSelect, buildingKeys);
}

/// adds the optionNames to the selectElement as separate options in the dropdown
function populateSelect(selectElement, optionNames) {
	for (var i = 0; i < optionNames.length; i++) {
		var option = document.createElement("option");
		option.text = optionNames[i];
		selectElement.appendChild(option);
	}
}

/// clear all output
function clearAnswer() {
	var answerText = document.getElementById("output");
	answerText.style.display = "none";
	var pictogramDiv = document.getElementById("pictogram");
	pictogramDiv.innerHTML = '';
	var wordOutputText = document.getElementById("outputWords");
	wordOutputText.style.display = "none";
}

/// update the output text for the answer
function updateAnswer () {
	var objectSelect = document.getElementById("objectSelect");
	var buildingSelect = document.getElementById("buildingSelect");

	var answerText = document.getElementById("output");
	answerText.style.fontSize = "100px"; //reset text size
	var result = getOutput(objectVolumes[objectSelect.value], 
									   buildingVolumes[buildingSelect.value]);
	answerText.textContent = 0; // will be updated one by one as the pictogram appears
	answerText.style.display = "block";

	GenPictogram(result, objectSelect.value, buildingSelect.value);
}

/// generate a pictogram of the object tiled in a grid, with a delay
function GenPictogram(result, objectName, buildingName) {
	var pictogramDiv = document.getElementById("pictogram");
	pictogramDiv.innerHTML = '';
	var wordOutputText = document.getElementById("outputWords");
	wordOutputText.style.display = "none";
	targetResult = result;
	currentResult = 0;
	selectedObjectName = objectName;
	window.clearInterval(currentIntervalID);
	currentIntervalID = window.setInterval(AddPictogramImage, imageDisplayInterval);
}

/// add a new image (called every x seconds to make them pop in in sequence)
function AddPictogramImage() {
	var numToAddThisFrame;
	if (currentResult < maxImagesToDisplay) {
		numToAddThisFrame = 10 + Math.ceil((currentResult + 1) * 0.01);
	} else {
		numToAddThisFrame = Math.ceil((currentResult + 1) / 10);
	}
	currentResult += numToAddThisFrame;
	if (currentResult >= targetResult) {
		currentResult = targetResult;
		window.clearInterval(currentIntervalID);
		getWordOutput(targetResult);
	}

	// generate images, but not TOO many...
	if (currentResult < maxImagesToDisplay){
		for (var i = 0; i < numToAddThisFrame; i++) {
			var pictogramDiv = document.getElementById("pictogram");
			var image = document.createElement("img");
			image.src = selectedObjectName + ".png";
			pictogramDiv.appendChild(image);	
		}
	}
	updateOutputText();
}

/// update the answer text to the current result
function updateOutputText() {
	var answerText = document.getElementById("output");
	answerText.textContent = currentResult;
	if (checkOverflow(answerText)) {
		resizeText(0.9, answerText, 100);
	}
	else { console.log('it fits');	}
}

function checkOverflow(el)
{
   var curOverflow = el.style.overflow;
   if ( !curOverflow || curOverflow === "visible" )
      el.style.overflow = "hidden";

   var isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;

   el.style.overflow = curOverflow;

   return isOverflowing;
}

function resizeText(multiplier, element, defaultSize) {
  if (element.style.fontSize === "") {
    element.style.fontSize = defaultSize.toString() + "px";
  }
  element.style.fontSize = parseFloat(element.style.fontSize) * multiplier + "px";
}

/// work out how many objects with objectVolume can fit in the given buildingVolume
function getOutput (objectVolume, buildingVolume) {
	// round down because decimals are ugly
	var result = buildingVolume / objectVolume;
	if (Number.isNaN(result)) {
		console.log("Error: not a number");
	}
	return Math.floor(result);
}

// convert the int output into words
function getWordOutput(result) {
	var words = intToWords(result); 
	if (words.includes("undefined")) {
		return;
	}
	// update the word output
	var wordOutputText = document.getElementById("outputWords");
	wordOutputText.textContent = "That's about "+words+".";
	wordOutputText.style.display = "block";
}

function intToWords(num) {
	var numString = num.toString();
	var digits = getNumDigits(num);
	var adjust = 1;
	while (true) {
		if ((digits) in Object.keys(largeNumberDigits)) {
			return numString.slice(0, adjust) +" "+ largeNumberDigits[digits];
		} else {
			adjust += 1;
			digits -= 1;
		}
		if (digits === 0) {
			return;
		}

		console.log('');
		console.log("digits: "+digits+", adjust :"+adjust+", num :"+num);
	}
}


function getNumDigits(num) {
	return Math.floor(Math.log(num) / Math.log(10));
}


document.addEventListener("DOMContentLoaded", start);