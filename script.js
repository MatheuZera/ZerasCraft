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
    const clickAudio = new Audio('audios/click.mp3');
    clickAudio.preload = 'auto';

    document.addEventListener('click', function(event) {
        const clickedElement = event.target;
        const isClickable = clickedElement.tagName === 'A' ||
                            clickedElement.tagName === 'BUTTON' ||
                            clickedElement.classList.contains('btn-primary') ||
                            clickedElement.classList.contains('btn-secondary') ||
                            clickedElement.classList.contains('btn-link');
        
        const isMainAudioButton = clickedElement.id === 'playAudioBtn';

        if (isClickable && !isMainAudioButton) {
            clickAudio.currentTime = 0; // Reinicia o som para tocar novamente
            clickAudio.play().catch(e => {
                console.warn("Erro ao reproduzir som de clique:", e);
            });
        }
    });

    // --- Lógica para reproduzir select.mp3 ao passar o mouse/toque nas abas/cards ---
    const selectAudio = document.getElementById('selectAudio');

    if (selectAudio) { // Certifica-se de que o elemento selectAudio existe
        const interactiveCards = document.querySelectorAll(
            '.service-card, .role-category-card, .event-card, .community-card, .partnership-card'
        );

        // Função para tocar o áudio select.mp3
        function playSelectSound() {
            selectAudio.currentTime = 0; // Reinicia o áudio para que ele possa ser tocado rapidamente
            selectAudio.play().catch(e => {
                // Captura e ignora o erro se a reprodução automática foi bloqueada
                console.warn("Reprodução de áudio 'select.mp3' bloqueada ou falhou:", e);
            });
        }

        // Adiciona o event listener 'mouseenter' para cada card interativo
        interactiveCards.forEach(card => {
            card.addEventListener('mouseenter', playSelectSound);
            // Para suporte a toque, 'touchstart' pode ser usado, mas pode ser redundante com 'mouseenter'
            // em alguns dispositivos ou pode causar um comportamento inesperado (som ao rolar).
            // Se precisar, adicione com cautela e teste bem:
            // card.addEventListener('touchstart', playSelectSound); 
        });

    } else {
        console.error("Erro: Elemento de áudio 'selectAudio' não encontrado no DOM. Certifique-se de que está no HTML.");
    }
});