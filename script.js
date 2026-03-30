// Test Variables
let testDuration = 30; // seconds
let timeRemaining = 30;
let testActive = false;
let testStarted = false;
let charTyped = 0;
let correctChars = 0;
let testWords = "";
let testStartTime = null;
let currentSection = 'test';

// Sample texts for typing test
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog in a spectacular display of agility and pure momentum. Every keystroke is a calculated movement towards perfection.",
    "Typing speed tests measure your words per minute and accuracy. Practice regularly to improve both metrics and develop consistency.",
    "Artificial intelligence is transforming the world. Machine learning algorithms can now recognize patterns and make predictions with incredible accuracy.",
    "The future of technology lies in quantum computing. These systems will revolutionize how we process information and solve complex problems.",
    "Climate change is one of the most pressing challenges facing humanity today. We must act now to reduce our carbon footprint."
];  

// DOM Elements
const heroSection = document.querySelector('.hero');
const testSection = document.querySelector('.test-section');
const practiceSection = document.querySelector('.practice-section');
const leaderboardSection = document.querySelector('.leaderboard-section');
const startBtn = document.getElementById('StartBtn');
const restartBtn = document.getElementById('restartBtn');
const inputField = document.getElementById('inputField');
const textDisplay = document.getElementById('textDisplay');
const timerDisplay = document.getElementById('timer');
const wpmStat = document.getElementById('wpmStat');
const accuracyStat = document.getElementById('accuracy');
const durationBtns = document.querySelectorAll('.duration-btn');
const navLinks = document.querySelectorAll('.nav-link');

// Event Listeners
startBtn.addEventListener('click', startTest);
restartBtn.addEventListener('click', restartTest);
inputField.addEventListener('input', handleInput);

durationBtns.forEach(btn => {
    btn.addEventListener('click', () => changeDuration(btn));
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        navigateToSection(section);
    });
});

// Navigation Handler
function navigateToSection(section) {
    currentSection = section;
    
    // Hide all sections
    heroSection.style.display = 'none';
    testSection.classList.add('hidden');
    practiceSection.classList.add('hidden');
    leaderboardSection.classList.add('hidden');
    
    // Hide input field when not in test
    inputField.classList.remove('active');
    
    // Update nav links
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Show selected section
    if (section === 'test') {
        heroSection.style.display = 'flex';
    } else if (section === 'practice') {
        practiceSection.classList.remove('hidden');
    } else if (section === 'leaderboard') {
        leaderboardSection.classList.remove('hidden');
    }
}

// Start Test
function startTest() {
    testActive = true;
    testStarted = true;
    charTyped = 0;
    correctChars = 0;
    testStartTime = Date.now();
    
    heroSection.style.display = 'none';
    testSection.classList.remove('hidden');
    
    // Set random text
    testWords = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    displayText(testWords);
    
    // Focus input
    inputField.classList.add('active');
    inputField.disabled = false;
    
    // Focus after a small delay to ensure it's visible
    setTimeout(() => {
        inputField.focus();
    }, 100);
    
    // Start timer
    startTimer();
}

// Display Text
function displayText(text) {
    textDisplay.innerHTML = '';
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.id = `char-${i}`;
        textDisplay.appendChild(span);
    }
}

// Handle Input
function handleInput(e) {
    if (!testActive) return;
    
    const input = e.target.value;
    charTyped = input.length;
    
    // Update display
    for (let i = 0; i < testWords.length; i++) {
        const charSpan = document.getElementById(`char-${i}`);
        if (i < input.length) {
            if (input[i] === testWords[i]) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
                correctChars = i + 1;
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
            }
        } else {
            charSpan.classList.remove('correct', 'incorrect');
        }
    }
    
    updateStats();
}

// Update Stats
function updateStats() {
    if (!testStarted) return;
    
    const timeElapsed = (Date.now() - testStartTime) / 1000;
    const minutes = timeElapsed / 60;
    const words = (charTyped / 5); // Average word length = 5 chars
    const wpm = Math.round(words / minutes) || 0;
    const accuracy = charTyped > 0 ? Math.round((correctChars / charTyped) * 100) : 0;
    
    wpmStat.textContent = wpm;
    accuracyStat.textContent = accuracy + '%';
}

// Start Timer
function startTimer() {
    timeRemaining = testDuration;
    updateTimerDisplay();
    
    const timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endTest();
        }
    }, 1000);
}

// Update Timer Display
function updateTimerDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Change Duration
function changeDuration(btn) {
    if (testActive) return;
    
    durationBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    testDuration = parseInt(btn.dataset.duration);
    timeRemaining = testDuration;
    updateTimerDisplay();
}

// End Test
function endTest() {
    testActive = false;
    inputField.disabled = true;
    
    // Calculate final stats
    const timeElapsed = (Date.now() - testStartTime) / 1000;
    const minutes = timeElapsed / 60;
    const words = (correctChars / 5);
    const finalWpm = Math.round(words / minutes) || 0;
    const finalAccuracy = charTyped > 0 ? Math.round((correctChars / charTyped) * 100) : 0;
    
    // Show results
    const modal = document.getElementById('resultsModal');
    if (modal) {
        const finalWpmEl = document.getElementById('finalWpm');
        const finalAccuracyEl = document.getElementById('finalAccuracy');
        const finalCharactersEl = document.getElementById('finalCharacters');
        const finalErrorsEl = document.getElementById('finalErrors');
        
        if (finalWpmEl) finalWpmEl.textContent = finalWpm;
        if (finalAccuracyEl) finalAccuracyEl.textContent = finalAccuracy + '%';
        if (finalCharactersEl) finalCharactersEl.textContent = charTyped;
        if (finalErrorsEl) finalErrorsEl.textContent = charTyped - correctChars;
        
        modal.classList.add('show');
    }
}

// Restart Test
function restartTest() {
    testActive = false;
    testStarted = false;
    charTyped = 0;
    correctChars = 0;
    inputField.value = '';
    inputField.disabled = false;
    inputField.classList.remove('active');
    
    // Reset display
    document.getElementById('resultsModal').classList.remove('show');
    testSection.classList.add('hidden');
    heroSection.style.display = 'flex';
    
    // Reset stats
    wpmStat.textContent = '0';
    accuracyStat.textContent = '0%';
    updateTimerDisplay();
}

// Make restartTest global
window.restartTest = restartTest;

// Initialize
window.addEventListener('load', () => {
    updateTimerDisplay();
    
    // Add event listener to modal background to close
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                restartTest();
            }
        });
    }
    
    // Add event listener to modal try again button
    const tryAgainBtn = document.querySelector('.modal-content .btn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            restartTest();
        });
    }
});
