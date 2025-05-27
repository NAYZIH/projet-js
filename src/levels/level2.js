import * as ui from '../ui.js';
import { levelCompleted } from '../game.js';
import { playSound } from '../utils/sound.js';

// --- Character Definitions ---
const thanos = { name: 'Thanos', image: './assets/images/sprites/thanos.png' };
const strange = { name: 'Doctor Strange', image: './assets/images/sprites/strange.png' };

// --- Level Constants ---
const LEVEL_ID = "Titan - La Pierre du Temps";
const BACKGROUND_IMAGE = './assets/images/titan_2d.jpg';
const MUSIC_SRC = './assets/sounds/titan.mp3';
const NUMBER_APPEAR_SOUND = './assets/sounds/number_appear.mp3';

const CODE_LENGTH = 4;
const NUMBER_APPEAR_INTERVAL = 10000; // 10 seconds
const NUMBER_DISPLAY_DURATION = 2000; // 2 seconds

// --- Level State ---
let correctCode = [];
let numberAppearanceIntervalId = null;
let currentCodeDigitIndex = 0;
let interactiveElementsForNumbers = [];
let gameAreaRef;

// --- Main Level Function ---
export function startTitan() {
    console.log('Lancement du niveau 2 - Titan');

    // Ajout de la classe de thème vert pour level2
    document.body.classList.add('level2-theme');

    ui.clearGameArea();
    gameAreaRef = document.getElementById('game-area');

    correctCode = [];
    currentCodeDigitIndex = 0;
    interactiveElementsForNumbers = [];
    if (numberAppearanceIntervalId) {
        clearInterval(numberAppearanceIntervalId);
        numberAppearanceIntervalId = null;
    }

    ui.setRoomTitle(LEVEL_ID);
    ui.loadSceneBackground(BACKGROUND_IMAGE);
    ui.showDialogue(thanos, "Tu ne pourras jamais contrôler son pouvoir. Tu n'es pas prêt.");

    const music = document.getElementById('background-music');
    music.src = MUSIC_SRC;
    music.volume = 0.3;
    music.play().catch(e => console.warn("Music play failed for Titan:", e));

    generateCorrectCode();
    createInteractiveElements();
    startNumberAppearanceCycle();
}

function generateCorrectCode() {
    correctCode = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
        correctCode.push(Math.floor(Math.random() * 10));
    }
    console.log('Code secret de Titan (pour débogage):', correctCode.join(''));
}

function createInteractiveElements() {
    // Doctor Strange Sprite
    const strangeSprite = document.createElement('img');
    strangeSprite.src = strange.image;
    strangeSprite.alt = strange.name;
    strangeSprite.id = 'strange-sprite';
    strangeSprite.className = 'interactive-object';
    strangeSprite.style.position = 'absolute';
    strangeSprite.style.width = '150px';
    strangeSprite.style.height = 'auto';
    strangeSprite.style.bottom = '60px';
    strangeSprite.style.right = '120px';
    strangeSprite.style.cursor = 'pointer';
    strangeSprite.addEventListener('click', () => {
        ui.showDialogue(strange, "J'ai vu 14 000 605 futurs. Un seul nous mène à la victoire, et ses chiffres clignotent à travers le temps.");
    });
    gameAreaRef.appendChild(strangeSprite);

    // Eye of Agamotto
    const eyeOfAgamotto = document.createElement('img');
    eyeOfAgamotto.src = './assets/images/objects/agamotto.png';
    eyeOfAgamotto.alt = "Oeil d'Agamotto";
    eyeOfAgamotto.id = 'agamotto-eye';
    eyeOfAgamotto.className = 'interactive-object';
    eyeOfAgamotto.style.position = 'absolute';
    eyeOfAgamotto.style.width = '70px';
    eyeOfAgamotto.style.height = 'auto';
    eyeOfAgamotto.style.top = '280px';
    eyeOfAgamotto.style.left = '460px';
    eyeOfAgamotto.style.cursor = 'pointer';
    eyeOfAgamotto.addEventListener('click', promptForCode);
    gameAreaRef.appendChild(eyeOfAgamotto);

    // Debris/Portals for number display
    const elementConfigs = [
        { type: 'portal', src: './assets/images/objects/portal.png', top: '150px', left: '100px', size: '120px' },
        { type: 'portal', src: './assets/images/objects/portal.png', top: '350px', left: '700px', size: '100px' },
        { type: 'portal', src: './assets/images/objects/portal.png', top: '480px', left: '200px', size: '110px' },
        { type: 'portal', src: './assets/images/objects/portal.png', top: '120px', left: '800px', size: '110px' }
    ];

    elementConfigs.forEach((config, index) => {
        const el = document.createElement('img');
        el.src = config.src;
        el.alt = `${config.type} ${index + 1}`;
        el.id = `${config.type}-${index}`;
        el.className = 'interactive-object level2-number-host';
        el.style.position = 'absolute';
        el.style.width = config.size;
        el.style.height = 'auto';
        el.style.objectFit = 'contain';
        el.style.top = config.top;
        el.style.left = config.left;
        gameAreaRef.appendChild(el);
        interactiveElementsForNumbers.push(el);
    });
}

