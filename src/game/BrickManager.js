// BrickManager.js - Level layouts and brick grid management
import { Brick, BRICK_TYPES } from './Brick.js';

export class BrickManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.bricks = [];
    this.currentLevel = 1;
    this.levelSpeed = 3.0;
  }

  loadLevel(level) {
    this.currentLevel = level;
    this.bricks = [];
    this.levelSpeed = 3.0 + (level - 1) * 0.2;

    const startX = 15;
    const startY = 40;
    const brickWidth = 45;
    const brickHeight = 15;
    const padding = 2;

    switch (level) {
      case 1:
        // Full rectangle - 8 rows × 10 columns
        this.createRectanglePattern(startX, startY, 10, 8, brickWidth, brickHeight, padding, [
          'RED', 'RED',
          'ORANGE', 'ORANGE',
          'GREEN', 'GREEN',
          'BLUE', 'BLUE'
        ]);
        break;

      case 2:
        // Checkerboard pattern
        this.createCheckerboardPattern(startX, startY, 10, 8, brickWidth, brickHeight, padding);
        break;

      case 3:
        // Pyramid pattern
        this.createPyramidPattern(startX, startY, brickWidth, brickHeight, padding);
        break;

      case 4:
        // Diamond pattern
        this.createDiamondPattern(startX, startY, brickWidth, brickHeight, padding);
        break;

      case 5:
        // Wave pattern
        this.createWavePattern(startX, startY, 10, brickWidth, brickHeight, padding);
        break;

      case 6:
        // Spiral pattern
        this.createSpiralPattern(startX, startY, brickWidth, brickHeight, padding);
        break;

      case 7:
        // Random pattern with gaps
        this.createRandomPattern(startX, startY, 10, 6, brickWidth, brickHeight, padding, 0.7);
        break;

      case 8:
        // Boss level - compact fortress
        this.createBossPattern(startX, startY, brickWidth, brickHeight, padding);
        break;

      default:
        this.loadLevel(1);
    }
  }

  createRectanglePattern(startX, startY, cols, rows, width, height, padding, colorPattern) {
    for (let row = 0; row < rows; row++) {
      const colorType = colorPattern[row % colorPattern.length];
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (width + padding);
        const y = startY + row * (height + padding);
        const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
        this.bricks.push(brick);
      }
    }
  }

  createCheckerboardPattern(startX, startY, cols, rows, width, height, padding) {
    const colors = ['RED', 'ORANGE', 'GREEN', 'BLUE'];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row + col) % 2 === 0) {
          const colorType = colors[row % colors.length];
          const x = startX + col * (width + padding);
          const y = startY + row * (height + padding);
          const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
          this.bricks.push(brick);
        }
      }
    }
  }

  createPyramidPattern(startX, startY, width, height, padding) {
    const colors = ['BLUE', 'GREEN', 'ORANGE', 'RED'];
    for (let row = 0; row < 7; row++) {
      const bricksInRow = 10 - row;
      const offsetX = row * (width + padding) / 2;
      const colorType = colors[row % colors.length];
      
      for (let col = 0; col < bricksInRow; col++) {
        const x = startX + offsetX + col * (width + padding);
        const y = startY + row * (height + padding);
        const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
        this.bricks.push(brick);
      }
    }
  }

  createDiamondPattern(startX, startY, width, height, padding) {
    const colors = ['RED', 'ORANGE', 'GREEN', 'BLUE'];
    const rows = 7;
    const midRow = Math.floor(rows / 2);

    for (let row = 0; row < rows; row++) {
      const bricksInRow = row <= midRow ? (row + 1) * 2 : (rows - row) * 2;
      const offset = (10 - bricksInRow) * (width + padding) / 2;
      const colorType = colors[row % colors.length];

      for (let col = 0; col < bricksInRow; col++) {
        const x = startX + offset + col * (width + padding);
        const y = startY + row * (height + padding);
        const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
        this.bricks.push(brick);
      }
    }
  }

  createWavePattern(startX, startY, cols, width, height, padding) {
    const colors = ['RED', 'ORANGE', 'GREEN', 'BLUE'];
    for (let col = 0; col < cols; col++) {
      const waveHeight = Math.floor(Math.sin(col * 0.8) * 2 + 4);
      for (let row = 0; row < waveHeight; row++) {
        const colorType = colors[(col + row) % colors.length];
        const x = startX + col * (width + padding);
        const y = startY + row * (height + padding);
        const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
        this.bricks.push(brick);
      }
    }
  }

  createSpiralPattern(startX, startY, width, height, padding) {
    const colors = ['BLUE', 'GREEN', 'ORANGE', 'RED'];
    const positions = [
      [3,2], [4,2], [5,2], [6,2],
      [6,3], [6,4], [6,5],
      [5,5], [4,5], [3,5],
      [3,4], [3,3],
      [4,3], [5,3], [5,4], [4,4]
    ];

    positions.forEach((pos, i) => {
      const [col, row] = pos;
      const colorType = colors[Math.floor(i / 4) % colors.length];
      const x = startX + col * (width + padding);
      const y = startY + row * (height + padding);
      const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
      this.bricks.push(brick);
    });
  }

  createRandomPattern(startX, startY, cols, rows, width, height, padding, density) {
    const colors = ['RED', 'ORANGE', 'GREEN', 'BLUE'];
    for (let row = 0; row < rows; row++) {
      const colorType = colors[row % colors.length];
      for (let col = 0; col < cols; col++) {
        if (Math.random() < density) {
          const x = startX + col * (width + padding);
          const y = startY + row * (height + padding);
          const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
          this.bricks.push(brick);
        }
      }
    }
  }

  createBossPattern(startX, startY, width, height, padding) {
    // Compact fortress with all 4 colors
    const pattern = [
      ['BLUE', 'BLUE', 'BLUE', 'BLUE', 'BLUE', 'BLUE', 'BLUE', 'BLUE'],
      ['GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN', 'GREEN'],
      ['ORANGE', 'ORANGE', 'ORANGE', 'ORANGE', 'ORANGE', 'ORANGE', 'ORANGE', 'ORANGE'],
    ];

    pattern.forEach((row, rowIndex) => {
      row.forEach((colorType, colIndex) => {
        const x = startX + colIndex * (width + padding) + 50;
        const y = startY + rowIndex * (height + padding);
        const brick = new Brick(x, y, BRICK_TYPES[colorType].color, BRICK_TYPES[colorType].points);
        this.bricks.push(brick);
      });
    });
  }

  getActiveBricks() {
    return this.bricks.filter(b => !b.destroyed);
  }

  isLevelComplete() {
    return this.getActiveBricks().length === 0;
  }

  draw(ctx) {
    this.bricks.forEach(brick => brick.draw(ctx));
  }
}
