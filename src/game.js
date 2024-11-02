import { Player } from './player.js';
import { Level } from './level.js';
import { StartScreen } from './start-screen.js';
import { AudioManager } from './audio.js';

export class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    this.audio = new AudioManager();
    this.gameState = 'START';
    this.startScreen = new StartScreen();
    this.player = new Player(50, 200, this.audio);
    this.currentLevel = 0;
    this.levels = [
      new Level(1),
      new Level(2)
    ];
    
    this.keys = {};
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Enter') {
        if (this.gameState === 'START') {
          this.gameState = 'PLAYING';
          this.audio.startMusic();
        } else if (this.gameState === 'GAME_OVER') {
          this.resetGame();
        }
      }
    });
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);
  }

  resetGame() {
    this.gameState = 'PLAYING';
    this.player = new Player(50, 200, this.audio);
    this.currentLevel = 0;
    this.levels = [
      new Level(1),
      new Level(2)
    ];
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
      
      if (this.player.x > this.width - 32) {
        if (this.currentLevel < this.levels.length - 1) {
          this.currentLevel++;
          this.player.x = 50;
        }
      }
    }
  }

  render() {
    if (this.gameState === 'START') {
      this.startScreen.render(this.ctx, this.width, this.height);
    } else if (this.gameState === 'GAME_OVER') {
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      this.ctx.fillStyle = '#ff0000';
      this.ctx.font = 'bold 24px "Press Start 2P"';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '16px "Press Start 2P"';
      this.ctx.fillText(`Final Score: ${this.player.score}`, this.width / 2, this.height / 2 + 40);
      this.ctx.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + 80);
    } else {
      this.ctx.fillStyle = '#6b8cff';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
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