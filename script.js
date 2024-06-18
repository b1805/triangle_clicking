// These represent the main and magnifier canvases we draw on
const CANVAS = document.getElementById('canvas'); // The main canvas
const MAG_DIV_LIST = [document.getElementById('mag_viewer')]; // This includes the labels associated with each magnifier
const MAG_CANVAS_LIST = [document.getElementById('mag_canvas')]; // This refers to just the magnifier canvas
const CTX = CANVAS.getContext('2d', { willReadFrequently: true }); // Canvas contexts are used to draw on and read from

// Style values
const BACKGROUND_COLOR = '#FFFFFF';
let WALL_COLOR = '#FFA914';
let PHOTON_HEAD_COLOR = '#E1FF00';
let PHOTON_TAIL_COLOR = '#00FFB3';
let MAG_COLOR = 'blue';
let LIGHT_SOURCE_COLOR = 'red';
let MAG_POINT_COLOR = 'blue'
let PHOTON_RADIUS = 10; // Distance away from source

let NUMBER_LIGHT_RAYS = 360;
const RENDER_INTERVAL_TIME = 33;
let SPEED_TIMES_TEN = 5;
let HEAD_SIZE = 0.6;
let TAIL_SIZE = 0.3;
let TRIANGLE_SIDE = 100;
let CORNER_EPS = 0.01; // Radius of the epsilon ball around each corner for collision detection

let TRIANGLES = [];
let SELECTED_TRIANGLES = [];
let BOUNDARIES = [];
let COORDS = [];
var photons = [];
var renderInterval;

var video = new Whammy.Video(33);
var currentlyRecording = false;
var recording = document.getElementById('recording');
var downloadButton = document.getElementById('downloadButton');
var statusElement = document.getElementById('status');
var startRecButton = document.getElementById('startRecButton');
var numCapturedFrames = 0;

let lightSource = { x: 500, y: 400 };
// For every mag canvas, we create a corresponding Magnifier which interacts with it
let MAG_LIST = MAG_CANVAS_LIST.map(mag_canvas => 
  new Magnifier([lightSource.x, lightSource.y], 10, mag_canvas.width, mag_canvas.getContext('2d', {willReadFrequently: true }))
);

function initialize() {
  createTriangleGrid();
  CANVAS.addEventListener('click', selectTriangle);
  CANVAS.addEventListener('contextmenu', setLightSource);
}

function applyColors() {
  WALL_COLOR = document.getElementById("wallColorInput").value;
  PHOTON_HEAD_COLOR = document.getElementById("photonHeadColorInput").value;
  PHOTON_TAIL_COLOR = document.getElementById("photonTailColorInput").value;
  MAG_COLOR = document.getElementById("magnifierColorInput").value; 
  MAG_CANVAS_LIST.forEach(mag_canvas => mag_canvas.style.borderColor = MAG_COLOR);
  LIGHT_SOURCE_COLOR = document.getElementById("lightSourceColorInput").value;
  MAG_POINT_COLOR = document.getElementById("magnifierPointColorInput").value;
  updateScreen(); // Update canvas with new colors
}

// Changes Epsilon Value
function changeEpsilon() {
  CORNER_EPS = parseFloat(document.getElementById("epsilonInput").value);
  console.log(CORNER_EPS);
}

// Turns the mag box on and off
function turnMagOnOff() {
  const magCanvas = document.getElementById('mag_viewer');
  const bool = parseInt(document.getElementById("magOnOffInput").value);
  if (bool) {
    MAG_LIST.forEach(MAG => MAG.calculate = true);
    mag_viewer_list.forEach(magViewer => magViewer.style.display = 'inline');
  } else {
    MAG_LIST.forEach(MAG => MAG.calculate = false);
    mag_viewer_list.forEach(magViewer => magViewer.style.display = 'none');
  }
}


function changeMouseCoordsVisibility() {
  const mouseVisibilityCheckBox = document.getElementById("mouseVisibilityCheckBox");
  const mouse_coords = document.getElementById("mouse_coords");
  if(mouseVisibilityCheckBox.checked) {
    mouse_coords.style.display = "inline";
  } else {
    mouse_coords.style.display = "none";
  }
}

