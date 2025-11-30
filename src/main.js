/* ============================================
 * MAIN GAME ENGINE
 * - 60 FPS game loop using requestAnimationFrame
 * - State machine (START, COUNTDOWN, PLAYING, PAUSED, GAME_OVER, VICTORY, NEXT_LEVEL)
 * - Input handling (keyboard, mouse, touch)
 * - Collision detection and physics
 * - Power-up system and particle effects
 * - High score persistence (localStorage)
 * ============================================ */

// IMPORTS: Game components and utilities
import { Paddle } from './game/Paddle.js';
import { Ball } from './game/Ball.js';
import { BrickManager } from './game/BrickManager.js';
import { PowerUp, POWERUP_TYPES } from './game/PowerUp.js';
import { ParticleSystem } from './game/ParticleSystem.js';
import { SoundManager } from './utils/SoundManager.js';
import { UI } from './ui/UI.js';

// GAME STATES: State machine configuration
const GAME_STATES = {
  START: 'START',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY',
  NEXT_LEVEL: 'NEXT_LEVEL'
};

class BreakoutGame {
  constructor() {
    this.canvas = document.getElementById('breakoutCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Setup responsive canvas
    this.setupCanvas();
    
    // Game components
    this.paddle = new Paddle(this.canvas);
    this.balls = [];
    this.brickManager = new BrickManager(this.canvas);
    this.powerUps = [];
    this.particles = new ParticleSystem();
    this.sound = new SoundManager();
    this.ui = new UI(this.canvas);

    // Game state
    this.state = GAME_STATES.START;
    this.score = 0;
    this.highScore = this.loadHighScore();
    this.lives = 3;
    this.currentLevel = 1;
    this.activePowerUp = null;
    this.powerUpTimer = 0;
    this.nextLevelTimer = 0;
    this.countdownTimer = 0;
    this.countdownValue = 5;

    // Input handling
    this.keys = {};
    this.mouseX = 0;
    this.touchX = null;

    // Mobile check
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    this.init();
  }

  init() {
    this.sound.init();
    this.setupEventListeners();
    this.brickManager.loadLevel(1);
    this.balls.push(new Ball(this.canvas, this.paddle));
    this.gameLoop();
  }

  setupCanvas() {
    // Make canvas responsive while maintaining aspect ratio
    const resizeCanvas = () => {
      const container = this.canvas.parentElement;
      const aspectRatio = 480 / 360; // Original aspect ratio
      const maxWidth = Math.min(window.innerWidth - 40, 960); // Max 2x original size
      const maxHeight = window.innerHeight - 100;
      
      let width = maxWidth;
      let height = width / aspectRatio;
      
      if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
      }
      
      this.canvas.style.width = width + 'px';
      this.canvas.style.height = height + 'px';
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  setupEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        this.handleSpacePress();
      }
      
      // R key for reset (only during pause)
      if ((e.key === 'r' || e.key === 'R') && this.state === GAME_STATES.PAUSED) {
        e.preventDefault();
        this.handleResetPress();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Mouse
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      this.mouseX = (e.clientX - rect.left) * scaleX;
    });

