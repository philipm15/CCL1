export type AnimatedSpriteConfig = {
    spriteSheetPath: string;
    animations: Record<string, AnimationConfig>
}

export type AnimationConfig = {
    name: string;
    row: number;
    numberOfSprites: number;
    animationSpeed: number;
}

export class AnimatedSpriteNode {

}
