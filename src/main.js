// src/main.js

import { startGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM prêt. En attente du lancement par l'utilisateur.");

    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');

    startButton.addEventListener('click', () => {
        // On cache l'écran de démarrage
        startScreen.style.display = 'none';
        
        // On lance le jeu (et donc la musique)
        startGame();
    });
});