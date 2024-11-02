import { Enemy } from './enemy.js';
import { Coin } from './coin.js';

export class Level {
  constructor(levelNumber) {
    this.blocks = [];
    this.enemies = [];
    this.coins = [];
    this.setupLevel(levelNumber);
  }

  setupLevel(levelNumber) {
    if (levelNumber === 1) {
      // Ground blocks
      for (let x = 0; x < 16; x++) {
        this.blocks.push({
          x: x * 16,
          y: 224,
          width: 16,
          height: 16
        });
      }

      // Platforms
      this.blocks.push({ x: 64, y: 176, width: 32, height: 16 });
      this.blocks.push({ x: 128, y: 144, width: 32, height: 16 });
      this.blocks.push({ x: 192, y: 176, width: 32, height: 16 });

      // Add enemies
      this.enemies.push(new Enemy(100, 208));
      this.enemies.push(new Enemy(180, 208));

      // Add coins
      this.coins.push(new Coin(80, 160));
      this.coins.push(new Coin(144, 128));
      this.coins.push(new Coin(208, 160));
    } else {
      // Level 2 - More complex layout
      for (let x = 0; x < 16; x++) {
        if (x !== 5 && x !== 6) { // Gap in the ground
          this.blocks.push({
            x: x * 16,
            y: 224,
            width: 16,
            height: 16
          });
        }
      }

      // Floating platforms
      this.blocks.push({ x: 80, y: 160, width: 48, height: 16 });
      this.blocks.push({ x: 160, y: 128, width: 48, height: 16 });
      this.blocks.push({ x: 64, y: 96, width: 32, height: 16 });

      // Add enemies
      this.enemies.push(new Enemy(90, 144));
      this.enemies.push(new Enemy(170, 112));

      // Add coins
      this.coins.push(new Coin(96, 80));
      this.coins.push(new Coin(176, 112));
      this.coins.push(new Coin(88, 144));
    }
  }

  getBlocks() {
    return this.blocks;
  }

  update() {
    this.enemies.forEach(enemy => enemy.update(this));
  }

  render(ctx) {
    // Draw blocks
    ctx.fillStyle = '#5c3c00';
    for (const block of this.blocks) {
      ctx.fillRect(block.x, block.y, block.width, block.height);
    }

    // Draw coins
    this.coins.forEach(coin => coin.render(ctx));

    // Draw enemies
    this.enemies.forEach(enemy => enemy.render(ctx));
  }
}