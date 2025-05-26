// src/ui.js

// Références aux éléments du DOM
const gameArea = document.getElementById('game-area');
const dialogueWindow = document.getElementById('dialogue-window');
const dialogueText = document.getElementById('dialogue-text');
const dialogueCharacterImage = document.getElementById('dialogue-character-image');
const timerDisplay = document.getElementById('timer');
const riddlesLeftDisplay = document.getElementById('riddles-left');
const roomTitleElement = document.getElementById('room-title'); // NOUVELLE RÉFÉRENCE

/**
 * Met à jour le titre de la salle.
 * @param {string} title - Le titre à afficher.
 */
export function setRoomTitle(title) {
    roomTitleElement.textContent = title;
}

/**
 * Affiche la boîte de dialogue avec un personnage et un texte.
 * @param {object} character - L'objet personnage { name, image }
 * @param {string} text - Le texte à afficher
 */
export function showDialogue(character, text) {
    dialogueCharacterImage.src = character.image;
    dialogueCharacterImage.alt = character.name;
    dialogueText.textContent = text;
    dialogueWindow.classList.remove('hidden');
}

/**
 * Cache la boîte de dialogue.
 */
export function hideDialogue() {
    dialogueWindow.classList.add('hidden');
}

/**
 * Met à jour le texte du timer.
 * @param {string} formattedTime - Le temps formaté (ex: "04:59")
 */
export function updateTimerDisplay(formattedTime) {
    timerDisplay.textContent = `Temps restant : ${formattedTime}`;
}

/**
 * Met à jour le nombre de pierres restantes.
 * @param {number} count - Le nombre de pierres restantes.
 */
export function updateRiddlesLeft(count) {
    riddlesLeftDisplay.textContent = `Pierres restantes : ${count}`;
}

/**
 * Change l'image de fond de la zone de jeu.
 * @param {string} imageUrl - Le chemin vers l'image.
 */
export function loadSceneBackground(imageUrl) {
    gameArea.style.backgroundImage = `url(${imageUrl})`;
}

/**
 * Vide la zone de jeu de tous ses éléments interactifs.
 */
export function clearGameArea() {
    gameArea.innerHTML = '';
}