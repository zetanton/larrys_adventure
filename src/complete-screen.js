import { SPRITES } from './sprites.js';
import { SpriteRenderer } from './sprite-renderer.js';

export class CompleteScreen {
  constructor(finalScore) {
    this.frameCount = 0;
    this.finalScore = finalScore;
  }

  render(ctx, width, height) {
    // Background
    ctx.fillStyle = '#4A5459';
    ctx.fillRect(0, 0, width, height);

    // Victory Title - moved up and made smaller
    ctx.fillStyle = '#ffd700'; // Gold color
    ctx.font = 'bold 20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('VICTORY!', width / 2, height * 0.20);

    // Bouncing Larry animation
    this.frameCount++;
    const bounceOffset = Math.sin(this.frameCount * 0.05) * 5;
    
    // Draw giant coin trophy - adjusted position
    SpriteRenderer.drawSprite(
      ctx,
      SPRITES.COIN,
      width / 2 - 16,
      height * 0.30,
      4
    );

    // Draw two Larrys celebrating - moved down and spread apart
    SpriteRenderer.drawSprite(
      ctx,
      SPRITES.LARRY_RIGHT,
      width / 2 - 64,
      height * 0.60 + bounceOffset,
      2
    );
    
    SpriteRenderer.drawSprite(
      ctx,
      SPRITES.LARRY_LEFT,
      width / 2 + 32,
      height * 0.60 + bounceOffset,
      2
    );

    // Final Score - moved up to avoid Larry sprites
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Press Start 2P"';
    ctx.fillText(`FINAL SCORE: ${this.finalScore}`, width / 2, height * 0.52);
    
    // Thanks for playing - adjusted spacing
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('Thanks for playing!', width / 2, height * 0.85);
    
    // Restart instruction - adjusted size and position
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText('PRESS ENTER TO PLAY AGAIN', width / 2, height * 0.92);
  }
} 