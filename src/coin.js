import { SPRITES } from './sprites.js';
import { SpriteRenderer } from './sprite-renderer.js';

export class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
    this.collected = false;
  }

  render(ctx) {
    if (this.collected) return;
    SpriteRenderer.drawSprite(ctx, SPRITES.COIN, this.x, this.y, 1);
  }
}