import { Player } from "../scenes/game-objects/player.ts";
import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { Input } from "../classes/input.ts";
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

export type LevelTile = {
    node: CanvasItemNode;
    collisionMask: number;
}

export type LevelMap = number[][];

export interface Level {
    player: Player;
    objectives: LevelObjective[];
    map: LevelMap;
    collisionMask: number[][];
    input: Input;
    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;

    draw(camera: Camera): void;
    onComplete(): void;
}
