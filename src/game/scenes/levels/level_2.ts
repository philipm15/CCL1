import Level_2_Json from '../../../assets/levels/level_2.json';
import {LevelConfig} from "../../types/level.ts";

export const Level_2: LevelConfig = {
    jsonData: Level_2_Json,
    player1Position: {x: 16, y: 2, direction: 'down'},
    player2Position: {x: 17, y: 2, direction: 'down'},
    enemies: [
        {
            position: {x: 2, y: 16},
            path: [{x: 2, y: 16}, {x: 3, y: 16}, {x: 4, y: 16}, {x: 5, y: 16}, {x: 6, y: 16}, {x: 7, y: 16}]
        },
        {
            position: {x: 8, y: 9},
            path: [{x: 8, y: 9}, {x: 8, y: 8}, {x: 8, y: 7}, {x: 8, y: 6}],
            tilesPerSecond: 3
        },
        {
            position: {x: 18, y: 14},
            path: [{x: 18, y: 14}, {x: 17, y: 14}, {x: 16, y: 14}]
        }
    ]
}
