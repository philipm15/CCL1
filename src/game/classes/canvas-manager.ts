export class CanvasManager {
    private static instance: CanvasManager;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public objectivesDiv: HTMLDivElement;
    public scoreText: HTMLSpanElement;

    private constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.objectivesDiv = document.getElementById('gameObjectives') as HTMLDivElement;
        this.scoreText = document.getElementById('scoreText') as HTMLSpanElement;
    }

     static getInstance(): CanvasManager {
        if (!CanvasManager.instance) {
            CanvasManager.instance = new CanvasManager();
        }
        return CanvasManager.instance;
    }
}
