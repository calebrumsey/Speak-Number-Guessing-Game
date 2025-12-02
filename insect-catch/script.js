const screens = document.querySelectorAll('.screen');
const chooseInsectBtns = document.querySelectorAll('.choose-insect-btn');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const gameOverEl = document.getElementById('game-over');
const gameOverTitle = document.getElementById('game-over-title');
const gameOverMessage = document.getElementById('game-over-message');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// Configuration
const TIME_LIMIT = 30; // seconds for the player to catch all bugs
const GAME_TARGET = 20; // bugs to win

let timeLeft = 0;
let timerInterval = null;
let score = 0;
let selectedInsect = {};
let isGameOver = false;

startBtn.addEventListener('click', () => screens[0].classList.add('up'));

chooseInsectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const img = btn.querySelector('img');
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        selectedInsect = { src, alt };
        screens[1].classList.add('up');
        setTimeout(() => createInsect(), 1000);
        startGame();
    });
});

// create once and reuse (clone for overlapping play)
const hitAudio = new Audio('smack.mp3');
hitAudio.preload = 'auto';

function playClickSound() {
  // clone so multiple clicks overlap
  const s = hitAudio.cloneNode();
    // play at double speed
    s.playbackRate = 2.0;
    s.play().catch(()=>{}); // ignore play() promise errors
}

restartBtn.addEventListener('click', () => {
    // simple restart: reload the page to reset state
    location.reload();
});

function startGame() {
    // initialize timer
    timeLeft = TIME_LIMIT;
    updateTimeDisplay(timeLeft);
    timerInterval = setInterval(decreaseTime, 1000);
}

function decreaseTime() {
    if (isGameOver) return;

    timeLeft--;
    updateTimeDisplay(timeLeft);

    if (timeLeft <= 0) {
        endGame(false);
    }
}

function updateTimeDisplay(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    timeEl.innerHTML = `Time: ${m}:${s}`;
}

function createInsect() {
    if (isGameOver) return;

    const insect = document.createElement('div');
    insect.classList.add('insect');
    const { x, y } = getRandomLocation();
    insect.style.top = `${y}px`;
    insect.style.left = `${x}px`;
    insect.innerHTML = `<img src="${selectedInsect.src}" alt="${selectedInsect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

    insect.addEventListener('click', catchInsect);

    gameContainer.appendChild(insect);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
}

function catchInsect() {
    if (isGameOver) return;
    // play the user-provided smack sound
    try { playClickSound(); } catch (e) { /* ignore */ }

    increaseScore();
    this.classList.add('caught');
    setTimeout(() => this.remove(), 2000);
    addInsects();
}

function addInsects() {
    if (isGameOver) return;

    setTimeout(createInsect, 1000);
    setTimeout(createInsect, 1500);
}

function increaseScore() {
    score++;
    scoreEl.innerHTML = `Score: ${score}`;

    if (score >= GAME_TARGET) {
        endGame(true);
    } else if (score > 9 && score < GAME_TARGET) {
        // encourage the player, remove the impossible message if present
        message.classList.remove('visible');
    }
}

function endGame(didWin) {
    isGameOver = true;
    clearInterval(timerInterval);

    // remove all insects so the player can't keep clicking
    document.querySelectorAll('.insect').forEach(i => i.remove());

    // show game-over overlay with appropriate text
    finalScoreEl.textContent = score;
    if (didWin) {
        gameOverTitle.textContent = 'You Win!';
        gameOverMessage.innerHTML = `You caught ${score} bugs. Great job!`;
    } else {
        gameOverTitle.textContent = 'Game Over';
        gameOverMessage.innerHTML = `Time's up! You caught ${score} bugs.`;
    }

    gameOverEl.classList.remove('hidden');
}