# VizSorter - Sorting Algorithm Visualizer

A visual learning tool for sorting algorithms with animations and sound.

## Current Version (Vercel)

- **Frontend:** HTML/CSS/JavaScript
- **Status:** ✅ Live on Vercel
- **Features:** 6 sorting algorithms, real-time visualization, sound effects

## Next Version (Railway - In Progress)

Frontend (JavaScript)
↓
Flask API (Python middleware)
↓
Java Backend (Sorting logic)

## Algorithms Included

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort

## Deployment

- **Current:** Vercel (<https://viz-sorter.vercel.app>)
- **Future:** Railway (Java + Flask + Frontend)

## 🐛 Known Bugs

### Critical

- **Algorithm Switch Bug**: When changing sorting algorithm after starting, visualization freezes but sound continues playing
  - **Steps to reproduce**:
    1. Click "Start" with any algorithm
    2. Change dropdown to different algorithm while sorting
    3. Bars stop moving but audio persists
  - **Expected**: Either block dropdown during sort OR restart with new algorithm

### Minor

- Skeleton loader persists on slow connections
- Mobile: Speed slider labels overlap on small screens

---

## 💡 Features in Mind

### High Priority

- **Side-by-Side Comparison Mode**
  - Run multiple algorithms simultaneously on same dataset
  - Visual comparison of performance (comparisons, swaps, time)
  - Layout: Split screen with 2-4 algorithm visualizations

### Medium Priority

- **Algorithm Complexity Display**

  - Show Big O notation for each algorithm
  - Real-time comparison: theoretical vs actual performance
  - Color-coded efficiency indicator

- **Custom Speed Presets**

  - Save favorite speed settings
  - Quick toggle between "Learn Mode" (slow) and "Demo Mode" (fast)

- **Export Visualization**
  - Download sorting animation as GIF/MP4
  - Share button for social media

### Low Priority

- Dark/Light theme toggle
- More algorithms (Shell Sort, Radix Sort, Bucket Sort)
- Step-by-step mode with "Next" button
- Code snippet viewer (show actual algorithm code)

---

## 🚀 Roadmap

**v1.1** (Current - Vercel)

- ✅ 6 sorting algorithms
- ✅ Sound effects
- ✅ Custom input arrays
- 🔧 Fix algorithm switch bug

**v2.0** (Railway - Java + Flask)

- Server-side sorting with Java backend
- Side-by-side comparison mode
- Performance analytics dashboard

**v3.0** (Future)

- User accounts & saved visualizations
- Community-shared datasets
- Educational mode with explanations
