import { Player } from "../scenes/game-objects/player.ts";
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

export type LevelMap = number[][];

export interface Level {
    player: Player;
    objectives: LevelObjective[];
    collisionMask: LevelMap;
    input: Input;
    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;

    draw(camera: Camera): void;
    onComplete(): void;
}
