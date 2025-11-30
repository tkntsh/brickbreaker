// Ball.js - Ball physics and collision detection
export class Ball {
  constructor(canvas, paddle) {
    this.canvas = canvas;
    this.paddle = paddle;
    this.radius = 4; // 8px diameter
    this.baseSpeed = 3.0;
    this.speedMultiplier = 1.0;
    console.log('⚽ Ball constructor - baseSpeed:', this.baseSpeed, 'speedMultiplier:', this.speedMultiplier);
    
    this.trailPositions = [];
    this.maxTrailLength = 10;
    
    this.reset();
  }

  reset() {
    console.log('🔄 Ball.reset() called');
    console.log('Paddle state:', this.paddle ? `y=${this.paddle.y}, width=${this.paddle.width}` : 'UNDEFINED');
    console.log('Canvas:', this.canvas.width, this.canvas.height);
    console.log('BEFORE calculation - baseSpeed:', this.baseSpeed, 'speedMultiplier:', this.speedMultiplier);
    
    // Ensure baseSpeed is valid
    if (typeof this.baseSpeed !== 'number' || isNaN(this.baseSpeed)) {
      console.error('⚠️ baseSpeed is invalid:', this.baseSpeed, '- forcing to 3.0');
      this.baseSpeed = 3.0;
    }
    if (typeof this.speedMultiplier !== 'number' || isNaN(this.speedMultiplier)) {
      console.error('⚠️ speedMultiplier is invalid:', this.speedMultiplier, '- forcing to 1.0');
      this.speedMultiplier = 1.0;
    }
    
    // Ensure paddle exists and has valid position
    if (!this.paddle || typeof this.paddle.y !== 'number' || isNaN(this.paddle.y)) {
      console.error('⚠️ PADDLE INVALID! Using fallback position');
      this.x = this.canvas.width / 2;
      this.y = this.canvas.height - 50; // Fallback position
    } else {
      this.x = this.canvas.width / 2;
      this.y = this.paddle.y - this.radius - 5;
    }
    
    // Random angle between -60 and -120 degrees (upward)
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
    const speed = this.baseSpeed * this.speedMultiplier;
    console.log('Calculated - angle:', angle, 'speed:', speed);
    this.dx = Math.cos(angle) * speed;
    this.dy = Math.sin(angle) * speed;
    console.log('After calculation - dx:', this.dx, 'dy:', this.dy);
    
    // Validate velocity
    if (isNaN(this.dx) || isNaN(this.dy)) {
      console.error('⚠️ VELOCITY IS NaN! Using default');
      this.dx = 0;
      this.dy = -this.baseSpeed;
    }
    
    this.attached = true;
    console.log('Ball reset - position:', this.x, this.y, 'velocity:', this.dx, this.dy, 'attached:', this.attached);
  }

  launch() {
    console.log('🚀 Ball.launch() called');
    console.log('Before launch - attached:', this.attached, 'position:', this.x, this.y);
    console.log('Before launch - velocity:', this.dx, this.dy);
    this.attached = false;
    console.log('After launch - attached:', this.attached);
    console.log('Ball launched with velocity:', this.dx, this.dy);
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    const currentSpeed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    const newSpeed = this.baseSpeed * multiplier;
    this.dx = (this.dx / currentSpeed) * newSpeed;
    this.dy = (this.dy / currentSpeed) * newSpeed;
  }

  update(bricks, powerUps) {
    if (this.attached) {
      // Follow paddle when attached - with NaN protection
      if (!this.paddle || typeof this.paddle.y !== 'number' || isNaN(this.paddle.y)) {
        console.error('⚠️ PADDLE INVALID during update!');
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 50;
      } else {
        this.x = this.paddle.x + this.paddle.width / 2;
        this.y = this.paddle.y - this.radius - 5;
      }
      
      // Validate position
      if (isNaN(this.x) || isNaN(this.y)) {
        console.error('⚠️ POSITION IS NaN after paddle follow! Resetting...');
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 50;
      }
      
      return { bricksHit: [], powerUpCollected: null, ballLost: false };
    }

    console.log('⚽ Ball update - position:', this.x.toFixed(1), this.y.toFixed(1), 'velocity:', this.dx.toFixed(2), this.dy.toFixed(2));

    // Update trail
    this.trailPositions.unshift({ x: this.x, y: this.y });
    if (this.trailPositions.length > this.maxTrailLength) {
      this.trailPositions.pop();
    }

    // Move ball
    this.x += this.dx;
    this.y += this.dy;

    // Wall collision
    if (this.x - this.radius <= 0 || this.x + this.radius >= this.canvas.width) {
      this.dx = -this.dx;
      this.x = Math.max(this.radius, Math.min(this.canvas.width - this.radius, this.x));
    }

    // Top wall collision
    if (this.y - this.radius <= 0) {
      this.dy = -this.dy;
      this.y = this.radius;
    }

    // Paddle collision
    const paddleBounds = this.paddle.getBounds();
    if (this.dy > 0 && 
        this.y + this.radius >= paddleBounds.top &&
        this.y - this.radius <= paddleBounds.bottom &&
        this.x >= paddleBounds.left &&
        this.x <= paddleBounds.right) {
      
      // Calculate hit position (-1 to 1, left to right)
      const hitPos = (this.x - paddleBounds.left) / this.paddle.width;
      const relativePos = (hitPos - 0.5) * 2; // -1 to 1
      
      // Adjust angle based on hit position
      const angle = -Math.PI / 2 + relativePos * Math.PI / 3;
      const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
      this.dx = Math.cos(angle) * speed;
      this.dy = Math.sin(angle) * speed;
      
      this.y = paddleBounds.top - this.radius;
      return { bricksHit: [], powerUpCollected: null, ballLost: false };
    }

    // Check if ball is lost
    if (this.y - this.radius > this.canvas.height) {
      return { bricksHit: [], powerUpCollected: null, ballLost: true };
    }

    // Brick collision
    const bricksHit = [];
    for (let brick of bricks) {
      if (brick.destroyed) continue;

      const brickBounds = brick.getBounds();
      if (this.x + this.radius >= brickBounds.left &&
          this.x - this.radius <= brickBounds.right &&
          this.y + this.radius >= brickBounds.top &&
          this.y - this.radius <= brickBounds.bottom) {
        
        // Determine collision side
        const overlapLeft = (this.x + this.radius) - brickBounds.left;
        const overlapRight = brickBounds.right - (this.x - this.radius);
        const overlapTop = (this.y + this.radius) - brickBounds.top;
        const overlapBottom = brickBounds.bottom - (this.y - this.radius);
        
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        if (minOverlap === overlapLeft || minOverlap === overlapRight) {
          this.dx = -this.dx;
        } else {
          this.dy = -this.dy;
        }
        
        brick.hit();
        bricksHit.push(brick);
        break; // Only hit one brick per frame
      }
    }

    // Power-up collision
    let powerUpCollected = null;
    for (let powerUp of powerUps) {
      const dx = this.x - powerUp.x;
      const dy = this.y - powerUp.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.radius + powerUp.radius) {
        powerUpCollected = powerUp;
        break;
      }
    }

    return { bricksHit, powerUpCollected, ballLost: false };
  }

  draw(ctx) {
    // Draw trail
    for (let i = 0; i < this.trailPositions.length; i++) {
      const pos = this.trailPositions[i];
      const alpha = 1 - (i / this.trailPositions.length);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw ball
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}
