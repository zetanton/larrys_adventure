import { COLORS } from './sprites.js';

export class SpriteRenderer {
  static drawSprite(ctx, sprite, x, y, scale = 1) {
    const pixelSize = scale;
    sprite.forEach((row, i) => {
      row.forEach((pixel, j) => {
        if (pixel !== 0) {
          ctx.fillStyle = COLORS[pixel];
          ctx.fillRect(x + j * pixelSize, y + i * pixelSize, pixelSize, pixelSize);
        } 
      });
    });
  }
}