import {Player} from "../scenes/game-objects/player.ts";
import {Objective} from "../scenes/game-objects/objective.ts";
import {Item} from "./item.ts";
import {Camera} from "../classes/camera.ts";
import {JsonLevelData} from "../lib/level-import.ts";
import {CanvasItemNode} from "../nodes/canvas-item.node.ts";

export type LevelObjective = {
    item: Item;
    node: Objective;
    required: boolean;
    acquired: boolean;
    itemsRequired?: Item[];
}

export type LevelMap = number[][];

export interface Level {
    player1: Player;
    player2: Player;
    objectives: LevelPickup[];
    collisionMask: LevelMap;
    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;
    state: LevelState;
    possibleSpawnLocations: LevelMapPosition[];
    scorePlayer1: number;
    scorePlayer2: number;
    playerMode: 'sp' | 'mp';
    // time in milliseconds
    timeToFinish: number;
    // time in milliseconds
    remainingTime: number;
    pointsToFinish: number;

    draw(camera: Camera): void;

    onComplete(): void;

    toggleState(): void;

    reset(): void;

    startTimer(): void;

    stopTimer(): void;
}

export type LevelState = 'pause' | 'play';

export type LevelPickup<T = unknown> = {
    node: Objective;
    item?: T;
}

export type LevelMapPosition = {
    x: number;
    y: number;
}

export type LevelConfig = {
    jsonData: JsonLevelData;
    player1Position: LevelMapPosition & { direction: CanvasItemNode["direction"] };
    player2Position: LevelMapPosition & { direction: CanvasItemNode["direction"] };
    enemies: { position: LevelMapPosition, path: LevelMapPosition[], tilesPerSecond?: number }[];
    maxElementsToSpawn?: number;
}
