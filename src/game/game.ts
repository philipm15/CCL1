import {CanvasManager} from "./classes/canvas-manager.ts";
import {Level_1} from "./scenes/levels/level_1.ts";
import {Player} from "./scenes/player.ts";
import {Input} from "./classes/input.ts";

export class Game {
    private canvasManager: CanvasManager;
    private player = new Player(0, 0, 0, 0);
    private currentLevel = new Level_1(this.player);
    private input = new Input();

    constructor() {
        this.canvasManager = CanvasManager.getInstance();

        this.input.addOnKeyUpCallback((key) => {
            if (['w', 'a', 's', 'd'].includes(key)) {
                this.player.stopMove();
            }
        });
    }

    start() {
        this.gameLoop();
    }

    private gameLoop() {
        const currentTime = Date.now();
        const ctx = this.canvasManager.ctx;
        ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);

        this.handleInput(currentTime);
        this.currentLevel.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    private handleInput(currentTime: number) {
        if (this.input.isKeyPressed('w')) this.player.move('up', this.currentLevel.map, currentTime);
        if (this.input.isKeyPressed('s')) this.player.move('down', this.currentLevel.map, currentTime);
        if (this.input.isKeyPressed('a')) this.player.move('left', this.currentLevel.map, currentTime);
        if (this.input.isKeyPressed('d')) this.player.move('right', this.currentLevel.map, currentTime);
    }
}
