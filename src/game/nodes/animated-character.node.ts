import {EventTargetMixin} from "../lib/event-target.ts";
import {CanvasItemNode, CanvasItemNodeDirection} from "./canvas-item.node.ts";
import {AnimatedSpriteNode} from "./animated-sprite.node.ts";
import {PLAYER_SPEED, TILE_SIZE} from "../lib/constants.ts";

export class AnimatedCharacterNode extends EventTargetMixin(CanvasItemNode) {
    tilesPerSecond = PLAYER_SPEED;
    animatedSpriteNode!: AnimatedSpriteNode;
    moveStartTime: number = 0;
    moving: boolean = false;
    startX: number = 0;
    startY: number = 0;
    targetX: number = 0;
    targetY: number = 0;

    draw() {
        if (!this.animatedSpriteNode.currentAnimation) return;

        const frames = this.animatedSpriteNode.currentAnimation.frames;
        const frame = frames[Math.floor(Date.now() / 150) % frames.length];

        this.ctx.drawImage(frame, this.x, this.y, this.tileSize, this.tileSize);
    }

    stopMove(direction: CanvasItemNodeDirection = this.direction) {
        this.updateDirection(direction);
        this.animatedSpriteNode.playAnimation(`idle_${this.direction}`);
    }

    setTilePosition(tileX: number, tileY: number) {
        this.tileX = tileX;
        this.tileY = tileY;
        this.x = this.tileX * TILE_SIZE;
        this.y = this.tileY * TILE_SIZE;
        this.moving = false;
    }

    updateDirection(direction: CanvasItemNodeDirection = this.direction) {
        this.direction = direction;
    }

    getDirectionToTile(nextTile: { x: number; y: number }): CanvasItemNode["direction"] {
        if (nextTile.x > this.tileX) return "right";
        if (nextTile.x < this.tileX) return "left";
        if (nextTile.y > this.tileY) return "down";
        if (nextTile.y < this.tileY) return "up";
        return "down";
    }
}