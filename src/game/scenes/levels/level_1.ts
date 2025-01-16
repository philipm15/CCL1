import {Player} from "../game-objects/player.ts";
import {LevelMap, LevelObjective} from "../../types/level.ts";
import {Floor} from "../game-objects/floor.ts";
import {Objective} from "../game-objects/objective.ts";
import {LevelTemplate} from "./level_template.ts";
import {Enemy} from "../game-objects/enemy.ts";
import { CollisionMask, MAP_SIZE } from "../../lib/constants.ts";
import { Wall } from "../game-objects/wall.ts";
import Level_1_Json from '../../../assets/levels/level_1.json';

export class Level_1 extends LevelTemplate {
    map: LevelMap =
        Array.from({length: 20})
            .map((_, i) => {
                return Array.from({length: 20})
                    .map((_, j) => {
                        if(i === 0 || i === MAP_SIZE - 1 || j === 0 || j === MAP_SIZE - 1) {
                            return {
                                node: new Wall(j, i, j, i),
                                collisionMask: CollisionMask.STATIC
                            }
                        }

                        return {
                            node: new Floor(j, i, (i + j) % 2 === 1 ? 'lightblue' : 'lightslategray'),
                            collisionMask: CollisionMask.FLOOR
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
            node: new Objective(10, 5, 'src/assets/sprites/plant.png')
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
        this.init(Level_1_Json);
        console.log(this.layers);
    }
}
