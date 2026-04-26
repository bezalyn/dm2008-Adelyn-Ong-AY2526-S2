//variables

let capture;


let rains = [];
let showCircle = false;
let g = 10;




let lastTime = 0; // stores when we last added a static raindrop
let interval = 100;

function setup() {
  createCanvas(800, 800);
  

  
  
  rains.push(new Rain(random(width), random(height), random(10, 20)));

  for (let i = 0; i < 50; i++) {
    // create 100 rains
    rains.push(new Rain(random(width), random(height), random(10, 20)));
  }
}

function draw() {

  
  background(200,20);
  

  for (let i = 0; i < rains.length; i++) {
    rains[i].show();
    rains[i].update();
    rains[i].move();
  }

  handleCollisions(rains);

  if (showCircle) {
    for (let i = 0; i < rains.length; i++) {
      let d = dist(mouseX, mouseY, rains[i].pos.x, rains[i].pos.y);

      let r = rains[i].sz/2;

      //if collide, mouse gains size based off collided drops, then rain starts back at top
     if (d < r + g / 2) {
    g += rains[i].sz * 0.1; // grow based on size (more visible)

    rains[i].pos.set(random(width), -20); // recycle properly
  }
      
    }

   //shadow
    fill(0, 0, 0);
    ellipse(mouseX - 2, mouseY + 10, g + 20);
    //body
    fill(200);
    ellipse(mouseX, mouseY, g + 18);
    //highlight
    fill(255);
    ellipse(mouseX + 4, mouseY - 5, g);
    
    fill(200);
    ellipse(mouseX - 5, mouseY, g + 10);
    
  }
   background(220,20);
 
}

function mousePressed() {
  showCircle = true;
  g = 10;

}

//---------------------------

class Rain {
  constructor(x, y, sz) {
    this.x = x;
    this.y = y;
    this.sz = sz;
    this.wind = random(0, 0.005);

    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.pos = createVector(x, y);
    this.r = 16; // for collision + draw

    this.isStatic = random(1) < 0.3;

    this.gravity = this.isStatic ? 0 : map(this.sz, 2, 16, 0.01, 0.06);
  }

  show() {
    push();
    noStroke();

    //shadow
    fill(0, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.sz);
    //body
    

    fill(200);
    ellipse(this.pos.x, this.pos.y - 5, this.sz + 1);
 

    
    //highlight
    fill(255);
    ellipse(this.pos.x + 3, this.pos.y - 5, 5);
    
  }

  move() {
    if (!this.isStatic) {
      this.pos.x += random(-2, 4);
    } else {
      this.pos.x = this.pos.x + random(-0.1, 0.1);
    }
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  update() {
    // gravity
    this.applyForce(this.gravity);

    // integrate
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    //reset
    if (this.pos.y > height) {
      this.pos.y = random(-50, 0); // start slightly above screen
      this.pos.x = random(width); // new random x position
      this.sz = random(10, 20);
      this.vel.y = 0; // reset falling speed
    }
  }
}

//--------------------------------------------------------end ofclass

//Make a function to detect collision
// let i be a variable, if  the variable is more or equals to 0, the index gets moved down.
function handleCollisions(rains) {
  for (let i = rains.length - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      let r1 = rains[i];
      let r2 = rains[j];

      if (!r1 || !r2) continue; // safety check

      let d = dist(r1.pos.x, r1.pos.y, r2.pos.x, r2.pos.y);

      if (d < (r1.sz + r2.sz) / 2) {
        // they overlap
        // merge sizes based on area
        let area1 = PI * sq(r1.sz / 2);
        let area2 = PI * sq(r2.sz / 2);
        let newArea = area1 + area2;
        r1.sz = sqrt(newArea / PI) * 2;

        // // if either drop is static, make it fall
        // if (r1.isStatic) r1.isStatic = false;
        // if (r2.isStatic) r2.isStatic = false;

        // optional: average velocities
        r1.vel.add(r2.vel).div(2);

        // remove r2 safely
        rains.splice(j, 1);

        let sz = random(6, 15);
        let x = random(width);
        let y = random(height / 2);
        rains.push(new Rain(x, y, sz, true));
        rains[rains.length - 1].vel = createVector(0, 0);
      }
    }
  }
}
