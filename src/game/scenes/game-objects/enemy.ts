import {AnimatedSpriteNode} from "../../nodes/animated-sprite.node.ts";
import {TILE_SIZE} from "../../lib/constants.ts";
import {AnimatedCharacterNode} from "../../nodes/animated-character.node.ts";

export class Enemy extends AnimatedCharacterNode {
    private path: { x: number; y: number }[] = [];
    private currentPathIndex: number = 0;
    private reverse: boolean = false;

    tilesPerSecond = 2; // Speed of the enemy
    animatedSpriteNode = new AnimatedSpriteNode({
        spriteSheetPath: 'assets/spritesheets/enemy_1.png',
        rows: 4,
        cols: 4,
        defaultAnimation: 'idle_right',
        tileSize: TILE_SIZE * 2,
        animations: {
            'idle_down': {
                row: 0,
                numberOfSprites: 1,
            },
            'idle_right': {
                row: 1,
                numberOfSprites: 1,
            },
            'idle_left': {
                row: 2,
                numberOfSprites: 1,
            },
            'idle_up': {
                row: 3,
                numberOfSprites: 1,
            },
            'walk_down': {
                row: 0,
                numberOfSprites: 4,
            },
            'walk_left': {
                row: 1,
                numberOfSprites: 4,
            },
            'walk_right': {
                row: 2,
                numberOfSprites: 4,
            },
            'walk_up': {
                row: 3,
                numberOfSprites: 4,
            }
        }
    });

    constructor(tileX: number, tileY: number, path: {
        x: number;
        y: number
    }[], tilesPerSecond?: number, spriteSheetPath: string = 'assets/spritesheets/enemy_1.png') {
        super(tileX * TILE_SIZE, tileY * TILE_SIZE, tileX, tileY);
        this.path = path;
        this.tilesPerSecond = tilesPerSecond ?? this.tilesPerSecond;
        this.animatedSpriteNode.config.spriteSheetPath = spriteSheetPath;
        this.animatedSpriteNode.init();
        this.direction = this.getDirectionToTile(path[0]);
        this.animatedSpriteNode.playAnimation(`idle_${this.direction}`);

        if (path && path.length > 0) {
            this.startNextMove();
        }
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
}