function changeLightSourceCoordinates() {
  lightSource["x"] = parseInt(document.getElementById("lightSourceXInput").value);
  lightSource["y"] = parseInt(document.getElementById("lightSourceYInput").value);
  photons = [];
  updateScreen(); // Update canvas with new coordinates
}

function changeMagBoxCoordinates() { 
  x = parseInt(document.getElementById("magBoxXInput").value);
  y = parseInt(document.getElementById("magBoxYInput").value);
  MAG_LIST[0].moveMag(x,y);
  updateScreen(); // Update canvas with new coordinates
}

// The radius of a square is its side length
function changeMagBoxRadius() {
    r = parseInt(document.getElementById("magBoxRadiusInput").value);
    MAG_LIST.forEach(MAG => MAG.rescale(r));
    PHOTON_RADIUS = r;
    updateScreen();
}

//log function
function log(b, n) {
  return Math.log(n) / Math.log(b);
}

// Function to change number of light rays
function changeNumRays() {
  NUMBER_LIGHT_RAYS = parseInt(document.getElementById("numRaysInput").value);
  if (NUMBER_LIGHT_RAYS < 360) {
    //y=(630-x)/900
    TAIL_SIZE = (630-NUMBER_LIGHT_RAYS)/900;
    HEAD_SIZE = 1.5*TAIL_SIZE;
    //console.log(TAIL_SIZE)
  }
  else {
    //y=(0.7/log250(x))-0.35
    TAIL_SIZE = (0.7/(log(250,NUMBER_LIGHT_RAYS)))-0.35;
    HEAD_SIZE = 2*TAIL_SIZE;
    //console.log(TAIL_SIZE)
  }
}

// Function to change rendering speed
function changeSpeed() {
  SPEED_TIMES_TEN = parseInt(document.getElementById("speedInput").value);
  //console.log(SPEED_TIMES_TEN)
}

// Advanced Function to change rendering speed to 1000
function changeSpeed2() {
  SPEED_TIMES_TEN = 1000;
  //console.log(SPEED_TIMES_TEN)
}

function changeNumberTriangles(){
  TRIANGLE_SIDE = parseInt(document.getElementById("triangleSideInput").value);
  TRIANGLES = [];
  SELECTED_TRIANGLES = [];
  createTriangleGrid();
  console.log(TRIANGLE_SIDE);
}

function createTriangleGrid() {
  const triangleSize = TRIANGLE_SIDE;
  for (let y = 0; y < CANVAS.height; y += triangleSize) {
    for (let x = 0; x < CANVAS.width; x += triangleSize) {
      let isEvenRow = (y / triangleSize) % 2 === 0;
      let isEvenCol = (x / triangleSize) % 2 === 0;

      if ((isEvenRow && isEvenCol) || (!isEvenRow && !isEvenCol)) {
        let triangle1 = new Path2D();
        triangle1.moveTo(x, y);
        triangle1.lineTo(x + triangleSize, y);
        triangle1.lineTo(x, y + triangleSize);
        triangle1.closePath();
        let triangleObj1 = { path: triangle1, selected: false, point1: { x: x, y: y }, point2: { x: x + triangleSize, y: y }, point3: { x: x, y: y + triangleSize } };
        TRIANGLES.push(triangleObj1);

        let triangle2 = new Path2D();
        triangle2.moveTo(x + triangleSize, y);
        triangle2.lineTo(x + triangleSize, y + triangleSize);
        triangle2.lineTo(x, y + triangleSize);
        triangle2.closePath();
        let triangleObj2 = { path: triangle2, selected: false, point1: { x: x + triangleSize, y: y }, point2: { x: x + triangleSize, y: y + triangleSize }, point3: { x: x, y: y + triangleSize } };
        TRIANGLES.push(triangleObj2);
      } else {
        let triangle1 = new Path2D();
        triangle1.moveTo(x, y);
        triangle1.lineTo(x + triangleSize, y);
        triangle1.lineTo(x + triangleSize, y + triangleSize);
        triangle1.closePath();
        let triangleObj1 = { path: triangle1, selected: false, point1: { x: x, y: y }, point2: { x: x + triangleSize, y: y }, point3: { x: x + triangleSize, y: y + triangleSize } };
        TRIANGLES.push(triangleObj1);

        let triangle2 = new Path2D();
        triangle2.moveTo(x, y);
        triangle2.lineTo(x, y + triangleSize);
        triangle2.lineTo(x + triangleSize, y + triangleSize);
        triangle2.closePath();
        let triangleObj2 = { path: triangle2, selected: false, point1: { x: x, y: y }, point2: { x: x, y: y + triangleSize }, point3: { x: x + triangleSize, y: y + triangleSize } };
        TRIANGLES.push(triangleObj2);
      }
    }
  }
  drawTriangles();
}

