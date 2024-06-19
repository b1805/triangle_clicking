let draggable = null;
let offsetX = 0;
let offsetY = 0;
// Calculate offset to drag the magnification canvas
MAG_DIV_LIST.forEach(mag_div => {
    mag_div.ontouchstart = (event) => {
      draggable = mag_div;
      console.log("Pointer Down");
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    }
  }
);
// Stop dragging when mouse released
document.ontouchend = () => {
  console.log("Pointer Up");
  draggable = null;
}

// Change mag_canvas coords
document.ontouchmove = (event) => {
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
