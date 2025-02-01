import {CanvasItemNodeDirection} from "../../nodes/canvas-item.node.ts";
import {AnimatedSpriteNode} from "../../nodes/animated-sprite.node.ts";
import {CollisionMask, MAP_SIZE, TILE_SIZE} from "../../lib/constants.ts";
import {AnimatedCharacterNode} from "../../nodes/animated-character.node.ts";

export type PlayerCollidedEvent = {
    collisionMask: number;
}

export class Player extends AnimatedCharacterNode {
    animatedSpriteNode = new AnimatedSpriteNode({
        spriteSheetPath: 'assets/spritesheets/player_blue.png',
        rows: 4,
        cols: 4,
        defaultAnimation: 'idle_down',
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

    constructor(tileX: number, tileY: number, spriteSheetPath: string = 'assets/spritesheets/player_red.png') {
        super(tileX * TILE_SIZE, tileY * TILE_SIZE, tileX, tileY);
        this.animatedSpriteNode.config.spriteSheetPath = spriteSheetPath;
        this.animatedSpriteNode.init();
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

        this.dispatchEvent(new Event('player:update'));
    }

    move(direction: CanvasItemNodeDirection, collisionMask: number[][]) {
        if (this.moving) return; // Ignore input during movement

        let newTileX = this.tileX;
        let newTileY = this.tileY;

        this.direction = direction;
        if (direction === 'up') {
            newTileY--;
        }
        if (direction === 'down') {
            newTileY++;
        }
        if (direction === 'left') {
            newTileX--;
        }
        if (direction === 'right') {
            newTileX++;
        }

        this.animatedSpriteNode.playAnimation(`walk_${this.direction}`);

        if (
            newTileX >= 0 &&
            newTileX < MAP_SIZE &&
            newTileY >= 0 &&
            newTileY < MAP_SIZE &&
            collisionMask[newTileY][newTileX] <= CollisionMask.FLOOR
        ) {
            this.tileX = newTileX;
            this.tileY = newTileY;

            this.startX = this.x;
            this.startY = this.y;
            this.targetX = this.tileX * TILE_SIZE;
            this.targetY = this.tileY * TILE_SIZE;
            this.moveStartTime = Date.now();
            this.moving = true;

            if (collisionMask[newTileY][newTileX] < CollisionMask.FLOOR) {
                this.dispatchEvent(new CustomEvent<PlayerCollidedEvent>('player:collided', {
                    detail: {
                        collisionMask: collisionMask[newTileY][newTileX],
                    }
                }));
            }
        } else {
            const isOutOfBounds = newTileX >= MAP_SIZE || newTileY >= MAP_SIZE || newTileX < 0 || newTileY < 0;
            this.dispatchEvent(new CustomEvent<PlayerCollidedEvent>('player:collided', {
                detail: {
                    collisionMask: isOutOfBounds ? 1 : collisionMask[newTileY][newTileX],
                }
            }));
        }
    }
}
