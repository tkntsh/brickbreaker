// Brick.js - Individual brick with color-coded points
export class Brick {
  constructor(x, y, color, points) {
    this.x = x;
    this.y = y;
    this.width = 45;
    this.height = 15;
    this.color = color;
    this.points = points;
    this.destroyed = false;
  }

  hit() {
    this.destroyed = true;
  }

  getBounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  draw(ctx) {
    if (this.destroyed) return;

    // Main brick
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Border for pixelated look
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    // Highlight for 3D effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(this.x + 2, this.y + 2, this.width - 4, 3);

    // Shadow for 3D effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(this.x + 2, this.y + this.height - 5, this.width - 4, 3);
  }
}

// Brick color and point mappings
export const BRICK_TYPES = {
  RED: { color: '#FF3333', points: 25 },
  ORANGE: { color: '#FF9933', points: 50 },
  GREEN: { color: '#33FF33', points: 75 },
  BLUE: { color: '#3399FF', points: 100 }
};
