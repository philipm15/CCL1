import { CanvasManager } from "./classes/canvas-manager.ts";
import { Level_1 } from "./scenes/levels/level_1.ts";
import { Player } from "./scenes/game-objects/player.ts";
import { Input } from "./classes/input.ts";
import { MapBuilder } from "./classes/map-builder.ts";
import { LevelTemplate } from "./scenes/levels/level_template.ts";
import { Level } from "./types/level.ts";

export enum GameLevel {
    Level_1 = 1,
    Level_2 = 2,
}

export class Game {
    private canvasManager: CanvasManager;
    private player1 = new Player(0, 0);
    private player2 = new Player(0, 0);
    private level = new LevelTemplate(this.player1, this.player2);
    private input = new Input();
    private mapBuilder = new MapBuilder();
    animationFrameId: number | undefined;
    playerMode: Level["playerMode"] = 'mp';

    constructor() {
        this.canvasManager = CanvasManager.getInstance();
        this.mapBuilder.loadImages().then(() => {
            this.setLevel(GameLevel.Level_1);
            this.gameLoop();

            Input.onKeyPress(' ', (_, event) => {
                event.preventDefault();
                this.level.toggleState();
            });
        });

        this.level.playerMode = this.playerMode;
        this.canvasManager.scoreText1.hidden = false;
        if(this.playerMode === 'mp') {
            this.canvasManager.scoreText2.hidden = false;
        }
    }

    setLevel(level: GameLevel) {
        if (level === GameLevel.Level_1) {
            this.level.toggleState("pause");
            this.level.init(Level_1);
        }
    }

    private gameLoop() {
        if (!this.level || !this.canvasManager.ctx) return;

        const ctx = this.canvasManager.ctx;
        ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);

        this.handleInput();
        this.level.draw();

        this.handleScoreUpdate();

        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private handleInput() {
        if (!this.level || this.level?.state !== 'play') return;

        if (this.input.isKeyPressed('w')) this.player1.updateDirection('up');
        if (this.input.isKeyPressed('s')) this.player1.updateDirection('down');
        if (this.input.isKeyPressed('a')) this.player1.updateDirection('left');
        if (this.input.isKeyPressed('d')) this.player1.updateDirection('right');

        if (this.input.isKeyPressed('ArrowUp')) this.player2.updateDirection('up');
        if (this.input.isKeyPressed('ArrowDown')) this.player2.updateDirection('down');
        if (this.input.isKeyPressed('ArrowLeft')) this.player2.updateDirection('left');
        if (this.input.isKeyPressed('ArrowRight')) this.player2.updateDirection('right');
    }

    private handleScoreUpdate() {
        const scoreText1 = this.canvasManager.scoreText1;
        const scoreText2 = this.canvasManager.scoreText2;

        const score1 = +((scoreText1.innerText.split(':') || ['0']).at(-1)?.trim() ?? 0);
        if (this.level.scorePlayer1 !== score1) {
            scoreText1.innerText = `SCORE: ${ this.level.scorePlayer1 ?? 0 }`;
        }

        const score2 = +((scoreText2.innerText.split(':') || ['0']).at(-1)?.trim() ?? 0);
        if (this.level.scorePlayer2 !== score2) {
            scoreText2.innerText = `SCORE: ${ this.level.scorePlayer2 ?? 0 }`;
        }
    }
}
