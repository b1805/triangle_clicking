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

// The magnifier
class Magnifier {
  constructor(mag, magSide, magViewSide, ctx) {
    this.mag = mag;
    this.calculate = true;
    this.ctx = ctx;
    this.magSide = magSide;
    this.magViewSide = magViewSide;
    this.magView = [magViewSide/2, magViewSide/2];
    // Scale factor and translation to map vectors on the canvas to the larger virtual canvas of the magnified image
    this.scale = magViewSide/magSide; 
    this.translation = new Vector(this.magView[0] - this.scale * this.mag[0], this.magView[1] - this.scale * this.mag[1]);
    this.magBox = [
      [mag[0] - magSide / 2, mag[1] - magSide / 2],
      [mag[0] - magSide / 2, mag[1] + magSide / 2],
      [mag[0] + magSide / 2, mag[1] + magSide / 2],
      [mag[0] + magSide / 2, mag[1] - magSide / 2],
    ];
  }

  rescale(magSide) {
    this.magSide = magSide;
    this.scale = this.magViewSide/this.magSide; 
    this.translation = new Vector(this.magView[0] - this.scale * this.mag[0], this.magView[1] - this.scale * this.mag[1]);
    this.magBox = [
      [this.mag[0] - this.magSide / 2, this.mag[1] - this.magSide / 2],
      [this.mag[0] - this.magSide / 2, this.mag[1] + this.magSide / 2],
      [this.mag[0] + this.magSide / 2, this.mag[1] + this.magSide / 2],
      [this.mag[0] + this.magSide / 2, this.mag[1] - this.magSide / 2],
    ];
  }
  // Change the location of the magBox
  moveMag(x, y) {
    this.mag = [x, y];
    this.translation = new Vector(this.magView[0] - this.scale * this.mag[0], this.magView[1] - this.scale * this.mag[1]);
    this.magBox = [
      [this.mag[0] - this.magSide / 2, this.mag[1] - this.magSide / 2],
      [this.mag[0] - this.magSide / 2, this.mag[1] + this.magSide / 2],
      [this.mag[0] + this.magSide / 2, this.mag[1] + this.magSide / 2],
      [this.mag[0] + this.magSide / 2, this.mag[1] - this.magSide / 2],
    ];
  }

  // Map a position vector to the magnified virtual canvas
  map(pos) {
    return pos.mult(this.scale).add(this.translation);
  }

  // Mark the center of the magnification box.
  drawCenter(color = MAG_POINT_COLOR, radius = 3) {
    if(!this.calculate) return;
    this.ctx.beginPath();
    this.ctx.fillStyle = color; 
    this.ctx.arc(this.magViewSide / 2, this.magViewSide / 2, radius, 0, 2 * Math.PI);
    this.ctx.fill();

  }

  // Draw a line from the main canvas onto the magnified canvas
  drawLine(x1, y1, x2, y2, color, width = 100) {
    if(!this.calculate) return;
    // Map coordinates
    const pos1 = this.map(new Vector(x1, y1));
    const pos2 = this.map(new Vector(x2, y2));
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = Math.max(width,1);
    this.ctx.moveTo(pos1.x, pos1.y);
    this.ctx.lineTo(pos2.x, pos2.y);
    this.ctx.stroke();
    this.ctx.lineWidth = 0.5;
  }
    
  // Light source and photon head
  drawCircle(x, y, radius, color) {
    if(!this.calculate) return;
    const pos = this.map(new Vector(x, y));
    this.ctx.beginPath();
    this.ctx.fillStyle = color; 
    this.ctx.arc(pos.x, pos.y, Math.max(radius,1.5), 0, 2 * Math.PI);
    this.ctx.fill();
  }

