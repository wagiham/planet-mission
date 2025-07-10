const planetList = [
  { name: "Baren", file: "Baren.png" },
  { name: "Black Hole", file: "Black_hole.png" },
  { name: "Ice", file: "Ice.png" },
  { name: "Lava", file: "Lava.png" },
  { name: "Terran", file: "Terran.png" }
];

let targetIndex = 0;
let score = 0;
let timeLeft = 30;
let timer = null;
let planetLog = {};
let dialogueTimeout;

const planetArea = document.getElementById("planet-area");
const orbitModal = document.getElementById("orbit-modal");
const targetPlanetSpan = document.getElementById("target-planet");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const catDialogue = document.getElementById("cat-dialogue");
const speechBubble = document.getElementById("speech-bubble");
const logList = document.getElementById("log-list");
const restartButton = document.getElementById("restart-button");

const bgMusic = document.getElementById("bg-music");

// 🎵 Music toggles and autoplay fallback
function tryPlayMusic() {
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(err => console.warn("Autoplay blocked:", err));
  }
}
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const toggleMusic = document.getElementById("toggle-music");

startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  tryPlayMusic();
  resetGame();
});

toggleMusic.addEventListener("click", () => {
  bgMusic.paused ? bgMusic.play() : bgMusic.pause();
});

window.addEventListener("click", tryPlayMusic);
window.addEventListener("keydown", tryPlayMusic);
window.addEventListener("touchstart", tryPlayMusic);

// 🚀 Timer
function startTimer() {
  clearInterval(timer);
  timerDisplay.textContent = timeLeft;
  timer = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      timerDisplay.textContent = 0;
      endGame();
    } else {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
    }
  }, 1000);
}

// 🧹 Reset logic
function resetGame() {
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  planetLog = {};
  updateLog();
  restartButton.style.display = "none";
  orbitModal.style.display = "none";
  setNewMission();
  startTimer();
}

// 🎉 Orbit modal close
function closeOrbit() {
  orbitModal.style.display = "none";
}

// 🐱 Cat dialogue
function showDialogue(type) {
  clearTimeout(dialogueTimeout);
  const phrases = {
    correct: [
      "Nice catch, star scout!",
      "You rock, space cadet!",
      "Out of this world!",
      "✨ You nailed it!"
    ],
    wrong: [
      "Oops! Not that one~",
      "Try again, space explorer!",
      "Not quite! 🔭",
      "Missed it! 🚀"
    ],
    end: [
      "Time's up! Great job!",
      "🌟 Mission complete!",
      "You're a cosmic legend!"
    ]
  };
  const list = phrases[type] || ["Hmm..."];
  speechBubble.textContent = list[Math.floor(Math.random() * list.length)];
  catDialogue.style.display = "flex";
  dialogueTimeout = setTimeout(() => {
    catDialogue.style.display = "none";
  }, 2500);
}

// 🔚 End game
function endGame() {
  feedback.textContent = `⏰ Time's up! Final Score: ${score}`;
  showDialogue("end");
  restartButton.style.display = "inline-block";
}

// 🎯 Planet picking
function setNewMission() {
  targetIndex = Math.floor(Math.random() * planetList.length);
  targetPlanetSpan.textContent = planetList[targetIndex].name;
  renderPlanets();
  feedback.textContent = "";
}

function renderPlanets() {
  planetArea.innerHTML = "";
  let shuffled = [...planetList].sort(() => 0.5 - Math.random());
  shuffled.forEach((planet) => {
    let img = document.createElement("img");
    img.src = `Planets/${planet.file}`;
    img.alt = planet.name;
    img.onclick = () => handleClick(planet.name);
    planetArea.appendChild(img);
  });
}

// 🖱️ Click logic
function handleClick(clickedName) {
  if (clickedName === planetList[targetIndex].name) {
    score++;
    scoreDisplay.textContent = score;
    showDialogue("correct");
    unlockPlanet(clickedName);

    if (score === 5) {
      setTimeout(() => {
        orbitModal.style.display = "block";
        const congratsSound = document.getElementById("congrats-sound");
        if (congratsSound) {
          congratsSound.play().catch(err => console.warn("Sound play blocked:", err));
        }
      }, 500);
    }

  } else {
    showDialogue("wrong");
  }

  setTimeout(setNewMission, 500);
}

// 🪐 Planet log
function unlockPlanet(name) {
  if (!planetLog[name]) {
    const nickname = prompt(`You discovered the ${name} Planet! Give it a name:`);
    planetLog[name] = nickname || name;
    updateLog();
  }
}

function updateLog() {
  logList.innerHTML = "";
  for (let name in planetLog) {
    const li = document.createElement("li");
    li.textContent = `${name} ➜ "${planetLog[name]}"`;
    logList.appendChild(li);
  }
}

// 🔁 Restart listener
restartButton.addEventListener("click", resetGame);

// 👇 Optional: Start game manually after Start button
// resetGame(); ← Don't auto-start
