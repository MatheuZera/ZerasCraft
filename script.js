// script.js
document.addEventListener('DOMContentLoaded', function() {
    const playAudioBtn = document.getElementById('playAudioBtn');
    const minecraftAudio = document.getElementById('minecraftAudio');

    if (playAudioBtn && minecraftAudio) {
        let isPlaying = false; // Estado do áudio

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0; // Reinicia o áudio
                playAudioBtn.textContent = 'Tocar Som do Minecraft'; // Texto original
                // Opcional: mude o ícone se quiser ter um "play" e "pause" visual
            } else {
                minecraftAudio.play();
                playAudioBtn.textContent = 'Parar Som do Minecraft'; // Texto para quando estiver tocando
            }
            isPlaying = !isPlaying; // Inverte o estado
        });

        // Opcional: Reiniciar a música quando ela terminar (loop)
        minecraftAudio.addEventListener('ended', function() {
            minecraftAudio.currentTime = 0;
            minecraftAudio.play();
        });

        // Opcional: Mudar o texto do botão caso o áudio seja pausado por outro motivo (ex: usuário muda de aba)
        minecraftAudio.addEventListener('pause', function() {
            if (isPlaying) { // Só muda se estava tocando ativamente
                playAudioBtn.textContent = 'Tocar Som do Minecraft';
                isPlaying = false;
            }
        });
    }
});