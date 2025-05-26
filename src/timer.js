// src/timer.js
import { updateTimerDisplay } from './ui.js';

let timerInterval;

function startTimer(durationInSeconds) {
    let timer = durationInSeconds;
    let minutes, seconds;

    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        updateTimerDisplay(`${minutes}:${seconds}`);

        if (--timer < 0) {
            stopTimer();
            // Ici, on déclenchera un événement 'gameOver'
            console.log("TEMPS ÉCOULÉ !");
            alert("Temps écoulé ! Game Over.");
            window.location.reload(); // Recommencer
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

export { startTimer, stopTimer };