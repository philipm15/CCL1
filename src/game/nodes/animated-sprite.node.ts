import { extractFramesFromSpritesheet } from "../lib/sprite.ts";
import { TILE_SIZE } from "../lib/constants.ts";

export type AnimatedSpriteConfig = {
    spriteSheetPath: string;
    rows: number;
    cols: number;
    animations: Record<string, AnimationConfig>;
    defaultAnimation: keyof AnimatedSpriteConfig['animations'];
    tileSize?: number;
}

export type AnimationConfig = {
    row: number;
    numberOfSprites: number;
    animationSpeed?: number;
}

export type Animation = AnimationConfig & { frames: HTMLCanvasElement[] };

export class AnimatedSpriteNode {
    config!: AnimatedSpriteConfig;
    currentAnimation: Animation | undefined;
    frames: HTMLCanvasElement[][] = [];
    animations: Record<string, Animation> = {};

    constructor(animatedSpriteConfig: AnimatedSpriteConfig) {
        this.config = animatedSpriteConfig;
    }

    init() {
        const config = this.config;

        if (!config) return;
        const spriteSheet = new Image();
        spriteSheet.src = config.spriteSheetPath;
        spriteSheet.onload = () => {
            this.frames = extractFramesFromSpritesheet(spriteSheet, config.rows, config.cols, config.tileSize ?? TILE_SIZE, config.tileSize ?? TILE_SIZE);
            this.setupAnimations();
        }
    }

    playAnimation(animationName: keyof AnimatedSpriteConfig['animations']) {
        this.currentAnimation = this.animations[animationName];
    }

    private setupAnimations() {
        Object.keys(this.config.animations).forEach(animationName => {
            const animation = this.config.animations[animationName];
            const frames = this.frames[animation.row].slice(0, animation.numberOfSprites);
            this.animations[animationName] = {
                ...animation,
                frames
            }
        });

        this.playAnimation(this.config.defaultAnimation);
    }
}
