package vizsorter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class SortingAPI {

    public static void main(String[] args) {
        SpringApplication.run(SortingAPI.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5000", "http://127.0.0.1:5000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE");
            }
        };
    }

    @PostMapping("/sort")
    public SortResponse sort(@RequestBody SortRequest request) {
        int[] arr = request.getArray();
        double durationMs = measureMillis(() -> bubbleSort(arr));
        return new SortResponse(arr, durationMs, arr.length, "BUBBLE_SORT");
    }

    @PostMapping("/compare")
    public ComparisonResponse compare(@RequestBody SortRequest request) {
        int[] arr = request.getArray();
        Map<String, AlgorithmMetrics> results = new HashMap<>();

        int[] bubbleArr = arr.clone();
        double bubbleMs = measureMillis(() -> bubbleSort(bubbleArr));
        results.put("BUBBLE SORT", new AlgorithmMetrics(bubbleMs, countComparisons(bubbleArr)));

        int[] selectionArr = arr.clone();
        double selectionMs = measureMillis(() -> selectionSort(selectionArr));
        results.put("SELECTION SORT", new AlgorithmMetrics(selectionMs, countComparisons(selectionArr)));

        int[] insertionArr = arr.clone();
        double insertionMs = measureMillis(() -> insertionSort(insertionArr));
        results.put("INSERTION SORT", new AlgorithmMetrics(insertionMs, countComparisons(insertionArr)));

        int[] mergeArr = arr.clone();
        double mergeMs = measureMillis(() -> mergeSort(mergeArr, 0, mergeArr.length - 1));
        results.put("MERGE SORT", new AlgorithmMetrics(mergeMs, countComparisons(mergeArr)));

        int[] quickArr = arr.clone();
        double quickMs = measureMillis(() -> quickSort(quickArr, 0, quickArr.length - 1));
        results.put("QUICK SORT", new AlgorithmMetrics(quickMs, countComparisons(quickArr)));

        int[] heapArr = arr.clone();
        double heapMs = measureMillis(() -> heapSort(heapArr));
        results.put("HEAP SORT", new AlgorithmMetrics(heapMs, countComparisons(heapArr)));

        return new ComparisonResponse(results);
    }

    @PostMapping("/stress-test")
    public ComparisonResponse stressTest(@RequestBody StressTestRequest request) {
        int size = request.getSize();
        Map<String, AlgorithmMetrics> results = new HashMap<>();
        Random rand = new Random();
        int[] baseArr = rand.ints(size, 0, 1000000).toArray();

        // Only run O(n^2) algorithms if size is manageable (< 50,000)
        if (size <= 50000) {
            int[] bubbleArr = baseArr.clone();
            double bubbleMs = measureMillis(() -> bubbleSort(bubbleArr));
            results.put("BUBBLE SORT", new AlgorithmMetrics(bubbleMs, 0)); // Comparisons not counted for speed

            int[] selectionArr = baseArr.clone();
            double selectionMs = measureMillis(() -> selectionSort(selectionArr));
            results.put("SELECTION SORT", new AlgorithmMetrics(selectionMs, 0));

            int[] insertionArr = baseArr.clone();
            double insertionMs = measureMillis(() -> insertionSort(insertionArr));
            results.put("INSERTION SORT", new AlgorithmMetrics(insertionMs, 0));
        }

        // O(n log n) Algorithms
        int[] mergeArr = baseArr.clone();
        double mergeMs = measureMillis(() -> mergeSort(mergeArr, 0, mergeArr.length - 1));
        results.put("MERGE SORT", new AlgorithmMetrics(mergeMs, 0));

        int[] quickArr = baseArr.clone();
        double quickMs = measureMillis(() -> quickSort(quickArr, 0, quickArr.length - 1));
        results.put("QUICK SORT", new AlgorithmMetrics(quickMs, 0));

        int[] heapArr = baseArr.clone();
        double heapMs = measureMillis(() -> heapSort(heapArr));
        results.put("HEAP SORT", new AlgorithmMetrics(heapMs, 0));

        // Java Built-in (Dual-Pivot Quicksort)
        int[] javaArr = baseArr.clone();
        double javaMs = measureMillis(() -> Arrays.sort(javaArr));
        results.put("JAVA ARRAYS SORT", new AlgorithmMetrics(javaMs, 0));

        // Java Parallel Sort
        int[] parallelArr = baseArr.clone();
        double parallelMs = measureMillis(() -> Arrays.parallelSort(parallelArr));
        results.put("JAVA PARALLEL SORT", new AlgorithmMetrics(parallelMs, 0));

        return new ComparisonResponse(results);
    }

    @GetMapping("/analytics")
    public AnalyticsResponse analytics() {
        return new AnalyticsResponse(
            Arrays.asList("BUBBLE SORT", "SELECTION SORT", "INSERTION SORT", "MERGE SORT", "QUICK SORT", "HEAP SORT"),
            Arrays.asList(125.0, 110.0, 95.0, 45.0, 38.0, 50.0)
        );
    }

    static class StressTestRequest {
        private int size;
        public int getSize() { return size; }
        public void setSize(int size) { this.size = size; }
    }

