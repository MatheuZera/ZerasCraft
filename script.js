document.addEventListener('DOMContentLoaded', function() {
    // --- Lógica para o botão de áudio de fundo (Minecraft Audio) ---
    const minecraftAudio = document.getElementById('minecraftAudio');
    const playAudioBtn = document.getElementById('playAudioBtn');

    // Define o volume para o áudio do Minecraft (por exemplo, 0.7 = 70% do volume máximo)
    if (minecraftAudio) {
        minecraftAudio.volume = 0.7; // AJUSTE ESTE VALOR PARA O VOLUME DESEJADO DO ÁUDIO DE FUNDO
    }

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
                minecraftAudio.play().catch(e => {
                    console.warn("Reprodução do áudio do Minecraft bloqueada ou falhou:", e);
                });
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
            if (isPlaying && minecraftAudio.paused) {
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
        console.error("Erro: Botão 'playAudioBtn' ou elemento de áudio 'minecraftAudio' não encontrados no DOM. Verifique seus IDs no HTML.");
    }

    // --- Lógica para o som de clique em interações ---
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto'; 
    clickAudio.volume = 0.4; // AJUSTE ESTE VALOR PARA O VOLUME DESEJADO DO SOM DE CLIQUE (ex: 0.4 = 40%)

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const isClickable = clickedElement.tagName === 'A' ||
                            clickedElement.tagName === 'BUTTON' ||
                            clickedElement.classList.contains('btn-primary') ||
                            clickedElement.classList.contains('btn-secondary') ||
                            clickedElement.classList.contains('btn-link');
        
        const isMainAudioButton = clickedElement.id === 'playAudioBtn';

        if (isClickable && !isMainAudioButton) {
            clickAudio.currentTime = 0;
            clickAudio.play().catch(e => {
                console.warn("Erro ao reproduzir som de clique:", e);
            });
        }
    });

    // --- Lógica para reproduzir select.mp3 ao passar o mouse/toque nas abas/cards ---
    const selectAudio = new Audio('audios/select.mp3');
    selectAudio.preload = 'auto'; 
    selectAudio.volume = 0.1; // AJUSTE ESTE VALOR PARA O VOLUME DESEJADO DO SOM DE SELEÇÃO (ex: 0.3 = 30%)

    const interactiveCards = document.querySelectorAll(
        '.service-card, .role-category-card, .event-card, .community-card, .partnership-card'
    );

    function playSelectSound() {
        selectAudio.currentTime = 0;
        selectAudio.play().catch(e => {
            console.warn("Reprodução de áudio 'select.mp3' bloqueada ou falhou:", e);
        });
    }

    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', playSelectSound);
    });
});