// src/levels/level1.js

import * as ui from '../ui.js';
import { levelCompleted } from '../game.js';
import { playSound } from '../utils/sound.js';

// --- Constantes du niveau ---
const gamora = { name: "Gamora", image: "./assets/images/sprites/gamora.png" };
const thanos = { name: "Thanos", image: "./assets/images/sprites/thanos.png" };

const correctOrder = ['souvenir_dague', 'souvenir_poupee'];
let sacrificedItems = [];


// --- Fonctions du niveau ---

/**
 * Fonction principale qui initialise le niveau 1.
 */
export function startVormir() {
    console.log("Lancement du niveau 1 : Vormir");
    
    // Réinitialise l'interface
    ui.clearGameArea();
    sacrificedItems = [];

    // Met à jour les informations de la scène
    ui.setRoomTitle("Vormir : La Pierre de l'Âme");
    ui.loadSceneBackground('./assets/images/vormir_2d.jpg');
    ui.showDialogue(thanos, "Le plus dur des choix requiert la plus grande des volontés.");

    // --- GESTION DE LA MUSIQUE ---
    const music = document.getElementById('background-music');
    music.src = './assets/sounds/vormir.mp3'; 
    music.volume = 0.3; 
    music.play();
    // --- FIN DE LA GESTION MUSIQUE ---

    // Crée les éléments de l'énigme et active les interactions
    createRiddleElements();
    addDragAndDropListeners();
}

/**
 * Crée les éléments HTML pour l'énigme (objets et zone de drop).
 */
function createRiddleElements() {
    const gameArea = document.getElementById('game-area');
    const sacrificeZone = document.createElement('div');
    sacrificeZone.id = 'sacrifice-zone';
    gameArea.appendChild(sacrificeZone);
    const memory1 = document.createElement('img');
    memory1.src = './assets/images/objects/poupee.png';
    memory1.id = 'souvenir_poupee';
    memory1.className = 'memory-object interactive-object';
    memory1.draggable = true;
    memory1.style.top = '200px';
    memory1.style.left = '150px';
    gameArea.appendChild(memory1);
    const memory2 = document.createElement('img');
    memory2.src = './assets/images/objects/dague.png';
    memory2.id = 'souvenir_dague';
    memory2.className = 'memory-object interactive-object';
    memory2.draggable = true;
    memory2.style.top = '350px';
    memory2.style.left = '700px';
    gameArea.appendChild(memory2);
}

/**
 * Ajoute tous les écouteurs d'événements nécessaires pour le Drag & Drop.
 */
function addDragAndDropListeners() {
    const memories = document.querySelectorAll('.memory-object');
    const sacrificeZone = document.getElementById('sacrifice-zone');
    memories.forEach(memory => {
        memory.addEventListener('dragstart', (event) => {
            // On joue le son "pickup"
            playSound('./assets/sounds/pickup.mp3', 0.1); // CHANGEMENT : Volume baissé à 20%

            event.dataTransfer.setData('text/plain', event.target.id);
            setTimeout(() => { event.target.classList.add('hidden'); }, 0);
        });
        memory.addEventListener('dragend', (event) => {
            event.target.classList.remove('hidden');
        });
    });
    sacrificeZone.addEventListener('dragover', (event) => {
        event.preventDefault(); 
        sacrificeZone.classList.add('drag-over');
    });
    sacrificeZone.addEventListener('dragleave', () => {
        sacrificeZone.classList.remove('drag-over');
    });
    sacrificeZone.addEventListener('drop', (event) => {
        event.preventDefault();
        sacrificeZone.classList.remove('drag-over');
        const droppedItemId = event.dataTransfer.getData('text/plain');
        const droppedItem = document.getElementById(droppedItemId);
        if (droppedItem) {
            handleSacrifice(droppedItem);
        }
    });
}

/**
 * Gère la logique lorsqu'un objet est déposé dans la zone.
 */
function handleSacrifice(item) {
    // On joue le son "drop"
    playSound('./assets/sounds/drop.mp3', 0.1); // CHANGEMENT : Volume baissé à 40%

    item.remove();
    sacrificedItems.push(item.id);
    ui.showDialogue(thanos, `Un sacrifice a été fait...`);
    checkVictory();
}

/**
 * Vérifie si la condition de victoire (bon ordre des sacrifices) est remplie.
 */
function checkVictory() {
    if (sacrificedItems.length === correctOrder.length) {
        document.getElementById('background-music').pause();

        let isOrderCorrect = true;
        for (let i = 0; i < correctOrder.length; i++) {
            if (sacrificedItems[i] !== correctOrder[i]) {
                isOrderCorrect = false;
                break;
            }
        }

        if (isOrderCorrect) {
            ui.showDialogue(thanos, "Je suis navré, mon enfant. La pierre est à moi.");
            setTimeout(levelCompleted, 3000);
        } else {
            ui.showDialogue(gamora, "Ce n'est pas le bon ordre ! Le sacrifice n'est pas accepté !");
            setTimeout(startVormir, 3000);
        }
    }
}