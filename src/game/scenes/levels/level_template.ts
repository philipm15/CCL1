import {Player, PlayerCollidedEvent} from "../game-objects/player.ts";
import {Level, LevelMapPosition, LevelPickup, LevelState} from "../../types/level.ts";
import {CollisionMask, TILE_SIZE} from "../../lib/constants.ts";
import {Enemy} from "../game-objects/enemy.ts";
import {CanvasManager} from "../../classes/canvas-manager.ts";
import {importLevelFromJson, JsonLevelData, LevelLayer} from "../../lib/level-import.ts";
import {MapBuilder} from "../../classes/map-builder.ts";
import {Objective} from "../game-objects/objective.ts";
import {getRandomArrayEntry, shuffleArray} from "../../lib/array-helpers.ts";
import {EventTargetBase} from "../../lib/event-target.decorator.ts";

export class LevelTemplate extends EventTargetBase implements Level {
    player: Player;
    objectives: LevelPickup[] = [];
    enemies: Enemy[] = [];
    canvasManager = CanvasManager.getInstance();
    mapBuilder = MapBuilder.getInstance();
    layers: LevelLayer[] = [];
    collisionMask: number[][] = [];
    state: LevelState = 'pause';
    score = 0;
    maxElementsToSpawn = 1;

    onCompleteCallback?: () => void;
    onFailedCallback?: () => void;

    constructor(player: Player) {
        super();
        this.player = player;
        player.setTilePosition(1, 1);
        player.addEventListener('player:collided', this.onPlayerCollision.bind(this));
    }

    get possibleSpawnLocations(): LevelMapPosition[] {
        const spawnLocations: LevelMapPosition[] = [];
        const collisionMask = this.collisionMask;
        for (let y = 0; y < collisionMask.length; y++) {
            for (let x = 0; x < collisionMask[y].length; x++) {
                if (collisionMask[y][x] === CollisionMask.FLOOR) { // Only consider locations with a mask of 0
                    spawnLocations.push({x, y});
                }
            }
        }
        return spawnLocations;
    }

    init(data: JsonLevelData) {
        this.layers = importLevelFromJson(data);
        this.collisionMask = this.layers.find(layer => layer.name === 'collide')!.matrix;
        (this.objectives || []).forEach(objective => {
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.ITEM);
        })
        // Input.onKeyPress('e', this.onPickup.bind(this));
    }

    draw(): void {
        this.checkAndCreateObjectives();
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
            .forEach(objective => {
                objective.node.draw();
            });

        // Draw all enemies
        this.enemies.forEach(enemy => {
            if (this.state === 'play') {
                enemy.update();
            }
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

        if (this.state === 'play') {
            this.player.move(this.player.direction, this.collisionMask);
        }

        // Restore the canvas to its original state
        ctx.restore();

        this.checkFailedState();
    }


    onComplete() {
        this.onCompleteCallback && this.onCompleteCallback();
    }

    // onPickup() {
    //     const availableObjective = this.getAvailableObjective();
    //     if (availableObjective) {
    //         this.setCollisionMask(availableObjective.node.tileX, availableObjective.node.tileY, CollisionMask.FLOOR)
    //         this.checkCompleteState();
    //     }
    // }

    // getAvailableObjective() {
    //     const playerDirection = this.player.direction;
    //     const positionToCheck = [this.player.tileX, this.player.tileY];
    //
    //     if (playerDirection === 'up') {
    //         positionToCheck[1] -= 1;
    //     }
    //
    //     if (playerDirection === 'down') {
    //         positionToCheck[1] += 1;
    //     }
    //
    //     if (playerDirection === 'left') {
    //         positionToCheck[0] -= 1;
    //     }
    //
    //     if (playerDirection === 'right') {
    //         positionToCheck[0] += 1;
    //     }
    //
    //     return this.objectives.find(objective => {
    //         return objective.node.tileX === positionToCheck[0] && objective.node.tileY === positionToCheck[1]
    //     });
    // }

    setCollisionMask(tileX: number, tileY: number, collisionMask: CollisionMask) {
        this.collisionMask[tileY][tileX] = collisionMask;
    }

    // checkCompleteState() {
    //     const objectives = this.objectives;
    //
    //     if (objectives.every(objective => objective.acquired)) {
    //         this.onComplete();
    //     }
    // }

    checkFailedState() {
        if (this.enemies.some(enemy => enemy.checkCollision(this.player))) {
            this.onFailedCallback && this.onFailedCallback();
        }
    }

    toggleState() {
        if (this.state === 'pause' || this.state === 'fail') {
            return this.state = 'play';
        }

        if (this.state === 'play') {
            return this.state = 'pause';
        }
    }

    checkAndCreateObjectives() {
        if (this.objectives.length < this.maxElementsToSpawn) {
            const randomSpawnLocation = getRandomArrayEntry(shuffleArray(this.possibleSpawnLocations));
            this.setCollisionMask(randomSpawnLocation.x, randomSpawnLocation.y, CollisionMask.ITEM);
            this.objectives.push(
                {
                    node: new Objective(
                        randomSpawnLocation.x,
                        randomSpawnLocation.y,
                        'src/assets/sprites/plant.png'
                    )
                }
            )
        }
    }

    onPlayerCollision(event: CustomEvent<PlayerCollidedEvent>) {
        const collisionMask = event.detail.collisionMask;

        if (collisionMask === CollisionMask.ITEM) {
            this.score++;
            const objective = this.objectives[0]!;
            console.log(this.objectives)
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.FLOOR);
            this.objectives.pop();

            this.dispatchEvent(new Event('level:score_update'));
        }
    }

    destroy() {
        this.player.removeEventListener('player:collided', this.onPlayerCollision);
        console.log("destroy!", this.player)
    }
}