    // Touch
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const scaleX = this.canvas.width / rect.width;
      this.touchX = (touch.clientX - rect.left) * scaleX;
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.touchX = null;
    });

    // Mobile pause button
    const pauseBtn = document.getElementById('mobile-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (this.state === GAME_STATES.PLAYING) {
          this.state = GAME_STATES.PAUSED;
        } else if (this.state === GAME_STATES.PAUSED) {
          this.state = GAME_STATES.PLAYING;
        }
      });
    }

    // Launch ball on click/touch
    this.canvas.addEventListener('click', () => {
      console.log('🖱️ Canvas clicked! Game state:', this.state, 'Balls count:', this.balls.length);
      if (this.state === GAME_STATES.PLAYING) {
        console.log('Launching balls...');
        this.balls.forEach((ball, i) => {
          console.log(`Ball ${i}: attached=${ball.attached}, position=(${ball.x}, ${ball.y})`);
          if (ball.attached) {
            ball.launch();
            console.log(`Ball ${i} launched!`);
          }
        });
        console.log('After launch - balls count:', this.balls.length);
      }
    });
  }

  handleSpacePress() {
    switch (this.state) {
      case GAME_STATES.START:
        this.startGame();
        break;
      case GAME_STATES.PLAYING:
        this.state = GAME_STATES.PAUSED;
        break;
      case GAME_STATES.PAUSED:
        this.state = GAME_STATES.PLAYING;
        break;
      case GAME_STATES.GAME_OVER:
      case GAME_STATES.VICTORY:
        this.resetGame();
        break;
    }
  }

  handleResetPress() {
    // Reset game to start screen
    this.resetGame();
  }

  startGame() {
    this.state = GAME_STATES.COUNTDOWN;
    this.lives = 3;
    this.score = 0;
    this.currentLevel = 1;
    this.brickManager.loadLevel(1);
    this.balls = [new Ball(this.canvas, this.paddle)];
    this.powerUps = [];
    this.particles.clear();
    this.countdownTimer = 300; // 5 seconds at 60fps
    this.countdownValue = 5;
  }

  resetGame() {
    this.state = GAME_STATES.START;
    this.lives = 3;
    this.score = 0;
    this.currentLevel = 1;
    this.brickManager.loadLevel(1);
    this.balls = [new Ball(this.canvas, this.paddle)];
    this.powerUps = [];
    this.particles.clear();
  }

  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel > 8) {
      this.state = GAME_STATES.VICTORY;
      this.updateHighScore();
      this.sound.levelComplete();
      return;
    }

    this.state = GAME_STATES.NEXT_LEVEL;
    this.nextLevelTimer = 180; // 3 seconds at 60fps
    this.brickManager.loadLevel(this.currentLevel);
    this.balls = [new Ball(this.canvas, this.paddle)];
    this.balls[0].baseSpeed = this.brickManager.levelSpeed;
    this.powerUps = [];
    this.particles.createLevelCompleteExplosion(this.canvas);
    this.sound.levelComplete();
  }

  update() {
    if (this.state !== GAME_STATES.PLAYING && this.state !== GAME_STATES.NEXT_LEVEL && this.state !== GAME_STATES.COUNTDOWN) return;

    // Handle countdown
    if (this.state === GAME_STATES.COUNTDOWN) {
      this.countdownTimer--;
      this.countdownValue = Math.ceil(this.countdownTimer / 60);
      
      if (this.countdownTimer <= 0) {
        this.state = GAME_STATES.PLAYING;
        // DO NOT auto-launch - wait for user click
      }
      
      // Update paddle during countdown
      if (this.keys['arrowleft'] || this.keys['a'] || this.keys['w']) {
        this.paddle.moveLeft();
      }
      if (this.keys['arrowright'] || this.keys['d'] || this.keys['s']) {
        this.paddle.moveRight();
      }
      if (this.touchX !== null) {
        this.paddle.moveTo(this.touchX);
      } else if (this.mouseX !== 0) {
        this.paddle.moveTo(this.mouseX);
      }
      this.paddle.update();
      
      // Update ball position to follow paddle (stays attached)
      this.balls.forEach(ball => ball.update([], []));
      return;
    }

    // Handle next level transition
    if (this.state === GAME_STATES.NEXT_LEVEL) {
      this.nextLevelTimer--;
      if (this.nextLevelTimer <= 0) {
        this.state = GAME_STATES.PLAYING;
      }
      this.particles.update();
      return;
    }

    // Paddle movement
    if (this.keys['arrowleft'] || this.keys['a']) {
      this.paddle.moveLeft();
    }
    if (this.keys['arrowright'] || this.keys['d']) {
      this.paddle.moveRight();
    }
    // Also support W key for left and S for right (alternative to WASD)
    if (this.keys['w']) {
      this.paddle.moveLeft();
    }
    if (this.keys['s']) {
      this.paddle.moveRight();
    }
    if (this.touchX !== null) {
      this.paddle.moveTo(this.touchX);
    } else if (this.mouseX !== 0) {
      this.paddle.moveTo(this.mouseX);
    }

    this.paddle.update();

    // Update all balls
    const activeBalls = [];
    this.balls.forEach(ball => {
      const result = ball.update(this.brickManager.getActiveBricks(), this.powerUps);

      // Handle brick hits
      result.bricksHit.forEach(brick => {
        this.score += brick.points;
        this.particles.createBrickExplosion(brick);
        this.particles.createScorePopup(brick.x + brick.width / 2, brick.y, brick.points);
        this.sound.brickHit(brick.points);

        // Spawn power-up (10% chance)
        if (Math.random() < 0.1) {
          this.spawnPowerUp(brick.x + brick.width / 2, brick.y + brick.height / 2);
        }
      });

      // Ball lost - CRITICAL FIX
      if (result.ballLost) {
        if (this.balls.length === 1) {
          // Last ball lost
          this.lives--;
          this.sound.ballLost();
          if (this.lives <= 0) {
            this.state = GAME_STATES.GAME_OVER;
            this.updateHighScore();
            this.sound.gameOver();
          } else {
            // Reset ball attached to paddle
            ball.reset();
            ball.baseSpeed = this.brickManager.levelSpeed;
            activeBalls.push(ball); // CRITICAL: Keep ball in array
          }
        }
        // If multiple balls, just don't add this one to activeBalls (it's removed)
      } else {
        // Ball is still in play
        activeBalls.push(ball);
      }
    });

    // Update balls array
    console.log('Before reassignment - balls count:', this.balls.length, 'activeBalls count:', activeBalls.length);
    this.balls = activeBalls;
    console.log('After reassignment - balls count:', this.balls.length);
    
    // Safety check: if no balls exist and player has lives, create one
    if (this.balls.length === 0 && this.lives > 0) {
      console.log('⚠️ No balls! Creating new one. Lives:', this.lives);
      const newBall = new Ball(this.canvas, this.paddle);
      newBall.baseSpeed = this.brickManager.levelSpeed;
      this.balls = [newBall];
      console.log('Created new ball:', newBall.x, newBall.y, 'attached:', newBall.attached);
    }

    // Update power-ups
    this.powerUps.forEach(powerUp => powerUp.update());
    this.powerUps = this.powerUps.filter(p => {
      if (p.checkPaddleCollision(this.paddle)) {
        this.activatePowerUp(p.type);
        this.sound.powerUpCollect();
        this.score += 150;
        return false;
      }
      return p.y < this.canvas.height + 20;
    });

    // Update active power-up timer
    if (this.activePowerUp && this.activePowerUp.duration > 0) {
      this.powerUpTimer--;
      if (this.powerUpTimer <= 0) {
        this.deactivatePowerUp();
      }
    }

    // Update particles
    this.particles.update();

    // Check level complete
    if (this.brickManager.isLevelComplete()) {
      this.nextLevel();
    }
  }

  spawnPowerUp(x, y) {
    const types = Object.keys(POWERUP_TYPES);
    const randomType = types[Math.floor(Math.random() * types.length)];
    this.powerUps.push(new PowerUp(x, y, randomType));
  }

  activatePowerUp(type) {
    const powerUpData = POWERUP_TYPES[type];
    
    switch (type) {
      case 'MULTIBALL':
        const currentBalls = [...this.balls];
        currentBalls.forEach(ball => {
          if (!ball.attached) {
            for (let i = 0; i < 2; i++) {
              const newBall = new Ball(this.canvas, this.paddle);
              newBall.x = ball.x;
              newBall.y = ball.y;
              newBall.dx = ball.dx * (Math.random() > 0.5 ? 1.2 : 0.8);
              newBall.dy = ball.dy;
              newBall.attached = false;
              newBall.baseSpeed = ball.baseSpeed;
              this.balls.push(newBall);
            }
          }
        });
        break;

      case 'EXTEND':
        this.paddle.extend();
        this.activePowerUp = { name: 'extend', color: powerUpData.color, duration: powerUpData.duration };
        this.powerUpTimer = powerUpData.duration;
        break;

      case 'SLOW':
        this.balls.forEach(ball => ball.setSpeed(0.5));
        this.activePowerUp = { name: 'slow', color: powerUpData.color, duration: powerUpData.duration };
        this.powerUpTimer = powerUpData.duration;
        break;

      case 'FAST':
        this.balls.forEach(ball => ball.setSpeed(1.25));
        this.activePowerUp = { name: 'fast', color: powerUpData.color, duration: powerUpData.duration };
        this.powerUpTimer = powerUpData.duration;
        break;

      case 'EXTRA_LIFE':
        this.lives = Math.min(this.lives + 1, 3);
        break;
    }
  }

  deactivatePowerUp() {
    if (this.activePowerUp) {
      if (this.activePowerUp.name === 'slow' || this.activePowerUp.name === 'fast') {
        this.balls.forEach(ball => ball.setSpeed(1.0));
      }
      this.activePowerUp = null;
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw game state
    switch (this.state) {
      case GAME_STATES.START:
        this.ui.drawStartScreen(this.highScore);
        break;

      case GAME_STATES.COUNTDOWN:
        this.brickManager.draw(this.ctx);
        this.balls.forEach(ball => ball.draw(this.ctx));
        this.paddle.draw(this.ctx);
        this.ui.drawCountdownScreen(this.countdownValue);
        break;

      case GAME_STATES.PLAYING:
      case GAME_STATES.PAUSED:
        this.brickManager.draw(this.ctx);
        this.powerUps.forEach(p => p.draw(this.ctx));
        this.balls.forEach(ball => ball.draw(this.ctx));
        this.paddle.draw(this.ctx);
        this.particles.draw(this.ctx);
        this.ui.drawHUD(this.score, this.highScore, this.currentLevel, this.lives, this.activePowerUp);
        
        if (this.state === GAME_STATES.PAUSED) {
          this.ui.drawPauseScreen();
        }
        break;

      case GAME_STATES.NEXT_LEVEL:
        this.brickManager.draw(this.ctx);
        this.paddle.draw(this.ctx);
        this.particles.draw(this.ctx);
        this.ui.drawNextLevelScreen(this.currentLevel, this.score);
        break;

      case GAME_STATES.GAME_OVER:
        this.ui.drawGameOverScreen(this.score, this.highScore, this.currentLevel);
        break;

      case GAME_STATES.VICTORY:
        this.ui.drawVictoryScreen(this.score);
        break;
    }
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  loadHighScore() {
    return parseInt(localStorage.getItem('breakout_highscore') || '0');
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('breakout_highscore', this.highScore.toString());
    }
  }
}

// Start the game
window.addEventListener('load', () => {
  new BreakoutGame();
});
