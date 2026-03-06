// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)

// Notes for students:
// 1) Add flap control in keyPressed() (space / ↑ to jump)
// 2) Detect collisions between the bird and pipes → game over
// 3) Add scoring when you pass a pipe
// 4) (Stretch) Add start/pause/game-over states

/* ----------------- Globals ----------------- */
let bird;
let pipes = [];
let s = 0;

let spawnCounter = 0; // simple timer
const SPAWN_RATE = 90; // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 2.5;
const PIPE_GAP = 140; // gap height (try 100–160)
const PIPE_W = 60;

/* ----------------- Setup & Draw ----------------- */
function setup() {
  createCanvas(480, 640);
  noStroke();
  bird = new Bird(120, height / 2);
  // Start with one pipe so there's something to see
  pipes.push(new Pipe(width + 40));
}

function draw() {
  background(60, 180, 200);

  // 1a update world
  bird.update();

  // 1b spawn new pipes on a simple timer
  spawnCounter++;
  if (spawnCounter >= SPAWN_RATE) {
    pipes.push(new Pipe(width + 40));
    spawnCounter = 0;
  }

  // update + draw pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    // TODO (students): collision check with bird
    // Hint: call pipes[i].hits(bird) here
    if (pipes[i].hits(bird)) {
      for (let i = 0; i < pipes.length; i++) {
        pipes[i].stop();
      }
    }

    // remove pipes that moved off screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  // 2) draw bird last so it's on top
  bird.show();
  drawScore();
}

//scoring
function drawScore() {
  fill(0);
  textAlign(LEFT);
  textSize(30);
  text("Score: " + s, 20, 40);
}

/* ----------------- Input ----------------- */
function keyPressed() {
  // TODO (students): make the bird flap on space or UP arrow
  // Uncomment the lines below to enable flapping:
  if (key === " " || keyCode === UP_ARROW) {
    bird.flap();
  }
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 16; // for collision + draw
    this.gravity = 0.45; // constant downward force
    this.flapStrength = -8.0; // negative = upward movement
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // instant upward kick (negative velocity = up)
    this.vel.y = this.flapStrength;
  }

  update() {
    // gravity
    this.applyForce(this.gravity);

    // integrate
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // keep inside canvas vertically (simple constraints)
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
      // TODO (students): treat touching the ground as game over
    }
  }

  show() {
    fill(255, 205, 80);
    circle(this.pos.x, this.pos.y, this.r * 2);
    // (Optional) add a small eye
    fill(40);
    circle(this.pos.x + 6, this.pos.y - 4, 4);
  }
}
