let correctAnswer = 0;
let score = 0;
let lives = 3;
let timer = 10;
let timerInterval;

const questionEl = document.getElementById('question');
const answerButtons = document.querySelectorAll('.answer-btn');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const gameOverEl = document.getElementById('game-over');
const timerEl = document.getElementById('timer');
const highScoreEl = document.getElementById('high-score');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = `High Score: ${highScore}`;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateQuestion() {
  clearInterval(timerInterval);
  timer = 10;
  updateTimer();

  const a = getRandomInt(1, 10);
  const b = getRandomInt(1, 10);
  const ops = ['+', '-', '*'];
  const op = ops[getRandomInt(0, ops.length)];

  switch (op) {
    case '+':
      correctAnswer = a + b;
      break;
    case '-':
      correctAnswer = a - b;
      break;
    case '*':
      correctAnswer = a * b;
      break;
  }

  questionEl.textContent = `${a} ${op} ${b} = ?`;

  const correctIndex = getRandomInt(0, 3);
  answerButtons.forEach((btn, index) => {
    if (index === correctIndex) {
      btn.textContent = correctAnswer;
    } else {
      let wrong;
      do {
        wrong = correctAnswer + getRandomInt(-5, 6);
      } while (wrong === correctAnswer || wrong < 0);
      btn.textContent = wrong;
    }
  });

  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer === 0) {
      clearInterval(timerInterval);
      handleWrong();
    }
  }, 1000);
}

function updateTimer() {
  timerEl.textContent = `Time Left: ${timer}s`;
}

function checkAnswer(index) {
  const chosen = parseInt(answerButtons[index].textContent);
  clearInterval(timerInterval);
  if (chosen === correctAnswer) {
    correctSound.play();
    score++;
    scoreEl.textContent = `Score: ${score}`;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highScoreEl.textContent = `High Score: ${highScore}`;
    }
  } else {
    handleWrong();
  }
  generateQuestion();
}

function handleWrong() {
  wrongSound.play();
  lives--;
  livesEl.textContent = `Lives: ${lives}`;
  if (lives === 0) {
    gameOver();
  } else {
    generateQuestion();
  }
}

function gameOver() {
  clearInterval(timerInterval);
  gameOverEl.classList.remove('hidden');
  questionEl.textContent = '';
  timerEl.textContent = '';
  answerButtons.forEach(btn => btn.disabled = true);
}

generateQuestion();


// Submit score to leaderboard
function submitScoreToLeaderboard(name, score) {
  const entry = {
    name: name,
    score: score,
    timestamp: Date.now()
  };
  firebase.database().ref('leaderboard').push(entry);
}

// Load top 5 scores
function loadLeaderboard() {
  firebase.database().ref('leaderboard')
    .orderByChild('score')
    .limitToLast(5)
    .once('value', snapshot => {
      const list = document.getElementById('leaderboard-list');
      list.innerHTML = '';
      const scores = [];
      snapshot.forEach(child => scores.push(child.val()));
      scores.reverse();
      scores.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        list.appendChild(li);
      });
    });
}
function submitScoreToLeaderboard(name, score) {
  const entry = {
    name: name,
    score: score,
    timestamp: Date.now()
  };
  firebase.database().ref('leaderboard').push(entry);
}
function loadLeaderboard() {
  firebase.database().ref('leaderboard')
    .orderByChild('score')
    .limitToLast(5)
    .once('value', snapshot => {
      const list = document.getElementById('leaderboard-list');
      list.innerHTML = '';
      const scores = [];
      snapshot.forEach(child => scores.push(child.val()));
      scores.reverse(); // highest first
      scores.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name}: ${entry.score}`;
        list.appendChild(li);
      });
    });
}
function gameOver() {
  clearInterval(timerInterval);
  gameOverEl.classList.remove('hidden');
  questionEl.textContent = '';
  timerEl.textContent = '';
  answerButtons.forEach(btn => btn.disabled = true);

  const name = prompt("Game Over! Enter your name for the leaderboard:");
  if (name) {
    submitScoreToLeaderboard(name, score);
  }
  loadLeaderboard();
}


// Modify gameOver to prompt name and submit score
function gameOver() {
  clearInterval(timerInterval);
  gameOverEl.classList.remove('hidden');
  questionEl.textContent = '';
  timerEl.textContent = '';
  answerButtons.forEach(btn => btn.disabled = true);

  const name = prompt("Game Over! Enter your name for the leaderboard:");
  if (name) {
    submitScoreToLeaderboard(name, score);
  }
  loadLeaderboard();
}

loadLeaderboard();