function drawTriangles() {
  CTX.lineWidth = 0.5
  MAG_LIST.forEach(MAG => MAG.drawTriangles(TRIANGLES, BACKGROUND_COLOR, WALL_COLOR));
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  CTX.fillStyle = BACKGROUND_COLOR;
  CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

  CTX.strokeStyle = WALL_COLOR;
  TRIANGLES.forEach(triangle => {
    if (triangle.selected) {
      CTX.fillStyle = 'black';
      CTX.strokeStyle = 'black';
      CTX.fill(triangle.path);
    }
    CTX.stroke(triangle.path);
    CTX.strokeStyle = WALL_COLOR;
  });
  drawBounds();
  MAG_LIST.forEach(MAG => drawMagBox(MAG, MAG_COLOR));
  drawLightSource();
}

function drawLightSource() {
  drawCircle(lightSource.x, lightSource.y, 2, LIGHT_SOURCE_COLOR);
}

function selectTriangle(event) {
  if (event.button === 2) return;  // Ignore right-clicks
  const x = event.offsetX;
  const y = event.offsetY;
  TRIANGLES.forEach(triangle => {
    if (CTX.isPointInPath(triangle.path, x, y)) {
      triangle.selected = !triangle.selected;
      if (triangle.selected) {
        SELECTED_TRIANGLES.push(triangle);
      } else {
        const index = SELECTED_TRIANGLES.indexOf(triangle);
        if (index > -1) {
          SELECTED_TRIANGLES.splice(index, 1);
        }
      }
    }
  });
  drawTriangles();
}

function setLightSource(event) {
  event.preventDefault();
  const x = event.offsetX;
  const y = event.offsetY;
  lightSource = { x: x, y: y };
  MAG_LIST[0].moveMag(x, y);
  createPhotons();
  drawTriangles();
}
// This function removes line segments that appear twice, since those are internal
function pruneRepeatedBounds() {
  let existingBounds = new Array();
  let internalBounds = new Array();
  BOUNDARIES.forEach(lineSeg => {
    let i = 0;
    for(; i < existingBounds.length; i++) {
      if(lineSeg.equals(existingBounds[i])) {
        internalBounds.push(lineSeg);
        break;
      }
    }
    existingBounds.push(lineSeg);
  });
  console.log("Exisiting Bounds:", existingBounds);
  console.log("Internal Bounds:", internalBounds);
  let goodBounds = new Array();
  BOUNDARIES.forEach(lineSeg => {
    let a = false;
    let i = 0;
    for(; i < internalBounds.length; i++) {
      if(internalBounds[i].equals(lineSeg)) {
        a = true;
      }
    }
    if(!a) {
      goodBounds.push(lineSeg);
    }
  })
  BOUNDARIES = goodBounds;
}

function mergeLineSegments() {
  // Merge line segments if possible
  let mergedBoundaries = [];
  let done = false;
  while (!done) {
    done = true;
    let newBoundaries = [];
    for (let i = 0; i < BOUNDARIES.length; i++) {
      let merged = false;
      for (let j = i + 1; j < BOUNDARIES.length; j++) {
        let mergedLine = BOUNDARIES[i].merge(BOUNDARIES[j]);
        if (mergedLine !== false) {
          newBoundaries.push(mergedLine);
          BOUNDARIES.splice(j, 1);  // Remove the merged segment
          merged = true;
          done = false;
          break;  // Stop checking this boundary, move to the next one
        }
      }
      if (!merged) {
        newBoundaries.push(BOUNDARIES[i]);
      }
    }
    BOUNDARIES = newBoundaries;
  }
  return done;
}

