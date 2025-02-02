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
        <span>OPTIONS: ESC</span>
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
                <span class="launch-screen-text" hidden>PRESS SPACE TO START</span>
            </div>
            <div class="game-canvas-container" style="display: none">
                <div id="gameOptions">
                    <div class="pixel-toggle">
                      <span class="label left">Singleplayer</span>
                      <input id="playerMode" type="checkbox" />
                      <label for="playerMode"></label>
                      <span class="label right">Multiplayer</span>
                </div>
                <div class="pixel-radio-group">
                  <label class="pixel-radio">
                    <input type="radio" name="level" value="1" checked />
                    <span>Level 1</span>
                  </label>
                  <label class="pixel-radio">
                    <input type="radio" name="level" value="2" />
                    <span>Level 2</span>
                  </label>
                </div>
                <button id="saveOptionsBtn">PLAY!</button>
                </div>
                <div id="gameResultContainer" style="display: none">
                    <div style="display: flex; flex-direction: column; gap: 8px">
                        <span id="gameResultName"></span>
                        <span id="gameResultScore"></span>
                    </div>
                    <div class="game-result-container__buttons">
                        <button id="backToOptionsBtn">Options</button>
                        <button id="restartBtn">Restart</button>
                    </div>
                </div>
                <canvas id="gameCanvas" height="640" width="640" hidden></canvas>
            </div>
    </div>
</div>
`

const audioToggle = document.getElementById('audioToggle')! as HTMLButtonElement;
const backgroundMusic = new Audio('assets/sounds/bg.mp3');
backgroundMusic.volume = 0.03;

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
const gameScreen = document.querySelector('.game-screen')! as HTMLDivElement;
fadeIn(gameScreen, () => {
    const launchScreenText = document.querySelector('.launch-screen-text')! as HTMLSpanElement;
    launchScreenText.hidden = false;
});

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

function fadeIn(element: HTMLElement, callback: () => void) {
    let opacity = 0;
    element.style.opacity = opacity.toString();
    element.style.display = "grid";

    const duration = 1200;
    const interval = 10;
    const increment = interval / duration;

    const fade = setInterval(() => {
        opacity += increment;
        element.style.opacity = opacity.toString();

        if (opacity >= 1) {
            element.style.opacity = "1";
            callback();
            clearInterval(fade);
        }
    }, interval);
}

