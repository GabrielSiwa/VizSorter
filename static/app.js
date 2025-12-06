let array = [];
let isSorting = false;
let shouldStop = false;
let startTime = 0;
let timerInterval = null;
let comparisons = 0;
let swaps = 0;

function generateArray() {
  const userInput = document.getElementById("userInput").value.trim();
  if (userInput) {
    array = userInput
      .split(",")
      .map(Number)
      .filter((n) => !isNaN(n));
    if (array.length === 0) {
      alert("Please enter valid numbers!");
      return;
    }
  } else {
    const size = document.getElementById("size").value;
    array = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
  }
  displayArray(array);
  resetStats();
}

function displayArray(arr, comparing = [], sorted = []) {
  const container = document.getElementById("barContainer");
  container.innerHTML = "";
  const max = Math.max(...arr);

  arr.forEach((num, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    if (sorted.includes(idx)) {
      bar.classList.add("sorted");
    } else if (comparing.includes(idx)) {
      bar.classList.add("comparing");
    }

    bar.style.height = `${(num / max) * 350}px`;
    bar.innerHTML = `<span>${num}</span>`;
    container.appendChild(bar);
  });
}

async function startSorting() {
  if (array.length === 0) {
    alert("Please generate or enter an array first!");
    return;
  }

  if (isSorting) return;
  isSorting = true;
  shouldStop = false;

  const algorithm = document.getElementById("algorithm").value;
  const speed = parseInt(document.getElementById("speed").value);
  const delay = 510 - speed;

  disableControls(true);
  document.getElementById("stopBtn").disabled = false;
  startTimer();
  resetStats();

  try {
    const response = await fetch("/api/sort", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        array: [...array],
        algorithm: algorithm,
      }),
    });

    if (!response.ok) throw new Error("Sort failed");
    const data = await response.json();

    comparisons = data.comparisons;
    swaps = data.swaps;
    const steps = data.steps;

    await visualizeSteps(steps, delay);

    if (!shouldStop) {
      array = steps[steps.length - 1];
      displayArray(
        array,
        [],
        array.map((_, i) => i)
      );
      audioManager.playComplete();
    }
  } catch (error) {
    alert("Error: " + error.message);
  }

  isSorting = false;
  shouldStop = false;
  disableControls(false);
  document.getElementById("stopBtn").disabled = true;
  stopTimer();
}

async function visualizeSteps(steps, delay) {
  const soundEnabled = document.getElementById("soundToggle").checked;

  for (let i = 0; i < steps.length; i++) {
    if (shouldStop) break;

    const step = steps[i];
    displayArray(step);

    if (soundEnabled) {
      const max = Math.max(...step);
      const avgValue = step.reduce((a, b) => a + b, 0) / step.length;
      audioManager.playComparison(avgValue, max);
    }

    updateStats();
    await new Promise((r) => setTimeout(r, delay));
  }
}

function stopSorting() {
  shouldStop = true;
  isSorting = false;
}

async function createAndStart() {
  generateArray();
  await new Promise((r) => setTimeout(r, 300));
  startSorting();
}

function resetVisualizer() {
  if (isSorting) return;
  shouldStop = true;
  array = [];
  document.getElementById("userInput").value = "";
  displayArray([]);
  resetStats();
  stopTimer();
  document.getElementById("stopBtn").disabled = true;
}

function disableControls(disabled) {
  document.getElementById("algorithm").disabled = disabled;
  document.getElementById("userInput").disabled = disabled;
  document.getElementById("size").disabled = disabled;
  document.getElementById("speed").disabled = disabled;
  document.getElementById("startBtn").disabled = disabled;
  document.getElementById("createBtn").disabled = disabled;
}

function resetStats() {
  comparisons = 0;
  swaps = 0;
  document.getElementById("comparisons").textContent = "0";
  document.getElementById("swaps").textContent = "0";
  document.getElementById("timer").textContent = "0.00s";
}

function updateStats() {
  document.getElementById("comparisons").textContent = comparisons;
  document.getElementById("swaps").textContent = swaps;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = (elapsed % 60).toFixed(2);

    // Show format: MM:SS.ms or just SS.ms if under 1 minute
    if (minutes > 0) {
      document.getElementById("timer").textContent = `${minutes}m ${seconds}s`;
    } else {
      document.getElementById("timer").textContent = `${seconds}s`;
    }
  }, 10);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

// Speed label indicator
document.getElementById("speed").addEventListener("input", (e) => {
  const speed = parseInt(e.target.value);
  let label = "Normal";

  if (speed < 50) label = "🐢 Slow";
  else if (speed < 150) label = "🚶 Normal";
  else if (speed < 300) label = "🏃 Fast";
  else label = "⚡ Very Fast";

  document.getElementById("speedLabel").textContent = label;
});

document.getElementById("soundToggle").addEventListener("change", (e) => {
  audioManager.setEnabled(e.target.checked);
});

window.addEventListener("load", generateArray);
