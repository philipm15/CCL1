import './style.css'
import {Game} from "./game/game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
<!--    <div class="level-selection">-->
<!--        <button data-level="Level_1">Level 1</button>-->
<!--        <button data-level="Level_2">Level 2</button>-->
<!--    </div>-->
    <div class="screen-container">
            <div id="launchScreen" class="launch-screen">
                <div class="game-screen">
                </div>
                <span class="launch-screen-text">PRESS SPACE TO START</span>
            </div>
            <div class="game-canvas-container" style="display: none">
                <canvas id="gameCanvas" height="640" width="640"></canvas>
            </div>
    </div>
<!--    <div id="gameObjectives"></div>-->
</div>
`
let game: Game | undefined = undefined;
const launchScreen = document.getElementById('launchScreen')! as HTMLDivElement;
const gameCanvas = document.getElementsByClassName('game-canvas-container')[0]! as HTMLCanvasElement;

// document.querySelector('.level-selection')!.addEventListener('click', (event) => {
//     const target = event.target as HTMLElement;
//     console.log(target)
//
//     if (target.tagName === 'BUTTON' && target.dataset.level) {
//         const level = target.dataset.level as keyof typeof GameLevel;
//         console.log(level)
//
//         if (GameLevel[level]) {
//             startLevel(GameLevel[level]);
//         } else {
//             console.error(`Invalid game level: ${level}`);
//         }
//     }
// });

document.addEventListener('keydown', handleSpacePress);

function handleSpacePress(event: KeyboardEvent) {
    if (event.key === ' ') {
        launchScreen.style.display = 'none';
        gameCanvas.style.display = 'block';
        document.removeEventListener('keydown', handleSpacePress); // Remove the listener
        game = new Game();
    }
}

// function startLevel(level: GameLevel) {
//     if (game) {
//         game.setLevel(level);
//     }
// }

