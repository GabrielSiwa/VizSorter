export class SortingAlgorithm {
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
