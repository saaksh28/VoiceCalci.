
function getHistory() {
	return document.getElementById("history-value").innerText;
}
function printHistory(num) {
	document.getElementById("history-value").innerText = num;
}
function getOutput() {
	return document.getElementById("output-value").innerText;
}
function printOutput(num) {
	if (num == "") {
		document.getElementById("output-value").innerText = num;
	}
	else {
		document.getElementById("output-value").innerText = getFormattedNumber(num);
	}
}
function getFormattedNumber(num) {
	if (num == "-") {
		return "";
	}
	var n = Number(num);
	var value = n.toLocaleString("en");
	return value;
}
function reverseNumberFormat(num) {
	return Number(num.replace(/,/g, ''));
}
// var operator = document.getElementsByClassName("operator");
// for (var i = 0; i < operator.length; i++) {
// 	operator[i].addEventListener('click', function () {
// 		if (this.id == "clear") {
// 			printHistory("");
// 			printOutput("");
// 		}
// 		else if (this.id == "backspace") {
// 			var output = reverseNumberFormat(getOutput()).toString();
// 			if (output) {//if output has a value
// 				output = output.substr(0, output.length - 1);
// 				printOutput(output);
// 			}
// 		}
// 		else {
// 			var output = getOutput();
// 			var history = getHistory();
// 			if (output == "" && history != "") {
// 				if (isNaN(history[history.length - 1])) {
// 					history = history.substr(0, history.length - 1);
// 				}
// 			}
// 			if (output != "" || history != "") {
// 				output = output == "" ? output : reverseNumberFormat(output);
// 				history = history + output;
// 				if (this.id == "=") {
// 					var result = eval(history);
// 					printOutput(result);
// 					printHistory("");
// 				}
// 				else {
// 					history = history + this.id;
// 					printHistory(history);
// 					printOutput("");
// 				}
// 			}
// 		}

// 	});
// }
var operator = document.getElementsByClassName("operator");

for (var i = 0; i < operator.length; i++) {
	operator[i].addEventListener('click', function () {
		if (this.id == "clear") {
			printHistory("");
			printOutput("");
		} else if (this.id == "backspace") {
			var output = reverseNumberFormat(getOutput()).toString();
			if (output) {//if output has a value
				output = output.substr(0, output.length - 1);
				printOutput(output);
			}
		} else {
			var output = getOutput();
			var history = getHistory();
			if (output == "" && history != "") {
				if (isNaN(history[history.length - 1])) {
					history = history.substr(0, history.length - 1);
				}
			}
			if (output != "" || history != "") {
				output = output == "" ? output : reverseNumberFormat(output);
				if (this.id == "=") {
					var result = eval(history + output);
					printOutput(result);
					printHistory(history + output + " = "); // Store entire calculation process in history

				} else {
					history = history + output + this.id;
					printHistory(history);
					printOutput("");
				}
			}
		}
	});
}

var number = document.getElementsByClassName("number");
for (var i = 0; i < number.length; i++) {
	number[i].addEventListener('click', function () {
		var output = reverseNumberFormat(getOutput());
		if (output != NaN) { //if output is a number
			output = output + this.id;
			printOutput(output);
		}
	});
}
var decimalButton = document.getElementById('.');
decimalButton.addEventListener('click', function () {
	// Handle the click event for the decimal button
	getOutput('.');
});

var currentKey = "";
document.addEventListener('keypress', handleKeyPress);
document.addEventListener('keydown', handleKeyDown);


function handleKeyDown(event) {
	const key = event.key;

	switch (key) {
		case 'Backspace':
			// Handle the Backspace key for clearing
			handleBackspace();
			break;
		// Add more cases for other keys as needed
	}
}

function handleKeyPress(event) {
	const key = event.key;

	switch (key) {
		case '0':
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
		case '7':
		case '8':
		case '9':
			// Handle numeric keys
			currentKey += key;
			printOutput(currentKey);
			break;
		case '+':
		case '-':
		case '*':
		case '/':
			// Handle arithmetic operators
			handleOperator(key);
			break;
		case '=':
		case 'Enter':
			// Handle the equal sign or Enter key for calculation
			// Calculate result logic here
			evaluate(getHistory() + getOutput());
			if (history && output) {
				const result = eval(history + output);
				printOutput(result);
				printHistory("");
			}

			break;
		case '.':
			// Handle the decimal point
			handleDecimal();
			break;
		case 'Escape':
			// Handle the Escape key for clearing the entire input
			printOutput('');
			break;
		// Add more cases for other keys as needed
	}
}

