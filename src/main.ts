import './style.css'
import { Game, GameLevel } from "./game/game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
    <div class="launch-screen">
        <button data-level="Level_1">Level 1</button>
    </div>
    <canvas id="gameCanvas" height="640" width="640"></canvas>
    <div id="gameObjectives"></div>
</div>
`
const game = new Game();

document.querySelector('.launch-screen')!.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'BUTTON' && target.dataset.level) {
        const level = target.dataset.level as keyof typeof GameLevel;

        if (GameLevel[level]) {
            startLevel(GameLevel[level]);
        } else {
            console.error(`Invalid game level: ${level}`);
        }
    }
});

function startLevel(level: GameLevel) {
    game.setLevel(level);
}

