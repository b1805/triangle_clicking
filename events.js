let draggable = false;
let offsetX = 0;
let offsetY = 0;
// Calculate offset to drag the magnification canvas
mag_canvas_list.forEach(mag_canvas => 
  mag_canvas.onmousedown = (mouseEvent) => {
    draggable = true;
    offsetX = mouseEvent.offsetX;
    offsetY = mouseEvent.offsetY;
  }
);
// Stop dragging when mouse released
document.onmouseup = (mouseEvent) => {
  draggable = false;
}
// Change mag_canvas coords
document.onmousemove = (mouseEvent) => {
  let x = mouseEvent.pageX - offsetX;
  let y = mouseEvent.pageY - offsetY;
  if(!draggable) return;
  document.getElementById("mag_viewer").style.left = x + 'px';
  document.getElementById("mag_viewer").style.top = y + 'px';

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
canvas.onmouseleave = (mouseEvent) => {
  const mouse_coords = document.getElementById("mouse_coords");
  mouse_coords.style.visibility = "hidden";
}

// Show coords when mouse enters canvas
canvas.onmouseenter = (mouseEvent) => {
  const mouse_coords = document.getElementById("mouse_coords");
  mouse_coords.style.visibility = "visible";
}

