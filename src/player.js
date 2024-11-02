import { SPRITES } from './sprites.js';
import { SpriteRenderer } from './sprite-renderer.js';

export class Player {
  constructor(x, y, audioManager) {
    this.x = x;
    this.y = y;
    this.width = 16;
    this.height = 16;
    this.velocityX = 0;
    this.velocityY = 0;
    this.speed = 3;
    this.jumpForce = -10;
    this.gravity = 0.5;
    this.isJumping = false;
    this.direction = 1;
    this.score = 0;
    this.lives = 3;
    this.isDying = false;
    this.deathAnimationFrame = 0;
    this.invulnerable = false;
    this.audio = audioManager;
  }

  die() {
    if (this.invulnerable) return;
    
    this.lives--;
    this.isDying = true;
    this.deathAnimationFrame = 0;
    this.velocityY = this.jumpForce;
    this.audio.play('death');
    
    if (this.lives <= 0) {
      this.audio.stopMusic();
    }
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.velocityX = 0;
    this.velocityY = 0;
    this.isDying = false;
    this.invulnerable = true;
    setTimeout(() => this.invulnerable = false, 2000);
  }

  update(keys, level) {
    if (this.isDying) {
      this.deathAnimationFrame++;
      this.velocityY += this.gravity;
      this.y += this.velocityY;
      
      if (this.deathAnimationFrame > 60) {
        if (this.lives > 0) {
          this.reset(50, 200);
        }
      }
      return;
    }

    if (keys['ArrowRight']) {
      this.velocityX = this.speed;
      this.direction = 1;
    } else if (keys['ArrowLeft']) {
      this.velocityX = -this.speed;
      this.direction = -1;
    } else {
      this.velocityX = 0;
    }

    if (keys['Space'] && !this.isJumping) {
      this.velocityY = this.jumpForce;
      this.isJumping = true;
      this.audio.play('jump');
    }

    this.velocityY += this.gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    const blocks = level.getBlocks();
    for (const block of blocks) {
      if (this.collidesWith(block)) {
        if (this.velocityY > 0) {
          this.y = block.y - this.height;
          this.velocityY = 0;
          this.isJumping = false;
        } else if (this.velocityY < 0) {
          this.y = block.y + block.height;
          this.velocityY = 0;
        }
      }
    }

    level.coins.forEach(coin => {
      if (!coin.collected && this.collidesWith(coin)) {
        coin.collected = true;
        this.score += 100;
        this.audio.play('coin');
      }
    });

    level.enemies.forEach(enemy => {
      if (enemy.alive && this.collidesWith(enemy)) {
        if (this.velocityY > 0 && this.y + this.height < enemy.y + enemy.height / 2) {
          enemy.alive = false;
          this.velocityY = this.jumpForce / 2;
          this.score += 200;
          this.audio.play('stomp');
        } else if (!this.invulnerable) {
          this.die();
        }
      }
    });

    if (this.x < 0) this.x = 0;
    if (this.x > 256 - this.width) this.x = 256 - this.width;
    if (this.y > 240 && !this.isDying) {
      this.die();
    }
  }

  collidesWith(entity) {
    return this.x < entity.x + entity.width &&
           this.x + this.width > entity.x &&
           this.y < entity.y + entity.height &&
           this.y + this.height > entity.y;
  }

  render(ctx) {
    // Draw lives
    for (let i = 0; i < this.lives; i++) {
      SpriteRenderer.drawSprite(
        ctx,
        SPRITES.MARIO_RIGHT,
        10 + i * 20,
        10,
        1
      );
    }

    // Don't render player if dead and animation finished
    if (this.isDying && this.deathAnimationFrame > 60) return;

    // Flash when invulnerable
    if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) return;

    const sprite = SPRITES.MARIO_RIGHT;
    SpriteRenderer.drawSprite(
      ctx,
      sprite,
      this.x,
      this.y,
      1.5
    );

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${this.score}`, 10, 40);
  }
}