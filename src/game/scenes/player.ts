import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { LevelMap } from "../types/level.ts";
import { AnimatedSpriteNode } from "../nodes/animated-sprite.node.ts";
import { CollisionMask } from "../lib/constants.ts";

export class Player extends CanvasItemNode {
    private tilesPerSecond = 4;
    private lastMoveTime = 0;
    private animatedSpriteNode = new AnimatedSpriteNode({
        spriteSheetPath: 'src/assets/spritesheets/player.png',
        rows: 13,
        cols: 4,
        defaultAnimation: 'idle_down',
        animations: {
            'idle_down': {
                row: 0,
                numberOfSprites: 4,
            },
            'idle_right': {
                row: 1,
                numberOfSprites: 4,
            },
            'idle_left': {
                row: 2,
                numberOfSprites: 4,
            },
            'idle_up': {
                row: 3,
                numberOfSprites: 4,
            },
            'walk_down': {
                row: 5,
                numberOfSprites: 4,
            },
            'walk_left': {
                row: 7,
                numberOfSprites: 4,
            },
            'walk_right': {
                row: 9,
                numberOfSprites: 4,
            },
            'walk_up': {
                row: 11,
                numberOfSprites: 4,
            }
        }
    })

    constructor(x: number, y: number, tileX: number, tileY: number) {
        super(x, y, tileX, tileY);
    }

    draw() {
        if (!this.animatedSpriteNode.currentAnimation) return;

        // Get the current animation object from the AnimatedSpriteNode instance
        const frames = this.animatedSpriteNode.currentAnimation.frames;
        const frame = frames[Math.floor(Date.now() / 125) % frames.length];

        this.ctx.drawImage(frame, this.x, this.y);
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

        if (direction === 'up') {
            newTileY--
            this.direction = 'up';
        }
        if (direction === 'down') {
            newTileY++
            this.direction = 'down';
        }
        if (direction === 'left') {
            newTileX--
            this.direction = 'left';
        }
        if (direction === 'right') {
            newTileX++
            this.direction = 'right';
        }

        this.animatedSpriteNode.playAnimation(`walk_${ this.direction }`);

        // Check boundaries and collisions
        if (
            newTileX >= 0 &&
            newTileX < map[0].length &&
            newTileY >= 0 &&
            newTileY < map.length &&
            map[newTileX][newTileY].collisionMask === CollisionMask.FLOOR
        ) {
            this.tileX = newTileX;
            this.tileY = newTileY;
            this.x = this.tileX * this.tileSize;
            this.y = this.tileY * this.tileSize;

            // Update the last move timestamp
            this.lastMoveTime = currentTime;
        }
    }


    stopMove() {
        this.animatedSpriteNode.playAnimation(`idle_${ this.direction }`);
    }
}
