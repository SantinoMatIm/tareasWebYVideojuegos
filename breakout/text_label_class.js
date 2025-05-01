/*
 * Class for displaying text in the game
 *
 * Based on the Pong game structure
 * Santino Im
 * 2025-04-29
 */

class TextLabel {
    constructor(position, font, color) {
        this.position = position;
        this.font = font;
        this.color = color;
    }

    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.position.x, this.position.y);
    }
}