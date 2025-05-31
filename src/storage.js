const LEADERBOARD_KEY = 'escapeGameLeaderboard';

export function saveScore(playerName, scoreTimeInSeconds) {
    if (!playerName || typeof scoreTimeInSeconds !== 'number') {
        console.error("Nom du joueur ou temps invalide pour la sauvegarde.");
        return;
    }

    const newScore = { name: playerName, time: scoreTimeInSeconds };
    let scores = [];

    try {
        const storedScores = localStorage.getItem(LEADERBOARD_KEY);
        if (storedScores) {
            scores = JSON.parse(storedScores);
        }
    } catch (e) {
        console.error("Erreur en lisant le leaderboard depuis localStorage:", e);
        scores = [];
    }

    scores.push(newScore);

    scores.sort((a, b) => a.time - b.time);

    try {
        localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scores));
        console.log("Score sauvegardé :", newScore, "Leaderboard actuel :", scores);
    } catch (e) {
        console.error("Erreur en sauvegardant le leaderboard dans localStorage:", e);
    }
}

export function getScores() {
    try {
        const storedScores = localStorage.getItem(LEADERBOARD_KEY);
        if (storedScores) {
            return JSON.parse(storedScores);
        }
    } catch (e) {
        console.error("Erreur en lisant le leaderboard depuis localStorage:", e);
    }
    return [];
}