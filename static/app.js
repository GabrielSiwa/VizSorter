let array = [];
let isSorting = false;
let shouldStop = false;
let startTime = 0;
let timerInterval = null;

// Sorting Algorithms Class
class SortingAlgorithm {
  constructor() {
    this.comparisons = 0;
    this.swaps = 0;
    this.steps = [];
    this.comparingIndices = [];
  }

  reset() {
    this.comparisons = 0;
    this.swaps = 0;
    this.steps = [];
    this.comparingIndices = [];
  }

  addStep(arr, comparingIndices = []) {
    this.steps.push([...arr]);
    this.comparingIndices.push([...comparingIndices]);
  }

  bubbleSort(arr) {
    this.reset();
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.comparisons++;
        this.addStep(arr, [j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.swaps++;
        }
      }
    }
    return this.steps;
  }

  selectionSort(arr) {
    this.reset();
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        this.comparisons++;
        this.addStep(arr, [i, j]);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      this.swaps++;
      this.addStep(arr, [i, minIdx]);
    }
    return this.steps;
  }

  insertionSort(arr) {
    this.reset();
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        this.comparisons++;
        this.addStep(arr, [j, i]);
        arr[j + 1] = arr[j];
        j--;
      }
      arr[j + 1] = key;
      this.swaps++;
      this.addStep(arr, [j + 1]);
    }
    return this.steps;
  }

  mergeSort(arr) {
    this.reset();
    this._mergeSortHelper(arr, 0, arr.length - 1);
    return this.steps;
  }

  _mergeSortHelper(arr, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      this._mergeSortHelper(arr, left, mid);
      this._mergeSortHelper(arr, mid + 1, right);
      this._merge(arr, left, mid, right);
    }
  }

  _merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0,
      j = 0,
      k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.comparisons++;
      if (leftArr[i] <= rightArr[j]) {
        arr[k++] = leftArr[i++];
      } else {
        arr[k++] = rightArr[j++];
      }
      this.swaps++;
      this.addStep(arr, [k - 1]);
    }

    while (i < leftArr.length) {
      arr[k++] = leftArr[i++];
      this.addStep(arr, [k - 1]);
    }

    while (j < rightArr.length) {
      arr[k++] = rightArr[j++];
      this.addStep(arr, [k - 1]);
    }
  }

  quickSort(arr) {
    this.reset();
    this._quickSortHelper(arr, 0, arr.length - 1);
    return this.steps;
  }

  _quickSortHelper(arr, low, high) {
    if (low < high) {
      const pi = this._partition(arr, low, high);
      this._quickSortHelper(arr, low, pi - 1);
      this._quickSortHelper(arr, pi + 1, high);
    }
  }

  _partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      this.comparisons++;
      this.addStep(arr, [j, high]);
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        this.swaps++;
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    this.swaps++;
    this.addStep(arr, [i + 1, high]);
    return i + 1;
  }

  heapSort(arr) {
    this.reset();
    const n = arr.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this._heapify(arr, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      this.swaps++;
      this.addStep(arr, [0, i]);
      this._heapify(arr, i, 0);
    }
    return this.steps;
  }

  _heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      this.comparisons++;
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      this.comparisons++;
      largest = right;
    }
    if (largest !== i) {
      this.addStep(arr, [i, largest]);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      this.swaps++;
      this._heapify(arr, n, largest);
    }
  }
}

const sorter = new SortingAlgorithm();

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
      bar.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.8)";
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
    audioManager.playComplete();
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
    const comparing = sorter.comparingIndices[i] || [];

    displayArray(step, comparing);

    if (soundEnabled) {
      const max = Math.max(...step);
      const avgValue = step.reduce((a, b) => a + b, 0) / step.length;
      audioManager.playComparison(avgValue, max);
    }

    document.getElementById("comparisons").textContent = sorter.comparisons;
    document.getElementById("swaps").textContent = sorter.swaps;
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
  document.getElementById("comparisons").textContent = "0";
  document.getElementById("swaps").textContent = "0";
  document.getElementById("timer").textContent = "0.00s";
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = (elapsed % 60).toFixed(2);

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