  clearCanvas(BACKGROUND_COLOR) {
    this.ctx.clearRect(0, 0, this.magViewSide, this.magViewSide);
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, this.magViewSide, this.magViewSide);
  }

  // Maps the trangle grid to the magnifier
  drawTriangles(triangles, BACKGROUND_COLOR, WALL_COLOR) {
    this.ctx.lineWidth = 0.5
    this.ctx.strokeStyle = WALL_COLOR;
    triangles.forEach(triangle => {
      // Mat the coordinates of the vertices in the original grid to the magnifier
      const p1 = this.map(new Vector(triangle.point1.x, triangle.point1.y));
      const p2 = this.map(new Vector(triangle.point2.x, triangle.point2.y));
      const p3 = this.map(new Vector(triangle.point3.x, triangle.point3.y));
      let path = new Path2D();
      path.moveTo(p1.x, p1.y);
      path.lineTo(p2.x, p2.y);
      path.lineTo(p3.x, p3.y);
      path.closePath();
      if (triangle.selected) {
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'black';
        this.ctx.fill(path);
      }
      if(BACKGROUND_COLOR == "#000000") this.ctx.globalAlpha = 0.0; // To remove the grid lines while recording
      this.ctx.stroke(path);
      this.ctx.strokeStyle = WALL_COLOR;
      this.ctx.globalAlpha = 1; // Change it to default after done
    });
    this.drawCenter();
  }
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.mag = Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    this.norm = Math.hypot(x, y);
    this.angle = Math.atan(y / x);
  }

  // Returns the cross product with another vector.
  cross(other) {
      return this.x * other.y - other.x * this.y;
  }

  // Returns the dot product with another vector.
  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  // Projects this vector onto another vector.
  projOnto(other) {
    return other.mult(this.dot(other) / (other.norm * other.norm));
  }

  // Returns the angle between this vector and another vector.
  angle(other) {
    return Math.acos(this.dot(other) / (this.norm * other.norm));
  }

  // Negates this vector.
  negate() {
    return new Vector(-this.x, -this.y);
  }

  // Adds this vector to another vector.
  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  // Subtracts another vector from this vector.
  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  // Multiplies this vector by a scalar.
  mult(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }
}

// Represents a line segment in 2D space
class LineSegment {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.dx = x2 - x1;
    this.dy = y2 - y1;
    this.length = Math.hypot(this.dx, this.dy); // The segment's length.
    this.normal = new Vector(-this.dy, this.dx); // A surface normal vector.
    this.normal = this.normal.mult(this.normal.norm);
    this.lastBounce = -1; // ID of the last reflected wall.
  }

  equals(line2) {
    if(line2 == null) {
      return false;
    }
    let one = this.x1 == line2.x1 && this.x2 == line2.x2 && this.y1 == line2.y1 && this.y2 == line2.y2;
    let two = this.x1 == line2.x2 && this.x2 == line2.x1 && this.y1 == line2.y2 && this.y2 == line2.y1;
    return (one || two);
  }

  merge(line2) {
    if(this.equals(line2) || (this.dy * line2.dx != line2.dy * this.dx)) {
      return false
    };
    if (this.x1 == line2.x1 && this.y1 == line2.y1) {
      return new LineSegment(line2.x2, line2.y2, this.x2, this.y2)
    }
    else if (this.x2 == line2.x2 && this.y2 == line2.y2){
      return new LineSegment(line2.x1, line2.y1, this.x1, this.y1)
    }
    else if (this.x1 == line2.x2 && this.y1 == line2.y2){
      return new LineSegment(line2.x1, line2.y1, this.x2, this.y2)
    }
    else if (this.x2 == line2.x1 && this.y2 == line2.y1){
      return new LineSegment(line2.x2, line2.y2, this.x1, this.y1)
    }
    return false
  }
}

