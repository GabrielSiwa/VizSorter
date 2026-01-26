export function displayArray(
  arr,
  comparing = [],
  sorted = [],
  containerId = "barContainer"
) {
  const container =
    typeof containerId === "string"
      ? document.getElementById(containerId)
      : containerId;
  if (!container) return;
  container.innerHTML = "";
  const max = Math.max(...arr, 1);
  // Adjust height multiplier based on container height if possible, or keep fixed 350px for main
  // For race mode, we might want smaller bars.
  // Let's use a CSS variable or percentage if possible, but the current code uses fixed px.
  // We can check container height.
  let defaultHeight = 350;
  if (typeof containerId === "string" && containerId.startsWith("race-")) {
    defaultHeight = 150;
  }
  const containerHeight = container.clientHeight || defaultHeight;
  const maxHeight = Math.max(containerHeight - 20, 50); // buffer for text, ensure min height

  arr.forEach((num, idx) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");

    if (sorted.includes(idx)) {
      bar.classList.add("sorted");
    } else if (comparing.includes(idx)) {
      bar.classList.add("comparing");
      bar.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.8)";
    }

    bar.style.height = `${(num / max) * maxHeight}px`;
    // Only show text if bars are wide enough (optional optimization)
    if (arr.length < 20) {
      bar.innerHTML = `<span>${num}</span>`;
    }
    container.appendChild(bar);
  });
}

export function updateStepInfo(current, total, description) {
  const progress = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  const algoDescElement = document.getElementById("algoDescription");
  if (algoDescElement) {
    algoDescElement.textContent = `${description} [${Math.min(
      progress,
      100
    )}% complete]`;
  }
}

export function resetStats() {
  const comparisonsEl = document.getElementById("comparisons");
  const swapsEl = document.getElementById("swaps");
  const timerEl = document.getElementById("timer");

  if (comparisonsEl) comparisonsEl.textContent = "0";
  if (swapsEl) swapsEl.textContent = "0";
  if (timerEl) timerEl.textContent = "0.00s";
}

let timerInterval = null;
let startTime = 0;

export function startTimer(offset = 0) {
  startTime = Date.now() - offset;
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = (elapsed % 60).toFixed(2);

    const timerEl = document.getElementById("timer");
    if (timerEl) {
      if (minutes > 0) {
        timerEl.textContent = `${minutes}m ${seconds}s`;
      } else {
        timerEl.textContent = `${seconds}s`;
      }
    }
  }, 10);
}

export function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  return Date.now() - startTime;
}

export function disableControls(disabled) {
  const ids = [
    "algorithm",
    "userInput",
    "size",
    // "speed", // Keep speed enabled so user can adjust BPM during sort
    "startBtn",
    "createBtn",
    "generateBtn",
    "compareBtn",
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = disabled;
  });
}
