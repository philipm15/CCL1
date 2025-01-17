import { Player } from "../game-objects/player.ts";
import { LevelObjective } from "../../types/level.ts";
import { Objective } from "../game-objects/objective.ts";
import { LevelTemplate } from "./level_template.ts";
import { Enemy } from "../game-objects/enemy.ts";
import Level_1_Json from '../../../assets/levels/level_1.json';

export class Level_1 extends LevelTemplate {
    objectives: LevelObjective[] = [
        {
            required: true,
            acquired: false,
            item: {
                name: 'Plant',
                price: 5,
                weight: 2
            },
            node: new Objective(1, 14, 'src/assets/sprites/plant.png')
        }
    ];

    enemies = [
        new Enemy(5, 5, [{x: 5, y: 5},
            {x: 6, y: 5},
            {x: 7, y: 5},
            {x: 7, y: 6},
            {x: 6, y: 6},
            {x: 5, y: 6},]),
    ]

    constructor(player: Player) {
        super(player);
        player.stopMove('up');
        player.setTilePosition(3, 18);
        this.init(Level_1_Json);
    }
}
