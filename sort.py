from flask import Flask, request, jsonify, send_file

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_file('index.html')

# Sorting Algorithms
class SortingAlgorithm:
    def __init__(self):
        self.comparisons = 0
        self.swaps = 0
        self.steps = []

    def reset(self):
        self.comparisons = 0
        self.swaps = 0
        self.steps = []

    def add_step(self, arr):
        self.steps.append(arr.copy())

    def bubble_sort(self, arr):
        self.reset()
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                self.comparisons += 1
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
                    self.swaps += 1
                self.add_step(arr)
        return self.steps

    def selection_sort(self, arr):
        self.reset()
        n = len(arr)
        for i in range(n):
            min_idx = i
            for j in range(i + 1, n):
                self.comparisons += 1
                if arr[j] < arr[min_idx]:
                    min_idx = j
                self.add_step(arr)
            arr[i], arr[min_idx] = arr[min_idx], arr[i]
            self.swaps += 1
            self.add_step(arr)
        return self.steps

    def insertion_sort(self, arr):
        self.reset()
        for i in range(1, len(arr)):
            key = arr[i]
            j = i - 1
            while j >= 0 and arr[j] > key:
                self.comparisons += 1
                arr[j + 1] = arr[j]
                j -= 1
                self.add_step(arr)
            arr[j + 1] = key
            self.swaps += 1
            self.add_step(arr)
        return self.steps

    def merge_sort(self, arr):
        self.reset()
        self._merge_sort_helper(arr, 0, len(arr) - 1)
        return self.steps

    def _merge_sort_helper(self, arr, left, right):
        if left < right:
            mid = (left + right) // 2
            self._merge_sort_helper(arr, left, mid)
            self._merge_sort_helper(arr, mid + 1, right)
            self._merge(arr, left, mid, right)

    def _merge(self, arr, left, mid, right):
        left_arr = arr[left:mid + 1]
        right_arr = arr[mid + 1:right + 1]
        i = j = 0
        k = left
        while i < len(left_arr) and j < len(right_arr):
            self.comparisons += 1
            if left_arr[i] <= right_arr[j]:
                arr[k] = left_arr[i]
                i += 1
            else:
                arr[k] = right_arr[j]
                j += 1
            self.swaps += 1
            self.add_step(arr)
            k += 1
        while i < len(left_arr):
            arr[k] = left_arr[i]
            i += 1
            k += 1
            self.add_step(arr)
        while j < len(right_arr):
            arr[k] = right_arr[j]
            j += 1
            k += 1
            self.add_step(arr)

    def quick_sort(self, arr):
        self.reset()
        self._quick_sort_helper(arr, 0, len(arr) - 1)
        return self.steps

    def _quick_sort_helper(self, arr, low, high):
        if low < high:
            pi = self._partition(arr, low, high)
            self._quick_sort_helper(arr, low, pi - 1)
            self._quick_sort_helper(arr, pi + 1, high)

    def _partition(self, arr, low, high):
        pivot = arr[high]
        i = low - 1
        for j in range(low, high):
            self.comparisons += 1
            if arr[j] < pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
                self.swaps += 1
                self.add_step(arr)
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        self.swaps += 1
        self.add_step(arr)
        return i + 1

    def heap_sort(self, arr):
        self.reset()
        n = len(arr)
        for i in range(n // 2 - 1, -1, -1):
            self._heapify(arr, n, i)
        for i in range(n - 1, 0, -1):
            arr[0], arr[i] = arr[i], arr[0]
            self.swaps += 1
            self.add_step(arr)
            self._heapify(arr, i, 0)
        return self.steps

    def _heapify(self, arr, n, i):
        largest = i
        left = 2 * i + 1
        right = 2 * i + 2
        if left < n and arr[left] > arr[largest]:
            self.comparisons += 1
            largest = left
        if right < n and arr[right] > arr[largest]:
            self.comparisons += 1
            largest = right
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            self.swaps += 1
            self.add_step(arr)
            self._heapify(arr, n, largest)

sorter = SortingAlgorithm()

@app.route('/api/sort', methods=['POST'])
def sort_data():
    data = request.json
    array = data.get('array', [])
    algorithm = data.get('algorithm', 'bubble')

    if not array:
        return jsonify({'error': 'No array provided'}), 400

    try:
        if algorithm == 'bubble':
            steps = sorter.bubble_sort(array)
        elif algorithm == 'selection':
            steps = sorter.selection_sort(array)
        elif algorithm == 'insertion':
            steps = sorter.insertion_sort(array)
        elif algorithm == 'merge':
            steps = sorter.merge_sort(array)
        elif algorithm == 'quick':
            steps = sorter.quick_sort(array)
        elif algorithm == 'heap':
            steps = sorter.heap_sort(array)
        else:
            return jsonify({'error': 'Unknown algorithm'}), 400

        return jsonify({
            'steps': steps,
            'comparisons': sorter.comparisons,
            'swaps': sorter.swaps
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)