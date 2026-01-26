export async function runHeavyLiftingTest() {
  const sizeInput = prompt(
    "Enter array size for Java Stress Test (e.g., 100000 for 100k, 1000000 for 1M):",
    "100000"
  );

  if (!sizeInput) return;

  let size = parseInt(sizeInput, 10);
  if (isNaN(size) || size <= 0) {
    alert("Invalid size!");
    return;
  }

  // Enforce max 5 million
  if (size > 5000000) {
    size = 5000000;
    alert("Max size limited to 5,000,000 to prevent server overload.");
  }

  // Show loading state
  const statsDiv = document.querySelector(".stats");
  let resultsDiv = document.getElementById("javaResults");
  if (resultsDiv) resultsDiv.remove();

  resultsDiv = document.createElement("div");
  resultsDiv.id = "javaResults";
  resultsDiv.innerHTML = `<div style="text-align:center; padding: 20px; color: #00ff88;">
    <h3>🚀 Running Heavy Lifting Test on ${size.toLocaleString()} elements...</h3>
    <p>Please wait, Java is crunching the numbers...</p>
  </div>`;
  if (statsDiv)
    statsDiv.parentNode.insertBefore(resultsDiv, statsDiv.nextSibling);

  try {
    const response = await fetch("/api/stress-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size: size }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      resultsDiv.remove();
      return;
    }

    displayJavaComparison(data.results, size);
  } catch (error) {
    console.error("Error:", error);
    alert("Error: Make sure Java backend is running!\n\n" + error.message);
    if (resultsDiv) resultsDiv.remove();
  }
}

function displayJavaComparison(results, arraySize) {
  // Sort algorithms by duration (fastest first)
  const sortedResults = Object.entries(results).sort(
    (a, b) => a[1].duration - b[1].duration
  );

  let html =
    '<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; margin: 20px auto; max-width: 900px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3); position: relative;">';
  
  // Close Button
  html += `<button onclick="document.getElementById('javaResults').remove()" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.3); border: none; color: white; font-size: 16px; cursor: pointer; padding: 5px 10px; border-radius: 5px;">✕</button>`;
  
  html += `<h3 style="color: #fff; margin-top: 0; font-size: 24px;">🔥 Java Heavy Lifting Results</h3>`;
  html += `<p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">Dataset Size: <strong>${arraySize.toLocaleString()} integers</strong></p>`;

  html += '<div style="display: grid; gap: 12px;">';

  sortedResults.forEach(([algo, metrics], index) => {
    const medals = ["🥇", "🥈", "🥉"];
    const medal = medals[index] || "🏁";
    const bgColor =
      index === 0
        ? "rgba(255, 215, 0, 0.2)"
        : index === 1
        ? "rgba(192, 192, 192, 0.2)"
        : index === 2
        ? "rgba(205, 127, 50, 0.2)"
        : "rgba(255, 255, 255, 0.1)";

    html += `<div style="background: ${bgColor}; padding: 15px; border-radius: 10px; border-left: 4px solid #00ff88; display: flex; justify-content: space-between; align-items: center;">`;
    html += `<div style="flex: 1;">`;
    html += `<span style="font-size: 18px; font-weight: bold; margin-right: 10px;">${medal}</span>`;
    html += `<span style="color: #fff; font-weight: bold;">${algo.replace(
      "_",
      " "
    )}</span>`;
    html += `</div>`;
    html += `<div style="text-align: right;">`;
    html += `<div style="font-size: 20px; color: #00ff88; font-weight: bold;">${metrics.duration.toFixed(
      3
    )} ms</div>`;
    // Comparisons are 0 in stress test to save memory/time
    // html += `<div style="color: rgba(255,255,255,0.7); font-size: 12px;">${metrics.comparisons.toLocaleString()} comparisons</div>`;
    html += `</div>`;
    html += `</div>`;
  });

  html += "</div>";

  // Add performance insights
  const fastest = sortedResults[0];
  const slowest = sortedResults[sortedResults.length - 1];
  const speedup = (slowest[1].duration / fastest[1].duration).toFixed(1);

  html += `<div style="margin-top: 20px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 10px; font-size: 14px;">`;
  html += `<p style="margin: 5px 0; color: rgba(255,255,255,0.9);">💡 <strong>${fastest[0].replace(
    "_",
    " "
  )}</strong> is <strong>${speedup}x faster</strong> than <strong>${slowest[0].replace(
    "_",
    " "
  )}</strong></p>`;

  if (arraySize > 50000) {
    html += `<p style="margin: 5px 0; color: #ffcc00;">⚠️ Note: O(n²) algorithms (Bubble, Selection, Insertion) were skipped because they would take hours to complete at this scale!</p>`;
  }

  html += `</div>`;

  html += "</div>";

  // Remove existing results if any
  const existingResults = document.getElementById("javaResults");
  if (existingResults) {
    existingResults.remove();
  }

  // Insert after stats
  const statsDiv = document.querySelector(".stats");
  if (statsDiv) {
    const resultsDiv = document.createElement("div");
    resultsDiv.id = "javaResults";
    resultsDiv.innerHTML = html;
    statsDiv.parentNode.insertBefore(resultsDiv, statsDiv.nextSibling);
  }
}
