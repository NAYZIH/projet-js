// src/game.js

import * as ui from './ui.js';
import { startTimer, stopTimer } from './timer.js';
import { startVormir } from './levels/level1.js';
// On importe les autres niveaux ici quand ils seront créés
import { startTitan } from './levels/level2.js';
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
            startTitan(); // Sera activé plus tard
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
    console.log(`Niveau terminé ! Pierres restantes: ${state.stonesLeft}. Prochain niveau index: ${state.currentLevel + 1}`);

    if (state.stonesLeft <= 0) {
        gameWon(); 
    } else {
        state.currentLevel++;
        loadLevel(state.currentLevel);
    }
}

function gameWon() {
    stopTimer();
    ui.clearGameArea();
    ui.loadSceneBackground(''); 
    const music = document.getElementById('background-music');
    music.pause();
    music.src = ''; 

    ui.showDialogue({ name: "Thanos", image: './assets/images/sprites/thanos.png' }, // [cite: 2]
        "Enfin ! L'équilibre sera restauré. L'univers ne saura jamais ce qu'il vous doit."); // [cite: 54]
    console.log("VICTOIRE - Toutes les pierres réunies !");
}

export function gameOverTimeOut() {
    stopTimer();
    ui.clearGameArea();
    ui.loadSceneBackground('');
    const music = document.getElementById('background-music');
    music.pause();
    music.src = '';

    ui.showDialogue({ name: "Strange", image: './assets/images/sprites/strange.png' }, // [cite: 2]
        "Le temps nous a manqué... Ce n'était pas la bonne réalité. L'univers est perdu."); // [cite: 54]
    console.log("GAME OVER - Temps écoulé");
}


export { startGame };