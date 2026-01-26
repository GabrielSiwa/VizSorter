import { SortingAlgorithm } from "./modules/sortingAlgorithms.js";
import {
  displayArray,
  updateStepInfo,
  resetStats,
  startTimer,
  stopTimer,
  disableControls,
} from "./modules/visualizer.js";
// import { runHeavyLiftingTest } from "./modules/javaTest.js";

let array = [];
let originalArray = [];
let isSorting = false;
let shouldStop = false;
let isPaused = false;
let pausedTime = 0;
let elapsedPausedTime = 0;

const sorter = new SortingAlgorithm();

const algorithmDescriptions = {
  bubble: {
    title: "Bubble Sort",
    description:
      "Comparing adjacent elements and bubbling larger values to the end.",
    steps: "Swapping adjacent pairs if they're out of order.",
    complexity: "O(n²)",
  },
  selection: {
    title: "Selection Sort",
    description: "Finding the minimum element and placing it at the beginning.",
    steps: "Looking for the smallest unsorted element.",
    complexity: "O(n²)",
  },
  insertion: {
    title: "Insertion Sort",
    description:
      "Inserting each element into its correct position in the sorted portion.",
    steps: "Inserting element into the sorted section.",
    complexity: "O(n²)",
  },
  merge: {
    title: "Merge Sort",
    description:
      "Dividing the array in half, sorting recursively, then merging sorted halves.",
    steps: "Merging sorted subarrays together.",
    complexity: "O(n log n)",
  },
  quick: {
    title: "Quick Sort",
    description:
      "Partitioning around a pivot element, then recursively sorting partitions.",
    steps: "Partitioning elements around the pivot.",
    complexity: "O(n log n)",
  },
  heap: {
    title: "Heap Sort",
    description:
      "Building a max heap and repeatedly extracting the largest element.",
    steps: "Heapifying to maintain max heap property.",
    complexity: "O(n log n)",
  },
};

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
    const sizeEl = document.getElementById("size");
    const raw = parseInt(sizeEl.value, 10);
    const min = parseInt(sizeEl.min, 10) || 5;
    const max = parseInt(sizeEl.max, 10) || 100;
    const size = Number.isFinite(raw) ? Math.max(min, Math.min(max, raw)) : min;
    sizeEl.value = size;
    array = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 500) + 1
    );
  }
  originalArray = [...array];
  displayArray(array);
  resetStats();
}

