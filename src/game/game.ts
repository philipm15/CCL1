import { CanvasManager } from "./classes/canvas-manager.ts";

export class Game {
    private canvasManager: CanvasManager;

    constructor() {
        this.canvasManager = CanvasManager.getInstance()
    }

    start() {
        this.gameLoop();
    }

    private gameLoop() {
        const ctx = this.canvasManager.ctx;
        ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);

        ctx.fillStyle = "white";
        ctx.fillRect(100, 100, 50, 50);

        requestAnimationFrame(this.gameLoop.bind(this));
    }
}
