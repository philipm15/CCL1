import { Player } from "../player.ts";
import { Level, LevelMap, LevelObjective } from "../../types/level.ts";
import { Input } from "../../classes/input.ts";
import { Floor } from "../floor.ts";
import { Item } from "../item.ts";
import { CollisionMask } from "../../lib/constants.ts";

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

    objectives: LevelObjective[] = [
        {
            required: true,
            acquired: false,
            item: {
                name: 'Plant',
                price: 5,
                weight: 2
            },
            node: new Item(10, 5, 'src/assets/sprites/plant.png')
        }
    ];
    input = new Input();
    onCompleteCallback?: () => void;

    constructor(player: Player) {
        this.player = player;

        this.objectives.forEach(objective => {
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.ITEM);
        })

        Input.onKeyPress('e', this.onPickup.bind(this));
    }

    draw(): void {
        this.map.forEach(row => row.forEach(tile => {
            tile.nodes.forEach(node => node.draw());
        }));

        this.objectives
            .filter(objective => !objective.acquired)
            .forEach(objective => {
                objective.node.draw();
            });

        this.player.update();
        this.player.draw();

        this.checkIfPlayerCanPickupItem();
    }

    restart() {
    }

    onComplete() {
        this.onCompleteCallback && this.onCompleteCallback();
    }

    private onPickup() {
        const availableObjective = this.getAvailableObjective();
        if (availableObjective) {
            availableObjective.acquired = true;
            this.setCollisionMask(availableObjective.node.tileX, availableObjective.node.tileY, CollisionMask.FLOOR)
        }
    }

    private checkIfPlayerCanPickupItem() {
        const availableObjective = this.getAvailableObjective();
    }

    private getAvailableObjective() {
        const playerDirection = this.player.direction;
        const positionToCheck = [this.player.tileX, this.player.tileY];

        if (playerDirection === 'up') {
            positionToCheck[1] -= 1;
        }

        if (playerDirection === 'down') {
            positionToCheck[1] += 1;
        }

        if (playerDirection === 'left') {
            positionToCheck[0] -= 1;
        }

        if (playerDirection === 'right') {
            positionToCheck[0] += 1;
        }

        return this.objectives.find(objective => {
            return objective.node.tileX === positionToCheck[0] && objective.node.tileY === positionToCheck[1]
        });
    }

    private setCollisionMask(tileX: number, tileY: number, collisionMask: CollisionMask) {
        this.map[tileX][tileY].collisionMask = collisionMask;
    }
}
