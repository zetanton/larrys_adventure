import { SPRITES } from './sprites.js';
import { SpriteRenderer } from './sprite-renderer.js';

export class StartScreen {
  constructor() {
    this.frameCount = 0;
  }

  render(ctx, width, height) {
    // Background
    ctx.fillStyle = '#4A5459';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ff8800';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Larry's Adventure", width / 2, height / 3);

    // Character
    this.frameCount++;
    const bounceOffset = Math.sin(this.frameCount * 0.05) * 5;
    SpriteRenderer.drawSprite(
      ctx,
      SPRITES.LARRY_RIGHT,
      width / 2 - 24,
      height / 2 - 24 + bounceOffset,
      2
    );

    // Instructions
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText('Press ENTER to Start', width / 2, height * 0.7);
    
    ctx.font = '12px Arial';
    ctx.fillText('Arrow Keys to Move, Space to Jump', width / 2, height * 0.8);
  }
}