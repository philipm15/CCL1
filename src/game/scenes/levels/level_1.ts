import { Player } from "../player.ts";
import { Level, LevelMap, LevelObjective } from "../../types/level.ts";
import { Input } from "../../classes/input.ts";
import { Floor } from "../floor.ts";

export class Level_1 implements Level {
    player: Player;
    map: LevelMap =
        Array.from({length: 20})
            .map((_, i) => {
                return Array.from({length: 20})
                    .map((_, j) => {
                        return {
                            nodes: [new Floor(j, i, j, i)],
                            collisionMask: 0
                        }
                    })
            })

    objectives: LevelObjective[] = [];
    input = new Input();
    onCompleteCallback?: () => void;

    constructor(player: Player) {
        this.player = player;
    }

    draw(): void {
        console.log(this.map)
        this.map.forEach(row => row.forEach(tile => {
            tile.nodes.forEach(node => node.draw());
        }));

        this.objectives.forEach(objective => {
            objective.node.draw();
        });

        this.player.update();
        this.player.draw();
    }

    restart() {
    }

    onComplete() {
        this.onCompleteCallback && this.onCompleteCallback();
    }
}
