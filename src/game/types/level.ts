import { Player } from "../scenes/game-objects/player.ts";
import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { Input } from "../classes/input.ts";
import { Objective } from "../scenes/game-objects/objective.ts";
import { Item } from "./item.ts";

export type LevelObjective = {
    item: Item;
    node: Objective;
    required: boolean;
    acquired: boolean;
    itemsRequired?: Item[];
}

export type LevelTile = {
    nodes: CanvasItemNode[];
    collisionMask: number;
}

export type LevelMap = LevelTile[][];

export interface Level {
    player: Player;
    objectives: LevelObjective[];
    map: LevelMap;
    input: Input;
    onCompleteCallback?: () => void;

    draw(): void;
    onComplete(): void;
}
