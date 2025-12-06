from flask import Flask, request, jsonify, send_file

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    return send_file('index.html')

# ---------------- SORTING ALGORITHMS ----------------
def bubble_sort(arr):
    steps = []
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
            steps.append(arr.copy())
    return steps


def selection_sort(arr):
    steps = []
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        steps.append(arr.copy())
    return steps


def insertion_sort(arr):
    steps = []
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
            steps.append(arr.copy())
        arr[j + 1] = key
        steps.append(arr.copy())
    return steps


def merge_sort_steps(arr):
    steps = []
    def merge_sort(a, start, end):
        if end - start > 1:
            mid = (start + end)//2
            merge_sort(a, start, mid)
            merge_sort(a, mid, end)
            L, R = a[start:mid], a[mid:end]
            i = j = 0
            k = start
            while i < len(L) and j < len(R):
                if L[i] < R[j]:
                    a[k] = L[i]
                    i += 1
                else:
                    a[k] = R[j]
                    j += 1
                k += 1
                steps.append(a.copy())
            while i < len(L):
                a[k] = L[i]
                i += 1
                k += 1
                steps.append(a.copy())
            while j < len(R):
                a[k] = R[j]
                j += 1
                k += 1
                steps.append(a.copy())
    merge_sort(arr, 0, len(arr))
    return steps


def quick_sort_steps(arr):
    steps = []
    def quick_sort(a, low, high):
        if low < high:
            p = partition(a, low, high)
            quick_sort(a, low, p - 1)
            quick_sort(a, p + 1, high)
    def partition(a, low, high):
        pivot = a[high]
        i = low - 1
        for j in range(low, high):
            if a[j] <= pivot:
                i += 1
                a[i], a[j] = a[j], a[i]
                steps.append(a.copy())
        a[i + 1], a[high] = a[high], a[i + 1]
        steps.append(a.copy())
        return i + 1
    quick_sort(arr, 0, len(arr) - 1)
    return steps


def heap_sort_steps(arr):
    steps = []
    def heapify(n, i):
        largest = i
        l = 2 * i + 1
        r = 2 * i + 2
        if l < n and arr[l] > arr[largest]:
            largest = l
        if r < n and arr[r] > arr[largest]:
            largest = r
        if largest != i:
            arr[i], arr[largest] = arr[largest], arr[i]
            steps.append(arr.copy())
            heapify(n, largest)
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(n, i)
    for i in range(n - 1, 0, -1):
        arr[i], arr[0] = arr[0], arr[i]
        steps.append(arr.copy())
        heapify(i, 0)
    return steps

@app.route('/sort', methods=['POST'])
def sort_data():
    data = request.json
    arr = data.get("array", [])
    algo = data.get("algorithm", "bubble")

    algorithms = {
        "bubble": bubble_sort,
        "selection": selection_sort,
        "insertion": insertion_sort,
        "merge": merge_sort_steps,
        "quick": quick_sort_steps,
        "heap": heap_sort_steps
    }

    if algo not in algorithms:
        return jsonify({"error": "Invalid algorithm"}), 400

    steps = algorithms[algo](arr.copy())
    return jsonify({"steps": steps})


if __name__ == '__main__':
    app.run(debug=True)