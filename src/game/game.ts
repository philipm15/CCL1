import {UIManager} from "./classes/ui-manager.ts";
import {Level_1} from "./scenes/levels/level_1.ts";
import {Player} from "./scenes/game-objects/player.ts";
import {Input} from "./classes/input.ts";
import {MapBuilder} from "./classes/map-builder.ts";
import {LevelTemplate} from "./scenes/levels/level_template.ts";
import {Level, LevelConfig, LevelResult} from "./types/level.ts";
import {Level_2} from "./scenes/levels/level_2.ts";

export class Game {
    private canvasManager: UIManager = UIManager.getInstance();
    private player1 = new Player(0, 0);
    private player2 = new Player(0, 0, 'assets/spritesheets/player_blue.png');
    private level = new LevelTemplate(this.player1, this.player2);
    private input = new Input();
    private mapBuilder = new MapBuilder();
    animationFrameId: number | undefined;
    playerMode: Level["playerMode"] = 'mp';
    firstBootUp = true;

    constructor() {
        this.canvasManager.restartBtn.addEventListener('click', () => {
            this.canvasManager.canvas.hidden = false;
            this.canvasManager.gameResultContainer.style.display = 'none';
            this.level.reset();
        });

        this.canvasManager.backToOptionsBtn.addEventListener('click', () => {
            this.handleOptionsWindow();
        });

        Input.onKeyPress('Escape', () => {
            if (!this.firstBootUp) {
                this.handleOptionsWindow();
            }
        })

        this.level.onCompleteCallback = (result: LevelResult) => this.handleGameComplete(result);

        this.canvasManager.saveOptionsBtn.addEventListener('click', () => {
            this.playerMode = this.canvasManager.playerModeToggle.checked ? 'mp' : 'sp';
            this.canvasManager.gameOptions.style.display = 'none';
            this.level.playerMode = this.playerMode;
            this.canvasManager.scoreText1.hidden = false;
            this.canvasManager.timeText.hidden = false;
            this.canvasManager.scoreText2.hidden = this.playerMode !== 'mp';
            this.setLevel(this.getSelectedLevel());

            if (this.firstBootUp) {
                this.firstBootUp = false;
                this.mapBuilder.loadImages().then(() => {
                    this.canvasManager.canvas.hidden = false;
                    this.gameLoop();

                    Input.onKeyPress(' ', () => {
                        this.level.toggleState();
                    });

                    Input.onKeyPress('r', () => {
                        this.level.reset();
                    })
                });
            } else {
                this.level.reset();
            }

            this.canvasManager.canvas.hidden = false;
        })
    }

    setLevel(level: LevelConfig) {
        this.level.toggleState("pause");
        this.level.init(level);
    }

    private gameLoop() {
        if (!this.level || !this.canvasManager.ctx) return;

        const ctx = this.canvasManager.ctx;
        ctx.clearRect(0, 0, this.canvasManager.canvas.width, this.canvasManager.canvas.height);

        this.handleInput();
        this.level.draw();

        // Dirty fix: there is a bug in the game where the options window is showing and others (e.g. Game Result) too,
        // so we need to check if the options window is showing and if so, close other windows
        this.checkIfOptionsShowing();

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

    private handleGameComplete(result: LevelResult) {
        this.canvasManager.gameResultContainer.style.display = 'grid';
        this.canvasManager.launchScreen.style.display = 'none';
        const nameEl = this.canvasManager.gameResultName;
        const scoreEl = this.canvasManager.gameResultScore;

        nameEl.innerText = `Winner: ${result.name}`;
        scoreEl.innerText = `Score: ${result.score}`;
    }

    private handleOptionsWindow() {
        this.level.toggleState("pause");
        this.canvasManager.canvas.hidden = true;
        this.canvasManager.gameOptions.style.display = 'grid';
        this.canvasManager.gameResultContainer.style.display = 'none';
        this.canvasManager.launchScreen.style.display = 'none';
    }

    private checkIfOptionsShowing() {
        if (this.canvasManager.gameOptions.style.display === 'grid' && this.canvasManager.gameResultContainer.style.display !== 'none') {
            this.handleOptionsWindow();
        }
    }

    private getSelectedLevel(): LevelConfig {
        const selectedValue = (document.querySelector('.pixel-radio input:checked') as HTMLInputElement)!.value;

        switch (+selectedValue) {
            case 1:
                return Level_1;
            case 2:
                return Level_2;
            default:
                return Level_1;
        }
    }
}
