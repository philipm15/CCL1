import { CanvasManager } from "./classes/canvas-manager.ts";
import { Level_1 } from "./scenes/levels/level_1.ts";
import { Player } from "./scenes/player.ts";
import { Input } from "./classes/input.ts";

export enum GameLevel {
    Level_1 = 1,
    Level_2 = 2,
}

export class Game {
    private canvasManager: CanvasManager;
    private player = new Player(0, 0);
    private currentLevel = new Level_1(this.player);
    private input = new Input();
    animationFrameId: number | undefined;

    constructor() {
        this.canvasManager = CanvasManager.getInstance();

        this.input.addOnKeyUpCallback((key) => {
            if (['w', 'a', 's', 'd'].includes(key)) {
                this.player.stopMove();
            }
        });
    }

    setLevel(level: GameLevel) {
        this.cancelCurrentLevel();

        if (level === GameLevel.Level_1) {
            this.currentLevel = new Level_1(this.player);
        }

        this.gameLoop();
        this.currentLevel.onCompleteCallback = () => {
            console.log("complete")
        }
    }

    private gameLoop() {
        const ctx = this.canvasManager.ctx;
        ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);

        this.handleInput();
        this.currentLevel.draw();

        this.drawCurrentObjectives();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private handleInput() {
        if (this.input.isKeyPressed('w')) this.player.move('up', this.currentLevel.map);
        if (this.input.isKeyPressed('s')) this.player.move('down', this.currentLevel.map);
        if (this.input.isKeyPressed('a')) this.player.move('left', this.currentLevel.map);
        if (this.input.isKeyPressed('d')) this.player.move('right', this.currentLevel.map);
    }

    private drawCurrentObjectives() {
        const objectives = this.currentLevel.objectives;
        const gameObjectivesDiv = this.canvasManager.objectivesDiv;
        gameObjectivesDiv.replaceChildren();
        objectives.forEach((objective) => {
            const image = objective.node.staticSpriteNode.sprite;

            if (image) {
                const div = document.createElement("div");
                div.classList.add("game-objective-entry");

                const span = div.appendChild(document.createElement("span"));
                span.innerHTML = objective.item.name;

                if (objective.acquired) {
                    span.classList.add("line-through");
                }

                div.appendChild(image);

                gameObjectivesDiv.appendChild(div);
            }
        })
    }

    private cancelCurrentLevel() {
        if (this.animationFrameId !== undefined) {
            window.cancelAnimationFrame(this.animationFrameId);
        }
    }
}