async function startSorting() {
  // If race grid exists, reset to main view first
  const raceGrid = document.querySelector(".race-grid");
  if (raceGrid) {
    resetVisualizer();
    // Wait a tiny bit for DOM update if needed, though resetVisualizer is synchronous mostly
  }

  if (array.length === 0) {
    alert("Please generate or enter an array first!");
    return;
  }

  if (isSorting) return;

  // Check if array is already sorted. If so, reset to original unsorted state.
  const isSorted = array.every((val, i, arr) => !i || arr[i - 1] <= val);
  if (isSorted && originalArray.length === array.length) {
    array = [...originalArray];
    displayArray(array);
  }

  isSorting = true;
  shouldStop = false;
  isPaused = false;
  elapsedPausedTime = 0;

  const algorithm = document.getElementById("algorithm").value;
  // BPM Logic
  const bpm = parseInt(document.getElementById("speed").value);
  // Calculate delay in ms: 60000 ms / BPM
  const delay = 60000 / bpm;

  disableControls(true);
  document.getElementById("stopBtn").disabled = false;
  document.getElementById("pauseBtn").disabled = false;
  startTimer();
  resetStats();

  let steps = [];
  switch (algorithm) {
    case "bubble":
      steps = sorter.bubbleSort([...array]);
      break;
    case "selection":
      steps = sorter.selectionSort([...array]);
      break;
    case "insertion":
      steps = sorter.insertionSort([...array]);
      break;
    case "merge":
      steps = sorter.mergeSort([...array]);
      break;
    case "quick":
      steps = sorter.quickSort([...array]);
      break;
    case "heap":
      steps = sorter.heapSort([...array]);
      break;
  }

  await visualizeSteps(steps, delay);

  if (!shouldStop) {
    array = steps[steps.length - 1];
    displayArray(
      array,
      [],
      array.map((_, i) => i)
    );
    if (window.audioManager) window.audioManager.playComplete();
  }

  isSorting = false;
  shouldStop = false;
  isPaused = false;
  disableControls(false);
  document.getElementById("stopBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = true;
  stopTimer();
}

function sortInstantly() {
  const algorithm = document.getElementById("algorithm").value;

  disableControls(true);
  startTimer();
  resetStats();

  let steps = [];
  switch (algorithm) {
    case "bubble":
      steps = sorter.bubbleSort([...array]);
      break;
    case "selection":
      steps = sorter.selectionSort([...array]);
      break;
    case "insertion":
      steps = sorter.insertionSort([...array]);
      break;
    case "merge":
      steps = sorter.mergeSort([...array]);
      break;
    case "quick":
      steps = sorter.quickSort([...array]);
      break;
    case "heap":
      steps = sorter.heapSort([...array]);
      break;
  }

  array = steps[steps.length - 1];
  displayArray(
    array,
    [],
    array.map((_, i) => i)
  );

  document.getElementById("comparisons").textContent = sorter.comparisons;
  document.getElementById("swaps").textContent = sorter.swaps;
  if (window.audioManager) window.audioManager.playComplete();

  disableControls(false);
  stopTimer();
}

function pauseSorting() {
  if (!isSorting) return;

  isPaused = !isPaused;
  const pauseBtn = document.getElementById("pauseBtn");

  if (isPaused) {
    pauseBtn.textContent = "▶ Resume";
    pauseBtn.style.background = "#4CAF50";
    pausedTime = Date.now();
    elapsedPausedTime = stopTimer(); // Stop timer and get elapsed time so far
  } else {
    pauseBtn.textContent = "⏸ Pause";
    pauseBtn.style.background = "#FFA500";
    // Resume timer with offset
    startTimer(elapsedPausedTime);
  }
}

function stopSorting() {
  shouldStop = true;
  isSorting = false;
  isPaused = false;
  document.getElementById("pauseBtn").textContent = "⏸ Pause";
  document.getElementById("pauseBtn").style.background = "#FFA500";
  stopTimer();
  disableControls(false);
  document.getElementById("stopBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = true;
}

async function createAndStart() {
  generateArray();
  await new Promise((r) => setTimeout(r, 300));
  startSorting();
}

async function startRace() {
  const sizeInput = document.getElementById("size");
  const userInput = document.getElementById("userInput");
  const desiredSize = parseInt(sizeInput.value, 10);
  const isCustomInput = userInput && userInput.value.trim() !== "";

  // If array is empty OR (not using custom input AND size mismatch), regenerate
  if (array.length === 0 || (!isCustomInput && array.length !== desiredSize)) {
    generateArray();
  }
  if (isSorting) return;

  // Setup UI for Race
  const mainContainer = document.getElementById("barContainer");
  mainContainer.style.display = "none";

  // Remove existing race grid if any
  const existingGrid = document.querySelector(".race-grid");
  if (existingGrid) existingGrid.remove();
  const existingTimer = document.querySelector(".race-stats-container");
  if (existingTimer) existingTimer.remove();
  const existingNote = document.querySelector(".race-note");
  if (existingNote) existingNote.remove();

  // Add Timer
  const timerContainer = document.createElement("div");
  timerContainer.className = "race-stats-container";
  timerContainer.innerHTML = `<div id="raceTimer" class="race-timer">0.00s</div>`;
  mainContainer.parentNode.insertBefore(
    timerContainer,
    mainContainer.nextSibling
  );

  const raceGrid = document.createElement("div");
  raceGrid.className = "race-grid";
  timerContainer.parentNode.insertBefore(raceGrid, timerContainer.nextSibling);

  // Add Note
  const noteContainer = document.createElement("div");
  noteContainer.className = "race-note";
  noteContainer.innerHTML = `
    <strong>Note:</strong> This race visualizes how many operations each algorithm performs. Algorithms with time complexity around O(n log n), like merge sort and quicksort on average, use far fewer steps than O(n²) algorithms like bubble and insertion sort, especially as the input size grows.
  `;
  raceGrid.parentNode.insertBefore(noteContainer, raceGrid.nextSibling);

  const algorithms = [
    "bubble",
    "selection",
    "insertion",
    "merge",
    "quick",
    "heap",
  ];
  const raceData = [];

  // Prepare data and UI for each algo
  algorithms.forEach((algo) => {
    const cell = document.createElement("div");
    cell.className = "race-cell";
    cell.id = `cell-${algo}`;
    cell.innerHTML = `
      <div class="race-title" id="title-${algo}">${algorithmDescriptions[algo].title}</div>
      <div class="race-container" id="race-${algo}"></div>
      <div style="font-size: 12px; margin-top: 5px; color: #aaa;">
        Steps: <span id="steps-${algo}">0</span>
      </div>
      <div id="result-${algo}" class="race-time-result"></div>
    `;
    raceGrid.appendChild(cell);

    // Generate steps
    const tempSorter = new SortingAlgorithm();
    let steps = [];
    const arrCopy = [...(originalArray.length ? originalArray : array)];

    switch (algo) {
      case "bubble":
        steps = tempSorter.bubbleSort(arrCopy);
        break;
      case "selection":
        steps = tempSorter.selectionSort(arrCopy);
        break;
      case "insertion":
        steps = tempSorter.insertionSort(arrCopy);
        break;
      case "merge":
        steps = tempSorter.mergeSort(arrCopy);
        break;
      case "quick":
        steps = tempSorter.quickSort(arrCopy);
        break;
      case "heap":
        steps = tempSorter.heapSort(arrCopy);
        break;
    }

    raceData.push({
      id: algo,
      steps: steps,
      currentStep: 0,
      finished: false,
    });
  });

  isSorting = true;
  shouldStop = false;
  disableControls(true);
  document.getElementById("stopBtn").disabled = false;

  const startTime = Date.now();
  let rank = 1;

  // Race Loop
  while (!shouldStop) {
    let allFinished = true;
    const currentTime = (Date.now() - startTime) / 1000;
    const timerEl = document.getElementById("raceTimer");
    if (timerEl) timerEl.textContent = currentTime.toFixed(2) + "s";

    raceData.forEach((data) => {
      if (data.currentStep < data.steps.length) {
        allFinished = false;
        displayArray(data.steps[data.currentStep], [], [], `race-${data.id}`);
        document.getElementById(`steps-${data.id}`).textContent =
          data.currentStep;
        data.currentStep++;
      } else if (!data.finished) {
        data.finished = true;
        displayArray(
          data.steps[data.steps.length - 1],
          [],
          data.steps[data.steps.length - 1].map((_, i) => i),
          `race-${data.id}`
        );

        // Award Medal
        let medal = "";
        if (rank === 1) medal = "🥇";
        else if (rank === 2) medal = "🥈";
        else if (rank === 3) medal = "🥉";

        if (medal) {
          const titleEl = document.getElementById(`title-${data.id}`);
          if (titleEl)
            titleEl.innerHTML += ` <span class="medal">${medal}</span>`;
        }

        const resultEl = document.getElementById(`result-${data.id}`);
        if (resultEl)
          resultEl.textContent = `Finished: ${currentTime.toFixed(2)}s`;
        rank++;
      }
    });

    if (allFinished) break;
    await new Promise((r) => setTimeout(r, 20)); // Fast speed for race
  }

  isSorting = false;
  disableControls(false);
  document.getElementById("stopBtn").disabled = true;

  // Cleanup or leave grid? Let's leave it until reset.
}

function resetVisualizer() {
  if (isSorting) return;
  shouldStop = true;

  // Restore main view
  const mainContainer = document.getElementById("barContainer");
  mainContainer.style.display = "flex";
  const raceGrid = document.querySelector(".race-grid");
  if (raceGrid) raceGrid.remove();
  const raceTimer = document.querySelector(".race-stats-container");
  if (raceTimer) raceTimer.remove();
  const raceNote = document.querySelector(".race-note");
  if (raceNote) raceNote.remove();

  if (originalArray.length > 0) {
    array = [...originalArray];
  } else {
    array = [];
  }
  isPaused = false;
  // document.getElementById("userInput").value = "";
  displayArray(array);
  resetStats();
  stopTimer();
  document.getElementById("stopBtn").disabled = true;
  document.getElementById("pauseBtn").disabled = true;
}

function updateAlgorithmInfo() {
  const algorithm = document.getElementById("algorithm").value;
  const info = algorithmDescriptions[algorithm];

  document.getElementById("algoTitle").textContent = info.title;
  document.getElementById("algoDescription").textContent = info.description;
  const complexityEl = document.getElementById("complexity");
  if (complexityEl) complexityEl.textContent = info.complexity;
}

async function visualizeSteps(steps, delay) {
  const soundEnabled = document.getElementById("soundToggle").checked;
  const algorithm = document.getElementById("algorithm").value;
  const stepDescription = algorithmDescriptions[algorithm].steps;

  for (let i = 0; i < steps.length; i++) {
    if (shouldStop) break;

    // Handle pause
    while (isPaused && !shouldStop) {
      await new Promise((r) => setTimeout(r, 100));
    }

    const step = steps[i];
    const comparing = sorter.comparingIndices[i] || [];

    displayArray(step, comparing);
    updateStepInfo(i, steps.length, stepDescription);

    if (soundEnabled && window.audioManager) {
      const max = Math.max(...step);
      const avgValue = step.reduce((a, b) => a + b, 0) / step.length;
      window.audioManager.playComparison(avgValue, max);
    }

    document.getElementById("comparisons").textContent = sorter.comparisons;
    document.getElementById("swaps").textContent = sorter.swaps;

    let bpm = parseInt(document.getElementById("speed").value);

    if (isNaN(bpm) || bpm < 60) bpm = 60;
    if (bpm > 200) bpm = 200;

    const currentDelay = 60000 / bpm;

    await new Promise((r) => setTimeout(r, currentDelay));
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Attach button listeners
  const startBtn = document.getElementById("startBtn");
  if (startBtn) startBtn.addEventListener("click", startSorting);

  const createBtn = document.getElementById("createBtn");
  if (createBtn) createBtn.addEventListener("click", createAndStart);

  const stopBtn = document.getElementById("stopBtn");
  if (stopBtn) stopBtn.addEventListener("click", stopSorting);

  const pauseBtn = document.getElementById("pauseBtn");
  if (pauseBtn) pauseBtn.addEventListener("click", pauseSorting);

  // We need to find the generate, reset, and compare buttons.
  // Since they might not have IDs in the original HTML, we should add IDs in the HTML update step.
  // But for now, let's try to find them by their text or onclick attribute if possible, or just assume I'll add IDs.
  // I will add IDs in the HTML update step.
  const generateBtn = document.getElementById("generateBtn");
  if (generateBtn) generateBtn.addEventListener("click", generateArray);

  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.addEventListener("click", resetVisualizer);

  const raceBtn = document.getElementById("raceBtn");
  if (raceBtn) raceBtn.addEventListener("click", startRace);

  /*
  const compareBtn = document.getElementById("compareBtn");
  if (compareBtn) compareBtn.addEventListener("click", runHeavyLiftingTest);
  */

  const algoSelect = document.getElementById("algorithm");
  if (algoSelect) algoSelect.addEventListener("change", updateAlgorithmInfo);

  // Speed Input Listener
  const speedInput = document.getElementById("speed");

  if (speedInput) {
    // Set initial BPM range
    speedInput.min = "60";
    speedInput.max = "200"; // Max song BPM
    speedInput.value = "120"; // Default BPM

    speedInput.addEventListener("change", (e) => {
      let bpm = parseInt(e.target.value);
      if (isNaN(bpm)) bpm = 120;

      // Clamp values
      if (bpm < 60) bpm = 60;
      if (bpm > 200) bpm = 200;

      e.target.value = bpm;
    });
  }
  const soundToggle = document.getElementById("soundToggle");
  if (soundToggle) {
    soundToggle.addEventListener("change", (e) => {
      if (window.audioManager) window.audioManager.setEnabled(e.target.checked);
    });
  }

  // Size Input Validation
  const sizeEl = document.getElementById("size");
  if (sizeEl) {
    const min = parseInt(sizeEl.min, 10) || 5;
    const max = parseInt(sizeEl.max, 10) || 100;

    function validate() {
      const raw = sizeEl.value.trim();
      if (raw === "") {
        sizeEl.classList.remove("invalid");
        return;
      }
      const n = Number(raw);
      if (!Number.isFinite(n) || n < min || n > max) {
        sizeEl.classList.add("invalid");
      } else {
        sizeEl.classList.remove("invalid");
      }
    }

    sizeEl.addEventListener("input", validate);
    sizeEl.addEventListener("blur", function () {
      let n = parseInt(sizeEl.value, 10);
      if (!Number.isFinite(n)) n = min;
      n = Math.max(min, Math.min(max, n));
      sizeEl.value = n;
      validate();
    });
    validate();
  }

  // Initialization
  const skeleton = document.getElementById("skeleton");
  const content = document.getElementById("content");
  if (skeleton && content) {
    skeleton.style.display = "none";
    content.style.display = "block";
  }

  generateArray();
  updateAlgorithmInfo();
});
