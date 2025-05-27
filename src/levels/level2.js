import * as ui from '../ui.js';
import { levelCompleted } from '../game.js';
import { playSound } from '../utils/sound.js';

// --- Character Definitions ---
const thanos = { name: 'Thanos', image: './assets/images/sprites/thanos.png' }; // [cite: 2]
const strange = { name: 'Doctor Strange', image: './assets/images/sprites/strange.png' }; // [cite: 2]

// --- Level Constants ---
const LEVEL_ID = "Titan - La Pierre du Temps";
const BACKGROUND_IMAGE = './assets/images/titan_2d.jpg'; // IMPORTANT: Ensure this image exists
const MUSIC_SRC = './assets/sounds/titan.mp3'; // [cite: 2]
const NUMBER_APPEAR_SOUND = './assets/sounds/number_appear.mp3'; // [cite: 2]

const CODE_LENGTH = 4;
const NUMBER_APPEAR_INTERVAL = 10000; // 10 seconds
const NUMBER_DISPLAY_DURATION = 2000; // 2 seconds

// --- Level State ---
let correctCode = [];
let numberAppearanceIntervalId = null;
let currentCodeDigitIndex = 0; // Tracks which digit of the code is to be shown next
let interactiveElementsForNumbers = []; // Stores debris/portals that can show numbers
let gameAreaRef; // Reference to the game area DOM element

// --- Main Level Function ---
export function startTitan() {
    console.log('Lancement du niveau 2 - Titan');
    ui.clearGameArea(); // [cite: 63]
    gameAreaRef = document.getElementById('game-area');

    // Reset state for replayability or if level is reloaded
    correctCode = [];
    currentCodeDigitIndex = 0;
    interactiveElementsForNumbers = [];
    if (numberAppearanceIntervalId) {
        clearInterval(numberAppearanceIntervalId);
        numberAppearanceIntervalId = null;
    }

    ui.setRoomTitle(LEVEL_ID); // [cite: 52]
    ui.loadSceneBackground(BACKGROUND_IMAGE); // [cite: 61]
    ui.showDialogue(thanos, "Tu ne pourras jamais contrôler son pouvoir. Tu n'es pas prêt."); // [cite: 54]

    const music = document.getElementById('background-music');
    music.src = MUSIC_SRC;
    music.volume = 0.3;
    music.play().catch(e => console.warn("Music play failed for Titan:", e)); // Autoplay can be blocked

    generateCorrectCode();
    createInteractiveElements();
    startNumberAppearanceCycle();
}

// --- Setup Functions ---
function generateCorrectCode() {
    correctCode = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
        correctCode.push(Math.floor(Math.random() * 10)); // Generates a digit from 0-9
    }
    console.log('Code secret de Titan (pour débogage):', correctCode.join(''));
}

function createInteractiveElements() {
    // Doctor Strange Sprite
    const strangeSprite = document.createElement('img');
    strangeSprite.src = strange.image;
    strangeSprite.alt = strange.name;
    strangeSprite.id = 'strange-sprite';
    strangeSprite.className = 'interactive-object'; // [cite: 18]
    strangeSprite.style.position = 'absolute';
    strangeSprite.style.width = '150px';
    strangeSprite.style.height = 'auto';
    strangeSprite.style.bottom = '60px';
    strangeSprite.style.right = '120px';
    strangeSprite.style.cursor = 'pointer'; // [cite: 18]
    strangeSprite.addEventListener('click', () => {
        ui.showDialogue(strange, "J'ai vu 14 000 605 futurs. Un seul nous mène à la victoire, et ses chiffres clignotent à travers le temps."); // [cite: 54]
    });
    gameAreaRef.appendChild(strangeSprite);

    // Eye of Agamotto
    const eyeOfAgamotto = document.createElement('img');
    eyeOfAgamotto.src = './assets/images/objects/agamotto.png'; // [cite: 1]
    eyeOfAgamotto.alt = "Oeil d'Agamotto";
    eyeOfAgamotto.id = 'agamotto-eye';
    eyeOfAgamotto.className = 'interactive-object'; // [cite: 18]
    eyeOfAgamotto.style.position = 'absolute';
    eyeOfAgamotto.style.width = '70px';
    eyeOfAgamotto.style.height = 'auto';
    eyeOfAgamotto.style.top = '280px';
    eyeOfAgamotto.style.left = '460px';
    eyeOfAgamotto.style.cursor = 'pointer'; // [cite: 18]
    eyeOfAgamotto.addEventListener('click', promptForCode);
    gameAreaRef.appendChild(eyeOfAgamotto);

    // Interactive Debris and Portals (for number appearances)
    // Positions are approximate, adjust as needed for your background image
    const elementConfigs = [
        { type: 'portal', src: './assets/images/objects/portal.png', top: '150px', left: '100px', size: '120px' }, // [cite: 1]
        { type: 'portal', src: './assets/images/objects/portal.png', top: '350px', left: '700px', size: '100px' }, // [cite: 1]
        { type: 'portal', src: './assets/images/objects/portal.png', top: '480px', left: '200px', size: '110px' }, // [cite: 1]
        { type: 'portal', src: './assets/images/objects/portal.png', top: '120px', left: '800px', size: '110px' }  // [cite: 1]
    ];

    elementConfigs.forEach((config, index) => {
        const el = document.createElement('img');
        el.src = config.src;
        el.alt = `${config.type} ${index + 1}`;
        el.id = `${config.type}-${index}`;
        el.className = 'interactive-object level2-number-host'; // Allows hover effects from style.css [cite: 18]
        el.style.position = 'absolute';
        el.style.width = config.size;
        el.style.height = 'auto'; // Maintain aspect ratio
        el.style.objectFit = 'contain';
        el.style.top = config.top;
        el.style.left = config.left;
        gameAreaRef.appendChild(el);
        interactiveElementsForNumbers.push(el);
    });
}

