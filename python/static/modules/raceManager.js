import { SortingAlgorithm } from "./sortingAlgorithms.js";
import { displayArray } from "./visualizer.js";

let raceInterval;
let raceStartTime;

export function startRace(originalArray, audioManager, onRaceFinish) {
  const raceGrid = document.getElementById("race-grid");
  const raceStatus = document.getElementById("race-status");
  const raceTimerDisplay = document.getElementById("race-timer");

  raceGrid.innerHTML = "";
  raceStatus.textContent = "Race in progress...";
  raceStatus.className = "status-text running";

  if (raceInterval) clearInterval(raceInterval);
  raceStartTime = Date.now();
  raceTimerDisplay.textContent = "00:00.000";

  raceInterval = setInterval(() => {
    const elapsed = Date.now() - raceStartTime;
    raceTimerDisplay.textContent = formatTime(elapsed);
  }, 10);

  const algorithms = [
    { key: "bubbleSort", name: "Bubble Sort" },
    { key: "selectionSort", name: "Selection Sort" },
    { key: "insertionSort", name: "Insertion Sort" },
    { key: "mergeSort", name: "Merge Sort" },
    { key: "quickSort", name: "Quick Sort" },
    { key: "heapSort", name: "Heap Sort" },
  ];

  const racePromises = algorithms.map((algo) => {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      container.className = "race-col";
      container.innerHTML = `<h3>${algo.name}</h3><div class="race-visualizer" id="race-${algo.key}"></div><div class="race-time" id="time-${algo.key}">Running...</div>`;
      raceGrid.appendChild(container);

      const visualizerContainer = container.querySelector(`#race-${algo.key}`);
      const timeDisplay = container.querySelector(`#time-${algo.key}`);

      const arrayCopy = [...originalArray];

      const sorter = new SortingAlgorithm();
      const steps = sorter[algo.key](arrayCopy);

      const startTime = Date.now();

      animateRace(visualizerContainer, steps, audioManager, () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        timeDisplay.textContent = formatTime(duration);
        resolve({
          name: algo.name,
          duration: duration,
          container: container,
          timeDisplay: timeDisplay,
        });
      });
    });
  });

  Promise.all(racePromises).then((results) => {
    clearInterval(raceInterval);
    raceStatus.textContent = "Race Finished!";
    raceStatus.className = "status-text finished";

    results.sort((a, b) => a.duration - b.duration);

    results.forEach((result, index) => {
      const medal = getMedal(index);
      if (medal) {
        const medalSpan = document.createElement("span");
        medalSpan.className = "medal";
        medalSpan.textContent = medal;
        result.timeDisplay.appendChild(medalSpan);

        if (index === 0) {
          result.container.style.borderColor = "#ffd700";
          result.container.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.3)";
        }
      }
    });

    if (onRaceFinish) onRaceFinish();
  });
}

function animateRace(container, steps, audioManager, callback) {
  if (steps.length === 0) {
    callback();
    return;
  }

  const step = steps.shift();
  displayArray(step, [], [], container);

  if (audioManager && Math.random() < 0.1) {
    const max = Math.max(...step);
    const avgValue = step.reduce((a, b) => a + b, 0) / step.length;
    audioManager.playComparison(avgValue, max);
  }

  setTimeout(() => {
    animateRace(container, steps, audioManager, callback);
  }, 20);
}

function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
}

function getMedal(rank) {
  switch (rank) {
    case 0:
      return "🥇";
    case 1:
      return "🥈";
    case 2:
      return "🥉";
    default:
      return "";
  }
}
