import { Player } from "../game-objects/player.ts";
import { LevelTemplate } from "./level_template.ts";
import { Enemy } from "../game-objects/enemy.ts";
import Level_1_Json from '../../../assets/levels/level_1.json';

export class Level_1 extends LevelTemplate {
    enemies = [
        new Enemy(2, 3, [{x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3}, {x: 7, y: 3}])
    ]

    constructor(player: Player) {
        super(player);
        player.stopMove('up');
        player.setTilePosition(3, 18);
        this.init(Level_1_Json);
    }
}
