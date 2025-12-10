# VizSorter - Sorting Algorithm Visualizer

A visual learning tool for sorting algorithms with animations and sound effects.

## Architecture

```text
Frontend (HTML/CSS/JavaScript - ES Modules)
         ↓
   Flask API (Python)
         ↓
   Java Backend (Sorting Logic)
```

## Key Features

- **6 Sorting Algorithms:** Bubble, Selection, Insertion, Merge, Quick, Heap
- **Real-time Visualization:** Watch sorting step-by-step with smooth animations
- **Audio Feedback:** Musical notes based on array values
- **Race Mode:** Run all 6 algorithms simultaneously and compare performance
- **Custom Input:** Enter your own arrays or generate random ones
- **Speed Control:** BPM-based tempo control (60-200 BPM)
- **Statistics:** Live comparison counter and swap counter
- **Responsive Design:** Mobile and desktop compatible

## Project Structure

```text
VizSorter/
├── python/
│   ├── sort.py                 # Flask app
│   ├── requirements.txt         # Python dependencies
│   ├── static/
│   │   ├── app.js             # Main controller (ES Modules)
│   │   ├── audioManager.js
│   │   └── modules/
│   │       ├── sortingAlgorithms.js
│   │       ├── visualizer.js
│   │       ├── raceManager.js
│   │       ├── constants.js
│   │       └── javaTest.js
│   └── templates/
│       └── index.html          # Main UI
├── java/
│   ├── pom.xml                # Maven configuration
│   └── src/main/java/vizsorter/
│       └── SortingAPI.java    # Java backend
├── vercel.json                 # Vercel config (deprecated)
└── README.md
```

## Deployment

**Status:** Ready for Railway deployment

### Deploy to Railway

IN DEVELOPMENT

## Local Development

### Prerequisites

- Node.js 16+ (for JavaScript modules)
- Python 3.8+
- Java 11+
- Maven 3.6+

### Setup

1. **Clone and Install Dependencies**

   ```bash
   cd python
   pip install -r requirements.txt
   cd ../java
   mvn clean compile
   ```

2. **Run Flask Server**

   ```bash
   cd python
   python sort.py
   ```

   Server runs on `http://localhost:5000`

3. **Run Java Backend** (if needed)

   ```bash
   cd java
   mvn clean compile
   mvn exec:java
   ```

4. **Access Application**
   - Open `http://localhost:5000` in browser

## Code Organization

### Frontend (JavaScript ES Modules)

- `app.js` - Main controller, event listeners, state management
- `modules/sortingAlgorithms.js` - Algorithm implementations
- `modules/visualizer.js` - DOM manipulation and rendering
- `modules/raceManager.js` - Race mode logic (6 algorithms simultaneously)
- `modules/constants.js` - Algorithm metadata and descriptions
- `modules/javaTest.js` - Java backend integration

### Backend (Python/Flask)

- `sort.py` - Flask application, routing, Java integration

### Java Backend

- `SortingAPI.java` - Sorting implementations

## 🚀 Features

### Current ✅

- ✅ 6 sorting algorithms with visualization
- ✅ Race mode (all algorithms simultaneously)
- ✅ Sound effects
- ✅ Custom array input
- ✅ Speed control (60-200 BPM)
- ✅ Live statistics (comparisons, swaps)
- ✅ Responsive mobile design
- ✅ Modular JavaScript architecture

### Planned 🔄

- Java backend integration for performance
- Advanced analytics and comparisons
- More sorting algorithms (Shell, Radix, Bucket)
- Theme toggle (dark/light mode)
- Export animations as video

## 🐛 Known Issues

- None currently reported

## Contributing

Contributions welcome! Please feel free to submit pull requests.

## License

MIT License - Feel free to use this project for learning purposes.
