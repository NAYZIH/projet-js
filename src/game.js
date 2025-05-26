// src/game.js

import * as ui from './ui.js';
import { startTimer, stopTimer } from './timer.js';
import { startVormir } from './levels/level1.js';
// On importe les autres niveaux ici quand ils seront créés
// import { startTitan } from './levels/level2.js';
// import { startWakanda } from './levels/final.js';

let state = {
    currentLevel: 0,
    stonesLeft: 3,
    totalTime: 300 // 5 minutes [cite: 25]
};

function startGame() {
    state.currentLevel = 1;
    state.stonesLeft = 3;
    ui.updateRiddlesLeft(state.stonesLeft);
    startTimer(state.totalTime);
    loadLevel(state.currentLevel);
}

function loadLevel(levelNumber) {
    switch (levelNumber) {
        case 1:
            startVormir();
            break;
        case 2:
            // startTitan(); // Sera activé plus tard
            console.log("Chargement du niveau 2...");
            break;
        case 3:
            // startWakanda(); // Sera activé plus tard
            console.log("Chargement du niveau 3...");
            break;
        default:
            gameWon();
    }
}

export function levelCompleted() {
    state.stonesLeft--;
    ui.updateRiddlesLeft(state.stonesLeft);
    state.currentLevel++;
    if(state.currentLevel > 3) {
        gameWon();
    } else {
        loadLevel(state.currentLevel);
    }
}

function gameWon() {
    stopTimer();
    ui.clearGameArea();
    ui.loadSceneBackground(''); // Fond noir
    alert("VICTOIRE ! Vous avez réuni toutes les pierres !");
    // Ici, on ajoutera la logique du leaderboard [cite: 27]
}

// On exporte la fonction de démarrage pour main.js
export { startGame };