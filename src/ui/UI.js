// UI.js - All UI screens (start, pause, game over, victory)
export class UI {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  drawStartScreen(highScore) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FFFFFF';
    ctx.fillText('BREAKOUT', this.canvas.width / 2, 80);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText('VINTAGE ARCADE EDITION', this.canvas.width / 2, 100);

    // Controls
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('CONTROLS:', this.canvas.width / 2, 140);
    
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('ARROW KEYS / WASD - MOVE', this.canvas.width / 2, 160);
    ctx.fillText('MOUSE - MOVE', this.canvas.width / 2, 175);
    ctx.fillText('SPACEBAR - PAUSE', this.canvas.width / 2, 190);

    // High Score
    if (highScore > 0) {
      ctx.font = '10px "Press Start 2P"';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(`HIGH SCORE: ${highScore.toLocaleString()}`, this.canvas.width / 2, 220);
    }

    // Start prompt (blinking)
    const blink = Math.floor(Date.now() / 500) % 2;
    if (blink) {
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#33FF33';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#33FF33';
      ctx.fillText('PRESS SPACE', this.canvas.width / 2, 280);
      ctx.shadowBlur = 0;
    }

    // Credits
    ctx.font = '6px "Press Start 2P"';
    ctx.fillStyle = '#666666';
    ctx.fillText('INSPIRED BY ATARI 1976', this.canvas.width / 2, 340);
  }

  drawPauseScreen() {
    const ctx = this.ctx;
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Paused text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFFFFF';
    ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2 - 40);
    ctx.shadowBlur = 0;

    // Resume prompt
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#33FF33';
    ctx.fillText('SPACE - RESUME', this.canvas.width / 2, this.canvas.height / 2 + 10);
    
    // Reset prompt
    ctx.fillStyle = '#FF9933';
    ctx.fillText('R - RESET GAME', this.canvas.width / 2, this.canvas.height / 2 + 30);
  }

  drawGameOverScreen(score, highScore, level) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Game Over
    ctx.fillStyle = '#FF3333';
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF3333';
    ctx.fillText('GAME OVER', this.canvas.width / 2, 100);
    ctx.shadowBlur = 0;

    // Stats
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`FINAL SCORE`, this.canvas.width / 2, 150);
    ctx.font = '16px "Press Start 2P"';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(score.toLocaleString(), this.canvas.width / 2, 175);

    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`LEVEL REACHED: ${level}`, this.canvas.width / 2, 210);

    if (score >= highScore && score > 0) {
      ctx.fillStyle = '#FFD700';
      ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 235);
    } else {
      ctx.fillStyle = '#CCCCCC';
      ctx.fillText(`HIGH SCORE: ${highScore.toLocaleString()}`, this.canvas.width / 2, 235);
    }

    // Restart prompt
    const blink = Math.floor(Date.now() / 500) % 2;
    if (blink) {
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#33FF33';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#33FF33';
      ctx.fillText('PRESS SPACE', this.canvas.width / 2, 290);
      ctx.shadowBlur = 0;
    }
  }

  drawVictoryScreen(score) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Victory
    ctx.fillStyle = '#FFD700';
    ctx.font = '24px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 25;
    ctx.shadowColor = '#FFD700';
    ctx.fillText('VICTORY!', this.canvas.width / 2, 100);
    ctx.shadowBlur = 0;

    // Congratulations
    ctx.font = '10px "Press Start 2P"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('ALL LEVELS COMPLETE!', this.canvas.width / 2, 140);

    // Final Score
    ctx.fillText(`FINAL SCORE`, this.canvas.width / 2, 180);
    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(score.toLocaleString(), this.canvas.width / 2, 210);

    // Restart prompt
    const blink = Math.floor(Date.now() / 500) % 2;
    if (blink) {
      ctx.font = '12px "Press Start 2P"';
      ctx.fillStyle = '#33FF33';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#33FF33';
      ctx.fillText('PRESS SPACE', this.canvas.width / 2, 280);
      ctx.shadowBlur = 0;
    }
  }

  drawNextLevelScreen(level, score) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Level complete
    ctx.fillStyle = '#33FF33';
    ctx.font = '18px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#33FF33';
    ctx.fillText('LEVEL COMPLETE!', this.canvas.width / 2, 100);
    ctx.shadowBlur = 0;

    // Score
    ctx.font = '12px "Press Start 2P"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`SCORE: ${score.toLocaleString()}`, this.canvas.width / 2, 150);

    // Next level info
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText(`LEVEL ${level}`, this.canvas.width / 2, 190);
    ctx.font = '8px "Press Start 2P"';
    ctx.fillStyle = '#CCCCCC';
    ctx.fillText('GET READY...', this.canvas.width / 2, 210);
  }

  drawHUD(score, highScore, level, lives, activePowerUp = null) {
    const ctx = this.ctx;
    
    // Top bar background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.canvas.width, 30);

    ctx.font = '8px "Press Start 2P"';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';

    // Score
    ctx.fillText(`SCORE: ${score.toLocaleString()}`, 10, 12);
    
    // High Score
    ctx.fillStyle = '#FFD700';
    ctx.fillText(`HI: ${highScore.toLocaleString()}`, 10, 24);

    // Level (center)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`LEVEL ${level}`, this.canvas.width / 2, 18);

    // Lives (right)
    ctx.textAlign = 'right';
    const heartSymbol = '♥';
    const emptyHeart = '♡';
    let livesDisplay = '';
    for (let i = 0; i < 3; i++) {
      livesDisplay += i < lives ? heartSymbol : emptyHeart;
      livesDisplay += ' ';
    }
    ctx.fillStyle = '#FF3333';
    ctx.fillText(livesDisplay, this.canvas.width - 10, 18);

    // Active power-up indicator
    if (activePowerUp) {
      ctx.textAlign = 'center';
      ctx.font = '6px "Press Start 2P"';
      ctx.fillStyle = activePowerUp.color;
      ctx.fillText(activePowerUp.name.toUpperCase(), this.canvas.width / 2, 28);
    }
  }

  drawCountdownScreen(countdownValue) {
    const ctx = this.ctx;
    
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Display countdown number or READY
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (countdownValue > 0) {
      // Numbers 5,4,3,2,1
      ctx.font = '80px "Press Start 2P"';
      ctx.fillStyle = '#FFD700';
      ctx.shadowBlur = 30;
      ctx.shadowColor = '#FFD700';
      ctx.fillText(countdownValue.toString(), this.canvas.width / 2, this.canvas.height / 2);
      ctx.shadowBlur = 0;
    } else {
      // READY! - Click to start
      ctx.font = '32px "Press Start 2P"';
      ctx.fillStyle = '#33FF33';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#33FF33';
      ctx.fillText('READY!', this.canvas.width / 2, this.canvas.height / 2 - 30);
      ctx.shadowBlur = 0;
      
      // Click prompt (blinking)
      const blink = Math.floor(Date.now() / 500) % 2;
      if (blink) {
        ctx.font = '12px "Press Start 2P"';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('CLICK TO LAUNCH', this.canvas.width / 2, this.canvas.height / 2 + 30);
      }
    }
  }
}