function createShape() {
  // Clear the COORDS list
  COORDS = [];
  BOUNDARIES = new Array();
 
  // Iterate through selected triangles
  SELECTED_TRIANGLES.forEach(triangle => {
    // Extract coordinates of triangle's vertices
    let point1 = triangle.point1;
    let point2 = triangle.point2;
    let point3 = triangle.point3;
        
    // Add vertices' coordinates to COORDS list
    BOUNDARIES.push(new LineSegment(
      point1.x,
      point1.y,
      point2.x,
      point2.y,
    ));
    BOUNDARIES.push(new LineSegment(
      point2.x,
      point2.y,
      point3.x,
      point3.y,
    ));
    BOUNDARIES.push(new LineSegment(
      point3.x,
      point3.y,
      point1.x,
      point1.y,
    ));
    //COORDS.push([point1.x, point1.y]);
    //COORDS.push([point2.x, point2.y]);
    //COORDS.push([point3.x, point3.y]);
  });

  pruneRepeatedBounds();

  let fullyMerged = false;
  // I assert this is O(n^2 * log n)
  while(!fullyMerged) {
    // We just keep merging until we can't
    fullyMerged = mergeLineSegments();
  }
  
  BOUNDARIES.forEach(lineSeg => {
    COORDS.push([lineSeg.x1, lineSeg.y1]);
    COORDS.push([lineSeg.x2, lineSeg.y2]);
  })

  const setCOORDS = new Set(COORDS.map(JSON.stringify));
  COORDS = Array.from(setCOORDS).map(JSON.parse);

  // Log the COORDS and Boundaries list
  console.log("COORDS Array:", COORDS);
  console.log("Boundaries Array:", BOUNDARIES);
  drawTriangles();
}

function startAnimation() {
  clearInterval(renderInterval);
  createPhotons();
  renderInterval = setInterval(updateScreen, RENDER_INTERVAL_TIME);
}

function stopAnimation() {
  clearInterval(renderInterval);
}

function createPhotons() {
  photons = [];
  for (let i = 0; i < NUMBER_LIGHT_RAYS; i++) {
    const angle = (i / NUMBER_LIGHT_RAYS) * 2 * Math.PI;
    photons.push(new Photon(
      lightSource.x + PHOTON_RADIUS * Math.cos(angle),
      lightSource.y + PHOTON_RADIUS * Math.sin(angle),
      angle,
      (SPEED_TIMES_TEN/10),
      PHOTON_HEAD_COLOR,
      PHOTON_TAIL_COLOR
    ));
  }
}

function updateScreen() {
  rayTracedUpdatePositions();
  drawTriangles();
  drawPhotons();
  if (currentlyRecording) {
    video.add(CTX);
    numCapturedFrames++;
    if (numCapturedFrames % 33 === 0) {
      const secs = numCapturedFrames / 33;
      displayStatus(`Recording: captured ${secs} second(s) of film so far...`);
    }
  }
}

function updatePhotonCount() {
  const activePhotonCount = photons.filter(photon => photon.active).length;
  document.getElementById('activePhotonCount').innerText = activePhotonCount;
}

function getClosestCollision(photon) {
    let closestCollision = null;
    for(let edge = 0; edge < BOUNDARIES.length; ++edge) {
      const result = photon.checkCollision(BOUNDARIES[edge]);
      if(result == null) {
        continue;
      }
      if(closestCollision == null || result.photonScalar < closestCollision.photonScalar) {
        closestCollision = result;
      }
    }
    return closestCollision;
}
function rayTracedUpdatePositions() {
  for(let i = 0; i < photons.length; ++i) {
    while(photons[i].vecDirRemaining.mag > 0.0001) {
      //console.log("photons["+i+"].vecDirRemaining.mag =", photons[i].vecDirRemaining.mag);
      let closestCollision = getClosestCollision(photons[i]);
      if(closestCollision == null) { // No bounce
        break;
      }
      if(closestCollision.onCorner == true) {
        photons[i].deactivate(); // Deactivate photon that hits a corner
      } 
      photons[i].bounceOffSegment(closestCollision); // Bounce off edge
    }
  }
  // Move the photons.
  for (var i = 0; i < photons.length; ++i) {
    photons[i].updatePosition();
  }
  // Update the active photon count.
  updatePhotonCount()
}

