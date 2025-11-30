// PowerUp.js - Power-up drops with effects
export const POWERUP_TYPES = {
  MULTIBALL: { symbol: '●●', color: '#FF3333', duration: 0 },
  EXTEND: { symbol: '▬▬', color: '#33FF33', duration: 600 },
  SLOW: { symbol: '◐', color: '#3399FF', duration: 480 },
  FAST: { symbol: '◈', color: '#FF9933', duration: 360 },
  EXTRA_LIFE: { symbol: '♥', color: '#FF33FF', duration: 0 }
};

export class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.data = POWERUP_TYPES[type];
    this.radius = 8;
    this.dy = 2; // Fall speed
    this.sparkles = [];
    this.collected = false;
  }

  update() {
    this.y += this.dy;

    // Create sparkle trail
    if (Math.random() < 0.3) {
      this.sparkles.push({
        x: this.x + (Math.random() - 0.5) * 10,
        y: this.y + (Math.random() - 0.5) * 10,
        life: 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }

    // Update sparkles
    this.sparkles = this.sparkles.filter(s => {
      s.x += s.vx;
      s.y += s.vy;
      s.life--;
      return s.life > 0;
    });
  }

  draw(ctx) {
    // Draw sparkles
    this.sparkles.forEach(s => {
      const alpha = s.life / 20;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.fillRect(s.x, s.y, 2, 2);
    });

    // Draw power-up circle
    ctx.fillStyle = this.data.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.data.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw symbol
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.data.symbol, this.x, this.y);
  }

  checkPaddleCollision(paddle) {
    const paddleBounds = paddle.getBounds();
    return (
      this.y + this.radius >= paddleBounds.top &&
      this.y - this.radius <= paddleBounds.bottom &&
      this.x >= paddleBounds.left &&
      this.x <= paddleBounds.right
    );
  }
}
