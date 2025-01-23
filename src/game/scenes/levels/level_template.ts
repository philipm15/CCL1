import { Player, PlayerCollidedEvent } from "../game-objects/player.ts";
import { Level, LevelConfig, LevelMapPosition, LevelPickup, LevelResult, LevelState } from "../../types/level.ts";
import { CollisionMask, PLAYER_SPEED, TILE_SIZE } from "../../lib/constants.ts";
import { Enemy } from "../game-objects/enemy.ts";
import { UIManager } from "../../classes/ui-manager.ts";
import { importLevelFromJson, LevelLayer } from "../../lib/level-import.ts";
import { MapBuilder } from "../../classes/map-builder.ts";
import { Objective } from "../game-objects/objective.ts";
import { getRandomArrayEntry, shuffleArray } from "../../lib/array-helpers.ts";
import { EventTargetBase } from "../../lib/event-target.decorator.ts";

export class LevelTemplate extends EventTargetBase implements Level {
    private currentLevelConfig!: LevelConfig;
    private timerInterval: ReturnType<typeof setInterval> | undefined;
    player1: Player;
    player2: Player;
    objectives: LevelPickup[] = [];
    enemies: Enemy[] = [];
    canvasManager = UIManager.getInstance();
    mapBuilder = MapBuilder.getInstance();
    layers: LevelLayer[] = [];
    collisionMask: number[][] = [];
    state: LevelState = 'pause';
    scorePlayer1 = 0;
    scorePlayer2 = 0;
    maxElementsToSpawn = 1;
    playerMode: Level["playerMode"] = "mp";
    timeToFinish = 5000;
    remainingTime = this.timeToFinish;
    pointsToFinish = 20;
    onCompleteCallback: (result: LevelResult) => void = () => {};

    constructor(player1: Player, player2: Player) {
        super();
        this.player1 = player1;
        this.player2 = player2;
        player1.stopMove();
        player2.stopMove();
        this.setupListeners();
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

    init(levelConfig: LevelConfig) {
        this.stopTimer();
        this.state = 'pause';
        this.currentLevelConfig = levelConfig;
        this.layers = importLevelFromJson(levelConfig.jsonData);
        this.collisionMask = this.layers.find(layer => layer.name === 'collide')!.matrix;
        this.objectives = [];
        (this.objectives || []).forEach(objective => {
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.ITEM);
        })
        this.enemies = levelConfig.enemies.map(enemy => new Enemy(enemy.position.x, enemy.position.y, enemy.path, enemy.tilesPerSecond ?? 2));

        this.player1.setTilePosition(levelConfig.player1Position.x, levelConfig.player1Position.y)
        this.player1.tilesPerSecond = PLAYER_SPEED;
        this.player2.setTilePosition(levelConfig.player2Position.x, levelConfig.player2Position.y)
        this.player2.tilesPerSecond = PLAYER_SPEED;

        this.player1.stopMove(levelConfig.player1Position.direction);
        this.player2.stopMove(levelConfig.player2Position.direction);

        this.scorePlayer1 = 0;
        this.scorePlayer2 = 0;

        this.maxElementsToSpawn = levelConfig.maxElementsToSpawn ?? 1;
        this.remainingTime = this.timeToFinish;
        this.updateScoreText()
        this.updateTimeText();
    }

    reset() {
        if (this.currentLevelConfig) {
            this.init(this.currentLevelConfig);
        }
    }

    draw(): void {
        this.checkAndCreateObjectives();
        const ctx = this.canvasManager.ctx; // Replace with your actual canvas context
        ctx.save();

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

        // Draw player 1
        this.player1.update();
        this.player1.draw();
        // draw player 2
        if (this.playerMode === 'mp') {
            this.player2.update();
            this.player2.draw();
        }

        this.layers.at(-1)!.matrix.forEach((row, rowIndex) => {
            row.forEach((spriteIndex, colIndex) => {
                if (this.mapBuilder.tiles[spriteIndex]) {
                    ctx.drawImage(this.mapBuilder.tiles[spriteIndex], colIndex * TILE_SIZE, rowIndex * TILE_SIZE, 32, 32);
                }
            })
        })

        if (this.state === 'play') {
            this.player1.move(this.player1.direction, this.collisionMask);

            if (this.playerMode === 'mp') {
                this.player2.move(this.player2.direction, this.collisionMask);
            }
        }

        // Restore the canvas to its original state
        ctx.restore();

        this.checkEnemyCollision();
    }


    onComplete() {
        this.onCompleteCallback && this.onCompleteCallback(this.getGameResult());
    }

    setCollisionMask(tileX: number, tileY: number, collisionMask: CollisionMask) {
        this.collisionMask[tileY][tileX] = collisionMask;
    }

    checkEnemyCollision() {
        if (this.enemies.some(enemy => enemy.checkCollision(this.player1))) {
            this.onPlayer1Collision(new CustomEvent<PlayerCollidedEvent>('player:collided', {detail: {collisionMask: CollisionMask.ENEMY}}))
        }

        if (this.enemies.some(enemy => enemy.checkCollision(this.player2))) {
            this.onPlayer2Collision(new CustomEvent<PlayerCollidedEvent>('player:collided', {detail: {collisionMask: CollisionMask.ENEMY}}))
        }
    }