function drawPhotons() {
  photons.forEach(photon => {
    const len = photon.contactPoints.length;
    for (let i = 0; i < len - 1; i++) {
      drawLine(
        photon.contactPoints[i][0],
        photon.contactPoints[i][1],
        photon.contactPoints[i + 1][0],
        photon.contactPoints[i + 1][1],
        photon.tailColor
      );
    }
    drawLine(
      photon.contactPoints[len - 1][0],
      photon.contactPoints[len - 1][1],
      photon.x,
      photon.y,
      photon.tailColor
    );
  });
  photons.forEach(photon => {
    drawCircle(photon.x, photon.y, HEAD_SIZE, photon.headColor);
  });
}

function drawCircle(x, y, radius, color) {
  MAG_LIST.forEach(MAG => MAG.drawCircle(x, y, radius, color));
  CTX.beginPath();
  CTX.fillStyle = color; 
  CTX.arc(x, y, radius, 0, 2 * Math.PI);
  CTX.fill();
}

function drawMagBox(magnifier, color) {
  CTX.beginPath();
  CTX.strokeStyle = color;
  CTX.lineWidth = 1.5;
  CTX.moveTo(magnifier.magBox[0][0], magnifier.magBox[0][1]);
  for(let i = 1; i <= magnifier.magBox.length; ++i) {
    CTX.lineTo(magnifier.magBox[i % magnifier.magBox.length][0], magnifier.magBox[i % magnifier.magBox.length][1]);
  }
  CTX.stroke()
  CTX.lineWidth = 0.5;

  // Calculate the center of the magBox
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < magnifier.magBox.length; i++) {
    sumX += magnifier.magBox[i][0];
    sumY += magnifier.magBox[i][1];
  }
  const centerX = sumX / magnifier.magBox.length;
  const centerY = sumY / magnifier.magBox.length;

  // Draw a circle at the center of the magBox
  const radius = 2;
  drawCircle(centerX, centerY, radius, MAG_POINT_COLOR);
}

function drawLine(x1, y1, x2, y2, color, width = TAIL_SIZE) {
  MAG_LIST.forEach(MAG => MAG.drawLine(x1, y1, x2, y2, color, width));
  CTX.beginPath();
  CTX.strokeStyle = color;
  CTX.lineWidth = width;
  CTX.moveTo(x1, y1);
  CTX.lineTo(x2, y2);
  CTX.stroke();
  CTX.lineWidth = 0.5;
}

function drawBounds() {
  //console.log(BOUNDARIES[0].x1)
  for (i in BOUNDARIES) {
    drawLine(BOUNDARIES[i].x1, BOUNDARIES[i].y1, BOUNDARIES[i].x2, BOUNDARIES[i].y2, WALL_COLOR, 5);
  }
  for (j in COORDS) {
    drawCircle(COORDS[j][0], COORDS[j][1], 2.5, WALL_COLOR)
  }
}

// Recording:

function startRecording() {
  if (currentlyRecording) {
    return;
  }
  if (!confirm('This feature only works on Firefox right now. Proceed?')) {
    return;
  }
  currentlyRecording = true;
}

function stopRecording() {
  if (!currentlyRecording) {
    return;
  }
  currentlyRecording = false;
  video.compile(false, function (output) {
    recording.src = URL.createObjectURL(output);
    downloadButton.href = recording.src;
    displayStatus('Recording complete.');
  });
}

function displayStatus(text) {
  statusElement.innerText = `Status: ${text}`;
}

function startAnimationAndRecording() {
  startAnimation();
  startRecording();
}