// Represents a photon (light 'particle' that bounces around the room)
//
// Parameters:
//   - x: Number, the current x-position.
//   - y: Number, the current y-position.
//   - dir: Number, the current direction we are travelling in, in radians.
//   - collisionRadius: Number, the distance at which the centre of the photon
//                      must be from a line segment for a collision to occur.
//
class Photon {
  constructor(x, y, dir, speed, headColor, tailColor) {
    this.x = x;
    this.y = y;
    this.vecDir = new Vector(speed * Math.cos(dir), speed * Math.sin(dir));
    this.vecDirRemaining = this.vecDir;
    this.speed = speed;
    //this.collisionRadius = collisionRadius;
    this.headColor = headColor;
    this.tailColor = tailColor;
    this.contactPoints = new Array();
    this.contactPoints.push([this.x, this.y]);
    this.lastLineCollided = null;
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  updatePosition() {
    if (this.active) {
      this.x += this.vecDirRemaining.x;
      this.y += this.vecDirRemaining.y;
      // Reset the velocity vector
      this.vecDirRemaining = this.vecDir;
    }
  }

  // Raycast the photon forward to see if it will intersect with a line segment this frame
  checkCollision(line) {
    //console.log("Photon coords: x =", this.x, "y =", this.y);
    //console.log("checking for intersection with ");
    //console.log(line);
    if(!this.active) {
      return null;
    }
    if(line != null) { // Not the first collision
      if(line.equals(this.lastLineCollided)) { // It is impossible to collide with the same line segment twice in a row
        return null;
      }
    }
    const edge_eps = 0.00000001;
    //const corner_eps = 0.01
    //console.log(corner_eps)
    const a = new Vector(line.x1, line.y1); // Position Vector of line segment
    const b = new Vector(line.dx, line.dy); // Direction Vector of line segment (a + b is the other endpoint)
    const p = new Vector(this.x, this.y); // Position Vector of photon
    const v = this.vecDirRemaining; // Direction Vector of photon
    const aSUBp = a.sub(p);

    // We treat line segments of length 0 as points.
    if(b.mag == 0) {
      const proj = aSUBp.projOnto(v);
      const ortho = aSUBp.sub(proj);
      const s = proj.mag;
      const t = ortho.mag; // Distance point is from the line that is the trajectory of the photon
      if(s < 0 - edge_eps || s > 1 + edge_eps) {
          return null;
      }
      if(Math.abs(t) > CORNER_EPS) {
          return null;
      }
      return {
          l : line,
          intersection : a,
          photonScalar : s,
          lineScalar : t,
          onCorner : true 
      }
    }

    const vCROSSb = v.cross(b); 
    //console.log("vCROSSb =",vCROSSb);
    if(0 - edge_eps <= vCROSSb && vCROSSb <= 0 + edge_eps) {
        return null;
    }
    const s = aSUBp.cross(b) / vCROSSb;  
    const t = aSUBp.cross(v) / vCROSSb;  
    //console.log("s =", s);
    //console.log("t =", t);
    if(s < 0 - edge_eps || s > 1 + edge_eps) {
        return null;
    }
    if(t <= 0 - edge_eps || t >= 1 + edge_eps) {
        return null;
    }
    let oc = false;
    if((0 - CORNER_EPS < t && t < CORNER_EPS + 0) || (1 - CORNER_EPS < t && t < CORNER_EPS + 1)) {
        oc = true;
    }
    return {
        l : line,
        intersection : p.add(v.mult(s)),
        photonScalar : s,
        lineScalar : t,
        onCorner : oc
    }
  }

  // Recalculates the direction of the photon based on the normal vector to a
  // line segment.
  bounceOffSegment(collision) {
    if (!this.active) {
      this.x = collision.intersection.x;
      this.y = collision.intersection.y;
      return;
    }
    const line = collision.l;
    // Mark this line, so we don't reflect off of it multiple times
    this.lastLineCollided = line;
    // Distance from photon to line segment
    const preReflectionVector = new Vector(collision.intersection.x - this.x, collision.intersection.y - this.y);
    //console.log("preReflectionVector.mag =", preReflectionVector.mag);
    this.x = collision.intersection.x;
    this.y = collision.intersection.y;
    // Calculate the reflection vector after having reached the line segment
    this.vecDirRemaining = this.vecDirRemaining.sub(preReflectionVector);
    const normalProj = this.vecDirRemaining.projOnto(line.normal);
    const parallelProj = this.vecDirRemaining.sub(normalProj);
    this.vecDirRemaining = parallelProj.sub(normalProj);
    // Also reflect the reference velocity vector
    const normalProjRef = this.vecDir.projOnto(line.normal);
    const parallelProjRef = this.vecDir.sub(normalProjRef);
    this.vecDir = parallelProjRef.sub(normalProjRef);
    this.contactPoints.push([this.x, this.y]);
  }
}