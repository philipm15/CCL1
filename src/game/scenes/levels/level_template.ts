import { Player } from "../game-objects/player.ts";
import { Input } from "../../classes/input.ts";
import { LevelMap, LevelObjective } from "../../types/level.ts";
import { CollisionMask } from "../../lib/constants.ts";
import { Enemy } from "../game-objects/enemy.ts";
import { Camera } from "../../classes/camera.ts";

export abstract class LevelTemplate {
    player: Player;
    map: LevelMap = [];
    objectives: LevelObjective[] = [];
    enemies: Enemy[] = [];

    input = new Input();
    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;

    protected constructor(player: Player) {
        this.player = player;
        player.setTilePosition(1, 1);
    }

    init() {
        (this.objectives || []).forEach(objective => {
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.ITEM);
        })

        Input.onKeyPress('e', this.onPickup.bind(this));
    }

    draw(camera: Camera): void {
        // const visibleTiles = camera.getVisibleTiles(this.map);
        //
        // visibleTiles.forEach(tile => {
        //     tile.node.draw();
        // })

        this.map.flat().forEach(tile => tile.node.draw())

        this.objectives
            .filter(objective => !objective.acquired)
            .forEach(objective => {
                objective.node.draw();
            });

        this.enemies.forEach(
            enemy => {
                enemy.update();
                enemy.draw();
            }
        )

        this.player.update();
        this.player.draw();

        this.checkIfPlayerCanPickupItem();
        this.checkFailedState();
    }

    onComplete() {
        this.onCompleteCallback && this.onCompleteCallback();
    }

    onPickup() {
        const availableObjective = this.getAvailableObjective();
        if (availableObjective) {
            availableObjective.acquired = true;
            this.setCollisionMask(availableObjective.node.tileX, availableObjective.node.tileY, CollisionMask.FLOOR)
            this.checkCompleteState();
        }
    }

    checkIfPlayerCanPickupItem() {
        const availableObjective = this.getAvailableObjective();

        // TODO: add indicator to signal that the item can be picked up
    }

    getAvailableObjective() {
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

    setCollisionMask(tileX: number, tileY: number, collisionMask: CollisionMask) {
        this.map[tileX][tileY].collisionMask = collisionMask;
    }

    checkCompleteState() {
        const objectives = this.objectives;

        if (objectives.every(objective => objective.acquired)) {
            this.onComplete();
        }
    }

    checkFailedState() {
         if(this.enemies.some(enemy => enemy.checkCollision(this.player))) {
             this.onFailedCallback && this.onFailedCallback();
         }
    }
}
