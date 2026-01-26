export const algorithmDescriptions = {
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
