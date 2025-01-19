import { Player } from "../scenes/game-objects/player.ts";
import { Objective } from "../scenes/game-objects/objective.ts";
import { Item } from "./item.ts";
import { Camera } from "../classes/camera.ts";

export type LevelObjective = {
    item: Item;
    node: Objective;
    required: boolean;
    acquired: boolean;
    itemsRequired?: Item[];
}

export type LevelMap = number[][];

export interface Level {
    player: Player;
    objectives: LevelPickup[];
    collisionMask: LevelMap;
    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;
    state: 'pause' | 'play' | 'fail';
    possibleSpawnLocations: LevelMapPosition[];
    score: number;

    draw(camera: Camera): void;
    onComplete(): void;
    toggleState(): void;
    destroy(): void;
}

export type LevelState = Level["state"];

export type LevelPickup<T = unknown> = {
    node: Objective;
    item?: T;
}

export type LevelMapPosition = {
    x: number;
    y: number;
}