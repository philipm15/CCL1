import {CanvasItemNode} from "../../nodes/canvas-item.node.ts";

export class Floor extends CanvasItemNode {
    color: string = 'lightblue';

    constructor(x: number, y: number, color: string) {
        super(x, y, x, y);
        this.color = color;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x * this.tileSize, this.y * this.tileSize, this.tileSize + 1, this.tileSize + 1);
    }
}
