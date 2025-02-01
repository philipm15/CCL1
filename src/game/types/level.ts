import {Player} from "../scenes/game-objects/player.ts";
import {Objective} from "../scenes/game-objects/objective.ts";
import {JsonLevelData} from "../lib/level-import.ts";
import {CanvasItemNode} from "../nodes/canvas-item.node.ts";

export type LevelMap = number[][];

export interface Level {
    player1: Player;
    player2: Player;
    objectives: LevelPickup[];
    collisionMask: LevelMap;
    onCompleteCallback?: (result: LevelResult) => void;
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

    draw(): void;

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

export type LevelResult = {
    name: string;
    score: number;
}
