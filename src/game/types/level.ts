import { Item } from "./item.ts";
import { Player } from "../scenes/player.ts";
import { CanvasItemNode } from "../nodes/canvas-item.node.ts";
import { Input } from "../classes/input.ts";

export type LevelObjective = {
    item: Item;
    node: CanvasItemNode;
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
    restart(): void;
    onComplete(): void;
}
