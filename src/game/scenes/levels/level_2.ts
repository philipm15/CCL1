import { Player } from "../game-objects/player.ts";
import { LevelObjective } from "../../types/level.ts";
import { Objective } from "../game-objects/objective.ts";
import { LevelTemplate } from "./level_template.ts";
import Level_1_Json from "../../../assets/levels/level_1.json";

export class Level_2 extends LevelTemplate {
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
        player.stopMove('up');
        player.setTilePosition(3, 18);
        this.init(Level_1_Json);
    }
}
