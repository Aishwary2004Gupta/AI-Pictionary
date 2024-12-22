const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let lastX = 0;
let lastY = 0;
let paths = []; // History of drawn paths for undo functionality

// Select buttons by their IDs
const undoButton = document.getElementById("undoButton");
const clearButton = document.getElementById("clearButton");
const submitButton = document.getElementById("submitButton");

// Initialize button states
updateButtonStates();

// Start drawing when the mouse is pressed
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  paths.push([]); // Start a new path
});

// Stop drawing when the mouse is released
canvas.addEventListener("mouseup", () => {
  drawing = false;
  updateButtonStates();
});

// Draw line while the mouse moves
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  drawLine(lastX, lastY, e.offsetX, e.offsetY);
  paths[paths.length - 1].push({ x1: lastX, y1: lastY, x2: e.offsetX, y2: e.offsetY });
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

function showLoadingIndicator() {
    document.getElementById("loading-indicator").style.display = "block";
  }
  
  function hideLoadingIndicator() {
    document.getElementById("loading-indicator").style.display = "none";
  }

// Function to draw a line between two points
function drawLine(x1, y1, x2, y2) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

// Undo the last drawn path
function undo() {
  if (paths.length === 0) return;
  paths.pop();
  redrawCanvas();
  updateButtonStates();
}

// Clear the entire canvas
function clearCanvas() {
  if (paths.length === 0) return;
  paths = [];
  redrawCanvas();
  updateButtonStates();
}

// Redraw the canvas based on the paths array
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths.forEach((path) => {
    path.forEach((line) => drawLine(line.x1, line.y1, line.x2, line.y2));
  });
}

// Submit the drawing and flip to show the guess
async function submitDrawing() {
  if (paths.length === 0) return;

  // Create an offscreen canvas to add a white background
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvas.width;
  offscreenCanvas.height = canvas.height;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  // Fill the background with white
  offscreenCtx.fillStyle = "white";
  offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

  // Draw the original canvas on top of the white background
  offscreenCtx.drawImage(canvas, 0, 0);

  // Convert the offscreen canvas to a JPEG data URL
  const drawingData = offscreenCanvas.toDataURL("image/jpeg", 1.0); // 1.0 for best quality

  try {
    // Display loading indicator
    showLoadingIndicator();

    // Send the JPEG image data to the backend
    const response = await fetch('http://127.0.0.1:5000/submit-drawing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: drawingData }),
    });

    const result = await response.json();

    if (response.ok) {
      const guessText = document.getElementById("guess-text");
      guessText.innerText = `Guess: ${result.guess}`;
      document.getElementById("canvas-flip-container").classList.add("flipped");
    } else {
      console.error(result.error);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Hide loading indicator once the response is received
    hideLoadingIndicator();
  }
}

// Restart session by clearing the canvas and flipping back
function restartSession() {
  clearCanvas();
  document.getElementById("canvas-flip-container").classList.remove("flipped");
  updateButtonStates();
}

// Update button states based on whether there are paths in the canvas
function updateButtonStates() {
  const hasPaths = paths.length > 0;
  undoButton.disabled = !hasPaths;
  clearButton.disabled = !hasPaths;
  submitButton.disabled = !hasPaths;
}

// Call this function whenever the paths array changes
updateButtonStates();