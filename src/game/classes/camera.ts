import {CAMERA_TILES, MAP_SIZE} from "../lib/constants.ts";

export class Camera {
    cameraX: number; // Actual camera position (floating-point)
    cameraY: number;
    targetX: number; // Target position (integer)
    targetY: number;
    size = CAMERA_TILES;

    constructor(x?: number, y?: number) {
        this.cameraX = x ?? 0;
        this.cameraY = y ?? 0;
        this.targetX = x ?? 0;
        this.targetY = y ?? 0;
    }

    updateCamera(playerTileX: number, playerTileY: number): void {
        // Determine the target position based on the player's tile position
        this.targetX = Math.max(0, Math.min(playerTileX - Math.floor(this.size / 2), MAP_SIZE - this.size));
        this.targetY = Math.max(0, Math.min(playerTileY - Math.floor(this.size / 2), MAP_SIZE - this.size));

        // Smoothly interpolate the camera's actual position towards the target
        this.cameraX += (this.targetX - this.cameraX) / 100; // Adjust 0.1 for smoother or faster motion
        this.cameraY += (this.targetY - this.cameraY) / 100;
    }


    // getVisibleTiles(map: LevelMap) {
    //     const visibleTiles = [];
    //
    //     for (let y = this.tileY; y < this.tileY + this.size; y++) {
    //         for (let x = this.tileX; x < this.tileX + this.size; x++) {
    //             if (map[y] && map[y][x]) {
    //                 visibleTiles.push(map[y][x]);
    //             }
    //         }
    //     }
    //
    //     return visibleTiles;
    // }
}
