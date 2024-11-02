import { Enemy } from './enemy.js';
import { Coin } from './coin.js';
import { LEVELS } from './levelData.js';


export class Level {
  constructor(levelNumber) {
    this.blocks = [];
    this.enemies = [];
    this.coins = [];
    this.currentLevel = levelNumber;
    this.setupLevel(levelNumber);
  }

  setupLevel(levelNumber) {
    const levelData = LEVELS[levelNumber];
    if (!levelData) {
      console.error(`Level ${levelNumber} not found!`);
      return;
    }

    // Create ground blocks
    levelData.ground.forEach(section => {
      for (let x = section.start; x < section.end; x++) {
        this.blocks.push({
          x: x * 16,
          y: 224,
          width: 16,
          height: 16
        });
      }
    });

    // Add platforms
    levelData.platforms.forEach(platform => {
      this.blocks.push(platform);
    });

    // Add enemies
    levelData.enemies.forEach(enemy => {
      this.enemies.push(new Enemy(enemy.x, enemy.y));
    });

    // Add coins
    levelData.coins.forEach(coin => {
      this.coins.push(new Coin(coin.x, coin.y));
    });
  }

  getBlocks() {
    return this.blocks;
  }

  update() {
    this.enemies.forEach(enemy => enemy.update(this));
  }

  render(ctx) {
    // Draw blocks
    ctx.fillStyle = this.currentLevel >= 20 ? '#202020' : '#5c3c00';
    for (const block of this.blocks) {
      ctx.fillRect(block.x, block.y, block.width, block.height);
    }

    // Draw coins
    this.coins.forEach(coin => coin.render(ctx));

    // Draw enemies
    this.enemies.forEach(enemy => enemy.render(ctx));
  }

  static getTotalLevels() {
    return Object.keys(LEVELS).length;
  }
}