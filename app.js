const generateBtn = document.getElementById("generateBtn");
const clearBtn = document.getElementById("clearBtn");
const resultsTable = document.getElementById("resultsTable");
const ballDisplay = document.getElementById("ballDisplay");
const frequencyDiv = document.getElementById("frequency");

let draws = JSON.parse(localStorage.getItem("draws")) || [];
let frequency = JSON.parse(localStorage.getItem("frequency")) || {};

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWhiteBalls() {
  const nums = [];
  while (nums.length < 5) {
    const n = getRandom(1, 69);
    if (!nums.includes(n)) nums.push(n);
  }
  return nums.sort((a, b) => a - b);
}

function generateRedBall() {
  return getRandom(1, 26);
}

function updateFrequency(numbers) {
  numbers.forEach(n => {
    frequency[n] = (frequency[n] || 0) + 1;
  });
  localStorage.setItem("frequency", JSON.stringify(frequency));
}

function renderFrequency() {
  frequencyDiv.innerHTML = "";
  Object.keys(frequency)
    .sort((a, b) => a - b)
    .forEach(num => {
      const div = document.createElement("div");
      div.className = "freq-box";
      div.textContent = `${num}: ${frequency[num]}`;
      frequencyDiv.appendChild(div);
    });
}

function renderTable() {
  resultsTable.innerHTML = "";

  draws.forEach((draw, index) => {
    const row = document.createElement("tr");

    // Create white ball elements
    const whiteBallsHTML = draw.white
      .map(num => `<div class="ball">${num}</div>`)
      .join("");

    // Create red ball element
    const redBallHTML = `<div class="ball red">${draw.red}</div>`;

    row.innerHTML = `
      <td>${index + 1}</td>
      <td>
        <div class="table-balls">
          ${whiteBallsHTML}
        </div>
      </td>
      <td>
        <div class="table-balls">
          ${redBallHTML}
        </div>
      </td>
    `;

    resultsTable.appendChild(row);
  });
}


function renderBalls(whiteBalls, redBall) {
  ballDisplay.innerHTML = "";
  whiteBalls.forEach(n => {
    const ball = document.createElement("div");
    ball.className = "ball";
    ball.textContent = n;
    ballDisplay.appendChild(ball);
  });

  const red = document.createElement("div");
  red.className = "ball red";
  red.textContent = redBall;
  ballDisplay.appendChild(red);
}

generateBtn.addEventListener("click", () => {
  const whiteBalls = generateWhiteBalls();
  const redBall = generateRedBall();

  draws.push({ white: whiteBalls, red: redBall });
  localStorage.setItem("draws", JSON.stringify(draws));

  updateFrequency([...whiteBalls, redBall]);

  renderBalls(whiteBalls, redBall);
  renderTable();
  renderFrequency();
});

clearBtn.addEventListener("click", () => {
  if (confirm("Clear all saved data?")) {
    localStorage.clear();
    draws = [];
    frequency = {};
    resultsTable.innerHTML = "";
    ballDisplay.innerHTML = "";
    frequencyDiv.innerHTML = "";
  }
});

/* Load saved data on page refresh */
renderTable();
renderFrequency();
