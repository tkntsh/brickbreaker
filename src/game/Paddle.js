// Paddle.js - Player paddle with keyboard/mouse/touch controls
export class Paddle {
  constructor(canvas) {
    console.log('🎮 Paddle constructor called');
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
    
    this.canvas = canvas;
    this.width = 75;
    this.height = 10;
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - 30;
    this.speed = 8;
    this.targetX = this.x;
    this.extended = false;
    this.extendTimer = 0;
    this.normalWidth = 75;
this.extendedWidth = 112; // +50%
    
    console.log('Paddle initialized - x:', this.x, 'y:', this.y);
    
    // Validate paddle position
    if (isNaN(this.x) || isNaN(this.y)) {
      console.error('⚠️ PADDLE POSITION IS NaN!');
      console.error('Canvas width:', canvas.width, 'Canvas height:', canvas.height);
      // Force valid position
      this.x = 200;
      this.y = 330;
      console.log('Using fallback paddle position:', this.x, this.y);
    }
  }

  moveLeft() {
    this.targetX = Math.max(0, this.x - this.speed);
  }

  moveRight() {
    this.targetX = Math.min(this.canvas.width - this.width, this.x + this.speed);
  }

  moveTo(x) {
    this.targetX = Math.max(0, Math.min(this.canvas.width - this.width, x - this.width / 2));
  }

  extend() {
    this.extended = true;
    this.width = this.extendedWidth;
    this.extendTimer = 10 * 60; // 10 seconds at 60fps
  }

  update() {
    // Smooth movement
    this.x += (this.targetX - this.x) * 0.3;

    // Handle extend power-up timer
    if (this.extended) {
      this.extendTimer--;
      if (this.extendTimer <= 0) {
        this.extended = false;
        this.width = this.normalWidth;
      }
    }
  }

  draw(ctx) {
    // Draw paddle with slight gradient for depth
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, '#FFFFFF');
    gradient.addColorStop(1, '#CCCCCC');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Phosphor glow effect
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.shadowBlur = 0;
  }

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }
}
