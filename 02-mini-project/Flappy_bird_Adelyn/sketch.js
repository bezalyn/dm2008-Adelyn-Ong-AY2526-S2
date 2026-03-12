// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)

// Notes for students:
// 1) Add flap control in keyPressed() (space / ↑ to jump)
// 2) Detect collisions between the bird and pipes → game over
// 3) Add scoring when you pass a pipe
// 4) (Stretch) Add start/pause/game-over states

/* ----------------- Globals ----------------- */
let gameOver = false;
let gameStart = false;

let bird;
let stars = [];
let pipes = [];
let score = 0;

let fadeAlpha = 0;
let rainbow = ["#FF055A", "#91A000", "#03A30A", "#4706D8"];
let currentIndex = 0;
let angle = 0;
let scroll = 0;

let spawnCounter = 0; // simple timer
const SPAWN_RATE = 90; // ~ every 90 frames at 60fps ≈ 1.5s
const PIPE_SPEED = 2.5;
const PIPE_GAP = 140; // gap height (try 100–160)
const PIPE_W = 60;

let flapSound;
let deadSound;
let bgMusic;
let font;

function preload() {
  ufo = loadImage("ufo.png");
  bg = loadImage("spacebg.png");
  me = loadImage("surfing2.png");

  //sound
  flapSound = loadSound("flap.mp3");
  bgMusic = loadSound("bgmusic.mp3");
  deadSound=loadSound("dead.mp3");

  //style
  font = loadFont("alien.otf");
}

/* ----------------- Setup & Draw ----------------- */
function setup() {
  createCanvas(480, 640);
  noStroke();
  angleMode(DEGREES);
  textFont(font);
  bgMusic.loop();

  bird = new Bird(120, height / 2);
  pipes.push(new Pipe(width + 40));
  for (let i = 0; i < 100; i++) {
    stars.push(new Star(random(width), random(height), random(1, 4)));
  }
}
//----------------------DRAW--------------------//
function draw() {
  background(0);

  scroll += -0.2;
  push();
  tint(120);
  image(bg, scroll, 0, 853, 640);
  pop();

  // 1a update world
  bird.update();

  // 1b spawn new pipes on a simple timer
  spawnCounter++;
  if (spawnCounter >= SPAWN_RATE) {
    pipes.push(new Pipe(width + 40));
    spawnCounter = 0;
  }

  //drawstars
  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
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
      gameOver = true;
    }

    if (pipes[i].updateScore(bird)) {
      score++;
    }

    // remove pipes that moved off screen
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }

    fill(200, 0, 255);
    textSize(48);
    textAlign(CENTER, CENTER);

    strokeJoin("round");
    text(score, width / 2, height / 8);
  }

  if (gameOver) {
    fadeAlpha += 1;
    fadeAlpha = min(fadeAlpha, 150);
    fill(255, 0, 0, fadeAlpha);
    rect(0, 0, width, height);
    textAlign(CENTER);
    push();
    stroke(200, 255, 0);
    strokeWeight(11);
    strokeJoin("round");

    textSize(63);
    fill(0);
    text("GAME ", width / 2, height / 2 - 65);
    text("over ", width / 2, height / 2);

    pop();

    textSize(25);
    fill(255);
    text("hit [R] to Retry", width / 2, height / 2 + 50);

  }

  bird.show();
}

/* ----------------- Input ----------------- */
function reset() {
  score = 0;
  scroll = 0;
  dead = false;
  deathTimer = 0;
  gameOver = false;
  gameStart = false;
  fadeAlpha = 0;
  pipes = [];
  spawnCounter = 0;
  bird = new Bird(140, height / 2);
  pipes.push(new Pipe(width + 30));
}
function keyPressed() {
  // TODO (students): make the bird flap on space or UP arrow
  // Uncomment the lines below to enable flapping:
  currentIndex++;
  if (currentIndex >= rainbow.length) {
    currentIndex = 0;
  }
  if (key === " " || keyCode === UP_ARROW) {
    bird.flap();
    flapSound.play();
  }
  if ((gameOver && key === "R") || key === "r") {
            deadSound.play();
 reset();
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
    this.angle = 0;
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // instant upward kick (negative velocity = up)
    this.vel.y = this.flapStrength;
    this.angle = -10;
  }

  update() {
    // gravity
    this.applyForce(this.gravity);
    this.angle = this.angle - 1;

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
    push();
    imageMode(CENTER);
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(200, 255, 100);
    ellipse(0, 4, random(10, 50));
    image(me, 0, -55, 1738 * 0.04, 1879 * 0.04);
    image(ufo, 0, 0, 130, 130);

    pop();
  }
}
//the class for stars
class Star {
  constructor(x, y, sz) {
    this.x = x;
    this.y = y;
    this.sz = sz;
  }
  show() {
    noStroke();
    fill(200, 255, 0);
    ellipse(this.x + scroll, this.y, this.sz);
  }
}
class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.h = random(0, 400);
    this.speed = PIPE_SPEED;
    this.highlight = false;

    // randomize gap position
    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);

    this.top = gapY; // bottom of top pipe
    this.bottom = gapY + PIPE_GAP; // top of bottom pipe

    this.passed = false; // for scoring once per pipe
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    stroke(0);
    strokeWeight(2);
    fill(rainbow[currentIndex]);
    rect(this.x, 0, this.w, this.top); // top pipe
    rect(this.x, this.bottom, this.w, height - this.bottom); // bottom pipe
    rect(this.x - 10, this.top, this.w + 20, 30); //bevel
    rect(this.x - 10, this.bottom, this.w + 20, 30); //bevel
  }

  stop() {
    this.speed = 0;
  }

  offscreen() {
    // look at MDN to understand what 'return' does
    // we will learn more about this in Week 6
    return this.x + this.w < 0;
  }

  // TODO (students): Uncomment this collision detection method
  // Circle-rect collision check (simple version)
  // 1) Check if bird is within pipe's x range
  // 2) If yes, check if bird.y is outside the gap (above top OR below bottom)
  //
  hits(bird) {
    const withinX =
      bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
  updateScore(bird) {
    if (this.passed == false && bird.pos.x > this.x + this.w) {
      this.passed = true;
      return true;
    }
    return false;
  }
}
