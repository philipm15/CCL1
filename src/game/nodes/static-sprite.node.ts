import {loadSpriteByPath} from "../lib/sprite.ts";

export class StaticSpriteNode {
    spritePath: string | undefined;
    sprite: HTMLImageElement | undefined;

    constructor(spritePath?: string) {
        if (spritePath) {
            this.loadSprite(spritePath);
        }
    }

    loadSprite(spritePath: string) {
        this.spritePath = spritePath;
        loadSpriteByPath(spritePath)
            .then(sprite => {
                this.sprite = sprite;
            })
    }
}
