import {CanvasItemNode} from "../../nodes/canvas-item.node.ts";
import {StaticSpriteNode} from "../../nodes/static-sprite.node.ts";
import {OBJECTIVE_SPRITE_PATHS, TILE_SIZE} from "../../lib/constants.ts";
import {getRandomArrayEntry} from "../../lib/array-helpers.ts";

export class Objective extends CanvasItemNode {
    staticSpriteNode = new StaticSpriteNode();

    constructor(x: number, y: number, spritePath: string) {
        super(x * TILE_SIZE, y * TILE_SIZE, x, y);
        this.staticSpriteNode.loadSprite(spritePath);
    }

    draw() {
        if (this.staticSpriteNode.sprite?.complete) {
            this.ctx.drawImage(this.staticSpriteNode.sprite, this.x, this.y, this.tileSize, this.tileSize);
        }
    }

    static getRandomObjectiveSpritePath() {
        return getRandomArrayEntry(OBJECTIVE_SPRITE_PATHS);
    }
}
