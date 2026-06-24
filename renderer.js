const { ipcRenderer } = require('electron');

let currentMode = 'stopwatch'; // 'stopwatch', 'pomodoro', 'shortBreak', 'custom'
let isRunning = false;
let timeElapsed = 0; // for stopwatch
let timeRemaining = 25 * 60; // for countdowns
let timerInterval = null;
let isAlarmPlaying = false;
let alarmInterval = null;


// DOM Elements
const timeDisplay = document.getElementById('timeDisplay');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const resetBtn = document.getElementById('resetBtn');
const modeBtns = document.querySelectorAll('.mode-btn');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const decreaseTimeBtn = document.getElementById('decreaseTimeBtn');
const increaseTimeBtn = document.getElementById('increaseTimeBtn');

const MODES = {
    stopwatch: 0,
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    custom: 15 * 60
};

// Alarm Logic
function playAlarmSound() {
    if (isAlarmPlaying) return;
    isAlarmPlaying = true;
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    let playBeep = () => {
        if (!isAlarmPlaying) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
        
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
        gain2.gain.setValueAtTime(0.1, ctx.currentTime + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc2.start(ctx.currentTime + 0.2);
        osc2.stop(ctx.currentTime + 0.3);
    };

    playBeep();
    alarmInterval = setInterval(playBeep, 1000);
    setTimeout(stopAlarm, 10000); // stop after 10s
}

function stopAlarm() {
    isAlarmPlaying = false;
    clearInterval(alarmInterval);
}

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

    if (currentMode === 'custom') {
        decreaseTimeBtn.classList.add('always-visible');
        increaseTimeBtn.classList.add('always-visible');
    } else {
        decreaseTimeBtn.classList.remove('always-visible');
        increaseTimeBtn.classList.remove('always-visible');
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
                playAlarmSound();
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
    stopAlarm();
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
    stopAlarm();
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

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-app');
});

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-app');
});

decreaseTimeBtn.addEventListener('click', () => {
    stopAlarm();
    if (currentMode === 'stopwatch') {
        timeElapsed = Math.max(0, timeElapsed - 60);
    } else {
        timeRemaining = Math.max(0, timeRemaining - 60);
        if (currentMode === 'custom') MODES.custom = timeRemaining;
    }
    updateUI();
});

increaseTimeBtn.addEventListener('click', () => {
    stopAlarm();
    if (currentMode === 'stopwatch') {
        timeElapsed += 60;
    } else {
        timeRemaining += 60;
        if (currentMode === 'custom') MODES.custom = timeRemaining;
    }
    updateUI();
});

// Init
updateUI();
