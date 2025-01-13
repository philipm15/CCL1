import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { LevelMap } from "../types/level.ts";

export class Player extends CanvasItemNode {
    private tilesPerSecond = 8;
    private lastMoveTime = 0;

    constructor(x: number, y: number, tileX: number, tileY: number) {
        super(x, y, tileX, tileY);
    }

    draw() {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.x, this.y, this.tileSize, this.tileSize);
    }

    update() {
        this.x += (this.tileX * this.tileSize - this.x);
        this.y += (this.tileY * this.tileSize - this.y);
    }

    move(direction: string, map: LevelMap, currentTime: number) {
        // Ensure the player only moves after enough time has passed
        const timePerTile = 1000 / this.tilesPerSecond; // Time needed to move one tile in milliseconds
        if (currentTime - this.lastMoveTime < timePerTile) return;

        // Determine the new tile coordinates
        let newTileX = this.tileX;
        let newTileY = this.tileY;

        if (direction === 'up') newTileY--;
        if (direction === 'down') newTileY++;
        if (direction === 'left') newTileX--;
        if (direction === 'right') newTileX++;

        // Check boundaries and collisions
        if (
            newTileX >= 0 &&
            newTileX < map[0].length &&
            newTileY >= 0 &&
            newTileY < map.length &&
            map[newTileY][newTileX].collisionMask === 0
        ) {
            this.tileX = newTileX;
            this.tileY = newTileY;
            this.x = this.tileX * this.tileSize;
            this.y = this.tileY * this.tileSize;

            // Update the last move timestamp
            this.lastMoveTime = currentTime;
        }
    }
}
