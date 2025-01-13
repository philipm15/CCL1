import { CanvasManager } from "../classes/canvas-manager.ts";
import { TILE_SIZE } from "../lib/constants.ts";

export class CanvasItemNode {
    tileSize = TILE_SIZE;
    tileX: number;
    tileY: number;
    x: number;
    y: number;
    ctx = CanvasManager.getInstance().ctx;

    constructor(x: number, y: number, tileX: number, tileY: number) {
        this.x = x;
        this.y = y;
        this.tileX = tileX;
        this.tileY = tileY;
    }

    /**
     * Called when the node should draw on the canvas
     * @abstract
     * @return void
     */
    draw() {
    }

    /**
     * Called when the node should update its state
     * @abstract
     * @param deltaTime {number}
     */
    update(deltaTime: number) {
    }
}
