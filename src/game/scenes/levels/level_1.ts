import Level_1_Json from '../../../assets/levels/level_1.json';
import {LevelConfig} from "../../types/level.ts";

export const Level_1: LevelConfig = {
    jsonData: Level_1_Json,
    player1Position: {x: 8, y: 19, direction: 'up'},
    player2Position: {x: 11, y: 19, direction: 'up'},
    enemies: [
        {
            position: {x: 2, y: 3},
            path: [{x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 5, y: 3}, {x: 6, y: 3}, {x: 7, y: 3}]
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
