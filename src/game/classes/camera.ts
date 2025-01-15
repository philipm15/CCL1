import { CAMERA_SIZE, CAMERA_TILES, MAP_SIZE } from "../lib/constants.ts";
import { LevelMap } from "../types/level.ts";

export class Camera {
    tileX: number;
    tileY: number;
    size = CAMERA_TILES;

    constructor(x?: number, y?: number) {
        this.tileX = x ?? 0;
        this.tileY = y ?? 0;
    }

    updateCamera(playerTileX: number, playerTileY: number) {
        this.tileX = Math.max(0, Math.min(playerTileX - Math.floor(this.size / 2),MAP_SIZE - this.size));
        this.tileY = Math.max(0, Math.min(playerTileY- Math.floor(this.size / 2), MAP_SIZE - this.size));
    }

    getVisibleTiles(map: LevelMap) {
        const visibleTiles = [];

        for (let y = this.tileY; y < this.tileY + this.size; y++) {
            for (let x = this.tileX; x < this.tileX + this.size; x++) {
                if (map[y] && map[y][x]) {
                    visibleTiles.push(map[y][x]);
                }
            }
        }

        return visibleTiles;
    }
}
