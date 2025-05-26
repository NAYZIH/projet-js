/**
 * Joue un fichier son.
 * @param {string} soundFile - Le chemin vers le fichier son (ex: './assets/sounds/nom.wav')
 * @param {number} [volume=0.4] - Le volume du son, entre 0.0 et 1.0
 */
export function playSound(soundFile, volume = 1.0) {
    const audio = new Audio(soundFile);
    audio.volume = volume;
    audio.play();
}