import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { CanvasManager } from "../classes/canvas-manager.ts";
import { TILE_SIZE } from "../lib/constants.ts";

export class Player extends CanvasItemNode {
    private tileSize = TILE_SIZE;
    tileX: number;
    tileY: number;
    ctx = CanvasManager.getInstance().ctx;

    constructor(x: number, y: number, tileX: number, tileY: number) {
        super(x, y, 32, 32);
        this.tileX = tileX;
        this.tileY = tileY;
    }

    draw() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.tileSize, this.tileSize);
    }

    update() {
        this.x += (this.tileX * this.tileSize - this.x) * 0.2;
        this.y += (this.tileY * this.tileSize - this.y) * 0.2;
    }
}
