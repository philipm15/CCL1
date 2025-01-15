import { CanvasItemNode } from "../../nodes/canvas-item.node.ts";

export class Wall extends CanvasItemNode {
    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x * this.tileSize, this.y * this.tileSize, this.tileSize + 1, this.tileSize + 1);
    }
}
