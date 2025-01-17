import { Player } from "../game-objects/player.ts";
import { Input } from "../../classes/input.ts";
import { LevelObjective } from "../../types/level.ts";
import { CollisionMask, TILE_SIZE } from "../../lib/constants.ts";
import { Enemy } from "../game-objects/enemy.ts";
import { Camera } from "../../classes/camera.ts";
import { CanvasManager } from "../../classes/canvas-manager.ts";
import { importLevelFromJson, JsonLevelData, LevelLayer } from "../../lib/level-import.ts";
import { MapBuilder } from "../../classes/map-builder.ts";

export abstract class LevelTemplate {
    player: Player;
    objectives: LevelObjective[] = [];
    enemies: Enemy[] = [];
    canvasManager = CanvasManager.getInstance();
    mapBuilder = MapBuilder.getInstance();
    layers: LevelLayer[] = [];
    collisionMask: number[][] = [];

    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;

    protected constructor(player: Player) {
        this.player = player;
        player.setTilePosition(1, 1);
    }

    init(data: JsonLevelData) {
        this.layers = importLevelFromJson(data);
        this.collisionMask = this.layers.find(layer => layer.name === 'collide')!.matrix;
        (this.objectives || []).forEach(objective => {
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.ITEM);
        })

        Input.onKeyPress('e', this.onPickup.bind(this));
    }

    draw(camera: Camera): void {
        // Adjust the canvas for the camera's position
        const ctx = this.canvasManager.ctx; // Replace with your actual canvas context
        ctx.save();
        // ctx.translate(-camera.cameraX * TILE_SIZE, -camera.cameraY * TILE_SIZE);

        // Draw all tiles
        this.layers
            .slice(0, -1)
            .forEach(layer => {
                layer.matrix.forEach((row, rowIndex) => {
                    row.forEach((spriteIndex, colIndex) => {
                        if (this.mapBuilder.tiles[spriteIndex]) {
                            ctx.drawImage(this.mapBuilder.tiles[spriteIndex], colIndex * TILE_SIZE, rowIndex * TILE_SIZE, 32, 32);
                        }
                    })
                })
            })

        // Draw all objectives
        this.objectives
            .filter(objective => !objective.acquired)
            .forEach(objective => {
                objective.node.draw();
            });

        // Draw all enemies
        this.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw();
        });

        // Draw the player
        this.player.update();
        this.player.draw();

        this.layers.at(-1)!.matrix.forEach((row, rowIndex) => {
            row.forEach((spriteIndex, colIndex) => {
                if (this.mapBuilder.tiles[spriteIndex]) {
                    ctx.drawImage(this.mapBuilder.tiles[spriteIndex], colIndex * TILE_SIZE, rowIndex * TILE_SIZE, 32, 32);
                }
            })
        })


        // Restore the canvas to its original state
        ctx.restore();

        // Check for interactions and game state
        this.checkIfPlayerCanPickupItem();
        this.checkFailedState();
    }


    onComplete() {
        this.onCompleteCallback && this.onCompleteCallback();
    }

    onPickup() {
        const availableObjective = this.getAvailableObjective();
        console.log({availableObjective});
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
        this.collisionMask[tileY][tileX] = collisionMask;
    }

    checkCompleteState() {
        const objectives = this.objectives;

        if (objectives.every(objective => objective.acquired)) {
            this.onComplete();
        }
    }

    checkFailedState() {
        if (this.enemies.some(enemy => enemy.checkCollision(this.player))) {
            this.onFailedCallback && this.onFailedCallback();
        }
    }
}
