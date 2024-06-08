var microphone = document.getElementById('microphone');
var isMicrophoneOn = false;
var recognition = null;  // Declare recognition globally

microphone.onclick = function () {
    isMicrophoneOn = !isMicrophoneOn; // Toggle the state

    if (isMicrophoneOn) {
        microphone.classList.add("record");
        startSpeechRecognition();
    } else {
        microphone.classList.remove("record");
        stopSpeechRecognition();
    }
};

function startSpeechRecognition() {
    microphone.classList.add("record");
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.start();
    
	operator = {
		"plus": "+",
		"minus": "-",
		"multiply": "*",
		"multiplied": "*",
		"times": "*",
		"divide": "/",
		"divided": "/",
		"reminder": "%"
	}
    recognition.onresult = function (event) {
        var input = event.results[0][0].transcript.trim();
        console.log("Voice Input:", input);
        handleVoiceInput(input);
    };
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
    // Add logic to stop speech recognition if needed
}

function handleVoiceInput(input) {
	
    // Attempt to evaluate the input as a mathematical expression
    try {
        var result = eval(input);
        document.getElementById("output-value").innerText = result;
        speakResult(result);
    } catch (error) {
        // If evaluation fails, indicate that the command was invalid
        speakInvalidCommand();
    }
    microphone.classList.remove("record");
}

function speakResult(result) {
    var synth = window.speechSynthesis;
    var spokenResult = result.toString().replace(/\*/g, ' times ');
    var utterance = new SpeechSynthesisUtterance(spokenResult); // Pass spokenResult only
    synth.speak(utterance);
}


function speakInvalidCommand() {
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance("Sorry, I didn't understand this command");
    synth.speak(utterance);
}

function handleVoiceInput(input) {
    // Replace spoken words with symbols before evaluation
    input = input.replace(/times/g, '*');
    input = input.replace(/multiplied by/g, '*');
    input = input.replace(/multiply/g, '*');
    input = input.replace(/x/g, '*'); // Handle 'x' as multiplication symbol if needed

    // Attempt to evaluate the modified input as a mathematical expression
    try {
        var result = evaluateExpression(input);
        document.getElementById("output-value").innerText = result;
        speakResult(result);
    } catch (error) {
        // If evaluation fails, indicate that the command was invalid
        speakInvalidCommand();
    }
    microphone.classList.remove("record");
}


function evaluateExpression(expression) {
    // Split the expression into operands and operators
    var tokens = expression.split(/(\+|\-|\*|\/)/);

    // Initialize variables for calculation
    var result = parseFloat(tokens[0]); // Initialize result with the first operand

    // Iterate through the tokens, performing calculations
    for (var i = 1; i < tokens.length; i += 2) {
        var operator = tokens[i];
        var operand = parseFloat(tokens[i + 1]);

        // Perform the corresponding operation based on the operator
        switch (operator) {
            case '+':
                result += operand;
                break;
            case '-':
                result -= operand;
                break;
            case '*':
                result *= operand;
                break;
            case '/':
                result /= operand;
                break;
            default:
                throw "Invalid operator";
        }
    }

    return result;
	
}

