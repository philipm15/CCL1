export const TILE_SIZE = 32;
export const MAP_SIZE = 20;
export const PLAYER_SPEED = 4.5;
export const OBJECTIVE_SPRITE_PATHS = [
    'assets/sprites/money_bag.png',
    'assets/sprites/pill_orange.png',
    'assets/sprites/pill_violet.png',
]

export enum CollisionMask {
    ENEMY = 1,
    FLOOR = 0,
    ITEM = -1,
}