private void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    private void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            int temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
        }
    }

    private void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    private void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    private int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }

    private void mergeSort(int[] arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    private void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) temp[k++] = arr[i++];
            else temp[k++] = arr[j++];
        }
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        System.arraycopy(temp, 0, arr, left, temp.length);
    }

    private void heapSort(int[] arr) {
        int n = arr.length;
        
        // Build max heap
        for (int i = n / 2 - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
        
        // Extract elements from heap one by one
        for (int i = n - 1; i > 0; i--) {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;
            heapify(arr, i, 0);
        }
    }

    private void heapify(int[] arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        
        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }
        if (largest != i) {
            int temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;
            heapify(arr, n, largest);
        }
    }

    private double measureMillis(Runnable runnable) {
        long start = System.nanoTime();
        runnable.run();
        return (System.nanoTime() - start) / 1_000_000.0; // ms with decimals
    }

    private double measureMicroseconds(Runnable runnable) {
        long start = System.nanoTime();
        runnable.run();
        return (System.nanoTime() - start) / 1_000.0; // Return microseconds (μs)
    }

    private long countComparisons(int[] arr) {
        return (long) arr.length * (arr.length - 1) / 2;
    }

    static class SortRequest {
        private int[] array;
        public int[] getArray() { return array; }
        public void setArray(int[] array) { this.array = array; }
    }

    static class SortResponse {
        private int[] sorted;
        private double duration;
        private int size;
        private String algorithm;

        public SortResponse(int[] sorted, double duration, int size, String algorithm) {
            this.sorted = sorted;
            this.duration = duration;
            this.size = size;
            this.algorithm = algorithm;
        }

        public int[] getSorted() { return sorted; }
        public double getDuration() { return duration; }
        public int getSize() { return size; }
        public String getAlgorithm() { return algorithm; }
    }

    static class AlgorithmMetrics {
        private double duration;
        private long comparisons;

        public AlgorithmMetrics(double duration, long comparisons) {
            this.duration = duration;
            this.comparisons = comparisons;
        }

        public double getDuration() { return duration; }
        public long getComparisons() { return comparisons; }
    }

    static class ComparisonResponse {
        private Map<String, AlgorithmMetrics> results;

        public ComparisonResponse(Map<String, AlgorithmMetrics> results) {
            this.results = results;
        }

        public Map<String, AlgorithmMetrics> getResults() { return results; }
    }

    static class AnalyticsResponse {
        private List<String> algorithms;
        private List<Double> times;

        public AnalyticsResponse(List<String> algorithms, List<Double> times) {
            this.algorithms = algorithms;
            this.times = times;
        }

        public List<String> getAlgorithms() { return algorithms; }
        public List<Double> getTimes() { return times; }
    }
}