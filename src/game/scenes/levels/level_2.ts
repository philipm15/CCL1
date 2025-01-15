import {Player} from "../game-objects/player.ts";
import {LevelMap, LevelObjective} from "../../types/level.ts";
import {Floor} from "../game-objects/floor.ts";
import {Objective} from "../game-objects/objective.ts";
import {LevelTemplate} from "./level_template.ts";

export class Level_2 extends LevelTemplate {
    map: LevelMap =
        Array.from({length: 20})
            .map((_, i) => {
                return Array.from({length: 20})
                    .map((_, j) => {
                        return {
                            node: new Floor(j, i, j, i),
                            collisionMask: 0
                        }
                    })
            })

    objectives: LevelObjective[] = [
        {
            required: true,
            acquired: false,
            item: {
                name: 'Plant',
                price: 5,
                weight: 2
            },
            node: new Objective(2, 1, 'src/assets/sprites/plant.png')
        }
    ];

    constructor(player: Player) {
        super(player);
        player.setTilePosition(9,1);
        this.init();
    }
}
