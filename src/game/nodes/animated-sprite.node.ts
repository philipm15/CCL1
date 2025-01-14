import {extractFramesFromSpritesheet} from "../lib/sprite.ts";

export type AnimatedSpriteConfig = {
    spriteSheetPath: string;
    rows: number;
    cols: number;
    animations: Record<string, AnimationConfig>;
    defaultAnimation: keyof AnimatedSpriteConfig['animations'];
}

export type AnimationConfig = {
    row: number;
    numberOfSprites: number;
    animationSpeed?: number;
}

export type Animation = AnimationConfig & { frames: HTMLCanvasElement[] };

export class AnimatedSpriteNode {
    currentAnimation: Animation | undefined;
    frames: HTMLCanvasElement[][] = [];
    animations: Record<string, Animation> = {};

    constructor(private config: AnimatedSpriteConfig) {
        const spriteSheet = new Image();
        spriteSheet.src = config.spriteSheetPath;
        spriteSheet.onload = () => {
            this.frames = extractFramesFromSpritesheet(spriteSheet, config.rows, config.cols);
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
