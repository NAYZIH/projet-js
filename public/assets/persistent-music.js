document.addEventListener('DOMContentLoaded', () => {
    const homeMusic = document.getElementById('home-music');

    if (!homeMusic) {
        console.error("L'élément audio 'home-music' est introuvable sur cette page.");
        return;
    }

    const saveMusicState = () => {
        const musicShouldPlay = sessionStorage.getItem('musicShouldPlay');
        if (musicShouldPlay === 'true' && homeMusic && !homeMusic.paused) {
            sessionStorage.setItem('musicCurrentTime', homeMusic.currentTime);
        }
    };

    window.addEventListener('beforeunload', saveMusicState);

    if (sessionStorage.getItem('musicShouldPlay') === 'true') {
        const musicTime = parseFloat(sessionStorage.getItem('musicCurrentTime')) || 0;
        homeMusic.currentTime = musicTime;
        homeMusic.volume = 0.4;

        const playPromise = homeMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("La lecture continue a été bloquée par le navigateur. Une interaction de l'utilisateur est requise.", error);
                document.body.addEventListener('click', () => homeMusic.play(), { once: true });
            });
        }
    }
});