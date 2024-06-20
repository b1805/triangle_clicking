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

let draggable = null;
let offsetX = 0;
let offsetY = 0;
// Calculate offset to drag the magnification canvas
MAG_DIV_LIST.forEach(mag_div => {
    mag_div.onmousedown = (event) => {
      draggable = mag_div;
      console.log("Pointer Down");
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    }
  }
);

// Stop dragging when mouse released
document.onmouseup = () => {
  console.log("Pointer Up");
  draggable = null;
}

// Change mag_canvas coords
document.onmousemove = (event) => {
  let x = event.pageX - offsetX;
  let y = event.pageY - offsetY;
  if(draggable == null) return;
  draggable.style.left = x + 'px';
  draggable.style.top = y + 'px';
}

// show mouse coordinates
canvas.onmousemove = (mouseEvent) => {
  const x_coord = document.getElementById("x_coord");
  const y_coord = document.getElementById("y_coord");
  const mouse_coords = document.getElementById("mouse_coords");
  // Set the displayed mouse coords
  /*
  x_coord.innerHTML = "X: " + Math.floor(mouseEvent.clientX - canvas.getBoundingClientRect().x);
  y_coord.innerHTML = "Y: " + Math.max(Math.floor(mouseEvent.clientY - canvas.getBoundingClientRect().y),0);
  */
  x_coord.innerHTML = "X: " + Math.max(Math.floor(mouseEvent.offsetX),0);
  y_coord.innerHTML = "Y: " + Math.max(Math.floor(mouseEvent.offsetY),0);
  //mouse_coords.style.position = "fixed";
  mouse_coords.style.left = mouseEvent.clientX + 'px';
  mouse_coords.style.bottom = (window.innerHeight + 17.5 - mouseEvent.clientY) + 'px';
}

// Hide coords when mouse leaves canvas
canvas.onmouseleave = () => {
  const mouse_coords = document.getElementById("mouse_coords");
  mouse_coords.style.visibility = "hidden";
}

// Show coords when mouse enters canvas
canvas.onmouseenter = () => {
  const mouse_coords = document.getElementById("mouse_coords");
  mouse_coords.style.visibility = "visible";
}