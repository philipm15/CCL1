import './style.css'
import { Game } from "./game/game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
    <canvas id="gameCanvas"></canvas>
</div>
`
const game = new Game();
game.start();

