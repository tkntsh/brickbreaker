// ParticleSystem.js - Visual effects for brick destruction and celebrations
export class Particle {
  constructor(x, y, vx, vy, color, life = 30) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = Math.random() * 3 + 1;
    this.gravity = 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
  }

  draw(ctx) {
    const alpha = this.life / this.maxLife;
    ctx.fillStyle = this.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  createBrickExplosion(brick) {
    const centerX = brick.x + brick.width / 2;
    const centerY = brick.y + brick.height / 2;
    const particleCount = 6;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 3 + 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      
      this.particles.push(new Particle(centerX, centerY, vx, vy, brick.color, 40));
    }
  }

  createScorePopup(x, y, points) {
    this.particles.push({
      x,
      y,
      text: `+${points}`,
      life: 60,
      maxLife: 60,
      vy: -1,
      update() {
        this.y += this.vy;
        this.life--;
      },
      draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
      },
      isDead() {
        return this.life <= 0;
      }
    });
  }

  createLevelCompleteExplosion(canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 5 + 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const colors = ['rgb(255, 51, 51)', 'rgb(255, 153, 51)', 'rgb(51, 255, 51)', 'rgb(51, 153, 255)'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      this.particles.push(new Particle(centerX, centerY, vx, vy, color, 80));
    }
  }

  update() {
    this.particles.forEach(p => p.update());
    this.particles = this.particles.filter(p => !p.isDead());
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    this.particles = [];
  }
}
