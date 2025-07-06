document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para o botão de áudio de fundo (Minecraft Audio) ---
    const playAudioBtn = document.getElementById('playAudioBtn');
    const minecraftAudio = document.getElementById('minecraftAudio');

    if (playAudioBtn && minecraftAudio) {
        playAudioBtn.classList.add('play-audio-btn-off');
        let isPlaying = false; 

        playAudioBtn.addEventListener('click', function() {
            if (isPlaying) {
                minecraftAudio.pause();
                minecraftAudio.currentTime = 0;
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            } else {
                minecraftAudio.play();
                isPlaying = true;
                playAudioBtn.classList.remove('play-audio-btn-off');
                playAudioBtn.classList.add('play-audio-btn-on');
            }
        });

        minecraftAudio.addEventListener('ended', function() {
            isPlaying = false;
            playAudioBtn.classList.remove('play-audio-btn-on');
            playAudioBtn.classList.add('play-audio-btn-off');
        });

        minecraftAudio.addEventListener('pause', function() {
            if (isPlaying) {
                isPlaying = false;
                playAudioBtn.classList.remove('play-audio-btn-on');
                playAudioBtn.classList.add('play-audio-btn-off');
            }
        });

        minecraftAudio.addEventListener('play', function() {
            isPlaying = true;
            playAudioBtn.classList.remove('play-audio-btn-off');
            playAudioBtn.classList.add('play-audio-btn-on');
        });

    } else {
        console.error("Erro: Botão de áudio de fundo ou elemento de áudio principal não encontrados no DOM.");
    }

    // --- Nova lógica para o som de clique em interações ---
    // Crie um novo elemento de áudio para o som de clique
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; // Pré-carrega o áudio

    // Adiciona um ouvinte de evento de clique ao documento inteiro
    document.addEventListener('click', function(event) {
        // Encontra o elemento que foi clicado
        const clickedElement = event.target;

        // Verifica se o elemento clicado é um link (<a>)
        // OU um botão (<button>)
        // OU um elemento com as classes de botão que você usa
        const isClickable = clickedElement.tagName === 'A' ||
                            clickedElement.tagName === 'BUTTON' ||
                            clickedElement.classList.contains('btn-primary') ||
                            clickedElement.classList.contains('btn-secondary') ||
                            clickedElement.classList.contains('btn-link');

        // Adicionalmente, queremos evitar que o som de clique toque no próprio botão de áudio principal
        // para não ter dois sons ao mesmo tempo no mesmo clique.
        const isMainAudioButton = clickedElement.id === 'playAudioBtn';

        if (isClickable && !isMainAudioButton) {
            // Se for clicável e não for o botão de áudio principal, reproduza o som de clique
            clickAudio.play().catch(e => {
                // Captura e exibe qualquer erro de reprodução (ex: autoplay block)
                console.warn("Erro ao reproduzir som de clique:", e);
            });
        }
    });
});