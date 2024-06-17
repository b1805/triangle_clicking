// show mouse coordinates
document.getElementById("canvas").onmousemove = (mouseEvent) => {
  const x_coord = document.getElementById("x_coord");
  const y_coord = document.getElementById("y_coord");
  const mouse_coords = document.getElementById("mouse_coords");
  // Set the displayed mouse coords
  x_coord.innerHTML = "X: " + Math.floor(mouseEvent.clientX - canvas.getBoundingClientRect().x);
  y_coord.innerHTML = "Y: " + Math.max(Math.floor(mouseEvent.clientY - canvas.getBoundingClientRect().y),0);
  //mouse_coords.style.position = "fixed";
  mouse_coords.style.left = mouseEvent.clientX + 'px';
  mouse_coords.style.bottom = (window.innerHeight + 17.5 - mouseEvent.clientY) + 'px';
}