    toggleState(state?: LevelState) {
        if (state) {
            return this.state = state;
        }

        if (this.state === 'pause') {
            this.startTimer();
            return this.state = 'play';
        }

        if (this.state === 'play') {
            this.stopTimer();
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
                        Objective.getRandomObjectiveSpritePath()
                    )
                }
            )
        }
    }

    onPlayer1Collision(event: CustomEvent<PlayerCollidedEvent>) {
        const collisionMask = event.detail.collisionMask;

        if (collisionMask === CollisionMask.ITEM) {
            this.scorePlayer1++;
            const objective = this.objectives[0]!;
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.FLOOR);
            this.objectives.pop();

            if (this.scorePlayer1 > 0 && this.scorePlayer1 % 3 === 0) {
                this.player1.tilesPerSecond = PLAYER_SPEED * 1.5;
            } else {
                this.player1.tilesPerSecond = PLAYER_SPEED;
            }
        }

        if (collisionMask > CollisionMask.FLOOR) {
            if (this.scorePlayer1 >= 1) {
                this.scorePlayer1--;
            }

            const levelConfig = this.currentLevelConfig;
            this.player1.updateDirection(this.currentLevelConfig.player1Position.direction);
            this.player1.setTilePosition(levelConfig.player1Position.x, levelConfig.player1Position.y)

            if (this.player1.tilesPerSecond > PLAYER_SPEED) {
                this.player1.tilesPerSecond = PLAYER_SPEED;
            }

            if (this.player1.tilesPerSecond > PLAYER_SPEED / 2) {
                this.player1.tilesPerSecond = PLAYER_SPEED / 2;
                setTimeout(() => {
                    if (this.player1.tilesPerSecond < PLAYER_SPEED) {
                        this.player1.tilesPerSecond = PLAYER_SPEED;
                    }
                }, 900)
            }
        }

        this.updateScoreText();
    }

    onPlayer2Collision(event: CustomEvent<PlayerCollidedEvent>) {
        const collisionMask = event.detail.collisionMask;

        if (collisionMask === CollisionMask.ITEM) {
            this.scorePlayer2++;

            const objective = this.objectives[0]!;
            this.setCollisionMask(objective.node.tileX, objective.node.tileY, CollisionMask.FLOOR);
            this.objectives.pop();

            if (this.scorePlayer2 > 0 && this.scorePlayer2 % 3 === 0) {
                this.player2.tilesPerSecond = PLAYER_SPEED * 1.5;
            } else {
                this.player2.tilesPerSecond = PLAYER_SPEED;
            }
        }

        if (collisionMask > CollisionMask.FLOOR) {
            if (this.scorePlayer2 >= 1) {
                this.scorePlayer2--;
            }

            const levelConfig = this.currentLevelConfig;
            this.player2.updateDirection(this.currentLevelConfig.player1Position.direction);
            this.player2.setTilePosition(levelConfig.player2Position.x, levelConfig.player2Position.y)

            if (this.player2.tilesPerSecond > PLAYER_SPEED) {
                this.player2.tilesPerSecond = PLAYER_SPEED;
            }

            if (this.player2.tilesPerSecond > PLAYER_SPEED / 2) {
                this.player2.tilesPerSecond = PLAYER_SPEED / 2;
                setTimeout(() => {
                    if (this.player2.tilesPerSecond < PLAYER_SPEED) {
                        this.player2.tilesPerSecond = PLAYER_SPEED;
                    }
                }, 900)
            }
        }

        this.updateScoreText();
    }

    private setupListeners() {
        this.player1.addEventListener('player:collided', this.onPlayer1Collision.bind(this));
        this.player2.addEventListener('player:collided', this.onPlayer2Collision.bind(this));
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimeText();
            if (this.remainingTime > 0) {
                this.remainingTime -= 1000; // Decrease time by 1 second
            } else {
                this.stopTimer();
                this.toggleState("pause");
                this.onComplete();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
    }

    getGameResult(): LevelResult {
        const score = Math.max(this.scorePlayer1, this.scorePlayer2);
        const name = score === this.scorePlayer1 ? 'Player 1' : 'Player 2';

        return {score, name};
    }

    private updateScoreText() {
        const scoreText1 = this.canvasManager.scoreText1;
        const scoreText2 = this.canvasManager.scoreText2;

        const score1 = +((scoreText1.innerText.split(':') || ['0']).at(-1)?.trim() ?? 0);
        if (this.scorePlayer1 !== score1) {
            scoreText1.innerText = `SCORE: ${this.scorePlayer1 ?? 0}`;
        }

        const score2 = +((scoreText2.innerText.split(':') || ['0']).at(-1)?.trim() ?? 0);
        if (this.scorePlayer2 !== score2) {
            scoreText2.innerText = `SCORE: ${this.scorePlayer2 ?? 0}`;
        }

    }

    private updateTimeText() {
        const timeText = this.canvasManager.timeText;
        timeText.innerText = `${this.remainingTime / 1000}`;
    }
}
