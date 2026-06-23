const { ipcRenderer } = require('electron');

let currentMode = 'stopwatch'; // 'stopwatch', 'pomodoro', 'shortBreak', 'custom'
let isRunning = false;
let timeElapsed = 0; // for stopwatch
let timeRemaining = 25 * 60; // for countdowns
let timerInterval = null;

// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const closeBtn = document.getElementById('closeBtn');

const MODES = {
    stopwatch: 0,
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    custom: 15 * 60
};

// Format Time
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update UI
function updateUI() {
    const displayTime = currentMode === 'stopwatch' ? timeElapsed : timeRemaining;
    timeDisplay.textContent = formatTime(displayTime);
    
    if (isRunning) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }

    // Apply Pomodoro active styling
    const isPomodoroActive = currentMode === 'pomodoro' && isRunning;
    
    if (isPomodoroActive) {
        timeDisplay.classList.add('pomodoro-active');
        playPauseBtn.classList.add('pomodoro-active');
        document.querySelector('.mode-btn.active').classList.add('pomodoro-active');
    } else {
        timeDisplay.classList.remove('pomodoro-active');
        playPauseBtn.classList.remove('pomodoro-active');
        document.querySelector('.mode-btn.active')?.classList.remove('pomodoro-active');
    }
}

// Timer Logic
function startTimer() {
    if (isRunning) return;
    if (currentMode !== 'stopwatch' && timeRemaining <= 0) return;

    isRunning = true;
    timerInterval = setInterval(() => {
        if (currentMode === 'stopwatch') {
            timeElapsed++;
        } else {
            timeRemaining--;
            if (timeRemaining <= 0) {
                pauseTimer();
                timeRemaining = 0;
                // Optional: Play sound or notification here
            }
        }
        updateUI();
    }, 1000);
    updateUI();
}

function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    updateUI();
}

function resetTimer() {
    pauseTimer();
    timeElapsed = 0;
    timeRemaining = MODES[currentMode];
    updateUI();
}

function switchMode(mode) {
    currentMode = mode;
    
    modeBtns.forEach(btn => {
        btn.classList.remove('active', 'pomodoro-active');
        if (btn.dataset.mode === mode) btn.classList.add('active');
    });

    resetTimer();
}

// Event Listeners
playPauseBtn.addEventListener('click', () => {
    isRunning ? pauseTimer() : startTimer();
});

resetBtn.addEventListener('click', resetTimer);

modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetMode = e.currentTarget.dataset.mode;
        if (currentMode !== targetMode) {
            switchMode(targetMode);
        }
    });
});

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-app');
});

// Init
updateUI();
