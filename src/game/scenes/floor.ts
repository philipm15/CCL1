import { CanvasItemNode } from "../nodes/canvas-item.node.ts";

export class Floor extends CanvasItemNode {
    draw() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.x * this.tileSize, this.y * this.tileSize, this.tileSize, this.tileSize);
    }
}
