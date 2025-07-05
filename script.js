document.addEventListener('DOMContentLoaded', function() {
    const playAudioBtn = document.getElementById('playAudioBtn');
    const minecraftAudio = document.getElementById('minecraftAudio');

    if (playAudioBtn && minecraftAudio) {
        playAudioBtn.addEventListener('click', function() {
            // Verifica se o áudio está pausado ou já terminou
            if (minecraftAudio.paused || minecraftAudio.ended) {
                // Reinicia o áudio para tocar desde o início, se necessário
                minecraftAudio.currentTime = 0; 
                minecraftAudio.play();
            } else {
                // Opcional: Se quiser que o botão pause o áudio se já estiver tocando
                minecraftAudio.pause();
            }
        });
    }
});