function handleDecimal() {
	// Check if the currentKey already contains a decimal point
	if (!currentKey.includes('.')) {
		currentKey += '.';
		printOutput(currentKey);
	}
}


function handleBackspace() {
	const history = getHistory();
	const output = getOutput();

	// Check if the output is not empty, clear the output
	if (output) {
		const newOutput = output.slice(0, -1);
		printOutput(newOutput);
		currentKey = newOutput;
	} else if (history) {
		// If the output is empty, clear the last entry in history
		const newHistory = history.slice(0, -1);
		printHistory(newHistory);
	}
	printHistory("");
	printOutput("");
	currentKey = "";
	// currentKey = currentKey.slice(0, -1);
	// printOutput(currentKey);
}

function handleOperator(key) {
	const output = getOutput();
	const history = getHistory();

	// Check if the last character in history is an operator
	if (isOperator(history[history.length - 1])) {
		// Replace the last operator with the new one
		printHistory(history.slice(0, -1) + key);
	} else {
		// Append the operator to history
		printHistory(history + output + key);
	}

	// Clear the output
	currentKey = '';
	printOutput('');
}
function isOperator(char) {
	return ['+', '-', '*', '/'].includes(char);
}
function handleEnter() {
	const history = getHistory();
	const output = getOutput();

	// Check if there is a valid expression in history
	if (history.trim() !== '') {
		// Perform calculation
		evaluate(history);
		// Clear history
		printHistory('');
	} else if (output.trim() !== '') {
		// If only a number is in the output, keep it in the history
		printHistory(output);
	}

	// Clear the output
	currentKey = '';
}

// function evaluate(input) {
// 	try {
// 		var result = eval(input);
// 		document.getElementById("output-value").innerText = result;
// 	}
// 	catch (e) {
// 		console.log(e);
// 		document.getElementById("output-value").innerText = "";
// 	}
// }
function evaluate(input) {
	try {
		var result = eval(input);
		if (result === Infinity || isNaN(result)) {
			throw "Division by zero error";
		}
		document.getElementById("output-value").innerText = result;
	} catch (error) {
		alert("Error: Division by zero is not allowed");
		clearDisplay();
	}
}

function clearDisplay() {
	document.getElementById("output-value").innerText = "";
}

// Capture elements
var historyIcon = document.getElementById("history-icon");
var modal = document.getElementById("history-modal");
var closeBtn = document.getElementsByClassName("close")[0];

// Array to store calculations
var calculationHistory = [];

// Function to update calculation history
function updateCalculationHistory() {
	var outputValue = document.getElementById("output-value").innerText;
	var historyValue = document.getElementById("history-value").innerText;
	var calculationExpression = historyValue + outputValue; // Full calculation expression

	// Add the calculation to the history
	calculationHistory.push(calculationExpression);
}

// Event listener for the equals button (click event)
document.getElementById("=").addEventListener("click", function () {
	updateCalculationHistory();
});

// Event listener for keypress (Enter key)
document.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		updateCalculationHistory();
	}
});

// Event listener for the history icon
historyIcon.onclick = function () {
	var historyContent = "<strong>Calculation History:</strong><br>";

	// Generate history content
	calculationHistory.forEach(function (calculation, index) {
		historyContent += (index + 1) + ". " + calculation + "<br>";
	});

	// Display history content in the modal
	document.getElementById("history-content").innerHTML = historyContent;

	// Show the modal
	modal.style.display = "block";
}

// Event listener for the close button
closeBtn.onclick = function () {
	modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

// // Toggle Cam function
// const toggleCam = () => {
//     if (!stream) {
//         // Start the webcam feed
//         if (navigator.mediaDevices.getUserMedia) {
//             navigator.mediaDevices
//                 .getUserMedia({ video: true })
//                 .then((videoStream) => {
//                     stream = videoStream;
//                     video.srcObject = stream;
//                     // Initialize hand detection
                
                    
//                 })
//                 .catch(function (error) {
//                     console.log("Something went wrong!");
//                 });
//         }
//     } else {
//         // Stop the webcam feed
//         let tracks = stream.getTracks();
//         tracks.forEach((track) => track.stop());
//         video.srcObject = null;
//         stream = null;
//         hands.close(); // Close hand detection
//     }
// };

