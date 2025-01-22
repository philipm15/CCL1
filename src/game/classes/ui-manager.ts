export class UIManager {
    private static instance: UIManager;
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public objectivesDiv: HTMLDivElement;
    public scoreText1: HTMLSpanElement;
    public scoreText2: HTMLSpanElement;
    public timeText: HTMLSpanElement;
    public gameOptions: HTMLDivElement;
    public gameCanvasContainer: HTMLDivElement;
    public playerModeToggle: HTMLInputElement;
    public saveOptionsBtn: HTMLButtonElement;

    private constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.objectivesDiv = document.getElementById('gameObjectives') as HTMLDivElement;
        this.scoreText1 = document.getElementById('scoreText1') as HTMLSpanElement;
        this.scoreText2 = document.getElementById('scoreText2') as HTMLSpanElement;
        this.timeText = document.getElementById('timeText') as HTMLSpanElement;
        this.gameOptions = document.getElementById('gameOptions') as HTMLDivElement;
        this.gameCanvasContainer = document.getElementsByClassName('game-canvas-container')[0]! as HTMLDivElement;
        this.playerModeToggle = document.getElementById('playerMode') as HTMLInputElement;
        this.saveOptionsBtn = document.getElementById('saveOptionsBtn') as HTMLButtonElement;
    }

    static getInstance(): UIManager {
        if (!UIManager.instance) {
            UIManager.instance = new UIManager();
        }
        return UIManager.instance;
    }
}
