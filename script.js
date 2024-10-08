/* MIT License

Copyright (c) 2024 Bhavya Jain, Austin Lu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

// For every mag canvas, we create a corresponding Magnifier which interacts with it
let MAG_LIST = MAG_CANVAS_LIST.map(mag_canvas => 
  new Magnifier([lightSource.x, lightSource.y], 8, mag_canvas.width, mag_canvas.getContext('2d', {willReadFrequently: true }))
);

//Screen Zoom
function setZoom() {
  SCREEN_ZOOM = 0.97 * (window.innerWidth / 1850);
  document.body.style.transform = `scale(${SCREEN_ZOOM})`;
  document.body.style.transformOrigin = "0 0"; // Set the origin to top-left
}
setZoom();

// Dark Mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}

// Version toggle
function toggleVersion() {
  if (angleRadio.checked) {
    angleDiv.style.display = 'block';
    rayDiv.style.display = 'none';
    addPhotonButton.style.display = 'block';
    addPhotonButton2.style.display = 'block';
  } else {
    angleDiv.style.display = 'none';
    rayDiv.style.display = 'block';
    addPhotonButton.style.display = 'none';
    addPhotonButton2.style.display = 'none';
  }
}

// Displays the grid when you first open the program
function initialize() {
  createTriangleGrid();
  CANVAS.addEventListener('click', selectTriangle); // Left click for selecting the triangles
  CANVAS.addEventListener('contextmenu', setLightSource); // Right click for moving the light source (and MAG box)
  turnMagOnOff();
  turnPartitionOnOff();
  drawLightSource();
  changePartitionCoordinates();
}

// Changes colors
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
  //console.log(CORNER_EPS);
}

// Get rid of the grid lines and make the background black
function blackbackground() {
  bool = document.getElementById("backgroundInput").value;
  if (bool == 1) {
  BACKGROUND_COLOR = "#000000";
  }
  else if (bool == 0) {
    BACKGROUND_COLOR = "#FFFFFF";
  }
  updateScreen();
}

// Orginally intended functionailty: Turns the mag box on and off
//
// Current functionailty: Show or hide the magnification boxes, 
// magnification coordinates and magnification recording boxes 
// depending on the number of magnification boxes
function turnMagOnOff() {
  const num = parseInt(document.getElementById("magOnOffInput").value);
  for(let i in MAG_LIST) {
    if(i < num) {
      MAG_LIST[i].calculate = true;
      MAG_DIV_LIST[i].style.display = 'inline';
      drawMagBox(MAG_LIST[i], MAG_COLOR);
    } else {
      MAG_LIST[i].calculate = false;
      MAG_DIV_LIST[i].style.display = 'none';
    }
  }
  // Show or hide the magnification boxes, magnification coordinates and
  // magnification recording boxes depending on the number of magnification boxes
  if (num === 0) {
    MAG_DOWNLOAD_BUTTON[0].style.visibility = 'hidden';
    MAG_DOWNLOAD_BUTTON[1].style.visibility = 'hidden';
    MAG_DOWNLOAD_BUTTON[2].style.visibility = 'hidden';
    MAG_RECORDING[0].style.visibility = 'hidden';
    MAG_RECORDING[1].style.visibility = 'hidden';
    MAG_RECORDING[2].style.visibility = 'hidden';
    mag.style.visibility = 'hidden';
    magButton.style.visibility = 'hidden';
    x.style.visibility = 'hidden';
    y.style.visibility = 'hidden';
    mag1.style.visibility = 'hidden';
    mag2.style.visibility = 'hidden';
    mag3.style.visibility = 'hidden';
    magBoxXInput1.style.display = 'none';
    magBoxYInput1.style.display = 'none';
    magBoxXInput2.style.display = 'none';
    magBoxYInput2.style.display = 'none';
    magBoxXInput3.style.display = 'none';
    magBoxYInput3.style.display = 'none';
  } else if (num === 1) {
    MAG_DOWNLOAD_BUTTON[0].style.visibility = 'visible';
    MAG_DOWNLOAD_BUTTON[1].style.visibility = 'hidden';
    MAG_DOWNLOAD_BUTTON[2].style.visibility = 'hidden';
    MAG_RECORDING[0].style.visibility = 'visible';
    MAG_RECORDING[1].style.visibility = 'hidden';
    MAG_RECORDING[2].style.visibility = 'hidden';
    mag.style.visibility = 'visible';
    magButton.style.visibility = 'visible';
    x.style.visibility = 'visible';
    y.style.visibility = 'visible';
    mag1.style.visibility = 'visible';
    mag2.style.display = 'none';
    mag3.style.display = 'none';
    magBoxXInput1.style.display = 'inline';
    magBoxYInput1.style.display = 'inline';
    magBoxXInput2.style.display = 'none';
    magBoxYInput2.style.display = 'none';
    magBoxXInput3.style.display = 'none';
    magBoxYInput3.style.display = 'none';
  } else if (num === 2) {
    MAG_DOWNLOAD_BUTTON[0].style.visibility = 'visible';
    MAG_DOWNLOAD_BUTTON[1].style.visibility = 'visible';
    MAG_DOWNLOAD_BUTTON[2].style.visibility = 'hidden';
    MAG_RECORDING[0].style.visibility = 'visible';
    MAG_RECORDING[1].style.visibility = 'visible';
    MAG_RECORDING[2].style.visibility = 'hidden';
    mag.style.visibility = 'visible';
    magButton.style.visibility = 'visible';
    x.style.visibility = 'visible';
    y.style.visibility = 'visible';
    mag1.style.visibility = 'visible';
    mag2.style.visibility = 'visible';
    mag3.style.display = 'none';
    magBoxXInput1.style.display = 'inline';
    magBoxYInput1.style.display = 'inline';
    magBoxXInput2.style.display = 'inline';
    magBoxYInput2.style.display = 'inline';
    magBoxXInput3.style.display = 'none';
    magBoxYInput3.style.display = 'none';
  }
  else if (num === 3) {
    MAG_DOWNLOAD_BUTTON[0].style.visibility = 'visible';
    MAG_DOWNLOAD_BUTTON[1].style.visibility = 'visible';
    MAG_DOWNLOAD_BUTTON[2].style.visibility = 'visible';
    MAG_RECORDING[0].style.visibility = 'visible';
    MAG_RECORDING[1].style.visibility = 'visible';
    MAG_RECORDING[2].style.visibility = 'visible';
    mag.style.visibility = 'visible';
    magButton.style.visibility = 'visible';
    x.style.visibility = 'visible';
    y.style.visibility = 'visible';
    mag1.style.visibility = 'visible'
    mag2.style.visibility = 'visible'
    mag3.style.visibility = 'visible'
    magBoxXInput1.style.display = 'inline';
    magBoxYInput1.style.display = 'inline';
    magBoxXInput2.style.display = 'inline';
    magBoxYInput2.style.display = 'inline';
    magBoxXInput3.style.display = 'inline';
    magBoxYInput3.style.display = 'inline';
  }
  updateScreen();
}

//Turns Partition/Post on and off
function turnPartitionOnOff() {
  const num = parseInt(document.getElementById("partitionOnOffInput").value);
  if (num === 0) {
    SHOW_PART = false; //Turns Partition/Post off
    // Hides the partition coordinates table:
    //partNote.style.visibility = 'hidden';
    part.style.visibility = 'hidden';
    partButton.style.visibility = 'hidden';
    partX.style.visibility = 'hidden';
    partY.style.visibility = 'hidden';
    part1.style.visibility = 'hidden';
    part2.style.visibility = 'hidden';
    partBoxXInput1.style.display = 'none';
    partBoxYInput1.style.display = 'none';
    partBoxXInput2.style.display = 'none';
    partBoxYInput2.style.display = 'none';
  } else if (num === 1) {
    SHOW_PART = true; //Turns Partition/Post on
    // Shows the partition coordinates table:
    //partNote.style.visibility = 'visible';
    part.style.visibility = 'visible';
    partButton.style.visibility = 'visible';
    partX.style.visibility = 'visible';
    partY.style.visibility = 'visible';
    part1.style.visibility = 'visible';
    part2.style.visibility = 'visible';
    partBoxXInput1.style.display = 'inline';
    partBoxYInput1.style.display = 'inline';
    partBoxXInput2.style.display = 'inline';
    partBoxYInput2.style.display = 'inline';
  }
  createShape(); // Update canvas with new coordinates
}

// Turns the mouse coordinates on and off
function changeMouseCoordsVisibility() {
  const mouseVisibilityCheckBox = document.getElementById("mouseVisibilityCheckBox");
  const mouse_coords = document.getElementById("mouse_coords");
  if(mouseVisibilityCheckBox.checked) {
    mouse_coords.style.display = "inline";
  } else {
    mouse_coords.style.display = "none";
  }
}

// Changes the coordinates of the light source
function changeLightSourceCoordinates() {
  lightSource["x"] = parseInt(document.getElementById("lightSourceXInput").value);
  lightSource["y"] = parseInt(document.getElementById("lightSourceYInput").value);
  PHOTONS = [];
  updateScreen(); // Update canvas with new coordinates
}

// Changes the coordinates of the magnification box
function changeMagBoxCoordinates() { 
  x1 = parseInt(document.getElementById("magBoxXInput1").value);
  y1 = parseInt(document.getElementById("magBoxYInput1").value);
  MAG_LIST[0].moveMag(x1,y1);
  x2 = parseInt(document.getElementById("magBoxXInput2").value);
  y2 = parseInt(document.getElementById("magBoxYInput2").value);
  MAG_LIST[1].moveMag(x2,y2);
  x3 = parseInt(document.getElementById("magBoxXInput3").value);
  y3 = parseInt(document.getElementById("magBoxYInput3").value);
  MAG_LIST[2].moveMag(x3,y3);
  drawTriangles(); // Update canvas with new coordinates
}

// Changes the coordinates of Partition/Post
function changePartitionCoordinates() {
  x1 = parseInt(document.getElementById("partBoxXInput1").value);
  y1 = parseInt(document.getElementById("partBoxYInput1").value);
  x2 = parseInt(document.getElementById("partBoxXInput2").value);
  y2 = parseInt(document.getElementById("partBoxYInput2").value);
  PARTITIONS = [new LineSegment(x1, y1, x2, y2)]
  createShape(); // Update canvas with new coordinates
}

// Changes the maginfiction by changing the radius (size) of the (small) mag box (The radius of a square is its side length)
function changeMagBoxRadius() {
    r = parseFloat(document.getElementById("magBoxRadiusInput").value);
    //console.log("r", r)
    MAG_LIST.forEach(MAG => MAG.rescale(r));
    PHOTON_RADIUS = r/(Math.sqrt(2));
    updateScreen();
}

//log function
function log(b, n) {
  return Math.log(n) / Math.log(b);
}

// Function to change the angle
function changeAngle() {
  ANGLE = parseFloat(document.getElementById("angleInput").value);
}

// Function to change number of light rays
function changeNumRays() {
  NUMBER_LIGHT_RAYS = parseInt(document.getElementById("numRaysInput").value);
  //if (NUMBER_LIGHT_RAYS < 360) {
    //y=(630-x)/900
    //TAIL_SIZE = (630-NUMBER_LIGHT_RAYS)/900; // Decreases the thinkness of each light ray as the number of light rays increases
    //HEAD_SIZE = 1.5*TAIL_SIZE;
    //console.log(TAIL_SIZE)
  //}
  //else { // between 360 and 36000
    //y=(0.7/log250(x))-0.35
    //TAIL_SIZE = (0.7/(log(250,NUMBER_LIGHT_RAYS)))-0.35; // Decreases the thinkness of each light ray as the number of light rays increase
    //HEAD_SIZE = 2*TAIL_SIZE;
    //console.log(TAIL_SIZE)
  //}
}

function changeThickness() {
  HEAD_SIZE = parseFloat(document.getElementById("headSizeInput").value);
  TAIL_SIZE = parseFloat(document.getElementById("tailSizeInput").value);
  MAG_HEAD_SIZE = parseFloat(document.getElementById("magHeadSizeInput").value);
  MAG_TAIL_SIZE = parseFloat(document.getElementById("magTailSizeInput").value);
}

// Function to change rendering speed
function changeSpeed() {
  SPEED_TIMES_TEN = parseInt(document.getElementById("speedInput").value);
  //console.log(SPEED_TIMES_TEN)
}

// Advanced Function to change rendering speed to 5000
function changeSpeed2() {
  SPEED_TIMES_TEN = 5000;
  document.getElementById("speedInput").value = 5000;
  document.getElementById("speedInput").classList.add("red_slider");
  document.getElementById("speedValue").textContent = 5000; // Update the displayed value
  //console.log(SPEED_TIMES_TEN)
}

// Add an event listener to the slider to reset the color on input change
document.getElementById("speedInput").addEventListener('input', function() {
  this.classList.remove("red_slider");
  document.getElementById("speedValue").textContent = this.value; // Update the displayed value
});

// Initialize the displayed value on page load
document.getElementById("speedValue").textContent = document.getElementById("speedInput").value;

// Changes the number of Triangles in the grid (essentially the size of the grid)
function changeNumberTriangles(){
  TRIANGLE_SIDE = parseInt(document.getElementById("triangleSideInput").value);
  TRIANGLES = [];
  SELECTED_TRIANGLES = [];
  createTriangleGrid();
  //console.log(TRIANGLE_SIDE);
}

// Function to make the grid of triangles
function createTriangleGrid() {
  const triangleSize = TRIANGLE_SIDE;
  // Split canvas into square cells
  for (let y = 0; y < CANVAS.height; y += triangleSize) {
    for (let x = 0; x < CANVAS.width; x += triangleSize) {
      let isEvenRow = (y / triangleSize) % 2 === 0;
      let isEvenCol = (x / triangleSize) % 2 === 0;

      // We split the cell into two (45,45) triangles, which are oriented differently depending on the parity of the row and column
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

// Function to draw the triangles, and also several other fixed canvas elements
function drawTriangles() {
  CTX.lineWidth = 0.5
  // Clear the canvas
  CTX.clearRect(0, 0, canvas.width, canvas.height);
  CTX.fillStyle = BACKGROUND_COLOR;
  CTX.fillRect(0, 0, canvas.width, canvas.height);
  CTX.strokeStyle = WALL_COLOR;
  // Clear all the magnifiers as well
  MAG_LIST.forEach(MAG => MAG.clearCanvas(BACKGROUND_COLOR));
  // Drawing order is important here. We first draw the bolded boundaries to the shape,
  // then we draw the triangles, and lastly we draw the mag box
  drawBounds();
  TRIANGLES.forEach(triangle => {
    if (SELECTED_TRIANGLES.includes(triangle)) {
      CTX.fillStyle = 'black';
      CTX.strokeStyle = 'black';
      CTX.fill(triangle.path);
    }
    if(BACKGROUND_COLOR == "#000000") CTX.globalAlpha = 0.0; // To remove the grid lines while recording
    CTX.stroke(triangle.path);
    CTX.strokeStyle = WALL_COLOR;
    CTX.globalAlpha = 1; // Change it to default after done
  });
  MAG_LIST.forEach(MAG => drawMagBox(MAG, MAG_COLOR));
  MAG_LIST.forEach(MAG => MAG.drawTriangles(TRIANGLES, BACKGROUND_COLOR, WALL_COLOR));
  drawPartitions();
  drawLightSource();
}

// Draws the light source point
function drawLightSource() {
  drawCircle(lightSource.x, lightSource.y, 2, 2, LIGHT_SOURCE_COLOR);
}

// Function to let users select triangles by clicking them
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

// Sets the light source *needs more comments
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
  console.log("Existing Bounds:", existingBounds);
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

// Merges line segments, as many as possible
function mergeLineSegments() {
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

// Creates the user selected shape
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


  if(SHOW_PART) PARTITIONS.forEach(lineSeg => BOUNDARIES.push(lineSeg));
  // Log the COORDS and Boundaries list
  console.log("COORDS Array:", COORDS);
  console.log("Boundaries Array:", BOUNDARIES);
  drawTriangles();
  drawPartitions();
}

function startAnimation() {
  clearInterval(RENDER_INTERVAL);
  if (angleRadio.checked) {
    createPhotons2();
  } else {
    createPhotons();
  }
  RENDER_INTERVAL = setInterval(updateScreen, RENDER_INTERVAL_TIME);
}

function stopAnimation() {
  clearInterval(RENDER_INTERVAL);
}

// Creates phtons according to the number of light rays and the position of the light source
function createPhotons() {
  PHOTONS = [];
  for (let i = 0; i < NUMBER_LIGHT_RAYS; i++) {
    const angle = (i / NUMBER_LIGHT_RAYS) * 2 * Math.PI;
    PHOTONS.push(new Photon(
      lightSource.x + PHOTON_RADIUS * Math.cos(angle),
      lightSource.y + PHOTON_RADIUS * Math.sin(angle),
      angle,
      (SPEED_TIMES_TEN/10),
      PHOTON_HEAD_COLOR,
      PHOTON_TAIL_COLOR
    ));
  }
}

// Creates photons for the angle version
function createPhotons2() {
  PHOTONS = [];
  PHOTONS.push(new Photon(
      lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
      lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
      Math.PI * (-ANGLE / 180), 
      (SPEED_TIMES_TEN/10),
      PHOTON_HEAD_COLOR, 
      PHOTON_TAIL_COLOR)
      );
}

// Adds new photon
function addPhoton() {
  var newPhoton = new Photon(
    lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
    lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
    Math.PI * (-ANGLE / 180), 
    (SPEED_TIMES_TEN/10),
    PHOTON_HEAD_COLOR, 
    PHOTON_TAIL_COLOR);

  PHOTONS.push(newPhoton);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Adds new photon with random colour
function addPhoton2() {
  var newPhoton = new Photon(
    lightSource.x + PHOTON_RADIUS * Math.cos(Math.PI * (-ANGLE / 180)), 
    lightSource.y + PHOTON_RADIUS * Math.sin(Math.PI * (-ANGLE / 180)), 
    Math.PI * (-ANGLE / 180), 
    (SPEED_TIMES_TEN/10),
    getRandomColor(), 
    getRandomColor());

  PHOTONS.push(newPhoton);
}

// Updates the screen
function updateScreen() {
  rayTracedUpdatePositions();
  drawTriangles();
  drawPhotons();
  drawPartitions();
  drawLightSource();
  MAG_LIST.forEach(MAG => drawMagBox(MAG, MAG_COLOR));
  MAG_LIST.forEach(MAG => MAG.drawCenter());
  if (CURRENTLY_RECORDING) {
    VIDEO.add(CTX);
    for(let i = 0; i < MAG_LIST.length; ++i) {
      if(MAG_LIST[i].calculate) {
        MAG_VIDEO[i].add(MAG_LIST[i].ctx);
      }
    }
    NUM_CAPTURED_FRAMES++;
    if (NUM_CAPTURED_FRAMES % 33 === 0) {
      const secs = NUM_CAPTURED_FRAMES / 33;
      displayStatus(`Recording: captured ${secs} second(s) of film so far...`);
    }
  }
}

// Counts the number of active photons
function updatePhotonCount() {
  const activePhotonCount = PHOTONS.filter(photon => photon.active).length;
  document.getElementById('activePhotonCount').innerText = activePhotonCount;
}

// For a given photon, we want the first boundary it collides with this frame
function getClosestCollision(photon) {
    let closestCollision = null;
    for(let edge = 0; edge < BOUNDARIES.length; ++edge) { // Go through all boundaries
      const result = photon.checkCollision(BOUNDARIES[edge]);
      if(result == null) {
        continue;
      }
      // photonScalar tells us how "far" a collision is
      if(closestCollision == null || result.photonScalar < closestCollision.photonScalar) {
        closestCollision = result;
      }
    }
    return closestCollision;
}

// We calculate the path of each photon for this frame
function rayTracedUpdatePositions() {
  for(let i = 0; i < PHOTONS.length; ++i) {
    // A photon can reflect multiple times in a frame, hence we track the magnitude of the vector representing it's remaining movement
    while(PHOTONS[i].vecDirRemaining.mag > 0.0001) {
      //console.log("PHOTONS["+i+"].vecDirRemaining.mag =", PHOTONS[i].vecDirRemaining.mag);
      let closestCollision = getClosestCollision(PHOTONS[i]);
      if(closestCollision == null) { // No bounce
        break;
      }
      if(closestCollision.onCorner == true) {
        PHOTONS[i].deactivate(); // Deactivate photon that hits a corner
      } 
      PHOTONS[i].bounceOffSegment(closestCollision); // Bounce off edge
    }
  }
  // Move the photons.
  for (var i = 0; i < PHOTONS.length; ++i) {
    PHOTONS[i].updatePosition();
  }
  // Update the active photon count.
  updatePhotonCount()
}

// Draws the Photons
function drawPhotons() {
  PHOTONS.forEach(photon => {
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
  PHOTONS.forEach(photon => {
    drawCircle(photon.x, photon.y, HEAD_SIZE, MAG_HEAD_SIZE, photon.headColor);
  });
}

function drawCircle(x, y, radius, magRadius, color) {
  MAG_LIST.forEach(MAG => MAG.drawCircle(x, y, magRadius, color));
  CTX.beginPath();
  CTX.fillStyle = color; 
  CTX.arc(x, y, radius, 0, 2 * Math.PI);
  CTX.fill();
}

// Draws the MAG box
function drawMagBox(magnifier, color) {
  if(!magnifier.calculate) return;
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
  CTX.beginPath();
  CTX.fillStyle = MAG_POINT_COLOR; 
  CTX.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  CTX.fill();
}

function drawLine(x1, y1, x2, y2, color, width = TAIL_SIZE, magWidth = MAG_TAIL_SIZE) {
  MAG_LIST.forEach(MAG => MAG.drawLine(x1, y1, x2, y2, color, magWidth));
  CTX.beginPath();
  CTX.strokeStyle = color;
  CTX.lineWidth = width;
  CTX.moveTo(x1, y1);
  CTX.lineTo(x2, y2);
  CTX.stroke();
  CTX.lineWidth = 0.5;
}

// Draws the boundries of the user selected shape
function drawBounds() {
  // Takes all the lines from the BOUNDARIES array and draws a line at them
  BOUNDARIES.forEach(lineSeg => {
    let isPartition = false;
    PARTITIONS.forEach(part => {isPartition = (isPartition || part.equals(lineSeg))})
    if(!(isPartition && SHOW_PART)) drawLine(lineSeg.x1, lineSeg.y1, lineSeg.x2, lineSeg.y2, WALL_COLOR, 10, 10);
  });
  // Takes all the points from the COORDS array and draws a circle at them
  COORDS.forEach(coord => {drawCircle(coord[0], coord[1], 5, 5, WALL_COLOR)});
}

// Draws the partitions
function drawPartitions() {
  if(!SHOW_PART) return;
  PARTITIONS.forEach(part => drawLine(part.x1, part.y1, part.x2, part.y2, PART_COLOR, 3));
  PARTITIONS.forEach(part => drawCircle(part.x1, part.y1, 1.5, 1.5, PART_COLOR));
  PARTITIONS.forEach(part => drawCircle(part.x2, part.y2, 1.5, 1.5, PART_COLOR));
}

// Recording:
function startRecording() {
  VIDEO = new Whammy.Video(33);
  MAG_VIDEO = [new Whammy.Video(33), new Whammy.Video(33), new Whammy.Video(33)];
  NUM_CAPTURED_FRAMES = 0;
  if (CURRENTLY_RECORDING) {
    return;
  }
  if (!confirm('This feature only works on Firefox right now. Proceed?')) {
    return;
  }
  CURRENTLY_RECORDING = true;
}

function stopRecording() {
  if (!CURRENTLY_RECORDING) {
    return;
  }
  CURRENTLY_RECORDING = false;
  VIDEO.compile(false, function (output) {
    RECORDING.src = URL.createObjectURL(output);
    DOWNLOAD_BUTTON.href = RECORDING.src;
    displayStatus('Recording complete.');
  });
  for(let i = 0; i < MAG_VIDEO.length; ++i) {
    MAG_VIDEO[i].compile(false, function (output) {
      MAG_RECORDING[i].src = URL.createObjectURL(output);
      MAG_DOWNLOAD_BUTTON[i].href = MAG_RECORDING[i].src;
      displayStatus('Recording complete.');
    });

  }
}

// Recording Status
function displayStatus(text) {
  STATUS_ELEMENT.innerText = `Status: ${text}`;
}

function startAnimationAndRecording() {
  startAnimation();
  startRecording();
}