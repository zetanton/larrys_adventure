import { SPRITES } from './sprites.js';
import { SpriteRenderer } from './sprite-renderer.js';
import { CompleteScreen } from './complete-screen.js';

export class Player {
  constructor(x, y, audioManager, game) {
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
    this.facingRight = true;
    this.isWalking = false;
    this.animationFrame = 0;
    this.ANIMATION_SPEED = 0.15;
    this.game = game;
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
    this.x = 1;
    this.y = 224;
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
          this.reset(5, 200);
        }
      }
      return;
    }

    if (keys['ArrowRight'] || keys['KeyD']) {
      this.velocityX = this.speed;
      this.direction = 1;
    } else if (keys['ArrowLeft'] || keys['KeyA']) {
      this.velocityX = -this.speed;
      this.direction = -1;
    } else {
      this.velocityX = 0;
    }

    if ((keys['Space'] || keys['KeyW']) && !this.isJumping) {
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
        this.score += coin.value;
        this.audio.play('coin');
        
        if (coin.isGiant && level.currentLevel === 25) {
          this.game.gameState = 'COMPLETE';
          this.game.completeScreen = new CompleteScreen(this.score);
          this.audio.stopMusic();
        }
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

    if (keys['ArrowRight'] || keys['KeyD']) {
      this.facingRight = true;
      this.isWalking = true;
    } else if (keys['ArrowLeft'] || keys['KeyA']) {
      this.facingRight = false;
      this.isWalking = true;
    } else {
      this.isWalking = false;
    }

    if (this.isWalking) {
      this.animationFrame += this.ANIMATION_SPEED;
    } else {
      this.animationFrame = 0;
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
        SPRITES.LARRY_RIGHT,
        10 + i * 20,
        10,
        1
      );
    }

    // Don't render player if dead and animation finished
    if (this.isDying && this.deathAnimationFrame > 60) return;

    // Flash when invulnerable
    if (this.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) return;

    let sprite;
    if (this.velocityY !== 0) {
      sprite = this.facingRight ? SPRITES.LARRY_RIGHT_JUMP : SPRITES.LARRY_LEFT_JUMP;
    } else if (this.isWalking) {
      const isWalkFrame = Math.floor(this.animationFrame % 2) === 1;
      if (this.facingRight) {
        sprite = isWalkFrame ? SPRITES.LARRY_RIGHT_WALK : SPRITES.LARRY_RIGHT;
      } else {
        sprite = isWalkFrame ? SPRITES.LARRY_LEFT_WALK : SPRITES.LARRY_LEFT;
      }
    } else {
      sprite = this.facingRight ? SPRITES.LARRY_RIGHT : SPRITES.LARRY_LEFT;
    }

    SpriteRenderer.drawSprite(
      ctx,
      sprite,
      this.x,
      this.y,
      1.5
    );

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '10px "Press Start 2P"';
    ctx.textAlign = 'right';
    const scoreText = `SCORE ${this.score}`;
    ctx.fillText(scoreText, 246, 20); // 246 = virtualWidth(256) - 10px padding
  }
}