import { Player } from './player.js';
import { Level } from './level.js';
import { StartScreen } from './start-screen.js';
import { AudioManager } from './audio.js';
import { LEVELS } from './levelData.js';
import { CompleteScreen } from './complete-screen.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    
    // Set up virtual and displayed dimensions
    this.virtualWidth = 256;
    this.virtualHeight = 240;
    this.scale = 2;  // Scale factor
    
    // Set displayed dimensions
    this.canvas.style.width = (this.virtualWidth * this.scale) + 'px';
    this.canvas.style.height = (this.virtualHeight * this.scale) + 'px';
    
    // Keep internal canvas dimensions at original size
    this.canvas.width = this.virtualWidth;
    this.canvas.height = this.virtualHeight;
    
    // Enable crisp pixels
    this.ctx.imageSmoothingEnabled = false;
    
    this.audio = new AudioManager();
    this.gameState = 'START';
    this.startScreen = new StartScreen();
    this.player = new Player(5, 200, this.audio, this);
    this.currentLevel = 0;
    this.levels = Object.keys(LEVELS).map(levelNum => new Level(parseInt(levelNum)));
    
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Enter') {
        if (this.gameState === 'START') {
          this.gameState = 'PLAYING';
          this.audio.startMusic();
        } else if (this.gameState === 'GAME_OVER') {
          this.resetGame();
        } else if (this.gameState === 'COMPLETE') {
          this.resetGame();
          this.gameState = 'START';
          this.startScreen = new StartScreen();
        }
      }
    });
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);

    this.completeScreen = null;
  }

  resetGame() {
    this.gameState = 'PLAYING';
    this.player = new Player(5, this.virtualHeight - 32, this.audio, this);
    this.currentLevel = 0;
    this.levels = Object.keys(LEVELS).map(levelNum => new Level(parseInt(levelNum)));
    this.audio.startMusic();
  }

  start() {
    this.gameLoop();
  }

  update() {
    if (this.gameState === 'PLAYING') {
      this.levels[this.currentLevel].update();
      this.player.update(this.keys, this.levels[this.currentLevel]);
      
      if (this.player.lives <= 0) {
        this.gameState = 'GAME_OVER';
      }
      
      if (this.player.x > this.virtualWidth - 32) {
        if (this.currentLevel < this.levels.length - 1) {
          this.currentLevel++;
          this.player.x = 0;
        }
      }
    }
  }

  render() {
    if (this.gameState === 'START') {
      this.startScreen.render(this.ctx, this.virtualWidth, this.virtualHeight);
    } else if (this.gameState === 'GAME_OVER') {
      // Black background
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
      
      // Game Over text
      this.ctx.fillStyle = '#ff0000';
      this.ctx.font = '20px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.virtualWidth / 2, 90);
      
      // Score text
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '12px "Press Start 2P"';
      this.ctx.fillText(`FINAL SCORE: ${this.player.score}`, this.virtualWidth / 2, 130);
      
      // Restart instruction
      this.ctx.font = '8px "Press Start 2P"';
      this.ctx.fillText('PRESS ENTER TO RESTART', this.virtualWidth / 2, 170);
    } else if (this.gameState === 'COMPLETE') {
      this.completeScreen.render(this.ctx, this.virtualWidth, this.virtualHeight);
    } else {
      const backgroundColor = LEVELS[this.levels[this.currentLevel].currentLevel].backgroundColor;
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(0, 0, this.virtualWidth, this.virtualHeight);
      
      this.levels[this.currentLevel].render(this.ctx);
      this.player.render(this.ctx);
    }
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}