import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { LevelMap } from "../types/level.ts";
import { AnimatedSpriteNode } from "../nodes/animated-sprite.node.ts";
import { CollisionMask, TILE_SIZE } from "../lib/constants.ts";

export class Player extends CanvasItemNode {
    private tilesPerSecond = 4;
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
    });

    private moveStartTime: number = 0;
    private moving: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private targetX: number = 0;
    private targetY: number = 0;

    constructor(tileX: number, tileY: number) {
        super(tileX * TILE_SIZE, tileY * TILE_SIZE, tileX, tileY);
    }

    draw() {
        if (!this.animatedSpriteNode.currentAnimation) return;

        const frames = this.animatedSpriteNode.currentAnimation.frames;
        const frame = frames[Math.floor(Date.now() / 125) % frames.length];

        this.ctx.drawImage(frame, this.x, this.y);
    }

    update() {
        if (this.moving) {
            const elapsed = (Date.now() - this.moveStartTime) / 1000; // Time in seconds
            const moveDuration = 1 / this.tilesPerSecond; // Duration to move one tile

            if (elapsed >= moveDuration) {
                // Movement complete
                this.x = this.targetX;
                this.y = this.targetY;
                this.moving = false;
            } else {
                // Smooth interpolation
                const t = elapsed / moveDuration;
                this.x = this.startX + t * (this.targetX - this.startX);
                this.y = this.startY + t * (this.targetY - this.startY);
            }
        }
    }

    move(direction: string, map: LevelMap) {
        if (this.moving) return; // Ignore input during movement

        let newTileX = this.tileX;
        let newTileY = this.tileY;

        if (direction === 'up') {
            newTileY--;
            this.direction = 'up';
        }
        if (direction === 'down') {
            newTileY++;
            this.direction = 'down';
        }
        if (direction === 'left') {
            newTileX--;
            this.direction = 'left';
        }
        if (direction === 'right') {
            newTileX++;
            this.direction = 'right';
        }

        this.animatedSpriteNode.playAnimation(`walk_${this.direction}`);

        if (
            newTileX >= 0 &&
            newTileX < map[0].length &&
            newTileY >= 0 &&
            newTileY < map.length &&
            map[newTileX][newTileY].collisionMask === CollisionMask.FLOOR
        ) {
            this.tileX = newTileX;
            this.tileY = newTileY;

            this.startX = this.x;
            this.startY = this.y;
            this.targetX = this.tileX * TILE_SIZE;
            this.targetY = this.tileY * TILE_SIZE;
            this.moveStartTime = Date.now();
            this.moving = true;
        }
    }

    stopMove() {
        this.animatedSpriteNode.playAnimation(`idle_${this.direction}`);
    }

    setTilePosition(tileX: number, tileY: number) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.x = this.tileX * TILE_SIZE;
        this.y = this.tileY * TILE_SIZE;
        this.moving = false;
    }
}
