import { SPRITES } from './sprites.js';
import { SpriteRenderer } from './sprite-renderer.js';

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.velocityX = -1;
    this.alive = true;
  }

  update(level) {
    if (!this.alive) return;
    
    this.x += this.velocityX;

    // Simple AI: Change direction when hitting walls or edges
    const blocks = level.getBlocks();
    let onGround = false;

    for (const block of blocks) {
      if (this.collidesWith(block)) {
        if (this.velocityX < 0) {
          this.x = block.x + block.width;
        } else {
          this.x = block.x - this.width;
        }
        this.velocityX *= -1;
      }

      // Check if enemy is on ground
      if (this.y + this.height === block.y &&
          this.x + this.width > block.x &&
          this.x < block.x + block.width) {
        onGround = true;
      }
    }

    if (!onGround) {
      this.velocityX *= -1;
    }
  }

  collidesWith(entity) {
    return this.x < entity.x + entity.width &&
           this.x + this.width > entity.x &&
           this.y < entity.y + entity.height &&
           this.y + this.height > entity.y;
  }

  render(ctx) {
    if (!this.alive) return;
    SpriteRenderer.drawSprite(ctx, SPRITES.GOOMBA, this.x, this.y, 1.5);
  }
}