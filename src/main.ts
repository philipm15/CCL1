import './style.css'
import {Game} from "./game/game.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div class="app">
    <button id="audioToggle">Sound</button>
  
    <div class="controls">
        <span>PLAYER 1: WASD</span>
        <span>PLAYER 2: ARROW KEYS</span>
        <span>PAUSE: SPACE</span>
        <span>RESET: R</span>
</div>
  
    <div class="screen-container">
    <div class="game-info-container">
            <span id="scoreText1" hidden>SCORE: 0</span>
            <span id="timeText" hidden></span>
            <span id="scoreText2" hidden>SCORE: 0</span>
    </div>
            <div id="launchScreen" class="launch-screen">
                <div class="game-screen">
                </div>
                <span class="launch-screen-text">PRESS SPACE TO START</span>
            </div>
            <div class="game-canvas-container" style="display: none">
                <div id="gameOptions">
                    <div class="pixel-toggle">
                      <span class="label left">Singleplayer</span>
                      <input id="playerMode" type="checkbox" />
                      <label for="playerMode"></label>
                      <span class="label right">Multiplayer</span>
                </div>
                <button id="saveOptionsBtn">PLAY!</button>
</div>
                <canvas id="gameCanvas" height="640" width="640" hidden></canvas>
            </div>
    </div>
</div>
`

const audioToggle = document.getElementById('audioToggle')! as HTMLButtonElement;
const backgroundMusic = new Audio('src/assets/sounds/bg.mp3');
backgroundMusic.volume = 0 //0.03;

audioToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
            console.error("Error starting music:", error);
        });
    } else {
        backgroundMusic.pause();
    }
});


const launchScreen = document.getElementById('launchScreen')! as HTMLDivElement;
const gameCanvas = document.getElementsByClassName('game-canvas-container')[0]! as HTMLDivElement;

document.addEventListener('keydown', handleSpacePress);

function handleSpacePress(event: KeyboardEvent) {
    if (event.key === ' ') {
        launchScreen.style.display = 'none';
        gameCanvas.style.display = 'block';
        void backgroundMusic.play();
        document.removeEventListener('keydown', handleSpacePress); // Remove the listener
        new Game();
    }
}

