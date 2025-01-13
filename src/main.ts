import './style.css'
import { Game } from "./game/game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
    <canvas id="gameCanvas" height="640" width="640"></canvas>
</div>
`
const game = new Game();
game.start();

