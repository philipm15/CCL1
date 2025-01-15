import {CanvasItemNode} from "../../nodes/canvas-item.node.ts";
import {AnimatedSpriteNode} from "../../nodes/animated-sprite.node.ts";
import {TILE_SIZE} from "../../lib/constants.ts";

export class Enemy extends CanvasItemNode {
    private tilesPerSecond = 3; // Speed of the enemy
    private animatedSpriteNode = new AnimatedSpriteNode({
        spriteSheetPath: 'src/assets/spritesheets/enemy_1.png',
        rows: 13,
        cols: 4,
        defaultAnimation: 'idle_down',
        animations: {
            'idle_down': { row: 0, numberOfSprites: 4 },
            'idle_right': { row: 1, numberOfSprites: 4 },
            'idle_left': { row: 2, numberOfSprites: 4 },
            'idle_up': { row: 3, numberOfSprites: 4 },
            'walk_down': { row: 5, numberOfSprites: 4 },
            'walk_left': { row: 7, numberOfSprites: 4 },
            'walk_right': { row: 9, numberOfSprites: 4 },
            'walk_up': { row: 11, numberOfSprites: 4 },
        }
    });

    private path: { x: number; y: number }[] = [];
    private currentPathIndex: number = 0;
    private moveStartTime: number = 0;
    private moving: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private targetX: number = 0;
    private targetY: number = 0;
    private reverse: boolean = false;

    constructor(tileX: number, tileY: number, path: { x: number; y: number }[], tilesPerSecond = 3) {
        super(tileX * TILE_SIZE, tileY * TILE_SIZE, tileX, tileY);
        this.path = path;
        this.tilesPerSecond = tilesPerSecond

        if (path && path.length > 0) {
            this.startNextMove();
        }
    }

    draw() {
        if (!this.animatedSpriteNode.currentAnimation) return;

        const frames = this.animatedSpriteNode.currentAnimation.frames;
        const frame = frames[Math.floor(Date.now() / 150) % frames.length];
        this.ctx.drawImage(frame, this.x, this.y, this.tileSize, this.tileSize);
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

                this.reverse ? this.currentPathIndex-- : this.currentPathIndex++;

                // Handle path reversal
                if (this.currentPathIndex >= this.path.length) {
                    this.currentPathIndex = this.path.length - 2;
                    this.reverse = true;
                } else if (this.currentPathIndex < 0) {
                    this.currentPathIndex = 1;
                    this.reverse = false;
                }

                this.startNextMove();
            } else {
                // Smooth interpolation
                const t = elapsed / moveDuration;
                this.x = this.startX + t * (this.targetX - this.startX);
                this.y = this.startY + t * (this.targetY - this.startY);
            }
        }
    }

    startNextMove() {
        if (this.path.length === 0 || this.currentPathIndex < 0 || this.currentPathIndex >= this.path.length) {
            this.animatedSpriteNode.playAnimation(`idle_down`);
            return;
        }

        const nextTile = this.path[this.currentPathIndex];
        const direction = this.getDirectionToTile(nextTile);

        this.animatedSpriteNode.playAnimation(`walk_${direction}`);
        this.startX = this.x;
        this.startY = this.y;
        this.targetX = nextTile.x * TILE_SIZE;
        this.targetY = nextTile.y * TILE_SIZE;
        this.tileX = nextTile.x;
        this.tileY = nextTile.y;
        this.moveStartTime = Date.now();
        this.moving = true;
    }

    getDirectionToTile(nextTile: { x: number; y: number }): string {
        if (nextTile.x > this.tileX) return "right";
        if (nextTile.x < this.tileX) return "left";
        if (nextTile.y > this.tileY) return "down";
        if (nextTile.y < this.tileY) return "up";
        return "down";
    }
}

