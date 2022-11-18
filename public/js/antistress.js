(() => {
  const config = {
    dotMinRad: 5,
    dotMaxRad: 20,
    sphereRad: 400,
    bigDotRad: 25,
    mouseSize: 160,
    massFactor: 0.002,
    defColor: 'rgba(69, 32, 171, 0.9)',
    smooth: 0.75,
  };

  const TWO_PI = 2 * Math.PI;
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  let w; let h; let mouse; let
    dots;

  class Dot {
    constructor(r) {
      this.pos = { x: mouse.x, y: mouse.y };
      this.vel = { x: 0, y: 0 };
      this.rad = r || random(config.dotMinRad, config.dotMaxRad);
      this.mass = this.rad * config.massFactor;
      this.color = config.defColor;
    }

    draw(x, y) {
      this.pos.x = x || this.pos.x + this.vel.x;
      this.pos.y = y || this.pos.y + this.vel.y;
      createCircle(this.pos.x, this.pos.y, this.rad, true, this.color);
      createCircle(this.pos.x, this.pos.y, this.rad, false, config.defColor);
    }
  }

  function updateDots() {
    for (let i = 0; i < dots.length; i++) {
      const acc = { x: 0, y: 0 };

      for (let j = 0; j < dots.length; j++) {
        if (i == j) continue;
        const [a, b] = [dots[i], dots[j]];

        const delta = { x: b.pos.x - a.pos.x, y: b.pos.y - a.pos.y };
        const dist = Math.sqrt(delta.x * delta.x + delta.y * delta.y) || 1;
        let force = (dist - config.sphereRad) / dist * b.mass;

        if (j == 0) {
          const alpha = config.mouseSize / dist;
          a.color = `rgba(41, 237, 255, ${alpha})`;

          dist < config.mouseSize ? force = (dist - config.mouseSize) * b.mass : force = a.mass;
        }

        acc.x += delta.x * force;
        acc.y += delta.y * force;
      }

      dots[i].vel.x = dots[i].vel.x * config.smooth + acc.x * dots[i].mass;
      dots[i].vel.y = dots[i].vel.y * config.smooth + acc.y * dots[i].mass;
    }

    dots.map((e) => (e == dots[0] ? e.draw(mouse.x, mouse.y) : e.draw()));
  }

  function createCircle(x, y, rad, fill, color) {
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, TWO_PI);
    ctx.closePath();
    fill ? ctx.fill() : ctx.stroke();
  }

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function init() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;

    mouse = { x: w / 2, y: h / 2, down: false };
    dots = [];

    dots.push(new Dot(config.bigDotRad));
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);

    if (mouse.down) { dots.push(new Dot()); }
    updateDots();

    window.requestAnimationFrame(loop);
  }

  function line(x, y, x2, y2) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  init();
  loop();

  function setPos({ layerX, layerY }) {
    [mouse.x, mouse.y] = [layerX, layerY];
  }

  function isDown() {
    mouse.down = !mouse.down;
  }

  canvas.addEventListener('mousemove', setPos);
  window.addEventListener('mousedown', isDown);
  window.addEventListener('mouseup', isDown);
})();
