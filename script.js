const msgEl = document.getElementById('msg');

// Set the maximum number of attempts allowed
const maxGuesses = 10;

// Counter for the current number of guesses used
let guessesRemaining = maxGuesses;

// Generate random number
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

const randomNum = getRandomNumber();
console.log('Number:', randomNum);

// Variable to store the distance of the previous valid guess
let previousDistance = Infinity; // Start with Infinity so the first guess is always "warmer"

// Initialize speech recognition

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = new window.SpeechRecognition();

// Start recognition and game
recognition.start();

// Capture user speak
function onSpeak(event) {
  const msg = event.results[0][0].transcript;  // You can log the event to view the structure of the data
  console.log(msg);
  writeMessage(msg);
  checkNumber(msg);
}

// Speak result
recognition.addEventListener('result', onSpeak);

// Write what user speaks
function writeMessage(msg) {
  const div = document.createElement('div');
  div.textContent = 'You said: ';
  const span = document.createElement('span');
  span.classList.add('box');
  span.textContent = msg;
  msgEl.append(div, span);
}

// Check msg against the secret number
function checkNumber(msg) {
    let num = Number(msg);
     // Update the value of num if it's a single-digit number
  if (msg === 'one' || msg === 'won') {
    num = 1;
  } else if (msg === 'two') {
    num = 2;
  } else if (msg === 'three') {
    num = 3;
  } else if (msg === 'four') {
    num = 4;
  } else if (msg === 'five') {
    num = 5;
  } else if (msg === 'six') {
    num = 6;
  } else if (msg === 'seven') {
    num = 7;
  } else if (msg === 'eight') {
    num = 8;
  } else if (msg === 'nine') {
    num = 9;
  };


    // Check if the spoken content is a valid number
    console.log(Number.isNaN(num));
  if (Number.isNaN(num)) {
    const div = document.createElement('div');
    div.textContent = 'That is not a valid number';
    msgEl.innerHTML='';
    msgEl.append(div);
    return;
    }
    
    // Check if its in range
    if (num < 1 || num > 100) {
        const div = document.createElement('div');
        div.textContent = 'Number must be between 1 and 100';
        msgEl.append(div);
        return;
    }

 // Display Remaining Guesses 
    if (!Number.isNaN(num) && num >= 1 && num <= 100) {
        guessesRemaining--;
    }

  // Check the number and provide feedback
  if (num === randomNum) {
    const h2 = document.createElement('h2');
    h2.textContent = `Congratulations! You have guessed the correct number: ${num}. You win!`;

    const button = document.createElement('button');
    button.classList.add('play-again');
    button.id = 'play-again';
    button.textContent = 'Play Again';
    // add listener and handler to button
    button.addEventListener('click', () => window.location.reload());

    msgEl.innerHTML = '';
    msgEl.append(h2, button);
    return;
  }

  //  Game Over Check (after a loss)
    if (guessesRemaining === 0) {
        const h2 = document.createElement('h2');
        h2.textContent = `GAME OVER! The number was ${randomNum}.`;

        const button = document.createElement('button');
        button.classList.add('play-again');
        button.id = 'play-again';
        button.textContent = 'Play Again';
        button.addEventListener('click', () => window.location.reload());

        msgEl.innerHTML = ''; // Clear previous messages
        msgEl.append(h2, button);
        return; // Stop execution because the game is over
    }

        // Hot/Cold Logic
       const currentDistance = Math.abs(num - randomNum);
    let feedback = '';
    const lastGuessWasValid = previousDistance !== Infinity;

    if (!lastGuessWasValid) {
        // First guess feedback
        feedback = 'You made a good guess! Now try to get warmer!';
    } else {
        // Compare current distance to the previous distance
        if (currentDistance < previousDistance) {
            feedback = ' GETTING HOTTER! '; // Closer to the number
        } else if (currentDistance > previousDistance) {
            feedback = ' GETTING COLDER! '; // Farther from the number
        } else {
            feedback = 'You are the same distance as before. Try moving!';
        }
    }

       // Update previousDistance for the next guess
    previousDistance = currentDistance;

    // Add Remaining Guesses to Feedback and Display
    feedback += ` | Guesses Left: ${guessesRemaining}`;

    const div = document.createElement('div');
    div.textContent = feedback;

    // Append the feedback to the message element
    msgEl.append(div);
    }

//restart
recognition.addEventListener('end', () => recognition.start());

