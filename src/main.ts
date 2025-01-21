import './style.css'
import {Game} from "./game/game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
    <div class="screen-container">
            <span id="scoreText1">SCORE: 0</span>
            <span id="scoreText2">SCORE: 0</span>
            <div id="launchScreen" class="launch-screen">
                <div class="game-screen">
                </div>
                <span class="launch-screen-text">PRESS SPACE TO START</span>
            </div>
            <div class="game-canvas-container" style="display: none">
                <canvas id="gameCanvas" height="640" width="640"></canvas>
            </div>
    </div>
</div>
`
let game: Game | undefined = undefined;
const launchScreen = document.getElementById('launchScreen')! as HTMLDivElement;
const gameCanvas = document.getElementsByClassName('game-canvas-container')[0]! as HTMLCanvasElement;

document.addEventListener('keydown', handleSpacePress);

function handleSpacePress(event: KeyboardEvent) {
    if (event.key === ' ') {
        launchScreen.style.display = 'none';
        gameCanvas.style.display = 'block';
        document.removeEventListener('keydown', handleSpacePress); // Remove the listener
        game = new Game();
    }
}