// --- Riddle Mechanics ---
function startNumberAppearanceCycle() {
    if (numberAppearanceIntervalId) clearInterval(numberAppearanceIntervalId);

    if (interactiveElementsForNumbers.length === 0) {
        console.error("Titan: Aucun élément interactif défini pour afficher les numéros.");
        return;
    }
    // Ensure currentCodeDigitIndex is reset if the cycle restarts after a failed attempt,
    // so it always starts showing the code from the first digit.
    currentCodeDigitIndex = 0;

    numberAppearanceIntervalId = setInterval(() => {
        if (currentCodeDigitIndex < CODE_LENGTH) {
            // Display the currentCodeDigitIndex-th digit of correctCode
            displayDigitOnElement(correctCode[currentCodeDigitIndex]);
            currentCodeDigitIndex++;
        } else {
            // All digits of the code have been shown for this cycle.
            // Reset index to loop the appearance of the code sequence.
            currentCodeDigitIndex = 0;
            displayDigitOnElement(correctCode[currentCodeDigitIndex]);
            currentCodeDigitIndex++;
        }
    }, NUMBER_APPEAR_INTERVAL);
}

function displayDigitOnElement(digit) {
    // Select a random host element from the available ones for variety
    const hostElement = interactiveElementsForNumbers[Math.floor(Math.random() * interactiveElementsForNumbers.length)];

    const numberDisplay = document.createElement('div');
    numberDisplay.textContent = digit;
    numberDisplay.className = 'ephemeral-number-display'; // Styled by public/style.css

    // Position the number approximately at the center of the host element
    // offsetTop/Left are relative to the offsetParent (gameArea)
    numberDisplay.style.top = `${hostElement.offsetTop + (hostElement.offsetHeight / 2) - 25}px`; // Adjust 25 based on half of numberDisplay's height
    numberDisplay.style.left = `${hostElement.offsetLeft + (hostElement.offsetWidth / 2) - 15}px`; // Adjust 15 based on half of numberDisplay's width

    gameAreaRef.appendChild(numberDisplay);
    playSound(NUMBER_APPEAR_SOUND, 0.6); // [cite: 93, 94]

    setTimeout(() => {
        if (numberDisplay.parentNode === gameAreaRef) {
            gameAreaRef.removeChild(numberDisplay);
        }
    }, NUMBER_DISPLAY_DURATION);
}

function promptForCode() {
    if (numberAppearanceIntervalId) { // Pause number appearances while prompting
        clearInterval(numberAppearanceIntervalId);
        numberAppearanceIntervalId = null; // Ensure it's cleared
    }

    // Timeout to allow current number to disappear if prompt is clicked quickly
    setTimeout(() => {
        const playerInput = prompt("Strange vous tend l'Œil d'Agamotto.\nEntrez le code des réalités (4 chiffres, ex: 1234) :");

        if (playerInput === null) { // Player pressed cancel
            ui.showDialogue(strange, "Le temps joue contre nous. Ne tardez pas."); // [cite: 54]
            startNumberAppearanceCycle(); // Resume number flashing
            return;
        }

        if (playerInput.replace(/\s/g, '') === correctCode.join('')) {
            handleVictory();
        } else {
            handleDefeat(playerInput);
        }
    }, 100); // Small delay
}

// --- Victory/Defeat ---
function handleVictory() {
    console.log('Niveau 2 Victoire !');
    if (numberAppearanceIntervalId) clearInterval(numberAppearanceIntervalId);
    document.getElementById('background-music').pause();
    ui.clearGameArea(); // [cite: 63]

    // Load Thanos background image for victory
    ui.loadSceneBackground('./assets/images/thanos-bg.jpg');

    ui.showDialogue(thanos, "La Pierre du Temps est mienne. Un pas de plus vers l'équilibre.");

    setTimeout(() => {
        levelCompleted(); // Advance to next level/game state [cite: 39, 64]
    }, 4500); // Wait for dialogue
}

function handleDefeat(wrongCode) {
    console.log(`Niveau 2 Défaite. Code entré : ${wrongCode}. Attendu : ${correctCode.join('')}`);
    ui.showDialogue(strange, `Le code "${wrongCode}"... Ce n'était pas cette réalité-là. Observez à nouveau.`); // [cite: 54]

    // Restart the number cycle for the player to try again with the same code
    startNumberAppearanceCycle();
}