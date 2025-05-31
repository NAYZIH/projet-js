// src/main.js - Version Finale

import { startGame } from './game.js';

// Attend que l'ensemble du contenu de la page (le DOM) soit chargé avant d'exécuter le script.
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM prêt. En attente du lancement par l'utilisateur.");

    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');

    if (startButton && startScreen) {
        // Ajoute un écouteur d'événement sur le clic du bouton "Lancer la Quête".
        startButton.addEventListener('click', () => {
            // Fait disparaître l'écran de démarrage.
            startScreen.style.display = 'none';
            
            // Demande le pseudo au joueur via une boîte de dialogue.
            let playerName = prompt("Entrez votre pseudo :", "Thanos Jr.");

            // Si le joueur ne saisit rien ou annule, on lui donne un nom par défaut.
            if (!playerName || playerName.trim() === "") {
                playerName = "Thanos Jr."; 
            }
            
            // Appelle la fonction principale du jeu en lui passant le nom du joueur.
            startGame(playerName); 
        });
    }
});