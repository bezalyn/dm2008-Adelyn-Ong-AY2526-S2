class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
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
    fill(120, 200, 160);

    rect(this.x, 0, this.w, this.top); // top pipe
    rect(this.x, this.bottom, this.w, height - this.bottom); // bottom pipe
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
   score(bird) {
    const withinX =
      bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}