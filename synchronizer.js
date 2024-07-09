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

// Function to save selected triangles to a file
function saveShape() {
    const shapes = SELECTED_TRIANGLES.map(triangle => {
        return {
            point1: triangle.point1,
            point2: triangle.point2,
            point3: triangle.point3
        };
    });
    const data = JSON.stringify(shapes);
    const blob = new Blob([data], { type: 'text/plain' });
  
    // Prompt the user to enter a filename
    let filename = prompt("Enter the filename:", "shape.txt");
    if (filename === null || filename.trim() === "") {
      filename = "shape.txt"; // Default filename if user cancels or enters an empty name
    }
  
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
  
  // Function to load selected triangles from a file
  function loadShape(file) {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const shapes = JSON.parse(content);
  
        SELECTED_TRIANGLES = shapes.map(shape => {
          // Itrates through the grid and select the triangles in the loaded file
            const triangle = TRIANGLES.find((sTriangle) => (sTriangle.point1.x == shape.point1.x && sTriangle.point1.y == shape.point1.y && sTriangle.point2.x == shape.point2.x && sTriangle.point2.y == shape.point2.y && sTriangle.point3.x == shape.point3.x && sTriangle.point3.y == shape.point3.y))
            triangle.selected = true;
            return triangle;
        });
        createShape();
        drawTriangles();
    };
    reader.readAsText(file);
  }
  
  // Function to save selected settings (globals values) to a file
  function saveSettings() {
    const settings = {
      TRIANGLE_SIDE: TRIANGLE_SIDE,
      NUMBER_LIGHT_RAYS: NUMBER_LIGHT_RAYS,
      CORNER_EPS: CORNER_EPS,
      MOUSE_VISIBILITY_BOOL: mouseVisibilityCheckBox.checked,
      PART_BOOL: parseInt(document.getElementById("partitionOnOffInput").value),
      SPEED_TIMES_TEN: SPEED_TIMES_TEN,
      MAG_NUM: parseInt(document.getElementById("magOnOffInput").value),
      MAG_RADIUS: parseFloat(document.getElementById("magBoxRadiusInput").value),
      WALL_COLOR: WALL_COLOR,
      PHOTON_HEAD_COLOR: PHOTON_HEAD_COLOR,
      PHOTON_TAIL_COLOR: PHOTON_TAIL_COLOR,
      MAG_COLOR: MAG_COLOR,
      LIGHT_SOURCE_COLOR: LIGHT_SOURCE_COLOR,
      MAG_POINT_COLOR: MAG_POINT_COLOR,
      HEAD_SIZE: HEAD_SIZE,
      TAIL_SIZE: TAIL_SIZE,
      MAG_HEAD_SIZE: MAG_HEAD_SIZE,
      MAG_TAIL_SIZE: MAG_TAIL_SIZE,
      lightSource: lightSource,
      mag_x1: parseInt(document.getElementById("magBoxXInput1").value),
      mag_y1: parseInt(document.getElementById("magBoxYInput1").value),
      mag_x2: parseInt(document.getElementById("magBoxXInput2").value),
      mag_y2: parseInt(document.getElementById("magBoxYInput2").value),
      mag_x3: parseInt(document.getElementById("magBoxXInput3").value),
      mag_y3: parseInt(document.getElementById("magBoxYInput3").value),
      part_x1: parseInt(document.getElementById("partBoxXInput1").value),
      part_y1: parseInt(document.getElementById("partBoxYInput1").value),
      part_x2: parseInt(document.getElementById("partBoxXInput2").value),
      part_y2: parseInt(document.getElementById("partBoxYInput2").value)
    };
    const data = JSON.stringify(settings);
    const blob = new Blob([data], { type: 'text/plain' });
  
    // Prompt the user to enter a filename
    let filename = prompt("Enter the filename:", "setting.txt");
    if (filename === null || filename.trim() === "") {
      filename = "setting.txt"; // Default filename if user cancels or enters an empty name
    }
  
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
  
  // Function to load selected settings (globals values) from a file
  function loadSettings(file) {
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const setting = JSON.parse(content);
  
        TRIANGLE_SIDE = setting.TRIANGLE_SIDE;
        document.getElementById("triangleSideInput").value = TRIANGLE_SIDE;
        
        NUMBER_LIGHT_RAYS = setting.NUMBER_LIGHT_RAYS;
        document.getElementById("numRaysInput").value = NUMBER_LIGHT_RAYS;
        
        CORNER_EPS = setting.CORNER_EPS;
        document.getElementById("epsilonInput").value = CORNER_EPS;
        
        MOUSE_VISIBILITY_BOOL = setting.MOUSE_VISIBILITY_BOOL;
        if(MOUSE_VISIBILITY_BOOL) {
          mouse_coords.style.display = "inline";
        } else {
          mouse_coords.style.display = "none";
        }
        document.getElementById("mouseVisibilityCheckBox").checked = MOUSE_VISIBILITY_BOOL;
        
        const part_num = setting.PART_BOOL;
        if (part_num === 0) {
          SHOW_PART = false; //Turns Partition/Post off
          // Hides the partition coordinates table:
          partNote.style.visibility = 'hidden';
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
        } else if (part_num === 1) {
          SHOW_PART = true; //Turns Partition/Post on
          // Shows the partition coordinates table:
          partNote.style.visibility = 'visible';
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
        document.getElementById("partitionOnOffInput").value = part_num;
  
        SPEED_TIMES_TEN = setting.SPEED_TIMES_TEN;
        document.getElementById("speedInput").value = SPEED_TIMES_TEN;
  
        const mag_num = setting.MAG_NUM
        for(let i in MAG_LIST) {
          if(i < mag_num) {
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
        if (mag_num === 0) {
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
        } else if (mag_num === 1) {
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
          mag2.style.visibility = 'hidden';
          mag3.style.visibility = 'hidden';
          magBoxXInput1.style.display = 'inline';
          magBoxYInput1.style.display = 'inline';
          magBoxXInput2.style.display = 'none';
          magBoxYInput2.style.display = 'none';
          magBoxXInput3.style.display = 'none';
          magBoxYInput3.style.display = 'none';
        } else if (mag_num === 2) {
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
          mag3.style.visibility = 'hidden';
          magBoxXInput1.style.display = 'inline';
          magBoxYInput1.style.display = 'inline';
          magBoxXInput2.style.display = 'inline';
          magBoxYInput2.style.display = 'inline';
          magBoxXInput3.style.display = 'none';
          magBoxYInput3.style.display = 'none';
        }
        else if (mag_num === 3) {
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
        document.getElementById("magOnOffInput").value = mag_num;
  
        r = setting.MAG_RADIUS;
        MAG_LIST.forEach(MAG => MAG.rescale(r));
        PHOTON_RADIUS = r/(Math.sqrt(2));
        document.getElementById("magBoxRadiusInput").value = r;
  
        WALL_COLOR = setting.WALL_COLOR;
        document.getElementById("wallColorInput").value = WALL_COLOR;
  
        PHOTON_HEAD_COLOR = setting.PHOTON_HEAD_COLOR;
        document.getElementById("photonHeadColorInput").value = PHOTON_HEAD_COLOR;
  
        PHOTON_TAIL_COLOR = setting.PHOTON_TAIL_COLOR;
        document.getElementById("photonTailColorInput").value = PHOTON_TAIL_COLOR;
  
        MAG_COLOR = setting.MAG_COLOR;
        document.getElementById("magnifierColorInput").value = MAG_COLOR;
  
        LIGHT_SOURCE_COLOR = setting.LIGHT_SOURCE_COLOR;
        document.getElementById("lightSourceColorInput").value = LIGHT_SOURCE_COLOR;
  
        MAG_POINT_COLOR = setting.MAG_POINT_COLOR;
        document.getElementById("magnifierPointColorInput").value = MAG_POINT_COLOR;

        HEAD_SIZE = setting.HEAD_SIZE;
        document.getElementById("headSizeInput").value = HEAD_SIZE;
      
        TAIL_SIZE = setting.TAIL_SIZE;
        document.getElementById("tailSizeInput").value = TAIL_SIZE;
      
        MAG_HEAD_SIZE = setting.MAG_HEAD_SIZE;
        document.getElementById("magHeadSizeInput").value = MAG_HEAD_SIZE;
      
        MAG_TAIL_SIZE = srtting.MAG_TAIL_SIZE;
        document.getElementById("magTailSizeInput").value = MAG_TAIL_SIZE;
        
        lightSource = setting.lightSource;
        document.getElementById("lightSourceXInput").value = lightSource.x;
        document.getElementById("lightSourceYInput").value = lightSource.y;
        
        x1 = setting.mag_x1;
        y1 = setting.mag_y1;
        MAG_LIST[0].moveMag(x1,y1);
        x2 = setting.mag_x2;
        y2 = setting.mag_y2;
        MAG_LIST[1].moveMag(x2,y2);
        x3 = setting.mag_x3;
        y3 = setting.mag_y3;
        MAG_LIST[2].moveMag(x3,y3);
        drawTriangles(); // Update canvas with new coordinates
        document.getElementById("magBoxXInput1").value = x1;
        document.getElementById("magBoxXInput1").value = x2;
        document.getElementById("magBoxXInput3").value = x3;
        document.getElementById("magBoxYInput1").value = y1;
        document.getElementById("magBoxYInput1").value = y2;
        document.getElementById("magBoxYInput3").value = y3;
  
        part_x1 = setting.part_x1;
        part_y1 = setting.part_y1;
        part_x2 = setting.part_x2;
        part_y2 = setting.part_y2;
        PARTITIONS = [new LineSegment(part_x1, part_y1, part_x2, part_y2)]
        createShape(); // Update canvas with new coordinates
        document.getElementById("partBoxXInput1").value = part_x1;
        document.getElementById("partBoxXInput2").value = part_x2;
        document.getElementById("partBoxYInput1").value = part_y1;
        document.getElementById("partBoxYInput2").value = part_y2;
  
        TRIANGLES = [];
        SELECTED_TRIANGLES = [];
        createTriangleGrid();
        updateScreen();
    };
    reader.readAsText(file);
  }