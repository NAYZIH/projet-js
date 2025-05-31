// src/game.js

// Imports
import * as ui from './ui.js';
import { startTimer, stopTimer, getPlayTimeInSeconds } from './timer.js';
import { saveScore } from './storage.js';
import { startVormir } from './levels/level1.js';
import { startTitan } from './levels/level2.js';
import { startWakanda } from './levels/level3.js';

// État du jeu
let gameState = {
    currentPlayerName: "Thanos Jr.",
    currentLevel: 0,
    stonesLeft: 3,
    totalTime: 300,
    cumulativeTime: 0,
    levelTimes: [] // NOUVEAU : Pour stocker le temps de chaque salle en secondes
};

/**
 * Lance le jeu, initialise l'état et charge le premier niveau.
 * @param {string} playerName - Le nom du joueur.
 */
export function startGame(playerName) {
    gameState.currentPlayerName = playerName;
    ui.displayPlayerName(gameState.currentPlayerName);

    gameState.stonesLeft = 3;
    ui.updateRiddlesLeft(gameState.stonesLeft);

    gameState.currentLevel = 1;
    gameState.cumulativeTime = 0;
    gameState.levelTimes = []; // Réinitialisation des temps de niveau
    loadLevel(gameState.currentLevel);
}

/**
 * Gère la complétion d'un niveau et vérifie la condition de victoire.
 */
export function levelCompleted() {
    stopTimer(); // Arrête le timer du niveau actuel
    const timeForThisLevel = getPlayTimeInSeconds(); // Récupère le temps pour ce niveau
    
    gameState.levelTimes.push(timeForThisLevel); // Stocke ce temps
    gameState.cumulativeTime += timeForThisLevel; // Ajoute au temps cumulé

    gameState.stonesLeft--;
    ui.updateRiddlesLeft(gameState.stonesLeft);
    console.log(`Niveau ${gameState.currentLevel} terminé en ${timeForThisLevel}s. Temps cumulé: ${gameState.cumulativeTime}s. Pierres restantes: ${gameState.stonesLeft}`);

    if (gameState.stonesLeft <= 0) {
        gameWon();
    } else {
        gameState.currentLevel++;
        loadLevel(gameState.currentLevel);
    }
}

/**
 * Charge le niveau spécifié.
 * @param {number} level - Le numéro du niveau à charger.
 */
function loadLevel(level) {
    const bodyElement = document.body;
    const music = document.getElementById('background-music');

    startTimer(gameState.totalTime);

    switch (level) {
        case 1:
            bodyElement.classList.add('theme-salle1-ame');
            music.src = './assets/sounds/vormir.mp3';
            music.volume = 0.5;
            if (music.src) music.play().catch(e => console.warn("Music play failed for Vormir:", e));
            startVormir();
            break;
        case 2:
            bodyElement.classList.add('level2-theme');
            music.src = './assets/sounds/titan.mp3';
            music.volume = 0.3;
            if (music.src) music.play().catch(e => console.warn("Music play failed for Titan:", e));
            startTitan();
            break;
        case 3:
            bodyElement.classList.add('theme-salle3-esprit');
            music.src = './assets/sounds/final.mp3';
            music.volume = 0.4;
            if (music.src) music.play().catch(e => console.warn("Music play failed for Wakanda (final.mp3):", e));
            startWakanda();
            break;
        default:
            console.log("Tous les niveaux sont terminés ou niveau inconnu.");
            if(gameState.stonesLeft > 0) {
                console.error("Erreur: Tentative de chargement d'un niveau invalide avant la fin du jeu.");
            }
            break;
    }
}

/**
 * Formate le temps en secondes en une chaîne "Xm Ys".
 * @param {number} timeInSeconds - Le temps total en secondes.
 * @returns {string} Le temps formaté.
 */
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
}

/**
 * Gère la séquence de victoire du jeu avec plusieurs écrans et dialogues.
 */
function gameWon() {
    const finalPlayTime = gameState.cumulativeTime; // C'est déjà le cumul des temps de niveau
    saveScore(gameState.currentPlayerName, finalPlayTime);

    ui.clearGameArea();
    ui.setRoomTitle("DESTINÉE ACCOMPLIE");

    const music = document.getElementById('background-music');
    if (music) {
        // music.pause(); // La musique continue de jouer
    }
    document.body.classList.remove('theme-salle1-ame', 'level2-theme', 'theme-salle3-esprit');

    const thanosVictory = { name: "Thanos", image: './assets/images/sprites/thanos.png' };
    const systemMessage = { name: "Système", image: "" };

    ui.loadSceneBackground('./assets/images/final_1.jpg');
    ui.showDialogue(thanosVictory, "L'univers requiert une correction. Ma volonté est plus forte que la leur.");

    setTimeout(() => {
        ui.loadSceneBackground('./assets/images/final_2.jpg');
        ui.showDialogue(thanosVictory, "L'équilibre doit être restauré. Une nouvelle ère commence.");

        setTimeout(() => {
            ui.loadSceneBackground('./assets/images/final_3.jpg');
            ui.showDialogue(thanosVictory, "Je... suis... inéluctable.");

            setTimeout(() => {
                // Construction du message final avec les temps détaillés
                let finalMessageText = `FÉLICITATIONS, ${gameState.currentPlayerName} ! Vous avez accompli votre destinée !\n\n`;
                gameState.levelTimes.forEach((time, index) => {
                    finalMessageText += `Temps Salle ${index + 1}: ${formatTime(time)}\n`;
                });
                finalMessageText += `\nTemps total : ${formatTime(finalPlayTime)}.`;

                ui.showDialogue(
                    systemMessage,
                    finalMessageText
                );

                // Redirection vers l'écran de crédits après 5 secondes
                setTimeout(() => {
                    window.location.href = 'credits.html';
                }, 5000);
            }, 5000);
        }, 6000);
    }, 6000);

    console.log("Jeu gagné ! Séquence de victoire lancée.");
    console.log("Temps par niveau:", gameState.levelTimes);
    console.log("Temps total cumulé:", finalPlayTime);
}

document.addEventListener('gameOverTimer', () => {
    console.log("Événement gameOverTimer (ou défaite) reçu dans game.js");
    stopTimer();
    ui.clearGameArea();
    const music = document.getElementById('background-music');
    if (music) music.pause();
    document.body.classList.remove('theme-salle1-ame', 'level2-theme', 'theme-salle3-esprit');

    ui.setRoomTitle("DÉFAITE...");

    if (document.getElementById('dialogue-window').classList.contains('hidden')) {
         ui.showDialogue(
            { name: "Strange", image: './assets/images/sprites/strange.png' },
            `Le destin n'a pas tourné en votre faveur cette fois, ${gameState.currentPlayerName}. La quête est un échec.`
        );
    }
    console.log("Jeu perdu !");
});