function startNumberAppearanceCycle() {
    if (numberAppearanceIntervalId) clearInterval(numberAppearanceIntervalId);

    currentCodeDigitIndex = 0;

    numberAppearanceIntervalId = setInterval(() => {
        if (currentCodeDigitIndex < CODE_LENGTH) {
            displayDigitOnElement(correctCode[currentCodeDigitIndex]);
            currentCodeDigitIndex++;
        } else {
            currentCodeDigitIndex = 0;
            displayDigitOnElement(correctCode[currentCodeDigitIndex]);
            currentCodeDigitIndex++;
        }
    }, NUMBER_APPEAR_INTERVAL);
}

function displayDigitOnElement(digit) {
    const hostElement = interactiveElementsForNumbers[Math.floor(Math.random() * interactiveElementsForNumbers.length)];
    const numberDisplay = document.createElement('div');
    numberDisplay.textContent = digit;
    numberDisplay.className = 'ephemeral-number-display';
    numberDisplay.style.top = `${hostElement.offsetTop + (hostElement.offsetHeight / 2) - 25}px`;
    numberDisplay.style.left = `${hostElement.offsetLeft + (hostElement.offsetWidth / 2) - 15}px`;
    gameAreaRef.appendChild(numberDisplay);
    playSound(NUMBER_APPEAR_SOUND, 0.6);
    setTimeout(() => {
        if (numberDisplay.parentNode === gameAreaRef) {
            gameAreaRef.removeChild(numberDisplay);
        }
    }, NUMBER_DISPLAY_DURATION);
}

function promptForCode() {
    if (numberAppearanceIntervalId) {
        clearInterval(numberAppearanceIntervalId);
        numberAppearanceIntervalId = null;
    }

    setTimeout(() => {
        const playerInput = prompt("Strange vous tend l'Œil d'Agamotto.\nEntrez le code des réalités (4 chiffres, ex: 1234) :");
        if (playerInput === null) {
            ui.showDialogue(strange, "Le temps joue contre nous. Ne tardez pas.");
            startNumberAppearanceCycle();
            return;
        }
        if (playerInput.replace(/\s/g, '') === correctCode.join('')) {
            handleVictory();
        } else {
            handleDefeat(playerInput);
        }
    }, 100);
}

function handleVictory() {
    console.log('Niveau 2 Victoire !');
    if (numberAppearanceIntervalId) clearInterval(numberAppearanceIntervalId);
    document.getElementById('background-music').pause();
    ui.clearGameArea();

    ui.loadSceneBackground('./assets/images/thanos-bg.jpg');
    ui.showDialogue(thanos, "La Pierre du Temps est mienne. Un pas de plus vers l'équilibre.");

    setTimeout(() => {
        levelCompleted();
        document.body.classList.remove('level2-theme');
    }, 4500);
}

function handleDefeat(wrongCode) {
    console.log(`Niveau 2 Défaite. Code entré : ${wrongCode}. Attendu : ${correctCode.join('')}`);
    ui.showDialogue(strange, `Le code "${wrongCode}"... Ce n'était pas cette réalité-là. Observez à nouveau.`);
    startNumberAppearanceCycle();
}
